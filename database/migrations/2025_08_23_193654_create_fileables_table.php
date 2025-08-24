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
        Schema::create('fileables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('file_id')->constrained('files')->cascadeOnDelete();
            $table->morphs('fileable'); // polymorphic attachment
            $table->string('role')->nullable(); // featured, gallery, attachment
            $table->integer('order')->nullable();
            $table->json('metadata')->nullable(); // alt text, captions, etc
            $table->timestamps();

            $table->index(['fileable_type', 'fileable_id', 'role']);
            $table->index(['file_id']);
            $table->index(['order']);
            $table->unique(['file_id', 'fileable_type', 'fileable_id', 'role']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fileables');
    }
};
