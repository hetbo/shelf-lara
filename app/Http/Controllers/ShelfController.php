<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Folder;
use Illuminate\Http\Request;

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
}
