<?php

namespace App\Policies;

use App\Models\MemberProfile;
use App\Models\User;
use App\Services\Access\AccessControl;

class MemberProfilePolicy
{
    public function __construct(private readonly AccessControl $access) {}

    /**
     * Owners always; officials with members.view for the member's home area if
     * the member shares with officials; any signed-in member if shared with members.
     */
    public function view(User $user, MemberProfile $profile): bool
    {
        if ($profile->isOwnedBy($user)) {
            return true;
        }

        return match ($profile->visibility) {
            MemberProfile::VISIBILITY_MEMBERS => true,
            MemberProfile::VISIBILITY_OFFICIALS => $this->access->allows($user, 'members.view', $profile->home_area_id),
            default => false,
        };
    }

    /** Only the member edits their own profile. */
    public function update(User $user, MemberProfile $profile): bool
    {
        return $profile->isOwnedBy($user);
    }
}
