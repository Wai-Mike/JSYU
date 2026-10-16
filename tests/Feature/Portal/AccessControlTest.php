<?php

namespace Tests\Feature\Portal;

use App\Models\OrganisationUnit;
use App\Services\Access\AccessControl;

class AccessControlTest extends PortalTestCase
{
    private function access(): AccessControl
    {
        return app(AccessControl::class);
    }

    public function test_statewide_grant_applies_everywhere_including_state_level(): void
    {
        $user = $this->userWithPermissions(['organisation.view']);

        $this->assertTrue($this->access()->allows($user, 'organisation.view'));
        $this->assertTrue($this->access()->allows($user, 'organisation.view', $this->countyB));
        $this->assertTrue($this->access()->allows($user, 'organisation.view', $this->payamA1));
    }

    public function test_county_grant_covers_the_county_and_its_payams_only(): void
    {
        $user = $this->userWithPermissions(['organisation.view'], $this->countyA);

        $this->assertTrue($this->access()->allows($user, 'organisation.view', $this->countyA));
        $this->assertTrue($this->access()->allows($user, 'organisation.view', $this->payamA1));
        $this->assertFalse($this->access()->allows($user, 'organisation.view', $this->countyB));
        $this->assertFalse($this->access()->allows($user, 'organisation.view', $this->state));
        $this->assertFalse($this->access()->allows($user, 'organisation.view'), 'State-level records need a state-wide grant');
    }

    public function test_payam_grant_is_isolated_from_sibling_payam_and_parent_county(): void
    {
        $user = $this->userWithPermissions(['organisation.view'], $this->payamA1);

        $this->assertTrue($this->access()->allows($user, 'organisation.view', $this->payamA1));
        $this->assertFalse($this->access()->allows($user, 'organisation.view', $this->payamA2));
        $this->assertFalse($this->access()->allows($user, 'organisation.view', $this->countyA));
    }

    public function test_unscoped_permissions_granted_for_an_area_have_no_effect(): void
    {
        $user = $this->userWithPermissions(['content.manage', 'audit.view'], $this->countyA);

        $this->assertFalse($this->access()->allows($user, 'content.manage'));
        $this->assertFalse($this->access()->hasAnywhere($user, 'audit.view'));
        $this->assertNotContains('audit.view', $this->access()->permissionKeys($user));
    }

    public function test_scope_query_returns_only_records_inside_the_jurisdiction(): void
    {
        $inPayam = $this->unitIn($this->payamA1);
        $inCounty = $this->unitIn($this->countyA);
        $otherCounty = $this->unitIn($this->countyB);
        $stateLevel = $this->unitIn(null);

        $county = $this->userWithPermissions(['organisation.view'], $this->countyA);
        $ids = $this->access()->scopeQuery(OrganisationUnit::query(), $county, 'organisation.view')->pluck('id')->all();

        $this->assertEqualsCanonicalizing([$inPayam->id, $inCounty->id], $ids);
        $this->assertNotContains($otherCounty->id, $ids);
        $this->assertNotContains($stateLevel->id, $ids);

        $none = $this->userWithPermissions(['people.view']);
        $this->assertSame(0, $this->access()->scopeQuery(OrganisationUnit::query(), $none, 'organisation.view')->count());
    }

    public function test_area_paths_follow_moves(): void
    {
        $this->payamA1->update(['parent_id' => $this->countyB->id]);
        $boma = \App\Models\GeographicArea::query()->create(['level' => 'boma', 'name' => 'Boma X', 'parent_id' => $this->payamA1->id]);
        $this->countyB->update(['parent_id' => null]);

        $this->assertSame('/'.$this->countyB->id.'/', $this->payamA1->fresh()->path);
        $this->assertSame('/'.$this->countyB->id.'/'.$this->payamA1->id.'/', $boma->fresh()->path);
    }

    public function test_a_record_cannot_be_moved_under_its_own_descendant(): void
    {
        $this->expectException(\InvalidArgumentException::class);

        $this->countyA->update(['parent_id' => $this->payamA1->id]);
    }
}
