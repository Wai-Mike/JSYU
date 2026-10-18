<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Election;
use App\Services\Elections\ElectionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Elections from the member's side: the ballot and published results.
 */
class ElectionController extends Controller
{
    public function __construct(private readonly ElectionService $elections) {}

    public function index(Request $request): Response
    {
        $user = $request->user();

        $elections = Election::query()
            ->whereIn('status', [Election::STATUS_OPEN, Election::STATUS_CLOSED, Election::STATUS_PUBLISHED])
            ->with('geographicArea:id,name')
            ->orderByRaw("case status when 'open' then 0 else 1 end")
            ->orderByDesc('closes_at')
            ->get()
            // Members only see elections they belong to
            ->filter(fn (Election $e) => $this->elections->isEligible($user, $e))
            ->values()
            ->map(fn (Election $e) => [
                ...$this->summary($e),
                'voted' => $this->elections->hasVoted($user, $e),
            ]);

        return Inertia::render('member/elections/index', ['elections' => $elections]);
    }

    public function show(Request $request, Election $election): Response
    {
        $user = $request->user();

        abort_unless($election->status !== Election::STATUS_DRAFT && $this->elections->isEligible($user, $election), 404);

        $election->load('positions.candidates');

        return Inertia::render('member/elections/show', [
            'election' => [
                ...$this->summary($election),
                'description' => $election->description,
                'positions' => $election->positions->map(fn ($p) => [
                    'id' => $p->id,
                    'title' => $p->title,
                    'seats' => $p->seats,
                    'candidates' => $p->candidates->map->only(['id', 'name', 'statement'])->values(),
                ]),
            ],
            'voted' => $this->elections->hasVoted($user, $election),
            // Members see results only once they are certified
            'results' => $election->status === Election::STATUS_PUBLISHED ? $this->elections->results($election) : null,
            'turnout' => $election->status === Election::STATUS_PUBLISHED ? $this->elections->turnout($election) : null,
        ]);
    }

    public function vote(Request $request, Election $election): RedirectResponse
    {
        $data = $request->validate([
            'ballot' => ['present', 'array'],
            'ballot.*' => ['array'],
            'ballot.*.*' => ['integer'],
        ]);

        $this->elections->vote($request->user(), $election, $data['ballot']);

        return redirect()->route('member.elections.show', $election)->with('success', 'Your vote has been recorded. Thank you for voting.');
    }

    private function summary(Election $e): array
    {
        return [
            'id' => $e->id,
            'title' => $e->title,
            'status' => $e->status,
            'area' => $e->geographicArea?->name,
            'opens_at' => $e->opens_at?->toIso8601String(),
            'closes_at' => $e->closes_at?->toIso8601String(),
            'accepting' => $e->isAcceptingVotes(),
        ];
    }
}
