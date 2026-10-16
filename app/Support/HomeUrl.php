<?php

namespace App\Support;

use App\Models\User;

class HomeUrl
{
    /**
     * Where a signed-in user belongs: portal users on the admin subdomain,
     * everyone else in the member area.
     */
    public static function for(User $user): string
    {
        return $user->role === 'admin'
            ? route('admin.dashboard')
            : route('member.dashboard');
    }

    /**
     * Where to land once an email address is confirmed: members who haven't
     * finished their membership details continue with them first.
     */
    public static function afterVerification(User $user): string
    {
        if ($user->role === 'admin') {
            return self::for($user);
        }

        $profile = $user->person?->memberProfile;

        return $profile?->isMembershipComplete()
            ? route('member.dashboard')
            : route('member.membership.edit');
    }
}
