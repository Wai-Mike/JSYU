<?php

namespace App\Policies;

use App\Models\Election;
use App\Models\User;
use App\Services\Access\AccessControl;

class ElectionPolicy
{
    public function __construct(private readonly AccessControl $access) {}

    public function viewAny(User $user): bool
    {
        return $this->access->hasAnywhere($user, 'elections.view') || $this->access->hasAnywhere($user, 'elections.manage');
    }

    public function view(User $user, Election $election): bool
    {
        return $this->access->allows($user, 'elections.view', $election->geographic_area_id)
            || $this->update($user, $election);
    }

    public function create(User $user, ?int $areaId = null): bool
    {
        return $this->access->allows($user, 'elections.manage', $areaId);
    }

    /** Set up, open and close the election. */
    public function update(User $user, Election $election): bool
    {
        return $this->access->allows($user, 'elections.manage', $election->geographic_area_id);
    }

    /** Certifying results is deliberately a separate permission from running the election. */
    public function certify(User $user, Election $election): bool
    {
        return $this->access->allows($user, 'elections.certify', $election->geographic_area_id);
    }
}
