<?php

namespace Database\Factories;

use App\Models\File;
use App\Models\Fileable;
use App\Models\Post; // Assuming you have a Post model for example
use Illuminate\Database\Eloquent\Factories\Factory;

class FileableFactory extends Factory
{
    protected $model = Fileable::class;

    public function definition(): array
    {
        return [
            'file_id' => File::factory(),
            'fileable_id' => Post::factory(), // Example: attach to a new Post
            'fileable_type' => Post::class,   // Example: the type is Post
            'role' => fake()->randomElement(['featured', 'gallery', 'attachment']),
            'order' => fake()->numberBetween(1, 10),
            'metadata' => [
                'alt' => fake()->sentence(3),
                'caption' => fake()->sentence(6),
            ],
        ];
    }
}
