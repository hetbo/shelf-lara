<?php

// app/Models/Shelf/FileMetadata.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FileMetadata extends Model
{
    protected $fillable = [
        'file_id',
        'key',
        'value',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the file this metadata belongs to
     */
    public function file(): BelongsTo
    {
        return $this->belongsTo(File::class);
    }

    /**
     * Scope to get metadata by key
     */
    public function scopeByKey($query, $key)
    {
        return $query->where('key', $key);
    }

    /**
     * Scope to get metadata for a specific file
     */
    public function scopeForFile($query, $fileId)
    {
        return $query->where('file_id', $fileId);
    }
}
