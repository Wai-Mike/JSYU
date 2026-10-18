<?php

namespace App\Http\Requests\Admin\Organisation;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/** Authorization (area-scoped) is checked in the controller. */
class ManagementTeamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'geographic_area_id' => ['nullable', 'integer', 'exists:geographic_areas,id'],
            'starts_on' => ['required', 'date'],
            // A previous team needs an end date; the current one may still be serving
            'ends_on' => [Rule::requiredIf(! $this->boolean('is_current')), 'nullable', 'date', 'after_or_equal:starts_on'],
            'is_current' => ['boolean'],
            'description' => ['nullable', 'string', 'max:5000'],

            'members' => ['required', 'array', 'min:1', 'max:100'],
            'members.*.position_title' => ['required', 'string', 'max:150'],
            'members.*.name' => ['required', 'string', 'max:255'],
            'members.*.person_id' => ['nullable', 'integer', 'exists:people,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'ends_on.required' => 'A previous team needs the date its term ended.',
            'members.required' => 'Add at least one team member.',
            'members.*.position_title.required' => 'Enter the position.',
            'members.*.name.required' => 'Enter the name.',
        ];
    }
}
