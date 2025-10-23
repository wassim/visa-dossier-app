<?php

namespace App\Http\Resources;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Document
 */
class DocumentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'dossier_id' => $this->dossier_id,
            'type' => $this->type,
            'original_name' => $this->original_name,
            'file_name' => $this->file_name,
            'file_path' => $this->file_path,
            'file_size' => $this->file_size,
            'mime_type' => $this->mime_type,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
