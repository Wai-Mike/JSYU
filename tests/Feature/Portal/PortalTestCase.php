<?php

namespace Tests\Feature\Portal;

use App\Models\GeographicArea;
use App\Models\OrganisationUnit;
use App\Models\Person;
use App\Models\Position;
use App\Models\Role;
use App\Models\RoleAssignment;
use App\Models\User;
use App\Services\Access\AccessControl;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Shared fixtures: a small state → county → payam tree and helpers for
 * creating users with state-wide or area-scoped roles.
 */
abstract class PortalTestCase extends TestCase
{
    use RefreshDatabase;

    protected GeographicArea $state;

    protected GeographicArea $countyA;

    protected GeographicArea $countyB;

    protected GeographicArea $payamA1;

    protected GeographicArea $payamA2;

    protected function setUp(): void
    {
        parent::setUp();

        // Clearly fictional demo geography for tests only
        $this->state = GeographicArea::query()->create(['level' => 'state', 'name' => 'Test State']);
        $this->countyA = GeographicArea::query()->create(['level' => 'county', 'name' => 'County A', 'parent_id' => $this->state->id]);
        $this->countyB = GeographicArea::query()->create(['level' => 'county', 'name' => 'County B', 'parent_id' => $this->state->id]);
        $this->payamA1 = GeographicArea::query()->create(['level' => 'payam', 'name' => 'Payam A1', 'parent_id' => $this->countyA->id]);
        $this->payamA2 = GeographicArea::query()->create(['level' => 'payam', 'name' => 'Payam A2', 'parent_id' => $this->countyA->id]);
    }

    protected function userWithRole(string $roleKey, ?GeographicArea $area = null): User
    {
        $user = User::factory()->create();

        RoleAssignment::query()->create([
            'user_id' => $user->id,
            'role_id' => Role::query()->where('key', $roleKey)->value('id'),
            'geographic_area_id' => $area?->id,
        ]);
        app(AccessControl::class)->syncAccountType($user);

        return $user->fresh();
    }

    /** A role holding exactly the given permissions, for precise access tests. */
    protected function userWithPermissions(array $permissions, ?GeographicArea $area = null): User
    {
        $role = Role::query()->create(['key' => 'test_'.uniqid(), 'name' => 'Test role '.uniqid()]);
        $role->permissions()->sync(\App\Models\Permission::query()->whereIn('key', $permissions)->pluck('id'));

        $user = User::factory()->create();
        RoleAssignment::query()->create(['user_id' => $user->id, 'role_id' => $role->id, 'geographic_area_id' => $area?->id]);

        return $user;
    }

    protected function unitIn(?GeographicArea $area, ?string $name = null): OrganisationUnit
    {
        return OrganisationUnit::query()->create([
            'type' => $area ? 'county_office' : 'headquarters',
            'name' => $name ?? 'Unit '.uniqid(),
            'geographic_area_id' => $area?->id,
        ]);
    }

    protected function positionIn(OrganisationUnit $unit, int $seats = 1, ?string $title = null): Position
    {
        return $unit->positions()->create(['title' => $title ?? 'Coordinator '.uniqid(), 'seats' => $seats]);
    }

    protected function person(?GeographicArea $area = null, ?string $name = null): Person
    {
        return Person::query()->create(['full_name' => $name ?? 'Person '.uniqid(), 'geographic_area_id' => $area?->id]);
    }

    protected function admin(string $name, array $params = []): string
    {
        return route($name, $params);
    }

    protected function refreshAccess(): void
    {
        app(AccessControl::class)->flush();
    }
}
