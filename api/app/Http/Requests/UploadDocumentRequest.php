<?php

namespace App\Http\Requests;

use App\Enums\DocumentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UploadDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'dossier_id' => ['required', 'uuid', 'exists:dossiers,id'],
            'type' => ['required', Rule::enum(DocumentType::class)],
            'file' => ['required', 'file', 'mimes:pdf,png,jpg,jpeg', 'max:4096'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'file.max' => 'The file must not be larger than 4MB.',
            'file.mimes' => 'The file must be a PDF, PNG, or JPG.',
        ];
    }
}
