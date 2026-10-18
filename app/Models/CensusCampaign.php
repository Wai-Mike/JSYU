<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A census exercise. Records can only be entered while it is open.
 */
class CensusCampaign extends Model
{
    public const STATUS_DRAFT = 'draft';

    public const STATUS_OPEN = 'open';

    public const STATUS_CLOSED = 'closed';

    public const STATUSES = [
        self::STATUS_DRAFT => 'Draft',
        self::STATUS_OPEN => 'Collecting',
        self::STATUS_CLOSED => 'Closed',
    ];

    // Status changes go through the controller's open/close actions
    protected $fillable = ['name', 'description', 'geographic_area_id', 'starts_on', 'ends_on'];

    protected $attributes = ['status' => self::STATUS_DRAFT];

    protected function casts(): array
    {
        return ['starts_on' => 'date', 'ends_on' => 'date'];
    }

    public function geographicArea(): BelongsTo
    {
        return $this->belongsTo(GeographicArea::class);
    }

    public function records(): HasMany
    {
        return $this->hasMany(CensusRecord::class);
    }

    public function isOpen(): bool
    {
        return $this->status === self::STATUS_OPEN;
    }

    /** Whether $area lies inside the campaign's area (any area when the campaign is state-wide). */
    public function covers(GeographicArea $area): bool
    {
        return $this->geographic_area_id === null
            || $area->id === $this->geographic_area_id
            || in_array($this->geographic_area_id, $area->ancestorIds(), true);
    }
}
