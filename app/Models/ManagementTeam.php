<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * The leadership team for one term, e.g. "State Executive 2023–2026". At most
 * one team per area is current; earlier teams are kept as history.
 */
class ManagementTeam extends Model
{
    protected $fillable = ['name', 'geographic_area_id', 'starts_on', 'ends_on', 'is_current', 'description'];

    protected function casts(): array
    {
        return [
            'starts_on' => 'date',
            'ends_on' => 'date',
            'is_current' => 'boolean',
        ];
    }

    public function geographicArea(): BelongsTo
    {
        return $this->belongsTo(GeographicArea::class);
    }

    public function members(): HasMany
    {
        return $this->hasMany(ManagementTeamMember::class)->orderBy('sort_order')->orderBy('id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
