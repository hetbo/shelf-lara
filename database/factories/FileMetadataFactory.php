<?php

namespace Database\Factories;

use App\Models\File;
use App\Models\FileMetadata;
use Illuminate\Database\Eloquent\Factories\Factory;

class FileMetadataFactory extends Factory
{
    protected $model = FileMetadata::class;

    public function definition(): array
    {
        return [
            'file_id' => File::factory(),
            'key' => fake()->word(),
            'value' => fake()->sentence(),
        ];
    }
}
