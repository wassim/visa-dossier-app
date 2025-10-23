<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Dossier extends Model
{
    use HasFactory, HasUuids;

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }
}
