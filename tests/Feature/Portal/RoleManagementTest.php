<?php

namespace Tests\Feature\Portal;

use App\Models\AuditLog;
use App\Models\Permission;
use App\Models\Role;
use App\Models\RoleAssignment;
use App\Models\User;

class RoleManagementTest extends PortalTestCase
{
    private function role(string $key): Role
    {
        return Role::query()->where('key', $key)->firstOrFail();
    }

    public function test_super_admin_assigns_a_scoped_role_and_it_is_audited(): void
    {
        $admin = $this->userWithRole('super_admin');
        $member = User::factory()->create(['role' => 'student']);

        $this->actingAs($admin)->post(route('admin.users.roles.store', $member), [
            'role_id' => $this->role('county_coordinator')->id,
            'geographic_area_id' => $this->countyA->id,
        ])->assertSessionHasNoErrors();

        $this->assertDatabaseHas('role_assignments', ['user_id' => $member->id, 'geographic_area_id' => $this->countyA->id]);
        $this->assertSame('admin', $member->fresh()->role);
        $this->assertTrue(AuditLog::query()->where('action', 'role.assigned')->where('subject_id', $member->id)->exists());

        // Duplicate assignment is rejected
        $this->actingAs($admin)->post(route('admin.users.roles.store', $member), [
            'role_id' => $this->role('county_coordinator')->id,
            'geographic_area_id' => $this->countyA->id,
        ])->assertSessionHasErrors('role_id');
    }

    public function test_users_cannot_assign_roles_more_powerful_than_their_own(): void
    {
        $assigner = $this->userWithPermissions(['portal.access', 'users.view', 'roles.assign']);
        $member = User::factory()->create();

        $this->actingAs($assigner)->post(route('admin.users.roles.store', $member), [
            'role_id' => $this->role('super_admin')->id,
        ])->assertForbidden();

        $this->assertFalse(RoleAssignment::query()->where('user_id', $member->id)->exists());
    }

    public function test_super_admin_cannot_be_assigned_to_an_area(): void
    {
        $admin = $this->userWithRole('super_admin');

        $this->actingAs($admin)->post(route('admin.users.roles.store', User::factory()->create()), [
            'role_id' => $this->role('super_admin')->id,
            'geographic_area_id' => $this->countyA->id,
        ])->assertSessionHasErrors('geographic_area_id');
    }

    public function test_the_last_super_admin_cannot_be_removed(): void
    {
        $admin = $this->userWithRole('super_admin');
        $assignment = $admin->roleAssignments()->first();

        $this->actingAs($admin)->delete(route('admin.users.roles.destroy', $assignment))->assertSessionHasErrors('role');
        $this->assertModelExists($assignment);

        $second = $this->userWithRole('super_admin');
        $this->refreshAccess();
        $this->actingAs($admin)->delete(route('admin.users.roles.destroy', $second->roleAssignments()->first()))->assertSessionHasNoErrors();
        $this->assertSame('student', $second->fresh()->role, 'Account type drops back when the last portal role goes');
    }

    public function test_role_permissions_can_only_be_changed_within_the_editors_own_permissions(): void
    {
        $editor = $this->userWithPermissions(['portal.access', 'users.view', 'roles.manage', 'people.view', 'members.view']);
        $role = $this->role('membership_officer');
        $people = Permission::query()->where('key', 'people.view')->value('id');
        $audit = Permission::query()->where('key', 'audit.view')->value('id');
        $portal = Permission::query()->where('key', 'portal.access')->value('id');

        // portal.access is already on the role, so leaving it unchanged is allowed
        $this->actingAs($editor)->put(route('admin.roles.update', $role), ['permission_ids' => [$portal, $people, $audit]])
            ->assertSessionHasErrors('permission_ids');
        $this->assertFalse($role->permissions()->whereKey($audit)->exists());

        $this->actingAs($editor)->put(route('admin.roles.update', $role), ['permission_ids' => [$portal]])
            ->assertSessionHasNoErrors();
        $this->assertFalse($role->permissions()->whereKey($people)->exists());
        $this->assertTrue(AuditLog::query()->where('action', 'role.permissions_updated')->exists());
    }

    public function test_super_admin_role_permissions_are_locked(): void
    {
        $admin = $this->userWithRole('super_admin');

        $this->actingAs($admin)->put(route('admin.roles.update', $this->role('super_admin')), ['permission_ids' => []])
            ->assertSessionHasErrors('role');
        $this->assertSame(Permission::query()->count(), $this->role('super_admin')->permissions()->count());
    }
}
