<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use App\Services\Access\AccessControl;
use App\Services\Audit\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    public function __construct(
        private readonly AccessControl $access,
        private readonly AuditLogger $audit,
    ) {}

    public function index(Request $request): Response
    {
        Gate::authorize('users.view');

        $user = $request->user();

        return Inertia::render('admin/access/roles/index', [
            'roles' => Role::query()
                ->withCount('assignments')
                ->with('permissions:id')
                ->orderBy('name')
                ->get()
                ->map(fn (Role $role) => [
                    ...$role->only(['id', 'key', 'name', 'description', 'assignments_count']),
                    'locked' => $role->isSuperAdmin(),
                    'permission_ids' => $role->permissions->pluck('id'),
                ]),
            'permissions' => Permission::query()->orderBy('group')->orderBy('key')->get(['id', 'key', 'name', 'group', 'is_scoped']),
            'canManage' => $this->access->hasStatewide($user, 'roles.manage'),
            // Users may only grant or withdraw permissions they hold themselves
            'grantable' => Permission::query()->get(['id', 'key'])
                ->filter(fn ($p) => $this->access->hasStatewide($user, $p->key))
                ->pluck('id')
                ->values(),
        ]);
    }

    public function update(Request $request, Role $role): RedirectResponse
    {
        Gate::authorize('roles.manage');

        if ($role->isSuperAdmin()) {
            throw ValidationException::withMessages(['role' => 'Super Administrator always has every permission and cannot be edited.']);
        }

        $data = $request->validate([
            'permission_ids' => ['present', 'array'],
            'permission_ids.*' => ['integer', 'exists:permissions,id'],
        ]);

        $user = $request->user();
        $current = $role->permissions()->pluck('permissions.id');
        $requested = collect($data['permission_ids'])->map(fn ($id) => (int) $id)->unique();
        $changed = $requested->diff($current)->merge($current->diff($requested));

        $notHeld = Permission::query()->whereKey($changed)->get()
            ->reject(fn ($p) => $this->access->hasStatewide($user, $p->key));

        if ($notHeld->isNotEmpty()) {
            throw ValidationException::withMessages([
                'permission_ids' => 'You cannot change permissions you do not hold: '.$notHeld->pluck('name')->implode(', '),
            ]);
        }

        DB::transaction(fn () => $role->permissions()->sync($requested));
        $this->access->flush();

        $keys = Permission::query()->pluck('key', 'id');
        $this->audit->log('role.permissions_updated', $role, "Updated permissions of {$role->name}", [
            'added' => $requested->diff($current)->map(fn ($id) => $keys[$id])->values(),
            'removed' => $current->diff($requested)->map(fn ($id) => $keys[$id])->values(),
        ]);

        return back()->with('success', "{$role->name} permissions saved.");
    }
}
