<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Http\Requests\Member\MembershipDetailsRequest;
use App\Models\MemberProfile;
use App\Services\Members\MemberProfileService;
use App\Services\Members\ProfilePhotoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Second half of sign-up: the membership details a member fills in once
 * their email is verified. Also reachable later to update the same details.
 */
class MembershipController extends Controller
{
    public function __construct(private readonly MemberProfileService $profiles) {}

    public function edit(Request $request): Response
    {
        $user = $request->user();
        $profile = $this->profiles->forUser($user);
        $person = $profile->person;

        return Inertia::render('member/membership', [
            'areas' => MembershipDetailsRequest::homeAreas(),
            'visibilities' => MemberProfile::VISIBILITIES,
            'hasPhoto' => $profile->hasPhoto(),
            'member' => [
                'email' => $user->email,
                'first_name' => $profile->first_name ?? '',
                'middle_name' => $profile->middle_name ?? '',
                'last_name' => $profile->last_name ?? '',
                'gender' => $person->gender ?? '',
                'date_of_birth' => $profile->date_of_birth?->toDateString() ?? '',
                'phone' => $person->phone ?? '',
                'alternative_phone' => $profile->alternative_phone ?? '',
                'home_area_id' => $profile->home_area_id ?? '',
                'current_country_code' => $profile->current_country_code ?? 'SS',
                'current_location' => $profile->current_location ?? '',
                'bio' => $profile->bio ?? '',
                'visibility' => $profile->visibility ?? MemberProfile::VISIBILITY_OFFICIALS,
            ],
        ]);
    }

    public function update(MembershipDetailsRequest $request, ProfilePhotoService $photos): RedirectResponse
    {
        $user = $request->user();
        $profile = $this->profiles->forUser($user);
        $wasComplete = $profile->isMembershipComplete();

        DB::transaction(function () use ($request, $user, $profile) {
            $name = $request->fullName();

            $user->forceFill(['name' => $name, 'gender' => $request->gender, 'date_of_birth' => $request->date_of_birth])->save();
            $profile->person->update(['full_name' => $name, 'phone' => $request->phone, 'gender' => $request->gender]);
            $profile->update($request->safe()->only(MembershipDetailsRequest::PROFILE_FIELDS));
        });

        if ($request->hasFile('photo')) {
            $photos->store($profile, $request->file('photo'));
        }

        return redirect()->route('member.dashboard')->with(
            'success',
            $wasComplete ? 'Your membership details have been updated.' : 'Welcome to the Jonglei State Youth Union! Your membership is complete.',
        );
    }
}
