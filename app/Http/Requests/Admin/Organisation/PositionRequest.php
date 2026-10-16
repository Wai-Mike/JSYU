<?php

namespace App\Http\Requests\Admin\Organisation;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PositionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // authorised in the controller against the unit
    }

    public function rules(): array
    {
        $position = $this->route('position');
        $unitId = $position?->organisation_unit_id ?? $this->route('unit')?->id;

        return [
            'title' => [
                'required', 'string', 'max:150',
                Rule::unique('positions')->where('organisation_unit_id', $unitId)->ignore($position?->id),
            ],
            'description' => ['nullable', 'string', 'max:2000'],
            'is_leadership' => ['boolean'],
            'seats' => ['required', 'integer', 'min:1', 'max:500'],
            'term_months' => ['nullable', 'integer', 'min:1', 'max:240'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:10000'],
            'is_active' => ['boolean'],
        ];
    }
}
