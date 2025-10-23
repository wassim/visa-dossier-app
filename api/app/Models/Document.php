<?php

namespace App\Models;

use App\Enums\DocumentType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'dossier_id',
        'type',
        'file_name',
        'original_name',
        'file_path',
        'file_size',
        'mime_type',
    ];

    protected function casts(): array
    {
        return [
            'type' => DocumentType::class,
            'file_size' => 'integer',
        ];
    }

    public function dossier(): BelongsTo
    {
        return $this->belongsTo(Dossier::class);
    }

    public function getFullPath(): string
    {
        return storage_path("app/{$this->file_path}");
    }
}
