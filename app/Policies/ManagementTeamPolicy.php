<?php

namespace App\Policies;

use App\Models\ManagementTeam;
use App\Models\User;
use App\Services\Access\AccessControl;

class ManagementTeamPolicy
{
    public function __construct(private readonly AccessControl $access) {}

    public function viewAny(User $user): bool
    {
        return $this->access->hasAnywhere($user, 'teams.view');
    }

    public function view(User $user, ManagementTeam $team): bool
    {
        return $this->access->allows($user, 'teams.view', $team->geographic_area_id);
    }

    /** $areaId null = a state-level team, which needs a state-wide grant. */
    public function create(User $user, ?int $areaId = null): bool
    {
        return $this->access->allows($user, 'teams.manage', $areaId);
    }

    public function update(User $user, ManagementTeam $team): bool
    {
        return $this->access->allows($user, 'teams.manage', $team->geographic_area_id);
    }

    public function delete(User $user, ManagementTeam $team): bool
    {
        return $this->update($user, $team);
    }
}
