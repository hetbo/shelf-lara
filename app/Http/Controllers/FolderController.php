<?php

// app/Http/Controllers/Shelf/FolderController.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Folder;
use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class FolderController extends Controller
{
    /**
     * Get root folders for the authenticated user
     */
    public function getRootFolders(Request $request): JsonResponse
    {
        try {
            $userId = Auth::id() ?? 1; // Fallback for development

            $rootFolders = Folder::where('user_id', $userId)
                ->whereNull('parent_id')
                ->orderBy('name')
                ->get()
                ->map(function ($folder) {
                    return [
                        'id' => $folder->id,
                        'name' => $folder->name,
                        'parent_id' => $folder->parent_id,
                        'user_id' => $folder->user_id,
                        'created_at' => $folder->created_at->toISOString(),
                        'updated_at' => $folder->updated_at->toISOString(),
                        'has_children' => $folder->children()->count() > 0,
                    ];
                });

            return response()->json($rootFolders);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to load root folders'], 500);
        }
    }

    /**
     * Get children of a specific folder
     */
    public function getChildren(Request $request, Folder $folder): JsonResponse
    {
        try {

            // Basic authorization check
/*            if ($folder->user_id !== (Auth::id() ?? 1)) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }*/

            $children = $folder->children()
                ->orderBy('name')
                ->get()
                ->map(function ($child) {
                    return [
                        'id' => $child->id,
                        'name' => $child->name,
                        'parent_id' => $child->parent_id,
                        'user_id' => $child->user_id,
                        'created_at' => $child->created_at->toISOString(),
                        'updated_at' => $child->updated_at->toISOString(),
                        'has_children' => $child->children()->count() > 0,
                    ];
                });

            return response()->json($children);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to load folder children'], 500);
        }
    }

    /**
     * Get content of root directory (folders and files without parent)
     */
    public function getRootContent(Request $request): JsonResponse
    {
        try {
            $userId = Auth::id() ?? 1; // Fallback for development

            // Get root folders
            $folders = Folder::where('user_id', $userId)
                ->whereNull('parent_id')
                ->orderBy('name')
                ->get()
                ->map(function ($folder) {
                    return [
                        'id' => $folder->id,
                        'name' => $folder->name,
                        'parent_id' => $folder->parent_id,
                        'user_id' => $folder->user_id,
                        'created_at' => $folder->created_at->toISOString(),
                        'updated_at' => $folder->updated_at->toISOString(),
                        'has_children' => $folder->children()->count() > 0,
                    ];
                });

            // Get root files
            $files = File::where('user_id', $userId)
                ->whereNull('folder_id')
                ->orderBy('filename')
                ->get()
                ->map(function ($file) {
                    return [
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
                    ];
                });

            return response()->json([
                'folders' => $folders,
                'files' => $files
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to load root content'], 500);
        }
    }

    /**
     * Get content of a specific folder (subfolders and files)
     */
    public function getContent(Request $request, Folder $folder): JsonResponse
    {
        try {
            // Basic authorization check
/*            if ($folder->user_id !== (Auth::id() ?? 1)) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }*/

            // Get subfolders
            $folders = $folder->children()
                ->orderBy('name')
                ->get()
                ->map(function ($subfolder) {
                    return [
                        'id' => $subfolder->id,
                        'name' => $subfolder->name,
                        'parent_id' => $subfolder->parent_id,
                        'user_id' => $subfolder->user_id,
                        'created_at' => $subfolder->created_at->toISOString(),
                        'updated_at' => $subfolder->updated_at->toISOString(),
                        'has_children' => $subfolder->children()->count() > 0,
                    ];
                });

            // Get files in this folder
            $files = $folder->files()
                ->orderBy('filename')
                ->get()
                ->map(function ($file) {
                    return [
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
                    ];
                });

            return response()->json([
                'folders' => $folders,
                'files' => $files
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to load folder content'], 500);
        }
    }

    public function getBreadcrumbs(Request $request, Folder $folder): JsonResponse
    {
        try {
/*            if ($folder->user_id !== (Auth::id() ?? 1)) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }*/

            $breadcrumbs = [['id' => null, 'name' => 'Root', 'type' => 'folder']];

            $path = [];
            $current = $folder;

            // Build path from current folder to root
            while ($current) {
                array_unshift($path, $current);
                $current = $current->parent;
            }

            // Convert to breadcrumbs format
            foreach ($path as $pathFolder) {
                $breadcrumbs[] = [
                    'id' => $pathFolder->id,
                    'name' => $pathFolder->name,
                    'type' => 'folder'
                ];
            }

            return response()->json($breadcrumbs);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to load breadcrumbs'], 500);
        }
    }

    public function getDetails(Folder $folder)
    {
        $itemCount = $folder->children()->count() + $folder->files()->count();

        return response()->json([
            'id' => $folder->id,
            'name' => $folder->name,
            'itemCount' => $itemCount,
            'createdAt' => $folder->created_at->toISOString(),
            'modifiedAt' => $folder->updated_at->toISOString(),
        ]);
    }
}
