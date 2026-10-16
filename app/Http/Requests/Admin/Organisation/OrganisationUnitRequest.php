<?php

namespace App\Http\Requests\Admin\Organisation;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrganisationUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // authorised in the controller against the unit's area
    }

    public function rules(): array
    {
        $unit = $this->route('unit');

        return [
            'parent_id' => ['nullable', 'integer', 'exists:organisation_units,id', Rule::notIn(array_filter([$unit?->id]))],
            'type' => ['required', Rule::in(array_keys(config('portal.unit_types')))],
            'name' => [
                'required', 'string', 'max:150',
                Rule::unique('organisation_units')->where('parent_id', $this->input('parent_id'))->ignore($unit?->id),
            ],
            'code' => ['nullable', 'string', 'max:50', 'alpha_dash', Rule::unique('organisation_units')->ignore($unit?->id)],
            'description' => ['nullable', 'string', 'max:2000'],
            'geographic_area_id' => ['nullable', 'integer', 'exists:geographic_areas,id'],
            'is_active' => ['boolean'],
        ];
    }
}
