<?php

namespace App\Policies;

use App\Models\CensusCampaign;
use App\Models\User;
use App\Services\Access\AccessControl;

class CensusCampaignPolicy
{
    private const ANY = ['census.view', 'census.collect', 'census.review', 'census.manage'];

    public function __construct(private readonly AccessControl $access) {}

    public function viewAny(User $user): bool
    {
        return collect(self::ANY)->contains(fn ($p) => $this->access->hasAnywhere($user, $p));
    }

    /** Anyone with a census role somewhere the campaign runs. */
    public function view(User $user, CensusCampaign $campaign): bool
    {
        return collect(self::ANY)->contains(fn ($p) => $this->access->overlaps($user, $p, $campaign->geographic_area_id));
    }

    public function create(User $user, ?int $areaId = null): bool
    {
        return $this->access->allows($user, 'census.manage', $areaId);
    }

    public function update(User $user, CensusCampaign $campaign): bool
    {
        return $this->access->allows($user, 'census.manage', $campaign->geographic_area_id);
    }

    /** Reports aggregate approved records; restricted to census.view holders. */
    public function viewReports(User $user, CensusCampaign $campaign): bool
    {
        return $this->access->overlaps($user, 'census.view', $campaign->geographic_area_id);
    }
}
