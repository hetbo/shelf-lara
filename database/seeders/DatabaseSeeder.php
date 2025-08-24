<?php

namespace Database\Seeders;

use App\Models\File;
use App\Models\Fileable;
use App\Models\FileMetadata;
use App\Models\Folder;
use App\Models\Post;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
/*        User::factory()->create([
            'id' => 1,
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Create 3 root folders
        $rootFolders = Folder::factory(3)->create();

        // Create a child folder for the first root folder
        Folder::factory()->create([
            'parent_id' => $rootFolders->first()->id,
        ]);

        // Create 5 files, each in a new, separate folder
        File::factory(5)->create();

        // Create 2 files specifically in the second root folder
        File::factory(2)->create([
            'folder_id' => $rootFolders[1]->id,
        ]);*/

        // Create a dummy Post model and factory for demonstration
        Post::factory()->create();

        $file = File::factory()->create([
            'filename' => 'report-2025.pdf',
            'folder_id' => 1 // Assuming folder with ID 1 exists
        ]);

        FileMetadata::factory(3)->create([
            'file_id' => $file->id,
        ]);

        Fileable::factory()->create([
            'file_id' => $file->id,
            'fileable_id' => 1, // The Post we just created
            'fileable_type' => Post::class,
            'role' => 'attachment',
        ]);
    }
}
