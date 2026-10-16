<?php

namespace App\Services\Access;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

/**
 * Syncs config/portal.php into the roles/permissions tables. Additive only:
 * grants changed by administrators are left alone, except that super_admin
 * always holds every permission.
 */
class AccessRegistry
{
    public function sync(): void
    {
        DB::transaction(function () {
            foreach (config('portal.permissions') as $key => $definition) {
                Permission::query()->updateOrCreate(['key' => $key], [
                    'name' => $definition['name'],
                    'group' => $definition['group'],
                    'is_scoped' => $definition['scoped'],
                ]);
            }

            $permissionIds = Permission::query()->pluck('id', 'key');

            foreach (config('portal.roles') as $key => $definition) {
                $role = Role::query()->firstOrNew(['key' => $key]);
                $isNew = ! $role->exists;

                $role->fill([
                    'name' => $definition['name'],
                    'description' => $definition['description'],
                    'is_system' => true,
                ])->save();

                if ($role->isSuperAdmin()) {
                    $role->permissions()->sync($permissionIds->values());
                } elseif ($isNew) {
                    $role->permissions()->sync($permissionIds->only($definition['permissions'])->values());
                }
            }
        });

        app(AccessControl::class)->flush();
    }
}
