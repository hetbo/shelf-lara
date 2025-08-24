<?php

// app/Models/Shelf/Fileable.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Fileable extends Model
{
    protected $fillable = [
        'file_id',
        'fileable_type',
        'fileable_id',
        'role',
        'order',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the file this relationship belongs to
     */
    public function file(): BelongsTo
    {
        return $this->belongsTo(File::class);
    }

    /**
     * Get the owning fileable model (polymorphic)
     */
    public function fileable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Scope to get fileables by role
     */
    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }

    /**
     * Scope to get fileables ordered by order field
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    /**
     * Scope to get fileables for a specific file
     */
    public function scopeForFile($query, $fileId)
    {
        return $query->where('file_id', $fileId);
    }

    /**
     * Scope to get fileables for a specific model
     */
    public function scopeForModel($query, $model)
    {
        return $query->where('fileable_type', get_class($model))
            ->where('fileable_id', $model->id);
    }
}
