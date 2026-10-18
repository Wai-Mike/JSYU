<?php

namespace App\Http\Controllers\Admin\Organisation;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Organisation\ManagementTeamRequest;
use App\Models\GeographicArea;
use App\Models\ManagementTeam;
use App\Models\ManagementTeamMember;
use App\Models\Person;
use App\Models\User;
use App\Services\Access\AccessControl;
use App\Services\Audit\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Management teams per term: the current team and the record of previous ones.
 */
class ManagementTeamController extends Controller
{
    public function __construct(
        private readonly AccessControl $access,
        private readonly AuditLogger $audit,
    ) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', ManagementTeam::class);

        $user = $request->user();
        $filters = $request->validate([
            'view' => ['nullable', Rule::in(['current', 'previous'])],
            'search' => ['nullable', 'string', 'max:100'],
        ]);
        $view = $filters['view'] ?? 'current';

        $teams = $this->access->scopeQuery(ManagementTeam::query(), $user, 'teams.view')
            ->where('is_current', $view === 'current')
            ->when($filters['search'] ?? null, fn ($q, $s) => $q->where(fn ($w) => $w
                ->where('name', 'like', "%{$s}%")
                ->orWhereHas('members', fn ($m) => $m->where('name', 'like', "%{$s}%"))))
            ->with(['geographicArea:id,name', 'members'])
            ->orderByDesc('starts_on')
            ->paginate(12)
            ->withQueryString()
            ->through(fn (ManagementTeam $team) => [
                ...$this->summary($team),
                // A preview of the first seats (usually the top leadership)
                'leaders' => $team->members->take(4)->map->only(['name', 'position_title'])->values(),
                'can' => ['update' => $user->can('update', $team)],
            ]);

