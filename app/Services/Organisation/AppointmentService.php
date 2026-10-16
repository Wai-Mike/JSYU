<?php

namespace App\Services\Organisation;

use App\Models\Appointment;
use App\Models\Person;
use App\Models\Position;
use App\Models\User;
use App\Services\Audit\AuditLogger;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * All appointment state changes go through here so seat limits, history and
 * audit records stay consistent. Authorization is checked by the caller.
 */
class AppointmentService
{
    public function __construct(private readonly AuditLogger $audit) {}

    public function appoint(User $actor, Position $position, Person $person, string $startsOn, ?string $termEndsOn = null, ?string $notes = null, ?Appointment $replaces = null): Appointment
    {
        $appointment = DB::transaction(function () use ($actor, $position, $person, $startsOn, $termEndsOn, $notes, $replaces) {
            // Lock the position row so concurrent appointments cannot exceed the seat limit
            $position = Position::query()->lockForUpdate()->findOrFail($position->id);

            if (! $position->is_active) {
                throw ValidationException::withMessages(['position_id' => 'This position is inactive.']);
            }

            $active = $position->activeAppointments()->get();

            if ($active->contains('person_id', $person->id)) {
                throw ValidationException::withMessages(['person_id' => "{$person->full_name} already holds this position."]);
            }

            if ($active->count() >= $position->seats) {
                throw ValidationException::withMessages(['position_id' => 'This position has no vacant seat. End or transfer the current appointment first.']);
            }

            $start = CarbonImmutable::parse($startsOn);

            if (! $termEndsOn && $position->term_months) {
                $termEndsOn = $start->addMonths($position->term_months)->toDateString();
            }

            $appointment = new Appointment([
                'position_id' => $position->id,
                'person_id' => $person->id,
                'starts_on' => $start->toDateString(),
                'term_ends_on' => $termEndsOn,
                'notes' => $notes,
            ]);
            $appointment->forceFill([
                'status' => Appointment::STATUS_ACTIVE,
                'appointed_by' => $actor->id,
                'replaces_appointment_id' => $replaces?->id,
            ])->save();

            return $appointment;
        });

        $this->audit->log('appointment.created', $appointment, "Appointed {$person->full_name} as {$position->title}", [
            'position_id' => $position->id,
            'person_id' => $person->id,
            'starts_on' => $appointment->starts_on->toDateString(),
        ]);

        return $appointment;
    }

    public function end(User $actor, Appointment $appointment, string $endedOn, string $reason, ?string $notes = null): Appointment
    {
        DB::transaction(function () use ($actor, $appointment, $endedOn, $reason, $notes) {
            $fresh = Appointment::query()->lockForUpdate()->findOrFail($appointment->id);

            if (! $fresh->isActive()) {
                throw ValidationException::withMessages(['appointment' => 'This appointment has already ended.']);
            }

            if (CarbonImmutable::parse($endedOn)->lt($fresh->starts_on)) {
                throw ValidationException::withMessages(['ended_on' => 'The end date cannot be before the start date.']);
            }

            $appointment->forceFill([
                'status' => Appointment::STATUS_ENDED,
                'ended_on' => $endedOn,
                'end_reason' => $reason,
                'ended_by' => $actor->id,
                'notes' => $notes !== null ? trim(($fresh->notes ? $fresh->notes."\n\n" : '').$notes) : $fresh->notes,
            ])->save();
        });

        $appointment->loadMissing('person', 'position');

        $this->audit->log('appointment.ended', $appointment, "Ended appointment of {$appointment->person->full_name} as {$appointment->position->title}", [
            'ended_on' => $endedOn,
            'reason' => $reason,
        ]);

        return $appointment;
    }

    /** End the current holder's appointment and appoint a successor in one step. */
    public function transfer(User $actor, Appointment $appointment, Person $successor, string $effectiveOn, ?string $notes = null): Appointment
    {
        return DB::transaction(function () use ($actor, $appointment, $successor, $effectiveOn, $notes) {
            $this->end($actor, $appointment, $effectiveOn, 'transferred', $notes);

            return $this->appoint($actor, $appointment->position, $successor, $effectiveOn, null, $notes, $appointment);
        });
    }
}
