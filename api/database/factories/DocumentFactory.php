<?php

namespace Database\Factories;

use App\Enums\DocumentType;
use App\Models\Document;
use App\Models\Dossier;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Document>
 */
class DocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $extension = fake()->randomElement(['pdf', 'jpg', 'png']);
        $uuid = Str::uuid();

        $mimeTypes = [
            'pdf' => 'application/pdf',
            'jpg' => 'image/jpeg',
            'png' => 'image/png',
        ];

        $dossier = Dossier::firstOrCreate();

        return [
            'dossier_id' => $dossier->id,
            'type' => fake()->randomElement(DocumentType::cases()),
            'file_name' => "{$uuid}.{$extension}",
            'original_name' => fake()->word().'_'.fake()->word().'.'.$extension,
            'file_path' => "documents/{$uuid}.{$extension}",
            'file_size' => fake()->numberBetween(100000, 10000000),
            'mime_type' => $mimeTypes[$extension],
        ];
    }
}
