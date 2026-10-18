<?php

namespace App\Http\Controllers\Admin\Elections;

use App\Http\Controllers\Controller;
use App\Models\Election;
use App\Models\GeographicArea;
use App\Models\Person;
use App\Models\User;
use App\Services\Access\AccessControl;
use App\Services\Audit\AuditLogger;
use App\Services\Elections\ElectionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Setting up and running member elections: draft → open → closed → published.
 */
class ElectionController extends Controller
{
    public function __construct(
        private readonly AccessControl $access,
        private readonly AuditLogger $audit,
        private readonly ElectionService $elections,
    ) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Election::class);

        $user = $request->user();

        $elections = Election::query()
            ->with('geographicArea:id,name')
            ->withCount(['positions', 'voters'])
            ->orderByRaw("case status when 'open' then 0 when 'draft' then 1 when 'closed' then 2 else 3 end")
            ->orderByDesc('opens_at')
            ->get()
            ->filter(fn (Election $e) => $user->can('view', $e))
            ->values()
            ->map(fn (Election $e) => [
                ...$this->summary($e),
                'positions_count' => $e->positions_count,
                'voters_count' => $e->voters_count,
            ]);

        return Inertia::render('admin/elections/index', [
            'elections' => $elections,
            'statuses' => Election::STATUSES,
            'canCreate' => $this->access->hasAnywhere($user, 'elections.manage'),
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($this->access->hasAnywhere($request->user(), 'elections.manage'), 403);

        return $this->form($request->user(), null);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        Gate::authorize('create', [Election::class, $data['geographic_area_id'] ?? null]);
        $this->authorizePeople($data['positions']);

        $election = DB::transaction(function () use ($request, $data) {
            $election = new Election($data);
            $election->created_by = $request->user()->id;
            $election->save();
            $this->syncBallot($election, $data['positions']);

            return $election;
        });

        $this->audit->log('election.created', $election, "Created election \"{$election->title}\"");

        return redirect()->route('admin.elections.show', $election)->with('success', "{$election->title} saved as a draft.");
    }

    public function show(Request $request, Election $election): Response
    {
        Gate::authorize('view', $election);

        $user = $request->user();
        $election->load(['geographicArea', 'positions.candidates', 'certifier:id,name']);

        return Inertia::render('admin/elections/show', [
            'election' => [
                ...$this->summary($election),
                'description' => $election->description,
                'certified_by' => $election->certifier?->name,
                'published_at' => $election->published_at?->toDateTimeString(),
                'positions' => $election->positions->map(fn ($p) => [
                    'id' => $p->id,
                    'title' => $p->title,
                    'seats' => $p->seats,
                    'candidates' => $p->candidates->map->only(['id', 'name', 'statement'])->values(),
                ]),
            ],
            'turnout' => $this->elections->turnout($election),
            // Results stay sealed until voting has ended
            'results' => $election->hasEnded() ? $this->elections->results($election) : null,
            'statuses' => Election::STATUSES,
            'windowPassed' => $election->closes_at->isPast(),
            'can' => [
                'update' => $user->can('update', $election),
                'certify' => $user->can('certify', $election),
            ],
        ]);
    }

    public function edit(Request $request, Election $election): Response
    {
        Gate::authorize('update', $election);
        $this->ensureDraft($election);

        return $this->form($request->user(), $election->load('positions.candidates.person:id,full_name'));
    }

    public function update(Request $request, Election $election): RedirectResponse
    {
        Gate::authorize('update', $election);
        $this->ensureDraft($election);

        $data = $this->validated($request);

        if (($data['geographic_area_id'] ?? null) != $election->geographic_area_id) {
            Gate::authorize('create', [Election::class, $data['geographic_area_id'] ?? null]);
        }

        $this->authorizePeople($data['positions']);

        DB::transaction(function () use ($election, $data) {
            $election->update($data);
            $this->syncBallot($election, $data['positions']);
        });

        $this->audit->log('election.updated', $election, "Updated election \"{$election->title}\"");

        return redirect()->route('admin.elections.show', $election)->with('success', "{$election->title} updated.");
    }

    public function destroy(Election $election): RedirectResponse
    {
        Gate::authorize('update', $election);
        $this->ensureDraft($election);

        $election->delete();
        $this->audit->log('election.deleted', $election, "Deleted draft election \"{$election->title}\"");

        return redirect()->route('admin.elections.index')->with('success', "{$election->title} deleted.");
    }

    public function open(Election $election): RedirectResponse
    {
        Gate::authorize('update', $election);
        $this->ensureDraft($election);

        $election->load('positions.candidates');

        if ($election->positions->isEmpty() || $election->positions->contains(fn ($p) => $p->candidates->isEmpty())) {
            throw ValidationException::withMessages(['status' => 'Every position needs at least one candidate before voting opens.']);
        }

        if ($election->closes_at->isPast()) {
            throw ValidationException::withMessages(['status' => 'The voting window has already ended. Edit the dates first.']);
        }

        return $this->transition($election, Election::STATUS_OPEN, 'Voting opened. The ballot can no longer be changed.');
    }

    public function close(Election $election): RedirectResponse
    {
        Gate::authorize('update', $election);

        if ($election->status !== Election::STATUS_OPEN) {
            throw ValidationException::withMessages(['status' => 'Only an open election can be closed.']);
        }

        return $this->transition($election, Election::STATUS_CLOSED, 'Voting closed. Results are ready for certification.');
    }

    /** Certify the results and show them to members. */
    public function publish(Request $request, Election $election): RedirectResponse
    {
        Gate::authorize('certify', $election);

        if ($election->status !== Election::STATUS_CLOSED) {
            throw ValidationException::withMessages(['status' => 'Results can only be published after voting has closed.']);
        }

        $election->forceFill(['certified_by' => $request->user()->id, 'published_at' => now()])->save();

        return $this->transition($election, Election::STATUS_PUBLISHED, 'Results certified and published to members.');
    }

    private function transition(Election $election, string $status, string $message): RedirectResponse
    {
        $from = $election->status;
        $election->forceFill(['status' => $status])->save();
        $this->audit->log("election.{$status}", $election, "Election \"{$election->title}\": {$from} → {$status}", ['from' => $from, 'to' => $status]);

        return back()->with('success', $message);
    }

    private function ensureDraft(Election $election): void
    {
        if (! $election->isEditable()) {
            throw ValidationException::withMessages(['status' => 'Only draft elections can be changed. Once voting opens the ballot is fixed.']);
        }
    }

    private function form(User $user, ?Election $election): Response
    {
        return Inertia::render('admin/elections/form', [
            'election' => $election ? [
                ...$this->summary($election),
                'description' => $election->description,
                'positions' => $election->positions->map(fn ($p) => [
                    'title' => $p->title,
                    'seats' => $p->seats,
                    'candidates' => $p->candidates->map(fn ($c) => [
                        'name' => $c->name,
                        'statement' => $c->statement ?? '',
                        'person_id' => $c->person_id,
                        'person' => $c->person?->only(['id', 'full_name']),
                    ]),
                ]),
            ] : null,
            'areas' => $this->access->scopeQuery(GeographicArea::query(), $user, 'elections.manage', 'id')
                ->whereIn('level', ['state', 'county', 'payam'])
                ->orderBy('path')->orderBy('name')->get(['id', 'name', 'level', 'parent_id']),
            'canStatewide' => $this->access->hasStatewide($user, 'elections.manage'),
        ]);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'geographic_area_id' => ['nullable', 'integer', 'exists:geographic_areas,id'],
            'opens_at' => ['required', 'date'],
            'closes_at' => ['required', 'date', 'after:opens_at'],
            'positions' => ['required', 'array', 'min:1', 'max:50'],
            'positions.*.title' => ['required', 'string', 'max:150', 'distinct'],
            'positions.*.seats' => ['required', 'integer', 'min:1', 'max:50'],
            'positions.*.candidates' => ['required', 'array', 'min:1', 'max:50'],
            'positions.*.candidates.*.name' => ['required', 'string', 'max:255'],
            'positions.*.candidates.*.statement' => ['nullable', 'string', 'max:2000'],
            'positions.*.candidates.*.person_id' => ['nullable', 'integer', 'exists:people,id'],
        ], [
            'positions.required' => 'Add at least one position.',
            'positions.*.title.distinct' => 'Each position must have a different title.',
            'positions.*.candidates.required' => 'Add at least one candidate.',
            'positions.*.candidates.*.name.required' => 'Enter the candidate\'s name.',
            'closes_at.after' => 'Voting must close after it opens.',
        ]);
    }

    /** Replace the ballot (drafts only, so no votes reference it). */
    private function syncBallot(Election $election, array $positions): void
    {
        $election->positions()->delete();

        foreach (array_values($positions) as $i => $position) {
            $created = $election->positions()->create([
                'title' => trim($position['title']),
                'seats' => $position['seats'],
                'sort_order' => $i,
            ]);

            foreach (array_values($position['candidates']) as $j => $candidate) {
                $created->candidates()->create([
                    'person_id' => $candidate['person_id'] ?? null,
                    'name' => trim($candidate['name']),
                    'statement' => $candidate['statement'] ?? null,
                    'sort_order' => $j,
                ]);
            }
        }
    }

    private function authorizePeople(array $positions): void
    {
        $ids = collect($positions)->flatMap(fn ($p) => collect($p['candidates'])->pluck('person_id'))->filter()->unique();

        Person::query()->whereKey($ids)->get()->each(fn (Person $person) => Gate::authorize('view', $person));
    }

    private function summary(Election $e): array
    {
        return [
            'id' => $e->id,
            'title' => $e->title,
            'status' => $e->status,
            'geographic_area_id' => $e->geographic_area_id,
            'area' => $e->geographicArea?->name,
            'opens_at' => $e->opens_at?->format('Y-m-d\TH:i'),
            'closes_at' => $e->closes_at?->format('Y-m-d\TH:i'),
        ];
    }
}
