<?php

namespace App\Http\Controllers\Admin\Organisation;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Organisation\GeographicAreaRequest;
use App\Models\GeographicArea;
use App\Models\OrganisationUnit;
use App\Models\Person;
use App\Models\RoleAssignment;
use App\Services\Access\AccessControl;
use App\Services\Audit\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class GeographicAreaController extends Controller
{
    public function __construct(
        private readonly AccessControl $access,
        private readonly AuditLogger $audit,
    ) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', GeographicArea::class);

        $user = $request->user();

        $areas = $this->access->scopeQuery(GeographicArea::query(), $user, 'geography.view', 'id')
            ->withCount(['children', 'organisationUnits'])
            ->orderBy('path')
            ->orderBy('name')
            ->get()
            ->map(fn (GeographicArea $area) => [
                'id' => $area->id,
                'parent_id' => $area->parent_id,
                'level' => $area->level,
                'name' => $area->name,
                'code' => $area->code,
                'is_active' => $area->is_active,
                'children_count' => $area->children_count,
                'units_count' => $area->organisation_units_count,
                'can' => [
                    'update' => $this->access->allows($user, 'geography.manage', $area),
                    'addChild' => $this->access->allows($user, 'geography.manage', $area)
                        && ! empty(config("portal.geographic_children.{$area->level}")),
                    'delete' => $this->access->allows($user, 'geography.manage', $area->parent_id),
                ],
            ]);

        return Inertia::render('admin/organisation/geography/index', [
            'areas' => $areas,
            'levels' => config('portal.geographic_levels'),
            'childLevels' => config('portal.geographic_children'),
            'canCreateRoot' => $this->access->allows($user, 'geography.manage'),
        ]);
    }

    public function store(GeographicAreaRequest $request): RedirectResponse
    {
        $parent = $request->input('parent_id') ? GeographicArea::query()->findOrFail($request->input('parent_id')) : null;
        Gate::authorize('create', [GeographicArea::class, $parent]);

        $area = GeographicArea::query()->create($request->safe()->only(['parent_id', 'level', 'name', 'code', 'is_active']));

        $this->audit->log('geography.created', $area, "Created {$area->level} \"{$area->name}\"");

        return back()->with('success', "{$area->name} added.");
    }

    public function update(GeographicAreaRequest $request, GeographicArea $area): RedirectResponse
    {
        Gate::authorize('update', $area);

        $area->update($request->safe()->only(['name', 'code', 'is_active']));

        if ($area->wasChanged()) {
            $this->audit->log('geography.updated', $area, "Updated {$area->level} \"{$area->name}\"", $this->audit->changes($area));
        }

        return back()->with('success', "{$area->name} updated.");
    }

    public function destroy(GeographicArea $area): RedirectResponse
    {
        Gate::authorize('delete', $area);

        $inUse = $area->children()->exists()
            || OrganisationUnit::query()->where('geographic_area_id', $area->id)->exists()
            || Person::withTrashed()->where('geographic_area_id', $area->id)->exists()
            || RoleAssignment::query()->where('geographic_area_id', $area->id)->exists();

        if ($inUse) {
            throw ValidationException::withMessages([
                'area' => "{$area->name} is in use (sub-areas, units, people or role scopes). Deactivate it instead.",
            ]);
        }

        $area->delete();
        $this->audit->log('geography.deleted', null, "Deleted {$area->level} \"{$area->name}\"", ['geographic_area_id' => $area->id]);

        return back()->with('success', "{$area->name} deleted.");
    }
}
