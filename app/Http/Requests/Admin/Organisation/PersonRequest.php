<?php

namespace App\Http\Requests\Admin\Organisation;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PersonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // authorised in the controller against the person's area
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => $this->filled('email') ? strtolower(trim($this->input('email'))) : null,
        ]);
    }

    public function rules(): array
    {
        $person = $this->route('person');

        return [
            'full_name' => ['required', 'string', 'max:150'],
            // One person record per email address avoids duplicate profiles
            'email' => ['nullable', 'email', 'max:255', Rule::unique('people')->ignore($person?->id)->whereNull('deleted_at')],
            'phone' => ['nullable', 'string', 'max:40', 'regex:/^[0-9+()\-\s]+$/'],
            'gender' => ['nullable', Rule::in(['male', 'female', 'other'])],
            'geographic_area_id' => ['nullable', 'integer', 'exists:geographic_areas,id'],
            'notes' => ['nullable', 'string', 'max:5000'],
            'link_account' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return ['email.unique' => 'A person with this email already exists. Search the directory instead of creating a duplicate.'];
    }
}
