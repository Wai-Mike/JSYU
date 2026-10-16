<?php

namespace App\Policies;

use App\Models\Appointment;
use App\Models\Position;
use App\Models\User;
use App\Services\Access\AccessControl;

class AppointmentPolicy
{
    public function __construct(private readonly AccessControl $access) {}

    public function viewAny(User $user): bool
    {
        return $this->access->hasAnywhere($user, 'appointments.view');
    }

    public function view(User $user, Appointment $appointment): bool
    {
        return $this->access->allows($user, 'appointments.view', $this->areaOf($appointment->position));
    }

    /** Appoint someone to $position. */
    public function create(User $user, Position $position): bool
    {
        return $this->access->allows($user, 'appointments.manage', $this->areaOf($position));
    }

    /** End or transfer an appointment, and manage its documents. */
    public function update(User $user, Appointment $appointment): bool
    {
        return $this->access->allows($user, 'appointments.manage', $this->areaOf($appointment->position));
    }

    public function viewDocuments(User $user, Appointment $appointment): bool
    {
        return $this->access->allows($user, 'appointments.documents', $this->areaOf($appointment->position));
    }

    private function areaOf(Position $position): ?int
    {
        return $position->organisationUnit()->value('geographic_area_id');
    }
}
