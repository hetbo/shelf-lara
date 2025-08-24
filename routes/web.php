<?php

use App\Http\Controllers\FileController;
use App\Http\Controllers\FolderController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::view('/shelf', 'shelf.app');

// API Routes for Shelf (prefixed with /api but in web.php)
Route::prefix('api')->middleware(['web'])->group(function () {

    // Folder Routes
    Route::prefix('folders')->group(function () {
        Route::get('/root', [FolderController::class, 'getRootFolders'])->name('api.folders.root');
        Route::get('/root/content', [FolderController::class, 'getRootContent'])->name('api.folders.root.content');
        Route::get('/{folder}/children', [FolderController::class, 'getChildren'])->name('api.folders.children');
        Route::get('/{folder}/content', [FolderController::class, 'getContent'])->name('api.folders.content');
        Route::get('/{folder}/breadcrumbs', [FolderController::class, 'getBreadcrumbs'])->name('api.folders.breadcrumbs');
        Route::get('/{folder}/details', [FolderController::class, 'getDetails']);

        // Future routes (commented out for now)
        // Route::post('/', [FolderController::class, 'store'])->name('api.folders.store');
        // Route::put('/{folder}', [FolderController::class, 'update'])->name('api.folders.update');
        // Route::delete('/{folder}', [FolderController::class, 'destroy'])->name('api.folders.destroy');
    });

    // File Routes
    Route::prefix('files')->group(function () {
        Route::get('/{file}', [FileController::class, 'show'])->name('api.files.show');
        Route::get('/{file}/details', [FileController::class, 'getDetails']);

        // Future routes (commented out for now)
        // Route::post('/upload', [FileController::class, 'upload'])->name('api.files.upload');
        // Route::put('/{file}', [FileController::class, 'update'])->name('api.files.update');
        // Route::delete('/{file}', [FileController::class, 'destroy'])->name('api.files.destroy');
        // Route::get('/{file}/download', [FileController::class, 'download'])->name('api.files.download');
    });

});
