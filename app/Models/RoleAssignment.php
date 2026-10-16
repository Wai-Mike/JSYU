<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** A role held by a user, state-wide (no area) or within one geographic area. */
class RoleAssignment extends Model
{
    protected $fillable = ['user_id', 'role_id', 'geographic_area_id', 'assigned_by'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function geographicArea(): BelongsTo
    {
        return $this->belongsTo(GeographicArea::class);
    }

    public function assigner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }
}
