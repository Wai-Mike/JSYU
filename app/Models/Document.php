<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * A privately stored file attached to another record. Files are never served
 * from the public disk; downloads go through an authorised controller.
 */
class Document extends Model
{
    protected $fillable = ['title'];

    protected $hidden = ['disk', 'path'];

    public function documentable(): MorphTo
    {
        return $this->morphTo();
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
