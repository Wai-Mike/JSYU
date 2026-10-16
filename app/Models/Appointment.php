<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * A person holding a position for a period. Ended appointments are kept as
 * leadership history; they are never deleted.
 */
class Appointment extends Model
{
    public const STATUS_ACTIVE = 'active';

    public const STATUS_ENDED = 'ended';

    // Lifecycle fields are set by AppointmentService, never mass-assigned from requests
    protected $fillable = ['position_id', 'person_id', 'starts_on', 'term_ends_on', 'notes'];

    protected function casts(): array
    {
        return [
            'starts_on' => 'date',
            'term_ends_on' => 'date',
            'ended_on' => 'date',
        ];
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class);
    }

    public function appointedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'appointed_by');
    }

    public function endedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'ended_by');
    }

    public function replaces(): BelongsTo
    {
        return $this->belongsTo(self::class, 'replaces_appointment_id');
    }

    public function documents(): MorphMany
    {
        return $this->morphMany(Document::class, 'documentable')->latest();
    }

    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }
}
