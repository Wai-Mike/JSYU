<?php

namespace App\Policies;

use App\Models\MemberProfile;
use App\Models\User;
use App\Services\Access\AccessControl;

class MemberProfilePolicy
{
    public function __construct(private readonly AccessControl $access) {}

    /** The portal's member directory: anyone who may view or review members somewhere. */
    public function viewAny(User $user): bool
    {
        return $this->access->hasAnywhere($user, 'members.view') || $this->access->hasAnywhere($user, 'members.review');
    }

    /**
     * Owners always; membership reviewers for the member's home area; officials
     * with members.view there if the member shares with officials; any
     * signed-in member if shared with members.
     */
    public function view(User $user, MemberProfile $profile): bool
    {
        if ($profile->isOwnedBy($user) || $this->review($user, $profile)) {
            return true;
        }

        return match ($profile->visibility) {
            MemberProfile::VISIBILITY_MEMBERS => true,
            MemberProfile::VISIBILITY_OFFICIALS => $this->access->allows($user, 'members.view', $profile->home_area_id),
            default => false,
        };
    }

    /** Approve or reject the membership. Nobody reviews their own application. */
    public function review(User $user, MemberProfile $profile): bool
    {
        return ! $profile->isOwnedBy($user) && $this->access->allows($user, 'members.review', $profile->home_area_id);
    }

    /** Only the member edits their own profile. */
    public function update(User $user, MemberProfile $profile): bool
    {
        return $profile->isOwnedBy($user);
    }
}
