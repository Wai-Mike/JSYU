<?php

namespace App\Services\Elections;

use App\Models\Election;
use App\Models\ElectionVote;
use App\Models\ElectionVoter;
use App\Models\GeographicArea;
use App\Models\MemberProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Who may vote, casting secret ballots and counting them.
 */
class ElectionService
{
    /**
     * Approved members with a login whose home area is inside the election's
     * area (all approved members for a state-wide election).
     */
    public function electorate(Election $election): Builder
    {
        return MemberProfile::query()
            ->where('status', MemberProfile::STATUS_APPROVED)
            ->whereHas('person', fn ($p) => $p->whereNotNull('user_id'))
            ->when($election->geographic_area_id, function ($q, $areaId) {
                $area = GeographicArea::query()->findOrFail($areaId);

                $q->whereIn('home_area_id', GeographicArea::query()
                    ->where('id', $area->id)
                    ->orWhere('path', 'like', $area->path.$area->id.'/%')
                    ->select('id'));
            });
    }

    public function isEligible(User $user, Election $election): bool
    {
        // Queried fresh rather than via $user->person, which may be a stale cached relation
        return $this->electorate($election)
            ->whereHas('person', fn ($p) => $p->where('user_id', $user->id))
            ->exists();
    }

    public function hasVoted(User $user, Election $election): bool
    {
        return ElectionVoter::query()->where('election_id', $election->id)->where('user_id', $user->id)->exists();
    }

    /**
     * Cast a ballot. $choices maps position id => candidate ids; a position
     * left empty is an abstention.
     *
     * @param  array<int|string, array<int, int>>  $choices
     */
    public function vote(User $user, Election $election, array $choices): void
    {
        if (! $election->isAcceptingVotes()) {
            throw ValidationException::withMessages(['ballot' => 'Voting is not open for this election.']);
        }

        if (! $this->isEligible($user, $election)) {
            throw ValidationException::withMessages(['ballot' => 'You are not eligible to vote in this election.']);
        }

        $election->loadMissing('positions.candidates');
        $rows = [];

        foreach ($election->positions as $position) {
            $selected = collect($choices[$position->id] ?? [])->map(fn ($id) => (int) $id)->unique()->values();

            if ($selected->count() > $position->seats) {
                throw ValidationException::withMessages(["ballot.{$position->id}" => "Choose at most {$position->seats} for {$position->title}."]);
            }

            $valid = $position->candidates->pluck('id');

            if ($selected->diff($valid)->isNotEmpty()) {
                throw ValidationException::withMessages(["ballot.{$position->id}" => 'Invalid choice.']);
            }

            foreach ($selected as $candidateId) {
                $rows[] = ['election_position_id' => $position->id, 'election_candidate_id' => $candidateId];
            }
        }

        try {
            DB::transaction(function () use ($user, $election, $rows) {
                // The unique (election, user) key rejects a second ballot, even from concurrent requests
                ElectionVoter::query()->create([
                    'election_id' => $election->id,
                    'user_id' => $user->id,
                    'voted_at' => now(),
                ]);

                // Shuffled so the ballot's choices are not stored in a recognisable order
                foreach (collect($rows)->shuffle() as $row) {
                    ElectionVote::query()->create(['election_id' => $election->id, ...$row]);
                }
            });
        } catch (UniqueConstraintViolationException) {
            throw ValidationException::withMessages(['ballot' => 'You have already voted in this election.']);
        }
    }

    /**
     * Votes per candidate, highest first, with the winners of each position marked.
     *
     * @return array<int, array{id: int, title: string, seats: int, candidates: array}>
     */
    public function results(Election $election): array
    {
        $election->loadMissing('positions.candidates');

        $counts = ElectionVote::query()
            ->where('election_id', $election->id)
            ->selectRaw('election_candidate_id, count(*) as total')
            ->groupBy('election_candidate_id')
            ->pluck('total', 'election_candidate_id');

        return $election->positions->map(function ($position) use ($counts) {
            $candidates = $position->candidates
                ->map(fn ($c) => ['id' => $c->id, 'name' => $c->name, 'votes' => (int) ($counts[$c->id] ?? 0)])
                ->sortByDesc('votes')
                ->values();

            // A tie at the last seat is flagged rather than silently broken
            $cutoff = $candidates[$position->seats - 1]['votes'] ?? null;
            $tied = $cutoff !== null && $cutoff > 0 && ($candidates[$position->seats]['votes'] ?? -1) === $cutoff;

            return [
                'id' => $position->id,
                'title' => $position->title,
                'seats' => $position->seats,
                'tie' => $tied,
                'total' => $candidates->sum('votes'),
                'candidates' => $candidates->map(fn ($c, $i) => [
                    ...$c,
                    // Candidates tied on the last seat are left undecided for officers to resolve
                    'elected' => $i < $position->seats && $c['votes'] > 0 && ! ($tied && $c['votes'] === $cutoff),
                ])->all(),
            ];
        })->all();
    }

    /** @return array{voted: int, eligible: int} */
    public function turnout(Election $election): array
    {
        return [
            'voted' => $election->voters()->count(),
            'eligible' => $this->electorate($election)->count(),
        ];
    }
}
