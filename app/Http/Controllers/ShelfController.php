<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Folder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
}
