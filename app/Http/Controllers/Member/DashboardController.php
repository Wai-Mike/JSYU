<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\MemberProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $profile = $user->person?->memberProfile;

        return Inertia::render('member/dashboard/index', [
            'account' => [
                'name' => $user->name,
                'email' => $user->email,
                'joined' => $user->created_at?->toDateString(),
                'signInMethod' => $user->google_id ? 'Google' : 'Email & password',
            ],
            'membershipComplete' => (bool) $profile?->isMembershipComplete(),
            'profile' => $profile ? [
                'status' => $profile->status,
                // Shown so a rejected member knows what to change before resubmitting
                'reviewNote' => $profile->status === MemberProfile::STATUS_REJECTED ? $profile->review_note : null,
                'homeArea' => $profile->homeArea?->name,
                'sections' => $profile->completeness(),
            ] : null,
        ]);
    }
}
