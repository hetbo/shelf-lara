<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    /**
     * Get detailed information about a specific file
     */
    public function show(Request $request, File $file): JsonResponse
    {
        try {
            // Basic authorization check
            if ($file->user_id !== (Auth::id() ?? 1)) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Load file with metadata if needed
            $file->load('metadata');

            $fileData = [
                'id' => $file->id,
                'filename' => $file->filename,
                'path' => $file->path,
                'disc' => $file->disc,
                'mime_type' => $file->mime_type,
                'size' => $file->size,
                'hash' => $file->hash,
                'user_id' => $file->user_id,
                'folder_id' => $file->folder_id,
                'created_at' => $file->created_at->toISOString(),
                'updated_at' => $file->updated_at->toISOString(),
                'metadata' => $file->metadata->map(function ($meta) {
                    return [
                        'id' => $meta->id,
                        'file_id' => $meta->file_id,
                        'key' => $meta->key,
                        'value' => $meta->value,
                    ];
                })
            ];

            return response()->json($fileData);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to load file details'], 500);
        }
    }

    public function getDetails(File $file)
    {
        $extension = pathinfo($file->filename, PATHINFO_EXTENSION);

        return response()->json([
            'id' => $file->id,
            'name' => $file->filename,
            'extension' => $extension ?: 'File',
            'size' => $file->size,
            'createdAt' => $file->created_at->toISOString(),
            'modifiedAt' => $file->updated_at->toISOString(),
        ]);
    }

    public function copy(Request $request): JsonResponse
    {
        $request->validate([
            'fileId' => 'required|exists:files,id',
            'destinationFolderId' => 'nullable|exists:folders,id',
        ]);

        // Eager load the metadata to avoid extra queries inside the transaction
        $originalFile = File::with('metadata')->findOrFail($request->fileId);
        $destinationFolderId = $request->destinationFolderId;

        // Wrap the entire operation in a database transaction for safety
        DB::beginTransaction();

        try {
            // 1. Replicate the File model instance
            $copy = $originalFile->replicate();
            $copy->folder_id = $destinationFolderId;
            $copy->push(); // Use push() to save the model and get its new ID

            // 2. Handle duplicate filenames in the destination
            $baseName = pathinfo($copy->filename, PATHINFO_FILENAME);
            $extension = pathinfo($copy->filename, PATHINFO_EXTENSION);
            $counter = 1;
            $finalFilename = $copy->filename;

            while (File::where('folder_id', $destinationFolderId)
                ->where('filename', $finalFilename)
                ->where('id', '!=', $copy->id) // Exclude the file we just created
                ->exists()) {
                $finalFilename = $baseName . " (Copy " . $counter . ")" . ($extension ? ".$extension" : "");
                $counter++;
            }
            $copy->filename = $finalFilename;

            // 3. Copy the actual file in storage
            $originalPath = $originalFile->path;
            // It's good practice to create a unique directory structure for uploads
            // For example: 'files/user_{id}/{year}/{month}/{uniqid}_{filename}'
            $newPath = 'copies/' . uniqid() . '_' . $copy->filename;

            if (Storage::disk($originalFile->disc)->exists($originalPath)) {
                Storage::disk($originalFile->disc)->copy($originalPath, $newPath);
                $copy->path = $newPath;
                $copy->hash = hash_file('sha256', Storage::disk($originalFile->disc)->path($newPath));
            }

            $copy->save();

            // 4. --- THE NEW PART: Copy the metadata ---
            if ($originalFile->relationLoaded('metadata') && $originalFile->metadata->isNotEmpty()) {
                $newMetadata = $originalFile->metadata->map(function ($meta) use ($copy) {
                    return [
                        'file_id' => $copy->id, // Use the ID of the new file copy
                        'key' => $meta->key,
                        'value' => $meta->value,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                })->all();

                // Use a single, efficient insert statement for all metadata
                DB::table('file_metadata')->insert($newMetadata);
            }
            // --- END OF NEW PART ---

            // If everything was successful, commit the transaction
            DB::commit();

            return response()->json(['message' => 'File and its metadata copied successfully.']);

        } catch (\Exception $e) {
            // If any error occurred, roll back all database changes
            DB::rollBack();

            // Log the error and return a server error response
            Log::error('File copy operation failed: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred during the file copy operation.'], 500);
        }
    }

    // Future methods (commented out for now)

    /*
    public function upload(Request $request): JsonResponse
    {
        // Handle file upload
    }

    public function update(Request $request, File $file): JsonResponse
    {
        // Update file metadata
    }

    public function destroy(Request $request, File $file): JsonResponse
    {
        // Delete file
    }

    public function download(Request $request, File $file)
    {
        // Download file
    }
    */
}
