<?php

namespace Tests\Feature\Portal;

use App\Models\RoleAssignment;
use App\Models\User;

class PortalAccessTest extends PortalTestCase
{
    public function test_guests_are_sent_to_the_admin_login(): void
    {
        $this->get(route('admin.dashboard'))->assertRedirect(route('admin.login'));
    }

    public function test_members_without_a_portal_role_are_forbidden(): void
    {
        $member = User::factory()->create(['role' => 'student']);

        $this->actingAs($member)->get(route('admin.dashboard'))->assertForbidden();
        $this->actingAs($member)->get(route('admin.organisation.units.index'))->assertForbidden();
    }

    public function test_county_coordinator_enters_the_portal_with_limited_navigation(): void
    {
        $coordinator = $this->userWithRole('county_coordinator', $this->countyA);

        $this->assertSame('admin', $coordinator->role, 'Account type follows role assignments');

        $this->actingAs($coordinator)->get(route('admin.dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('auth.permissions', fn ($permissions) => collect($permissions)->contains('organisation.view')
                    && ! collect($permissions)->contains('users.view')
                    && ! collect($permissions)->contains('audit.view'))
                ->missing('stats.users')
                ->missing('recentActivity.0'));

        $this->actingAs($coordinator)->get(route('admin.users.index'))->assertForbidden();
        $this->actingAs($coordinator)->get(route('admin.audit.index'))->assertForbidden();
        $this->actingAs($coordinator)->get(route('admin.posts.index'))->assertForbidden();
    }

    public function test_admin_login_only_admits_portal_users(): void
    {
        $member = User::factory()->create(['password' => bcrypt('secret-pass')]);

        $this->post(route('admin.login'), ['email' => $member->email, 'password' => 'secret-pass'])
            ->assertSessionHasErrors('email');
        $this->assertGuest();

        $officer = $this->userWithRole('secretariat_admin');
        $officer->forceFill(['password' => bcrypt('secret-pass')])->save();

        $this->post(route('admin.login'), ['email' => $officer->email, 'password' => 'secret-pass'])
            ->assertRedirect(route('admin.dashboard'));
        $this->assertAuthenticatedAs($officer);
    }

    public function test_shared_user_props_exclude_private_account_fields(): void
    {
        $admin = $this->userWithRole('super_admin');
        $admin->forceFill(['google_id' => 'g-123', 'date_of_birth' => '2000-01-01'])->save();

        $this->actingAs($admin)->get(route('admin.dashboard'))
            ->assertInertia(fn ($page) => $page
                ->where('auth.user.id', $admin->id)
                ->missing('auth.user.google_id')
                ->missing('auth.user.date_of_birth'));
    }

    public function test_sync_command_can_grant_super_admin(): void
    {
        $user = User::factory()->create(['role' => 'student']);

        $this->artisan('portal:sync-access', ['--grant-super-admin' => $user->email])->assertSuccessful();

        $this->assertTrue(RoleAssignment::query()->where('user_id', $user->id)->exists());
        $this->assertSame('admin', $user->fresh()->role);
    }
}
