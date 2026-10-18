<?php

namespace Tests\Feature\Portal;

use App\Models\ManagementTeam;

class ManagementTeamTest extends PortalTestCase
{
    private function payload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'State Executive 2026–2029',
            'geographic_area_id' => null,
            'starts_on' => '2026-01-01',
            'ends_on' => null,
            'is_current' => true,
            'description' => null,
            'members' => [
                ['position_title' => 'Chairperson', 'name' => 'Deng Majok', 'person_id' => null],
                ['position_title' => 'Secretary General', 'name' => 'Achol Garang', 'person_id' => null],
            ],
        ], $overrides);
    }

    public function test_creating_a_current_team_moves_the_old_one_to_previous(): void
    {
        $admin = $this->userWithRole('secretariat_admin');

        $this->actingAs($admin)->post(route('admin.organisation.teams.store'), $this->payload([
            'name' => 'State Executive 2023–2026', 'starts_on' => '2023-01-01',
        ]))->assertSessionHasNoErrors();

        $this->actingAs($admin)->post(route('admin.organisation.teams.store'), $this->payload())->assertSessionHasNoErrors();

        $old = ManagementTeam::query()->where('name', 'State Executive 2023–2026')->first();
        $new = ManagementTeam::query()->where('name', 'State Executive 2026–2029')->first();

        $this->assertFalse($old->is_current);
        $this->assertSame('2026-01-01', $old->ends_on->toDateString());
        $this->assertTrue($new->is_current);
        $this->assertSame(['Chairperson', 'Secretary General'], $new->members->pluck('position_title')->all());
        $this->assertDatabaseHas('audit_logs', ['action' => 'team.superseded', 'subject_id' => $old->id]);
    }

    public function test_previous_team_needs_an_end_date_and_members(): void
    {
        $this->actingAs($this->userWithRole('secretariat_admin'))
            ->post(route('admin.organisation.teams.store'), $this->payload(['is_current' => false, 'members' => []]))
            ->assertSessionHasErrors(['ends_on', 'members']);
    }

    public function test_update_replaces_members_in_order(): void
    {
        $admin = $this->userWithRole('secretariat_admin');
        $this->actingAs($admin)->post(route('admin.organisation.teams.store'), $this->payload());
        $team = ManagementTeam::query()->firstOrFail();
        $person = $this->person(null, 'Linked Person');

        $this->actingAs($admin)->put(route('admin.organisation.teams.update', $team), $this->payload([
            'members' => [
                ['position_title' => 'Treasurer', 'name' => 'Nyibol Akech', 'person_id' => $person->id],
                ['position_title' => 'Chairperson', 'name' => 'Deng Majok', 'person_id' => null],
            ],
        ]))->assertSessionHasNoErrors();

        $members = $team->fresh()->members;
        $this->assertSame(['Treasurer', 'Chairperson'], $members->pluck('position_title')->all());
        $this->assertSame($person->id, $members->first()->person_id);
    }

    public function test_county_scope_is_enforced(): void
    {
        $manager = $this->userWithPermissions(['portal.access', 'teams.view', 'teams.manage'], $this->countyA);

        $this->actingAs($manager)->post(route('admin.organisation.teams.store'), $this->payload([
            'geographic_area_id' => $this->countyA->id, 'name' => 'County A Team',
        ]))->assertSessionHasNoErrors();

        // No state-wide grant: cannot create state-level or other-county teams
        $this->actingAs($manager)->post(route('admin.organisation.teams.store'), $this->payload())->assertForbidden();
        $this->actingAs($manager)->post(route('admin.organisation.teams.store'), $this->payload([
            'geographic_area_id' => $this->countyB->id,
        ]))->assertForbidden();

        $this->actingAs($manager)->get(route('admin.organisation.teams.index'))
            ->assertInertia(fn ($page) => $page->has('teams.data', 1)->where('teams.data.0.name', 'County A Team'));
    }

    public function test_team_pages_render_and_delete_works(): void
    {
        $admin = $this->userWithRole('super_admin');
        $this->actingAs($admin)->post(route('admin.organisation.teams.store'), $this->payload());
        $team = ManagementTeam::query()->firstOrFail();

        foreach ([
            [route('admin.organisation.teams.index'), 'admin/organisation/teams/index'],
            [route('admin.organisation.teams.index', ['view' => 'previous']), 'admin/organisation/teams/index'],
            [route('admin.organisation.teams.create'), 'admin/organisation/teams/form'],
            [route('admin.organisation.teams.show', $team), 'admin/organisation/teams/show'],
            [route('admin.organisation.teams.edit', $team), 'admin/organisation/teams/form'],
        ] as [$url, $component]) {
            $this->actingAs($admin)->get($url)->assertOk()->assertInertia(fn ($page) => $page->component($component));
        }

        $this->actingAs($admin)->delete(route('admin.organisation.teams.destroy', $team))->assertRedirect();
        $this->assertDatabaseCount('management_team_members', 0);
    }
}
