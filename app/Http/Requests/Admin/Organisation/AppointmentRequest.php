<?php

namespace App\Http\Requests\Admin\Organisation;

use App\Services\Documents\DocumentStorage;
use Illuminate\Foundation\Http\FormRequest;

class AppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // authorised in the controller against the position
    }

    public function rules(): array
    {
        return [
            'position_id' => ['required', 'integer', 'exists:positions,id'],
            'person_id' => ['required', 'integer', 'exists:people,id'],
            'starts_on' => ['required', 'date'],
            'term_ends_on' => ['nullable', 'date', 'after:starts_on'],
            'notes' => ['nullable', 'string', 'max:5000'],
            'document' => ['nullable', ...DocumentStorage::validationRules()],
            'document_title' => ['nullable', 'string', 'max:150'],
        ];
    }
}
