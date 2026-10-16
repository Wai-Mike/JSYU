<?php

namespace Tests\Feature\Portal;

use App\Services\Organisation\AppointmentService;

class PortalPagesTest extends PortalTestCase
{
    public function test_every_portal_page_renders_its_component(): void
    {
        $admin = $this->userWithRole('super_admin');
        $unit = $this->unitIn($this->countyA, 'County A Office');
        $appointment = app(AppointmentService::class)->appoint($admin, $this->positionIn($unit), $this->person($this->countyA), '2026-01-01');

        $pages = [
            [route('admin.dashboard'), 'admin/dashboard/index'],
            [route('admin.organisation.geography.index'), 'admin/organisation/geography/index'],
            [route('admin.organisation.units.index'), 'admin/organisation/units/index'],
            [route('admin.organisation.units.show', $unit), 'admin/organisation/units/show'],
            [route('admin.organisation.appointments.index'), 'admin/organisation/appointments/index'],
            [route('admin.organisation.appointments.index', ['view' => 'history']), 'admin/organisation/appointments/index'],
            [route('admin.organisation.appointments.index', ['view' => 'vacancies']), 'admin/organisation/appointments/index'],
            [route('admin.organisation.appointments.show', $appointment), 'admin/organisation/appointments/show'],
            [route('admin.organisation.people.index'), 'admin/organisation/people/index'],
            [route('admin.users.index'), 'admin/users/index'],
            [route('admin.roles.index'), 'admin/access/roles/index'],
            [route('admin.audit.index'), 'admin/audit/index'],
            [route('admin.posts.index'), 'admin/posts/index'],
        ];

        foreach ($pages as [$url, $component]) {
            $this->actingAs($admin)->get($url)->assertOk()->assertInertia(fn ($page) => $page->component($component));
        }
    }

    public function test_people_search_returns_only_visible_people(): void
    {
        $this->person($this->countyA, 'Achol County A');
        $this->person($this->countyB, 'Achol County B');

        $officer = $this->userWithRole('county_coordinator', $this->countyA);

        $this->actingAs($officer)->getJson(route('admin.organisation.people.search', ['q' => 'Achol']))
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.full_name', 'Achol County A');
    }

    public function test_restricted_notes_are_hidden_from_viewers(): void
    {
        $person = $this->person($this->countyA, 'Noted Person');
        $person->update(['notes' => 'Sensitive note']);

        $this->actingAs($this->userWithRole('county_coordinator', $this->countyA))
            ->get(route('admin.organisation.people.index'))
            ->assertInertia(fn ($page) => $page->where('people.data.0.notes', null));

        $this->actingAs($this->userWithRole('secretariat_admin'))
            ->get(route('admin.organisation.people.index'))
            ->assertInertia(fn ($page) => $page->where('people.data.0.notes', 'Sensitive note'));
    }
}
