<?php

namespace App\Services\Members;

use App\Models\MemberProfile;
use App\Models\Person;
use App\Models\User;
use App\Services\Audit\AuditLogger;
use Illuminate\Support\Facades\DB;

class MemberProfileService
{
    public function __construct(private readonly AuditLogger $audit) {}

    /**
     * The signed-in user's profile, created on first use.
     *
     * Reuses the person already linked to the account, or an unlinked person
     * record with the same email (e.g. an official entered by staff), so the
     * same individual never ends up with two profiles.
     */
    public function forUser(User $user): MemberProfile
    {
        if ($profile = $user->person?->memberProfile) {
            return $profile->setRelation('person', $user->person);
        }

        return DB::transaction(function () use ($user) {
            $person = Person::query()->where('user_id', $user->id)->lockForUpdate()->first();

            if (! $person) {
                $person = Person::query()
                    ->whereNull('user_id')
                    ->whereRaw('lower(email) = ?', [strtolower($user->email)])
                    ->lockForUpdate()
                    ->first();

                if ($person) {
                    $person->forceFill(['user_id' => $user->id])->save();
                    $this->audit->log('person.linked_to_account', $person, "Linked existing person record to {$user->email} on profile creation");
                } else {
                    $person = Person::query()->forceCreate([
                        'user_id' => $user->id,
                        // Kept exactly as entered; never auto-split into first/last names
                        'full_name' => $user->name,
                        'email' => strtolower($user->email),
                    ]);
                }
            }

            // Carry over details collected at registration rather than asking again
            if (! $person->gender && in_array($user->gender, ['male', 'female', 'other'], true)) {
                $person->forceFill(['gender' => $user->gender])->save();
            }

            $profile = $person->memberProfile()->firstOrCreate([], [
                'date_of_birth' => $user->date_of_birth,
            ]);

            return $profile->setRelation('person', $person);
        });
    }
}
