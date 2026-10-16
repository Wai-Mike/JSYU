<?php

namespace App\Services\Access;

use App\Models\GeographicArea;
use App\Models\Role;
use App\Models\RoleAssignment;
use App\Models\User;
use App\Services\Audit\AuditLogger;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RoleAssignmentService
{
    public function __construct(
        private readonly AccessControl $access,
        private readonly AuditLogger $audit,
    ) {}

    public function assign(User $actor, User $user, Role $role, ?GeographicArea $area = null): RoleAssignment
    {
        $this->authorise($actor, $role);

        if ($area && $role->isSuperAdmin()) {
            throw ValidationException::withMessages(['geographic_area_id' => 'Super Administrator can only be assigned state-wide.']);
        }

        $assignment = DB::transaction(function () use ($actor, $user, $role, $area) {
            $exists = RoleAssignment::query()
                ->where('user_id', $user->id)
                ->where('role_id', $role->id)
                ->where('geographic_area_id', $area?->id)
                ->lockForUpdate()
                ->exists();

            if ($exists) {
                throw ValidationException::withMessages(['role_id' => "{$user->name} already has this role for that area."]);
            }

            return RoleAssignment::query()->create([
                'user_id' => $user->id,
                'role_id' => $role->id,
                'geographic_area_id' => $area?->id,
                'assigned_by' => $actor->id,
            ]);
        });

        $this->access->syncAccountType($user);

        $this->audit->log('role.assigned', $user, "Assigned {$role->name} to {$user->name}".($area ? " for {$area->name}" : ' (state-wide)'), [
            'role' => $role->key,
            'geographic_area_id' => $area?->id,
        ]);

        return $assignment;
    }

    public function revoke(User $actor, RoleAssignment $assignment): void
    {
        $assignment->loadMissing('role', 'user', 'geographicArea');
        $this->authorise($actor, $assignment->role);

        DB::transaction(function () use ($assignment) {
            if ($assignment->role->isSuperAdmin() && $assignment->geographic_area_id === null) {
                $remaining = RoleAssignment::query()
                    ->where('role_id', $assignment->role_id)
                    ->whereNull('geographic_area_id')
                    ->whereKeyNot($assignment->id)
                    ->lockForUpdate()
                    ->count();

                if ($remaining === 0) {
                    throw ValidationException::withMessages(['role' => 'The last Super Administrator cannot be removed.']);
                }
            }

            $assignment->delete();
        });

        $this->access->syncAccountType($assignment->user);

        $this->audit->log('role.revoked', $assignment->user, "Revoked {$assignment->role->name} from {$assignment->user->name}", [
            'role' => $assignment->role->key,
            'geographic_area_id' => $assignment->geographic_area_id,
        ]);
    }

    /**
     * The actor needs roles.assign state-wide and must already hold every
     * permission the role grants (no privilege escalation).
     */
    private function authorise(User $actor, Role $role): void
    {
        if (! $this->access->hasStatewide($actor, 'roles.assign')) {
            throw new AuthorizationException('You are not allowed to manage role assignments.');
        }

        $missing = $role->permissions()->pluck('key')
            ->reject(fn ($key) => $this->access->hasStatewide($actor, $key));

        if ($missing->isNotEmpty()) {
            throw new AuthorizationException('You cannot manage a role that grants permissions you do not hold.');
        }
    }
}
