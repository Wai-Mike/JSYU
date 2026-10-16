<?php

namespace App\Policies;

use App\Models\OrganisationUnit;
use App\Models\User;
use App\Services\Access\AccessControl;

class OrganisationUnitPolicy
{
    public function __construct(private readonly AccessControl $access) {}

    public function viewAny(User $user): bool
    {
        return $this->access->hasAnywhere($user, 'organisation.view');
    }

    public function view(User $user, OrganisationUnit $unit): bool
    {
        return $this->access->allows($user, 'organisation.view', $unit->geographic_area_id);
    }

    /** $areaId is the area the new unit will belong to (null = state level). */
    public function create(User $user, ?int $areaId = null): bool
    {
        return $this->access->allows($user, 'organisation.manage', $areaId);
    }

    public function update(User $user, OrganisationUnit $unit): bool
    {
        return $this->access->allows($user, 'organisation.manage', $unit->geographic_area_id);
    }

    public function delete(User $user, OrganisationUnit $unit): bool
    {
        return $this->update($user, $unit);
    }

    public function managePositions(User $user, OrganisationUnit $unit): bool
    {
        return $this->access->allows($user, 'positions.manage', $unit->geographic_area_id);
    }
}
