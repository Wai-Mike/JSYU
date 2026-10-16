<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AuditLog;
use App\Models\GeographicArea;
use App\Models\OrganisationUnit;
use App\Models\Person;
use App\Models\Position;
use App\Models\Post;
use App\Models\RoleAssignment;
use App\Models\User;
use App\Services\Access\AccessControl;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(private readonly AccessControl $access) {}

    /**
     * Role-aware dashboard: each card is only computed for users allowed to see
     * it, and counts are limited to the user's jurisdiction.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $stats = [];

        if ($this->access->hasAnywhere($user, 'organisation.view')) {
            $units = $this->access->scopeQuery(OrganisationUnit::query(), $user, 'organisation.view');
            $stats['units'] = (clone $units)->where('is_active', true)->count();

            $positions = Position::query()->where('is_active', true)
                ->whereIn('organisation_unit_id', (clone $units)->select('id'))
                ->withCount('activeAppointments')
                ->get(['id', 'seats']);
            $stats['positions'] = $positions->count();
            $stats['vacancies'] = $positions->sum(fn ($p) => max(0, $p->seats - $p->active_appointments_count));
        }

        if ($this->access->hasAnywhere($user, 'appointments.view')) {
            $scoped = fn ($q) => $this->access->scopeQuery($q, $user, 'appointments.view');
            $stats['active_appointments'] = Appointment::query()->where('status', Appointment::STATUS_ACTIVE)
                ->whereHas('position.organisationUnit', $scoped)->count();
            $stats['terms_ending_soon'] = Appointment::query()->where('status', Appointment::STATUS_ACTIVE)
                ->whereBetween('term_ends_on', [now()->toDateString(), now()->addDays(60)->toDateString()])
                ->whereHas('position.organisationUnit', $scoped)->count();
        }

        if ($this->access->hasAnywhere($user, 'people.view')) {
            $stats['people'] = $this->access->scopeQuery(Person::query(), $user, 'people.view')->count();
        }

        if ($this->access->hasAnywhere($user, 'geography.view')) {
            $stats['counties'] = $this->access->scopeQuery(GeographicArea::query(), $user, 'geography.view', 'id')
                ->where('level', 'county')->count();
        }

        // State-wide figures only for users allowed to see them (county officers must not see Union-wide totals)
        if ($this->access->hasStatewide($user, 'content.manage')) {
            $stats['pending_posts'] = Post::query()->where('status', Post::STATUS_DRAFT)->count();
            $stats['published_posts'] = Post::query()->where('status', Post::STATUS_PUBLISHED)->count();
        }

        if ($this->access->hasStatewide($user, 'users.view')) {
            $stats['users'] = User::query()->count();
            $stats['staff'] = RoleAssignment::query()->distinct('user_id')->count('user_id');
        }

        return Inertia::render('admin/dashboard/index', [
            'stats' => $stats,
            'scopes' => $user->roleAssignments()->with(['role:id,name', 'geographicArea:id,name'])->get()
                ->map(fn ($a) => ['role' => $a->role->name, 'area' => $a->geographicArea?->name ?? 'State-wide']),
            'recentActivity' => $this->access->hasStatewide($user, 'audit.view')
                ? AuditLog::query()->with('user:id,name')->latest('created_at')->latest('id')->limit(8)->get()
                    ->map(fn ($l) => ['id' => $l->id, 'description' => $l->description, 'user' => $l->user?->name, 'created_at' => $l->created_at->diffForHumans()])
                : null,
        ]);
    }
}
