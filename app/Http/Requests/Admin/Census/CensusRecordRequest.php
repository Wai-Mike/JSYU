<?php

namespace App\Http\Requests\Admin\Census;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/** Authorization (area-scoped) is checked in the controller. */
class CensusRecordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $options = config('portal.census');
        $phone = 'regex:/^\+?[0-9\s()\-]{7,40}$/';

        return [
            'geographic_area_id' => ['required', 'integer', 'exists:geographic_areas,id'],
            'full_name' => ['required', 'string', 'max:255'],
            'sex' => ['required', Rule::in(array_keys($options['sex']))],
            // Either an exact date of birth or an approximate age
            'date_of_birth' => ['nullable', 'required_without:age_years', 'date', 'before:today', 'after:1900-01-01'],
            'age_years' => ['nullable', 'required_without:date_of_birth', 'integer', 'between:'.$options['min_age'].','.$options['max_age']],
            'phone' => ['nullable', 'string', 'max:40', $phone],

            'education_level' => ['nullable', Rule::in(array_keys($options['education_levels']))],
            'in_school' => ['nullable', 'boolean'],

            'employment_status' => ['nullable', Rule::in(array_keys($options['employment_statuses']))],
            'occupation' => ['nullable', 'string', 'max:150'],
            'skills' => ['nullable', 'string', 'max:1000'],

            'disability' => ['nullable', Rule::in(array_keys($options['disability']))],
            'displacement_status' => ['nullable', Rule::in(array_keys($options['displacement_statuses']))],

            // Set after the duplicate warning to save anyway
            'confirm_not_duplicate' => ['boolean'],
        ];
    }

    /** The census only counts youth, so a date of birth must give an age in range too. */
    public function after(): array
    {
        return [function ($validator) {
            $dob = $this->input('date_of_birth');

            if (! $dob || $validator->errors()->has('date_of_birth')) {
                return;
            }

            ['min_age' => $min, 'max_age' => $max] = config('portal.census');
            $age = \Illuminate\Support\Carbon::parse($dob)->age;

            if ($age < $min || $age > $max) {
                $validator->errors()->add('date_of_birth', "This person is {$age}. The census counts youth aged {$min} to {$max}.");
            }
        }];
    }

    public function messages(): array
    {
        return [
            'date_of_birth.required_without' => 'Enter a date of birth or an approximate age.',
            'age_years.required_without' => 'Enter a date of birth or an approximate age.',
            'age_years.between' => 'The census counts youth aged :min to :max.',
            'phone.regex' => 'Enter a valid phone number, e.g. +211 912 345 678.',
        ];
    }
}