        return Inertia::render('admin/organisation/teams/index', [
            'view' => $view,
            'filters' => ['search' => $filters['search'] ?? null],
            'teams' => $teams,
            'canCreate' => $this->access->hasAnywhere($user, 'teams.manage'),
        ]);
    }

    public function show(Request $request, ManagementTeam $team): Response
    {
        Gate::authorize('view', $team);

        $user = $request->user();
        $team->load(['geographicArea', 'members.person:id,full_name', 'creator:id,name']);

        return Inertia::render('admin/organisation/teams/show', [
            'team' => [
                ...$this->summary($team),
                'description' => $team->description,
                'created_by' => $team->creator?->name,
                'members' => $team->members->map(fn (ManagementTeamMember $m) => [
                    'id' => $m->id,
                    'name' => $m->name,
                    'position_title' => $m->position_title,
                    'person' => $m->person?->only(['id', 'full_name']),
                ]),
            ],
            // Other teams for the same area, so the succession is easy to follow
            'otherTeams' => ManagementTeam::query()
                ->where('geographic_area_id', $team->geographic_area_id)
                ->whereKeyNot($team->id)
                ->orderByDesc('starts_on')
                ->get()
                ->map(fn (ManagementTeam $t) => $this->summary($t)),
            'can' => [
                'update' => $user->can('update', $team),
                'delete' => $user->can('delete', $team),
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        // The area is chosen on the form; store() checks authority for it
        abort_unless($this->access->hasAnywhere($request->user(), 'teams.manage'), 403);

        return $this->form($request->user(), null, $request->query('previous') ? false : true);
    }

    public function store(ManagementTeamRequest $request): RedirectResponse
    {
        $data = $request->validated();
        Gate::authorize('create', [ManagementTeam::class, $data['geographic_area_id'] ?? null]);
        $this->authorizePeople($data['members']);

        $team = DB::transaction(function () use ($request, $data) {
            $team = new ManagementTeam($this->teamFields($data));
            $team->created_by = $request->user()->id;
            $team->save();

            $this->syncMembers($team, $data['members']);
            $this->keepSingleCurrent($team);

            return $team;
        });

        $this->audit->log('team.created', $team, "Created management team \"{$team->name}\"", [
            'is_current' => $team->is_current,
            'members' => count($data['members']),
        ]);

        return redirect()->route('admin.organisation.teams.show', $team)->with('success', "{$team->name} saved.");
    }

    public function edit(Request $request, ManagementTeam $team): Response
    {
        Gate::authorize('update', $team);

        return $this->form($request->user(), $team->load('members.person:id,full_name'), $team->is_current);
    }

    public function update(ManagementTeamRequest $request, ManagementTeam $team): RedirectResponse
    {
        Gate::authorize('update', $team);

        $data = $request->validated();

        // Moving a team to another area requires authority there too
        if (($data['geographic_area_id'] ?? null) != $team->geographic_area_id) {
            Gate::authorize('create', [ManagementTeam::class, $data['geographic_area_id'] ?? null]);
        }

        $this->authorizePeople($data['members'], $team);

        DB::transaction(function () use ($team, $data) {
            $team->update($this->teamFields($data));
            $this->syncMembers($team, $data['members']);
            $this->keepSingleCurrent($team);
        });

        $this->audit->log('team.updated', $team, "Updated management team \"{$team->name}\"", [
            'fields' => array_values(array_diff(array_keys($team->getChanges()), ['updated_at'])),
            'members' => count($data['members']),
        ]);

        return redirect()->route('admin.organisation.teams.show', $team)->with('success', "{$team->name} updated.");
    }

    public function destroy(ManagementTeam $team): RedirectResponse
    {
        Gate::authorize('delete', $team);

        $team->delete();
        $this->audit->log('team.deleted', $team, "Deleted management team \"{$team->name}\"");

        return redirect()->route('admin.organisation.teams.index', ['view' => $team->is_current ? 'current' : 'previous'])
            ->with('success', "{$team->name} deleted.");
    }

    private function form(User $user, ?ManagementTeam $team, bool $isCurrent): Response
    {
        return Inertia::render('admin/organisation/teams/form', [
            'team' => $team ? [
                ...$this->summary($team),
                'description' => $team->description,
                'members' => $team->members->map(fn (ManagementTeamMember $m) => [
                    'person_id' => $m->person_id,
                    'person' => $m->person?->only(['id', 'full_name']),
                    'name' => $m->name,
                    'position_title' => $m->position_title,
                ]),
            ] : null,
            'defaults' => ['is_current' => $isCurrent],
            'areas' => $this->access->scopeQuery(GeographicArea::query(), $user, 'teams.manage', 'id')
                ->orderBy('path')->orderBy('name')->get(['id', 'name', 'level', 'parent_id']),
            'canStatewide' => $this->access->hasStatewide($user, 'teams.manage'),
            // Titles already used in the organisation, offered as suggestions
            'positionTitles' => ManagementTeamMember::query()->distinct()->orderBy('position_title')->limit(200)->pluck('position_title'),
        ]);
    }

    private function teamFields(array $data): array
    {
        return [
            'name' => $data['name'],
            'geographic_area_id' => $data['geographic_area_id'] ?? null,
            'starts_on' => $data['starts_on'],
            'ends_on' => $data['ends_on'] ?? null,
            'is_current' => (bool) ($data['is_current'] ?? false),
            'description' => $data['description'] ?? null,
        ];
    }

    /** Replace the seats with the submitted list, in the submitted order. */
    private function syncMembers(ManagementTeam $team, array $members): void
    {
        $team->members()->delete();

        foreach (array_values($members) as $index => $member) {
            $team->members()->create([
                'person_id' => $member['person_id'] ?? null,
                'name' => trim($member['name']),
                'position_title' => trim($member['position_title']),
                'sort_order' => $index,
            ]);
        }
    }

    /**
     * Only one current team per area. The team it replaces moves to the
     * previous teams, ending its term when the new one starts if no end date was set.
     */
    private function keepSingleCurrent(ManagementTeam $team): void
    {
        if (! $team->is_current) {
            return;
        }

        ManagementTeam::query()
            ->where('geographic_area_id', $team->geographic_area_id)
            ->where('is_current', true)
            ->whereKeyNot($team->id)
            ->get()
            ->each(function (ManagementTeam $previous) use ($team) {
                $previous->forceFill([
                    'is_current' => false,
                    'ends_on' => $previous->ends_on ?? Carbon::parse($team->starts_on)->max($previous->starts_on),
                ])->save();

                $this->audit->log('team.superseded', $previous, "\"{$previous->name}\" moved to previous teams, replaced by \"{$team->name}\"");
            });
    }

    /** Linking a seat to a person record needs permission to see that person. */
    private function authorizePeople(array $members, ?ManagementTeam $team = null): void
    {
        $alreadyLinked = $team ? $team->members()->pluck('person_id')->filter()->all() : [];

        $ids = collect($members)->pluck('person_id')->filter()->unique()->diff($alreadyLinked);

        Person::query()->whereKey($ids)->get()->each(fn (Person $person) => Gate::authorize('view', $person));
    }

    private function summary(ManagementTeam $team): array
    {
        return [
            'id' => $team->id,
            'name' => $team->name,
            'geographic_area_id' => $team->geographic_area_id,
            'area' => $team->geographicArea?->name,
            'starts_on' => $team->starts_on?->toDateString(),
            'ends_on' => $team->ends_on?->toDateString(),
            'is_current' => $team->is_current,
            'members_count' => $team->relationLoaded('members') ? $team->members->count() : null,
        ];
    }
}
