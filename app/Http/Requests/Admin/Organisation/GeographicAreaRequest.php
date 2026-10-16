<?php

namespace App\Http\Requests\Admin\Organisation;

use App\Models\GeographicArea;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class GeographicAreaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // authorised in the controller against the parent/area
    }

    public function rules(): array
    {
        $area = $this->route('area');
        $creating = $area === null;

        return [
            'parent_id' => $creating ? ['nullable', 'integer', 'exists:geographic_areas,id'] : ['prohibited'],
            'level' => $creating ? ['required', Rule::in(array_keys(config('portal.geographic_levels')))] : ['prohibited'],
            'name' => [
                'required', 'string', 'max:120',
                Rule::unique('geographic_areas')
                    ->where('parent_id', $creating ? $this->input('parent_id') : $area->parent_id)
                    ->ignore($area?->id),
            ],
            'code' => ['nullable', 'string', 'max:50', 'alpha_dash', Rule::unique('geographic_areas')->ignore($area?->id)],
            'is_active' => ['boolean'],
        ];
    }

    public function after(): array
    {
        return [function (Validator $validator) {
            if ($this->route('area') || $validator->errors()->isNotEmpty()) {
                return;
            }

            $parent = $this->input('parent_id') ? GeographicArea::query()->find($this->input('parent_id')) : null;
            $allowed = $parent ? config("portal.geographic_children.{$parent->level}", []) : config('portal.geographic_roots', ['country']);

            if (! in_array($this->input('level'), $allowed, true)) {
                $validator->errors()->add('level', $parent
                    ? 'A '.$parent->level.' can only contain: '.(implode(', ', $allowed) ?: 'nothing').'.'
                    : 'Top-level areas must be one of: '.implode(', ', $allowed).'.');
            }
        }];
    }
}
