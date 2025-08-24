<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class File extends Model
{
    protected $fillable = [
        'filename',
        'path',
        'disc',
        'mime_type',
        'size',
        'hash',
        'user_id',
        'folder_id',
    ];

    protected $casts = [
        'size' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the folder this file belongs to
     */
    public function folder(): BelongsTo
    {
        return $this->belongsTo(Folder::class);
    }

    /**
     * Get the user who owns this file
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all metadata for this file
     */
    public function metadata(): HasMany
    {
        return $this->hasMany(FileMetadata::class);
    }

    /**
     * Get all fileable relationships
     */
    public function fileables(): HasMany
    {
        return $this->hasMany(Fileable::class);
    }

    /**
     * Check if file is in root directory
     */
    public function isInRoot(): bool
    {
        return is_null($this->folder_id);
    }

    /**
     * Get the full path including folder path
     */
    public function getFullPath(): string
    {
        if ($this->isInRoot()) {
            return $this->filename;
        }

        return $this->folder->getFullPath() . '/' . $this->filename;
    }

    /**
     * Get human readable file size
     */
    public function getHumanReadableSizeAttribute(): string
    {
        $bytes = $this->size;
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Check if file is an image
     */
    public function isImage(): bool
    {
        return str_starts_with($this->mime_type, 'image/');
    }

    /**
     * Check if file is a video
     */
    public function isVideo(): bool
    {
        return str_starts_with($this->mime_type, 'video/');
    }

    /**
     * Check if file is audio
     */
    public function isAudio(): bool
    {
        return str_starts_with($this->mime_type, 'audio/');
    }

    /**
     * Check if file is a document
     */
    public function isDocument(): bool
    {
        $documentTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
        ];

        return in_array($this->mime_type, $documentTypes);
    }

    /**
     * Get file extension
     */
    public function getExtension(): string
    {
        return pathinfo($this->filename, PATHINFO_EXTENSION);
    }

    /**
     * Scope to get files for a specific user
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to get files by mime type
     */
    public function scopeByMimeType($query, $mimeType)
    {
        return $query->where('mime_type', $mimeType);
    }

    /**
     * Scope to get files in root directory
     */
    public function scopeInRoot($query)
    {
        return $query->whereNull('folder_id');
    }
}
