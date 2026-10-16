<?php

namespace Tests\Feature\Portal;

use App\Models\AuditLog;
use App\Models\GeographicArea;
use App\Models\OrganisationUnit;

class OrganisationTest extends PortalTestCase
{
    public function test_county_officer_only_lists_units_in_their_county(): void
    {
        $mine = $this->unitIn($this->payamA1, 'Payam A1 Office');
        $this->unitIn($this->countyB, 'County B Office');
        $this->unitIn(null, 'State HQ');

        $officer = $this->userWithRole('county_coordinator', $this->countyA);

        $this->actingAs($officer)->get(route('admin.organisation.units.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->has('units', 1)->where('units.0.id', $mine->id));
    }

    public function test_officers_cannot_open_units_outside_their_jurisdiction(): void
    {
        $other = $this->unitIn($this->countyB);
        $own = $this->unitIn($this->countyA);
        $officer = $this->userWithRole('county_coordinator', $this->countyA);

        $this->actingAs($officer)->get(route('admin.organisation.units.show', $other))->assertForbidden();
        $this->actingAs($officer)->get(route('admin.organisation.units.show', $own))->assertOk();
    }

    public function test_scoped_manager_can_only_create_units_inside_their_area(): void
    {
        $manager = $this->userWithPermissions(['portal.access', 'organisation.view', 'organisation.manage'], $this->countyA);

        $this->actingAs($manager)->post(route('admin.organisation.units.store'), [
            'type' => 'payam_office', 'name' => 'Allowed office', 'geographic_area_id' => $this->payamA1->id,
        ])->assertRedirect();
        $this->assertDatabaseHas('organisation_units', ['name' => 'Allowed office']);

        $this->actingAs($manager)->post(route('admin.organisation.units.store'), [
            'type' => 'county_office', 'name' => 'Other county office', 'geographic_area_id' => $this->countyB->id,
        ])->assertForbidden();

        $this->actingAs($manager)->post(route('admin.organisation.units.store'), [
            'type' => 'department', 'name' => 'State department',
        ])->assertForbidden();

        $this->assertDatabaseMissing('organisation_units', ['name' => 'Other county office']);
        $this->assertDatabaseMissing('organisation_units', ['name' => 'State department']);
    }

    public function test_unit_cannot_be_moved_under_its_own_sub_unit(): void
    {
        $admin = $this->userWithRole('super_admin');
        $parent = $this->unitIn(null, 'Parent');
        $child = OrganisationUnit::query()->create(['type' => 'committee', 'name' => 'Child', 'parent_id' => $parent->id]);

        $this->actingAs($admin)->put(route('admin.organisation.units.update', $parent), [
            'type' => 'headquarters', 'name' => 'Parent', 'parent_id' => $child->id,
        ])->assertSessionHasErrors('parent_id');

        $this->assertNull($parent->fresh()->parent_id);
    }

    public function test_geography_enforces_level_order_and_records_audit(): void
    {
        $admin = $this->userWithRole('super_admin');

        $this->actingAs($admin)->post(route('admin.organisation.geography.store'), [
            'parent_id' => $this->countyA->id, 'level' => 'boma', 'name' => 'Skips payam',
        ])->assertSessionHasErrors('level');

        $this->actingAs($admin)->post(route('admin.organisation.geography.store'), [
            'parent_id' => $this->countyA->id, 'level' => 'payam', 'name' => 'Payam A3',
        ])->assertSessionHasNoErrors();

        $area = GeographicArea::query()->where('name', 'Payam A3')->firstOrFail();
        $this->assertTrue(AuditLog::query()->where('action', 'geography.created')->where('subject_id', $area->id)->exists());
    }

    public function test_areas_in_use_cannot_be_deleted(): void
    {
        $admin = $this->userWithRole('super_admin');
        $this->unitIn($this->payamA2);

        $this->actingAs($admin)->delete(route('admin.organisation.geography.destroy', $this->payamA2))
            ->assertSessionHasErrors('area');
        $this->assertModelExists($this->payamA2);
    }

    public function test_positions_with_history_cannot_be_deleted(): void
    {
        $admin = $this->userWithRole('super_admin');
        $position = $this->positionIn($this->unitIn(null));
        app(\App\Services\Organisation\AppointmentService::class)->appoint($admin, $position, $this->person(), '2026-01-01');

        $this->actingAs($admin)->delete(route('admin.organisation.positions.destroy', $position))
            ->assertSessionHasErrors('position');
        $this->assertModelExists($position);
    }
}
