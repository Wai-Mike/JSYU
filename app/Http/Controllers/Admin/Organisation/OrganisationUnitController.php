<?php

namespace App\Http\Controllers\Admin\Organisation;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Organisation\OrganisationUnitRequest;
use App\Models\GeographicArea;
use App\Models\OrganisationUnit;
use App\Models\Position;
use App\Services\Access\AccessControl;
use App\Services\Audit\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use InvalidArgumentException;

class OrganisationUnitController extends Controller
{
    public function __construct(
        private readonly AccessControl $access,
        private readonly AuditLogger $audit,
    ) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', OrganisationUnit::class);

        $user = $request->user();
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'type' => ['nullable', 'string', 'max:30'],
        ]);

        $units = $this->access->scopeQuery(OrganisationUnit::query(), $user, 'organisation.view')
            ->with('geographicArea:id,name,level')
            ->withCount(['positions', 'children'])
            ->when($filters['search'] ?? null, fn ($q, $s) => $q->where(fn ($w) => $w->where('name', 'like', "%{$s}%")->orWhere('code', 'like', "%{$s}%")))
            ->when($filters['type'] ?? null, fn ($q, $t) => $q->where('type', $t))
            ->orderBy('path')
            ->orderBy('name')
            ->get();

        $vacancies = $this->vacancyCounts($units->pluck('id')->all());

        return Inertia::render('admin/organisation/units/index', [
            'units' => $units->map(fn (OrganisationUnit $unit) => [
                ...$unit->only(['id', 'parent_id', 'type', 'name', 'code', 'is_active', 'positions_count', 'children_count']),
                'area' => $unit->geographicArea?->only(['id', 'name', 'level']),
                'vacancies' => $vacancies[$unit->id] ?? 0,
            ]),
            'filters' => $filters,
            'types' => config('portal.unit_types'),
            'formOptions' => $this->formOptions($request),
            'canCreate' => $this->access->hasAnywhere($user, 'organisation.manage'),
        ]);
    }

    public function show(Request $request, OrganisationUnit $unit): Response
    {
        Gate::authorize('view', $unit);

        $user = $request->user();
        $unit->load([
            'geographicArea:id,name,level',
            'parent:id,name',
            'positions.activeAppointments.person:id,full_name,email,phone',
        ]);

        $children = $this->access->scopeQuery($unit->children()->getQuery(), $user, 'organisation.view')
            ->orderBy('name')
            ->get(['id', 'name', 'type', 'is_active']);

        return Inertia::render('admin/organisation/units/show', [
            'unit' => [
                ...$unit->only(['id', 'parent_id', 'type', 'name', 'code', 'description', 'geographic_area_id', 'is_active']),
                'area' => $unit->geographicArea?->only(['id', 'name', 'level']),
                'parent' => $unit->parent?->only(['id', 'name']),
            ],
            'children' => $children,
            'positions' => $unit->positions->map(fn (Position $position) => [
                ...$position->only(['id', 'title', 'description', 'is_leadership', 'seats', 'term_months', 'sort_order', 'is_active']),
                'holders' => $position->activeAppointments->map(fn ($a) => [
                    'appointment_id' => $a->id,
                    'person' => $a->person?->only(['id', 'full_name', 'email', 'phone']),
                    'starts_on' => $a->starts_on->toDateString(),
                    'term_ends_on' => $a->term_ends_on?->toDateString(),
                ]),
                'vacant_seats' => max(0, $position->seats - $position->activeAppointments->count()),
                'has_history' => $position->appointments()->exists(),
            ]),
            'types' => config('portal.unit_types'),
            'formOptions' => $this->formOptions($request),
            'can' => [
                'update' => $user->can('update', $unit),
                'delete' => $user->can('delete', $unit),
                'managePositions' => $user->can('managePositions', $unit),
                'appoint' => $this->access->allows($user, 'appointments.manage', $unit->geographic_area_id),
                'viewAppointments' => $this->access->allows($user, 'appointments.view', $unit->geographic_area_id),
            ],
        ]);
    }

    public function store(OrganisationUnitRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $this->authorizePlacement($request, $data);

        $unit = OrganisationUnit::query()->create($data);
        $this->audit->log('organisation.unit_created', $unit, "Created unit \"{$unit->name}\"");

        return redirect()->route('admin.organisation.units.show', $unit)->with('success', "{$unit->name} created.");
    }

    public function update(OrganisationUnitRequest $request, OrganisationUnit $unit): RedirectResponse
    {
        Gate::authorize('update', $unit);

        $data = $request->validated();
        $this->authorizePlacement($request, $data);

        try {
            $unit->update($data);
        } catch (InvalidArgumentException $e) {
            throw ValidationException::withMessages(['parent_id' => $e->getMessage()]);
        }

        if ($unit->wasChanged()) {
            $this->audit->log('organisation.unit_updated', $unit, "Updated unit \"{$unit->name}\"", $this->audit->changes($unit));
        }

        return back()->with('success', "{$unit->name} updated.");
    }

    public function destroy(OrganisationUnit $unit): RedirectResponse
    {
        Gate::authorize('delete', $unit);

        if ($unit->children()->exists() || Position::query()->where('organisation_unit_id', $unit->id)->exists()) {
            throw ValidationException::withMessages(['unit' => 'Remove its sub-units and positions first, or deactivate the unit instead.']);
        }

        $unit->delete();
        $this->audit->log('organisation.unit_deleted', null, "Deleted unit \"{$unit->name}\"", ['organisation_unit_id' => $unit->id]);

        return redirect()->route('admin.organisation.units.index')->with('success', "{$unit->name} deleted.");
    }

    /** The user must be allowed to manage both the unit's area and the parent's area. */
    private function authorizePlacement(Request $request, array $data): void
    {
        Gate::authorize('create', [OrganisationUnit::class, $data['geographic_area_id'] ?? null]);

        if (! empty($data['parent_id'])) {
            $parent = OrganisationUnit::query()->findOrFail($data['parent_id']);
            Gate::authorize('update', $parent);
        }
    }

    /** Areas and parent units the user may place units in. */
    private function formOptions(Request $request): array
    {
        $user = $request->user();

        return [
            'areas' => $this->access->scopeQuery(GeographicArea::query(), $user, 'organisation.manage', 'id')
                ->orderBy('path')->orderBy('name')->get(['id', 'name', 'level', 'parent_id']),
            'parents' => $this->access->scopeQuery(OrganisationUnit::query(), $user, 'organisation.manage')
                ->orderBy('name')->get(['id', 'name']),
            'statewide' => $this->access->hasStatewide($user, 'organisation.manage'),
        ];
    }

    /** @return array<int, int> unit id => vacant seats across active positions */
    private function vacancyCounts(array $unitIds): array
    {
        return Position::query()
            ->whereIn('organisation_unit_id', $unitIds)
            ->where('is_active', true)
            ->withCount('activeAppointments')
            ->get()
            ->groupBy('organisation_unit_id')
            ->map(fn ($positions) => $positions->sum(fn ($p) => max(0, $p->seats - $p->active_appointments_count)))
            ->all();
    }
}
