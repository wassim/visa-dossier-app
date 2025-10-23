<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('dossier_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->string('file_name');
            $table->string('original_name');
            $table->string('file_path');
            $table->unsignedBigInteger('file_size');
            $table->string('mime_type');
            $table->softDeletes();
            $table->timestamps();

            $table->index('dossier_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
