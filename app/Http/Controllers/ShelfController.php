<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Folder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ShelfController extends Controller {

    public function rename(Request $request, string $type, int $id) {

        $validated = $request->validate([
            'name' => 'required | string | max:255',
        ]);

        $model = null;

        if ($type === 'file') {
            $model = File::findOrFail($id);
            $model->filename = $validated['name'];
        } elseif ($type === 'folder') {
            $model = Folder::findOrFail($id);
            $model->name = $validated['name'];
        }

        if ($model) {
            $model->save();
            return response()->json([
                'message' => ucfirst($type) . ' renamed successfully.',
            ]);
        }

        return response()->json([
            'message' => ucfirst($type) . ' not found.',
        ], 400);

    }

    public function move(Request $request)
    {
        // 1. Validate the incoming request
        $validated = $request->validate([
            'id' => ['required', 'integer'],
            'type' => ['required', 'string', Rule::in(['file', 'folder'])],
            // 'destination_id' can be null, which means moving to the root
            'destination_id' => ['nullable', 'integer', 'exists:folders,id'],
        ]);

        $id = $validated['id'];
        $type = $validated['type'];
        $destinationId = $validated['destination_id'];

        // Use a database transaction to ensure data integrity.
        // If anything fails, all changes will be rolled back.
        DB::beginTransaction();

        try {
            if ($type === 'file') {
                // --- File Moving Logic ---
                $file = File::findOrFail($id);

                // Optional: Check if the file is already in the destination
                if ($file->folder_id == $destinationId) {
                    return response()->json(['message' => 'File is already in the destination folder.'], 200);
                }

                $file->folder_id = $destinationId;
                $file->save();

            } elseif ($type === 'folder') {
                // --- Folder Moving Logic ---
                $folder = Folder::findOrFail($id);

                // Validation: A folder cannot be moved to itself.
                if ($folder->id == $destinationId) {
                    return response()->json(['message' => 'A folder cannot be moved into itself.'], 409); // 409 Conflict
                }

                // ** CRITICAL VALIDATION **
                // A folder cannot be moved into one of its own descendants.
                if ($this->isDescendant($folder, $destinationId)) {
                    return response()->json(['message' => 'Invalid move operation. Cannot move a folder into one of its own subfolders.'], 409);
                }

                $folder->parent_id = $destinationId;
                $folder->save();
            }

            // If everything was successful, commit the transaction.
            DB::commit();

            return response()->json(['message' => ucfirst($type) . ' moved successfully.']);

        } catch (\Exception $e) {
            // If any error occurred, roll back all database changes.
            DB::rollBack();

            // Log the error and return a server error response.
            Log::error('Move operation failed: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred during the move operation.'], 500);
        }
    }

    /**
     * Check if a potential destination folder is a descendant of the folder being moved.
     *
     * @param Folder $folderToMove The folder that is being moved.
     * @param int|null $destinationId The ID of the folder it's being moved into.
     * @return bool
     */
    private function isDescendant(Folder $folderToMove, ?int $destinationId): bool
    {
        // If the destination is the root, it can't be a descendant.
        if ($destinationId === null) {
            return false;
        }

        // Start checking from the potential parent.
        $currentParent = Folder::find($destinationId);

        // Traverse up the tree from the destination.
        // If we ever find the folder we're trying to move, then it's an invalid operation.
        while ($currentParent) {
            if ($currentParent->id === $folderToMove->id) {
                return true; // Found a circular dependency
            }
            // Move up to the next parent
            $currentParent = $currentParent->parent;
        }

        // If we reached the root without finding the folder, the move is valid.
        return false;
    }

    public function copyFolder(Request $request)
    {
        $request->validate([
            'folderId' => 'required|exists:folders,id',
            'destinationFolderId' => 'nullable|exists:folders,id',
        ]);

        // Eager load the first level of children and files to start the process
        $originalFolder = Folder::with(['children', 'files', 'files.metadata'])->findOrFail($request->folderId);
        $destinationFolderId = $request->destinationFolderId;

        // A folder cannot be copied into itself or one of its own descendants.
        // This is a simplified check. A more robust check would traverse the tree.
        if ($originalFolder->id == $destinationFolderId) {
            return response()->json(['message' => 'A folder cannot be copied into itself.'], 409);
        }

        if ($this->isDescendant($originalFolder, $destinationFolderId)) {
            return response()->json(['message' => 'A folder cannot be copied into one of its own subfolders.'], 409); // 409 Conflict
        }

        DB::beginTransaction();

        try {
            // Start the recursive copy process
            $this->copyFolderRecursive($originalFolder, $destinationFolderId);

            DB::commit();

            return response()->json(['message' => 'Folder and all its contents copied successfully.']);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Folder copy failed: ' . $e->getMessage());

            return response()->json(['message' => 'An error occurred during the folder copy operation.'], 500);
        }
    }

    /**
     * Recursively copies a folder, its subfolders, and its files.
     *
     * @param Folder $originalFolder The folder instance to be copied.
     * @param int|null $newParentId The ID of the parent for the new copy.
     * @return Folder The newly created folder copy.
     */
    private function copyFolderRecursive(Folder $originalFolder, ?int $newParentId): Folder
    {
        // 1. Replicate the folder itself
        $folderCopy = $originalFolder->replicate(['id']); // Replicate without the original ID
        $folderCopy->parent_id = $newParentId;
        $folderCopy->save(); // Save to get the new ID for this folder copy

        // 2. Copy all files within this folder
        foreach ($originalFolder->files as $originalFile) {
            $fileCopy = $originalFile->replicate(['id']);
            $fileCopy->folder_id = $folderCopy->id; // Link to the new folder copy

            // Handle duplicate filenames within the new folder
            $baseName = pathinfo($fileCopy->filename, PATHINFO_FILENAME);
            $extension = pathinfo($fileCopy->filename, PATHINFO_EXTENSION);
            $counter = 1;
            $finalFilename = $fileCopy->filename;

            while (File::where('folder_id', $folderCopy->id)->where('filename', $finalFilename)->exists()) {
                $finalFilename = $baseName . " (Copy " . $counter . ")" . ($extension ? ".$extension" : "");
                $counter++;
            }
            $fileCopy->filename = $finalFilename;

            // Copy the actual file on the disk
            $originalPath = $originalFile->path;
            $newPath = 'copies/' . uniqid() . '_' . $fileCopy->filename;

            if (Storage::disk($originalFile->disc)->exists($originalPath)) {
                Storage::disk($originalFile->disc)->copy($originalPath, $newPath);
                $fileCopy->path = $newPath;
                $fileCopy->hash = hash_file('sha256', Storage::disk($originalFile->disc)->path($newPath));
            }

            $fileCopy->save(); // Save to get the new ID for this file copy

            // Copy metadata for the file
            if ($originalFile->relationLoaded('metadata') && $originalFile->metadata->isNotEmpty()) {
                $newMetadata = $originalFile->metadata->map(function ($meta) use ($fileCopy) {
                    return [
                        'file_id'    => $fileCopy->id,
                        'key'        => $meta->key,
                        'value'      => $meta->value,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                })->all();
                DB::table('file_metadata')->insert($newMetadata);
            }
        }

        // 3. Recurse into subfolders
        // We need to load the children relationship if it's not already loaded
        $originalFolder->load('children', 'children.files.metadata');

        foreach ($originalFolder->children as $childFolder) {
            $this->copyFolderRecursive($childFolder, $folderCopy->id);
        }

        return $folderCopy;
    }


}
