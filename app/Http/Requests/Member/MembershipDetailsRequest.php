<?php

namespace App\Http\Requests\Member;

use App\Models\GeographicArea;
use App\Models\MemberProfile;
use App\Services\Members\ProfilePhotoService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;

/**
 * The membership details collected after a new member has verified their email.
 */
class MembershipDetailsRequest extends FormRequest
{
    public const PROFILE_FIELDS = [
        'first_name', 'middle_name', 'last_name', 'date_of_birth', 'alternative_phone',
        'home_area_id', 'current_country_code', 'current_location', 'bio', 'visibility',
    ];

    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Counties, payams and bomas inside Jonglei that a member can pick as home area.
     */
    public static function homeAreas(): Collection
    {
        $state = GeographicArea::query()->where('code', 'SS-JG')->first();

        if (! $state) {
            return collect();
        }

        return GeographicArea::query()
            ->where('path', 'like', $state->path.$state->id.'/%')
            ->whereIn('level', ['county', 'payam', 'boma'])
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'level', 'parent_id']);
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'current_country_code' => strtoupper((string) $this->input('current_country_code')) ?: null,
        ]);
    }

    public function rules(): array
    {
        $areaIds = self::homeAreas()->pluck('id');
        $phone = 'regex:/^\+?[0-9\s()\-]{7,40}$/';

        return [
            'first_name' => ['required', 'string', 'max:80'],
            'middle_name' => ['nullable', 'string', 'max:80'],
            'last_name' => ['required', 'string', 'max:80'],
            'gender' => ['required', Rule::in(['male', 'female', 'other'])],
            'date_of_birth' => ['required', 'date', 'before:today', 'after:1900-01-01'],

            'phone' => ['required', 'string', 'max:40', $phone],
            'alternative_phone' => ['nullable', 'string', 'max:40', $phone],

            // Only enforced once the Jonglei geography has been seeded
            'home_area_id' => [Rule::requiredIf($areaIds->isNotEmpty()), 'nullable', 'integer', Rule::in($areaIds->all())],
            'current_country_code' => ['required', 'string', 'regex:/^[A-Z]{2}$/'],
            'current_location' => ['nullable', 'string', 'max:150'],

            'bio' => ['nullable', 'string', 'max:1000'],
            'photo' => ['nullable', ...array_values(array_diff(ProfilePhotoService::validationRules(), ['required']))],
            'visibility' => ['required', Rule::in(array_keys(MemberProfile::VISIBILITIES))],
        ];
    }

    public function messages(): array
    {
        return [
            'phone.regex' => 'Enter a valid phone number, e.g. +211 912 345 678.',
            'alternative_phone.regex' => 'Enter a valid phone number, e.g. +211 912 345 678.',
            'home_area_id.required' => 'Choose your home county.',
            'date_of_birth.before' => 'Your date of birth must be in the past.',
        ];
    }

    public function fullName(): string
    {
        return collect([$this->input('first_name'), $this->input('middle_name'), $this->input('last_name')])
            ->map(fn ($part) => trim((string) $part))
            ->filter()
            ->implode(' ');
    }
}
