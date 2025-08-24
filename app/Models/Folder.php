<?php

// app/Models/Shelf/Folder.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;

class Folder extends Model
{
    protected $fillable = [
        'name',
        'parent_id',
        'user_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the parent folder
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Folder::class, 'parent_id');
    }

    /**
     * Get all child folders
     */
    public function children(): HasMany
    {
        return $this->hasMany(Folder::class, 'parent_id')->orderBy('name');
    }

    /**
     * Get all files in this folder
     */
    public function files(): HasMany
    {
        return $this->hasMany(File::class)->orderBy('filename');
    }

    /**
     * Get the user who owns this folder
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if folder is root (has no parent)
     */
    public function isRoot(): bool
    {
        return is_null($this->parent_id);
    }

    /**
     * Get the full path of the folder
     */
    public function getFullPath(): string
    {
        if ($this->isRoot()) {
            return $this->name;
        }

        return $this->parent->getFullPath() . '/' . $this->name;
    }

    /**
     * Get all descendant folders (recursive)
     */
    public function descendants(): HasMany
    {
        return $this->children()->with('descendants');
    }

    /**
     * Scope to get only root folders
     */
    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Scope to get folders for a specific user
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}
