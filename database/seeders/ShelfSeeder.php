<?php

// database/seeders/ShelfSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Folder;
use App\Models\File;
use App\Models\FileMetadata;

class ShelfSeeder extends Seeder
{
    public function run(): void
    {
        // Create a test user if none exists
        $user = User::first() ?? User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        // Create root folders
        $documentsFolder = Folder::create([
            'name' => 'Documents',
            'parent_id' => null,
            'user_id' => $user->id,
        ]);

        $imagesFolder = Folder::create([
            'name' => 'Images',
            'parent_id' => null,
            'user_id' => $user->id,
        ]);

        $downloadsFolder = Folder::create([
            'name' => 'Downloads',
            'parent_id' => null,
            'user_id' => $user->id,
        ]);

        // Create subfolders
        $workFolder = Folder::create([
            'name' => 'Work',
            'parent_id' => $documentsFolder->id,
            'user_id' => $user->id,
        ]);

        $personalFolder = Folder::create([
            'name' => 'Personal',
            'parent_id' => $documentsFolder->id,
            'user_id' => $user->id,
        ]);

        $photosFolder = Folder::create([
            'name' => 'Photos',
            'parent_id' => $imagesFolder->id,
            'user_id' => $user->id,
        ]);

        $screenshotsFolder = Folder::create([
            'name' => 'Screenshots',
            'parent_id' => $imagesFolder->id,
            'user_id' => $user->id,
        ]);

        // Create nested folders
        $projectsFolder = Folder::create([
            'name' => 'Projects',
            'parent_id' => $workFolder->id,
            'user_id' => $user->id,
        ]);

        $reportsFolder = Folder::create([
            'name' => 'Reports',
            'parent_id' => $workFolder->id,
            'user_id' => $user->id,
        ]);

        // Create some files in root
        $rootFile1 = File::create([
            'filename' => 'readme.txt',
            'path' => 'readme.txt',
            'disc' => 'local',
            'mime_type' => 'text/plain',
            'size' => 1024,
            'hash' => 'abc123def456',
            'user_id' => $user->id,
            'folder_id' => null,
        ]);

        $rootFile2 = File::create([
            'filename' => 'presentation.pdf',
            'path' => 'presentation.pdf',
            'disc' => 'local',
            'mime_type' => 'application/pdf',
            'size' => 2048000,
            'hash' => 'def456ghi789',
            'user_id' => $user->id,
            'folder_id' => null,
        ]);

        // Create files in Documents folder
        $docFile1 = File::create([
            'filename' => 'letter.docx',
            'path' => 'documents/letter.docx',
            'disc' => 'local',
            'mime_type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'size' => 512000,
            'hash' => 'ghi789jkl012',
            'user_id' => $user->id,
            'folder_id' => $documentsFolder->id,
        ]);

        $docFile2 = File::create([
            'filename' => 'budget.xlsx',
            'path' => 'documents/budget.xlsx',
            'disc' => 'local',
            'mime_type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'size' => 256000,
            'hash' => 'jkl012mno345',
            'user_id' => $user->id,
            'folder_id' => $documentsFolder->id,
        ]);

        // Create files in Work folder
        $workFile1 = File::create([
            'filename' => 'project-plan.pdf',
            'path' => 'documents/work/project-plan.pdf',
            'disc' => 'local',
            'mime_type' => 'application/pdf',
            'size' => 1500000,
            'hash' => 'mno345pqr678',
            'user_id' => $user->id,
            'folder_id' => $workFolder->id,
        ]);

        $workFile2 = File::create([
            'filename' => 'meeting-notes.txt',
            'path' => 'documents/work/meeting-notes.txt',
            'disc' => 'local',
            'mime_type' => 'text/plain',
            'size' => 2048,
            'hash' => 'pqr678stu901',
            'user_id' => $user->id,
            'folder_id' => $workFolder->id,
        ]);

        // Create files in Images folder
        $imageFile1 = File::create([
            'filename' => 'logo.png',
            'path' => 'images/logo.png',
            'disc' => 'local',
            'mime_type' => 'image/png',
            'size' => 128000,
            'hash' => 'stu901vwx234',
            'user_id' => $user->id,
            'folder_id' => $imagesFolder->id,
        ]);

        $imageFile2 = File::create([
            'filename' => 'banner.jpg',
            'path' => 'images/banner.jpg',
            'disc' => 'local',
            'mime_type' => 'image/jpeg',
            'size' => 512000,
            'hash' => 'vwx234yza567',
            'user_id' => $user->id,
            'folder_id' => $imagesFolder->id,
        ]);

        // Create files in Photos subfolder
        $photoFile1 = File::create([
            'filename' => 'vacation-2024.jpg',
            'path' => 'images/photos/vacation-2024.jpg',
            'disc' => 'local',
            'mime_type' => 'image/jpeg',
            'size' => 2048000,
            'hash' => 'yza567bcd890',
            'user_id' => $user->id,
            'folder_id' => $photosFolder->id,
        ]);

        $photoFile2 = File::create([
            'filename' => 'family-portrait.png',
            'path' => 'images/photos/family-portrait.png',
            'disc' => 'local',
            'mime_type' => 'image/png',
            'size' => 3072000,
            'hash' => 'bcd890efg123',
            'user_id' => $user->id,
            'folder_id' => $photosFolder->id,
        ]);

        // Create files in Downloads folder
        $downloadFile1 = File::create([
            'filename' => 'software-installer.exe',
            'path' => 'downloads/software-installer.exe',
            'disc' => 'local',
            'mime_type' => 'application/x-executable',
            'size' => 50000000,
            'hash' => 'efg123hij456',
            'user_id' => $user->id,
            'folder_id' => $downloadsFolder->id,
        ]);

        $downloadFile2 = File::create([
            'filename' => 'archive.zip',
            'path' => 'downloads/archive.zip',
            'disc' => 'local',
            'mime_type' => 'application/zip',
            'size' => 10000000,
            'hash' => 'hij456klm789',
            'user_id' => $user->id,
            'folder_id' => $downloadsFolder->id,
        ]);

        // Create some file metadata examples
        FileMetadata::create([
            'file_id' => $imageFile1->id,
            'key' => 'alt_text',
            'value' => 'Company logo with blue background',
        ]);

        FileMetadata::create([
            'file_id' => $imageFile1->id,
            'key' => 'author',
            'value' => 'Design Team',
        ]);

        FileMetadata::create([
            'file_id' => $photoFile1->id,
            'key' => 'location',
            'value' => 'Bali, Indonesia',
        ]);

        FileMetadata::create([
            'file_id' => $photoFile1->id,
            'key' => 'camera',
            'value' => 'Canon EOS R5',
        ]);

        FileMetadata::create([
            'file_id' => $docFile1->id,
            'key' => 'template',
            'value' => 'Business Letter Template',
        ]);

        FileMetadata::create([
            'file_id' => $workFile1->id,
            'key' => 'project',
            'value' => 'Website Redesign 2024',
        ]);

        FileMetadata::create([
            'file_id' => $workFile1->id,
            'key' => 'status',
            'value' => 'approved',
        ]);
    }
}
