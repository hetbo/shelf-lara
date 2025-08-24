<?php

namespace Database\Factories;

use App\Models\File;
use App\Models\Folder;
use Illuminate\Database\Eloquent\Factories\Factory;

class FileFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = File::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $filename = fake()->word() . '.' . fake()->fileExtension();

        return [
            'filename' => $filename,
            'path' => 'uploads/' . $filename,
            'disk' => 'public',
            'mime_type' => fake()->mimeType(),
            'size' => fake()->numberBetween(1024, 10 * 1024 * 1024), // Size between 1KB and 10MB
            'hash' => fake()->sha256(),
            'user_id' => 1, // As requested
            'folder_id' => Folder::factory(), // Automatically create a new folder for this file
        ];
    }
}
