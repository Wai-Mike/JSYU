<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GeographicArea;
use App\Models\Role;
use App\Models\RoleAssignment;
use App\Models\User;
use App\Services\Access\AccessControl;
use App\Services\Access\RoleAssignmentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(
        private readonly AccessControl $access,
        private readonly RoleAssignmentService $assignments,
    ) {}

    public function index(Request $request): Response
    {
        Gate::authorize('users.view');

        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'staff' => ['nullable', 'boolean'],
        ]);

        $users = User::query()
            ->with(['roleAssignments.role:id,key,name', 'roleAssignments.geographicArea:id,name'])
            ->when($filters['search'] ?? null, fn ($q, $s) => $q->where(fn ($w) => $w->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%")))
            ->when($filters['staff'] ?? false, fn ($q) => $q->has('roleAssignments'))
            ->withCount('roleAssignments')
            ->orderByDesc('role_assignments_count')
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (User $user) => [
                ...$user->only(['id', 'name', 'email', 'avatar']),
                'verified' => $user->email_verified_at !== null,
                'joined' => $user->created_at?->toDateString(),
                'assignments' => $user->roleAssignments->map(fn (RoleAssignment $a) => [
                    'id' => $a->id,
                    'role' => $a->role->only(['id', 'key', 'name']),
                    'area' => $a->geographicArea?->only(['id', 'name']),
                ]),
            ]);

        $canAssign = $this->access->hasStatewide($request->user(), 'roles.assign');

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => $filters,
            'canAssign' => $canAssign,
            'roles' => $canAssign ? Role::query()->orderBy('name')->get(['id', 'key', 'name']) : [],
            'areas' => $canAssign ? GeographicArea::query()->orderBy('path')->orderBy('name')->get(['id', 'name', 'level', 'parent_id']) : [],
        ]);
    }

    public function assignRole(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'role_id' => ['required', 'integer', 'exists:roles,id'],
            'geographic_area_id' => ['nullable', 'integer', 'exists:geographic_areas,id'],
        ]);

        $role = Role::query()->findOrFail($data['role_id']);
        $area = isset($data['geographic_area_id']) ? GeographicArea::query()->findOrFail($data['geographic_area_id']) : null;

        $this->assignments->assign($request->user(), $user, $role, $area);

        return back()->with('success', "{$role->name} assigned to {$user->name}.");
    }

    public function revokeRole(Request $request, RoleAssignment $assignment): RedirectResponse
    {
        $assignment->load('role', 'user');
        $this->assignments->revoke($request->user(), $assignment);

        return back()->with('success', "{$assignment->role->name} removed from {$assignment->user->name}.");
    }
}
