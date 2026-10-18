<?php

namespace App\Policies;

use App\Models\CensusRecord;
use App\Models\User;
use App\Services\Access\AccessControl;

class CensusRecordPolicy
{
    public function __construct(private readonly AccessControl $access) {}

    /** Officers with census.view for the area; enumerators see their own records. */
    public function view(User $user, CensusRecord $record): bool
    {
        return $this->access->allows($user, 'census.view', $record->geographic_area_id)
            || $this->access->allows($user, 'census.review', $record->geographic_area_id)
            || $this->isOwn($user, $record);
    }

    /** Enumerators correct their own records until approved, while the campaign is open. */
    public function update(User $user, CensusRecord $record): bool
    {
        return $this->isOwn($user, $record)
            && $record->status !== CensusRecord::STATUS_APPROVED
            && $record->campaign->isOpen();
    }

    /** Nobody reviews a record they entered themselves. */
    public function review(User $user, CensusRecord $record): bool
    {
        return $record->enumerator_id !== $user->id
            && $this->access->allows($user, 'census.review', $record->geographic_area_id);
    }

    private function isOwn(User $user, CensusRecord $record): bool
    {
        return $record->enumerator_id === $user->id
            && $this->access->allows($user, 'census.collect', $record->geographic_area_id);
    }
}
