<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
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
            'profile' => $profile ? [
                'homeArea' => $profile->homeArea?->name,
                'sections' => $profile->completeness(),
            ] : null,
        ]);
    }
}
