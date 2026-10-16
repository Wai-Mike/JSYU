<?php

use App\Models\Permission;
use App\Models\Role;
use App\Services\Access\AccessRegistry;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * members.view is new, so add it to the existing roles that need it
     * (sync only applies default grants when a role is first created).
     */
    public function up(): void
    {
        app(AccessRegistry::class)->sync();

        $permission = Permission::query()->where('key', 'members.view')->first();

        Role::query()
            ->whereIn('key', ['state_executive', 'county_coordinator', 'payam_coordinator', 'membership_officer'])
            ->get()
            ->each(fn (Role $role) => $role->permissions()->syncWithoutDetaching([$permission->id]));
    }

    public function down(): void
    {
        Permission::query()->where('key', 'members.view')->delete();
    }
};
