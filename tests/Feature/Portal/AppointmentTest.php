<?php

namespace Tests\Feature\Portal;

use App\Models\Appointment;
use App\Models\AuditLog;
use App\Models\Document;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class AppointmentTest extends PortalTestCase
{
    private function appointPayload($position, $person, array $extra = []): array
    {
        return ['position_id' => $position->id, 'person_id' => $person->id, 'starts_on' => '2026-02-01', ...$extra];
    }

    public function test_appointing_fills_a_seat_and_respects_the_seat_limit(): void
    {
        $admin = $this->userWithRole('secretariat_admin');
        $position = $this->positionIn($this->unitIn(null), seats: 1);
        $first = $this->person();

        $this->actingAs($admin)->post(route('admin.organisation.appointments.store'), $this->appointPayload($position, $first))
            ->assertSessionHasNoErrors();

        $this->actingAs($admin)->post(route('admin.organisation.appointments.store'), $this->appointPayload($position, $this->person()))
            ->assertSessionHasErrors('position_id');

        $this->assertSame(1, $position->activeAppointments()->count());
        $this->assertTrue(AuditLog::query()->where('action', 'appointment.created')->exists());
    }

    public function test_same_person_cannot_hold_the_same_seat_twice(): void
    {
        $admin = $this->userWithRole('secretariat_admin');
        $position = $this->positionIn($this->unitIn(null), seats: 3);
        $person = $this->person();

        $this->actingAs($admin)->post(route('admin.organisation.appointments.store'), $this->appointPayload($position, $person));
        $this->actingAs($admin)->post(route('admin.organisation.appointments.store'), $this->appointPayload($position, $person))
            ->assertSessionHasErrors('person_id');
    }

    public function test_term_end_defaults_from_position_term_length(): void
    {
        $admin = $this->userWithRole('secretariat_admin');
        $position = $this->unitIn(null)->positions()->create(['title' => 'Chair', 'seats' => 1, 'term_months' => 48]);

        $this->actingAs($admin)->post(route('admin.organisation.appointments.store'), $this->appointPayload($position, $this->person()));

        $this->assertSame('2030-02-01', Appointment::query()->first()->term_ends_on->toDateString());
    }

    public function test_ending_keeps_history_and_frees_the_seat(): void
    {
        $admin = $this->userWithRole('secretariat_admin');
        $position = $this->positionIn($this->unitIn(null));
        $appointment = app(\App\Services\Organisation\AppointmentService::class)->appoint($admin, $position, $this->person(), '2026-01-01');

        $this->actingAs($admin)->post(route('admin.organisation.appointments.end', $appointment), [
            'ended_on' => '2026-06-30', 'end_reason' => 'resigned',
        ])->assertSessionHasNoErrors();

        $appointment->refresh();
        $this->assertSame(Appointment::STATUS_ENDED, $appointment->status);
        $this->assertSame('resigned', $appointment->end_reason);
        $this->assertSame($admin->id, $appointment->ended_by);
        $this->assertSame(0, $position->activeAppointments()->count());
        $this->assertSame(1, $position->appointments()->count(), 'History is kept');

        $this->actingAs($admin)->post(route('admin.organisation.appointments.end', $appointment), [
            'ended_on' => '2026-07-01', 'end_reason' => 'other',
        ])->assertSessionHasErrors('appointment');
    }

    public function test_transfer_ends_current_holder_and_links_the_successor(): void
    {
        $admin = $this->userWithRole('secretariat_admin');
        $position = $this->positionIn($this->unitIn(null));
        $current = app(\App\Services\Organisation\AppointmentService::class)->appoint($admin, $position, $this->person(), '2026-01-01');
        $successor = $this->person();

        $this->actingAs($admin)->post(route('admin.organisation.appointments.transfer', $current), [
            'person_id' => $successor->id, 'effective_on' => '2026-05-01',
        ])->assertSessionHasNoErrors();

        $this->assertSame('transferred', $current->fresh()->end_reason);
        $new = $position->activeAppointments()->first();
        $this->assertSame($successor->id, $new->person_id);
        $this->assertSame($current->id, $new->replaces_appointment_id);
    }

    public function test_county_officer_cannot_appoint_outside_their_county_or_with_hidden_people(): void
    {
        $officer = $this->userWithPermissions(['portal.access', 'appointments.manage', 'people.view'], $this->countyA);
        $otherCountyPosition = $this->positionIn($this->unitIn($this->countyB));
        $ownPosition = $this->positionIn($this->unitIn($this->countyA));

        $this->actingAs($officer)->post(route('admin.organisation.appointments.store'), $this->appointPayload($otherCountyPosition, $this->person($this->countyA)))
            ->assertForbidden();

        // A person record from another county is not visible to this officer
        $this->actingAs($officer)->post(route('admin.organisation.appointments.store'), $this->appointPayload($ownPosition, $this->person($this->countyB)))
            ->assertForbidden();

        $this->actingAs($officer)->post(route('admin.organisation.appointments.store'), $this->appointPayload($ownPosition, $this->person($this->payamA1)))
            ->assertSessionHasNoErrors();

        $this->assertSame(1, Appointment::query()->count());
    }

    public function test_viewers_without_manage_rights_cannot_end_appointments(): void
    {
        $admin = $this->userWithRole('secretariat_admin');
        $viewer = $this->userWithRole('state_executive');
        $appointment = app(\App\Services\Organisation\AppointmentService::class)->appoint($admin, $this->positionIn($this->unitIn(null)), $this->person(), '2026-01-01');

        $this->actingAs($viewer)->get(route('admin.organisation.appointments.show', $appointment))->assertOk();
        $this->actingAs($viewer)->post(route('admin.organisation.appointments.end', $appointment), [
            'ended_on' => '2026-03-01', 'end_reason' => 'removed',
        ])->assertForbidden();
        $this->assertTrue($appointment->fresh()->isActive());
    }

    public function test_appointment_documents_are_private_and_permission_checked(): void
    {
        Storage::fake('local');

        $admin = $this->userWithRole('secretariat_admin');
        $appointment = app(\App\Services\Organisation\AppointmentService::class)->appoint($admin, $this->positionIn($this->unitIn(null)), $this->person(), '2026-01-01');

        $this->actingAs($admin)->post(route('admin.organisation.appointments.documents.store', $appointment), [
            'document' => UploadedFile::fake()->create('letter.pdf', 120, 'application/pdf'),
            'title' => 'Appointment letter',
        ])->assertSessionHasNoErrors();

        $document = Document::query()->firstOrFail();
        Storage::disk('local')->assertExists($document->path);
        $this->assertStringNotContainsString('letter', $document->path, 'Stored under a random name');

        $this->actingAs($admin)->post(route('admin.organisation.appointments.documents.store', $appointment), [
            'document' => UploadedFile::fake()->create('script.exe', 10, 'application/octet-stream'),
        ])->assertSessionHasErrors('document');

        // Can view appointments, but not their documents
        $viewer = $this->userWithPermissions(['portal.access', 'appointments.view']);
        $this->actingAs($viewer)->get(route('admin.organisation.appointments.documents.download', [$appointment, $document]))->assertForbidden();
        $this->actingAs($viewer)->get(route('admin.organisation.appointments.show', $appointment))
            ->assertInertia(fn ($page) => $page->where('documents', null));

        $this->actingAs($admin)->get(route('admin.organisation.appointments.documents.download', [$appointment, $document]))->assertOk();
        $this->assertTrue(AuditLog::query()->where('action', 'appointment.document_downloaded')->exists());
    }

    public function test_leadership_register_is_scoped(): void
    {
        $admin = $this->userWithRole('super_admin');
        $service = app(\App\Services\Organisation\AppointmentService::class);
        $service->appoint($admin, $this->positionIn($this->unitIn($this->countyA)), $this->person(), '2026-01-01');
        $service->appoint($admin, $this->positionIn($this->unitIn($this->countyB)), $this->person(), '2026-01-01');

        $officer = $this->userWithRole('county_coordinator', $this->countyA);

        $this->actingAs($officer)->get(route('admin.organisation.appointments.index'))
            ->assertInertia(fn ($page) => $page->where('appointments.total', 1));

        $this->actingAs($admin)->get(route('admin.organisation.appointments.index'))
            ->assertInertia(fn ($page) => $page->where('appointments.total', 2));
    }
}
