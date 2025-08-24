<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
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

    public function copy(Request $request)
    {
        $request->validate([
            'fileId' => 'required|exists:files,id',
            'destinationFolderId' => 'nullable|exists:folders,id',
        ]);

        $originalFile = File::findOrFail($request->fileId);

        // Create the copy
        $copy = $originalFile->replicate();
        $copy->folder_id = $request->destinationFolderId;

        // Handle duplicate names
        $baseName = pathinfo($copy->filename, PATHINFO_FILENAME);
        $extension = pathinfo($copy->filename, PATHINFO_EXTENSION);
        $counter = 1;

        while (File::where('folder_id', $copy->folder_id)
            ->where('filename', $copy->filename)
            ->exists()) {
            $copy->filename = $baseName . " (Copy " . $counter . ")" . ($extension ? ".$extension" : "");
            $counter++;
        }

        // Copy the actual file in storage
        $originalPath = $originalFile->path;
        $newPath = 'copies/' . uniqid() . '_' . $copy->filename;

        if (Storage::disk($originalFile->disc)->exists($originalPath)) {
            Storage::disk($originalFile->disc)->copy($originalPath, $newPath);
            $copy->path = $newPath;
            $copy->hash = hash_file('sha256', Storage::disk($originalFile->disc)->path($newPath));
        }

        $copy->save();

        return response()->json(['message' => 'File copied successfully']);
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
