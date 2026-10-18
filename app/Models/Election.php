<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * An election in which approved members vote online. Ballots are secret:
 * election_voters records who voted, election_votes what was chosen, with
 * nothing linking the two.
 */
class Election extends Model
{
    public const STATUS_DRAFT = 'draft';

    public const STATUS_OPEN = 'open';

    public const STATUS_CLOSED = 'closed';

    public const STATUS_PUBLISHED = 'published';

    public const STATUSES = [
        self::STATUS_DRAFT => 'Draft',
        self::STATUS_OPEN => 'Voting open',
        self::STATUS_CLOSED => 'Closed',
        self::STATUS_PUBLISHED => 'Results published',
    ];

    // Status and certification are set through the lifecycle actions only
    protected $fillable = ['title', 'description', 'geographic_area_id', 'opens_at', 'closes_at'];

    protected $attributes = ['status' => self::STATUS_DRAFT];

    protected function casts(): array
    {
        return [
            'opens_at' => 'datetime',
            'closes_at' => 'datetime',
            'published_at' => 'datetime',
        ];
    }

    public function geographicArea(): BelongsTo
    {
        return $this->belongsTo(GeographicArea::class);
    }

    public function positions(): HasMany
    {
        return $this->hasMany(ElectionPosition::class)->orderBy('sort_order')->orderBy('id');
    }

    public function voters(): HasMany
    {
        return $this->hasMany(ElectionVoter::class);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(ElectionVote::class);
    }

    public function certifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'certified_by');
    }

    /** Open, and the current time is inside the voting window. */
    public function isAcceptingVotes(): bool
    {
        return $this->status === self::STATUS_OPEN && now()->between($this->opens_at, $this->closes_at);
    }

    public function isEditable(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    /** Results exist once voting has ended; members only see them once published. */
    public function hasEnded(): bool
    {
        return in_array($this->status, [self::STATUS_CLOSED, self::STATUS_PUBLISHED], true);
    }
}
