<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One young person counted in a census campaign.
 */
class CensusRecord extends Model
{
    public const STATUS_SUBMITTED = 'submitted';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_REJECTED = 'rejected';

    public const STATUSES = [
        self::STATUS_SUBMITTED => 'Awaiting review',
        self::STATUS_APPROVED => 'Approved',
        self::STATUS_REJECTED => 'Rejected',
    ];

    /** Fields shown only to holders of census.sensitive. */
    public const SENSITIVE_FIELDS = ['disability', 'displacement_status'];

    // Review fields and the enumerator are set by the controller, never mass-assigned
    protected $fillable = [
        'geographic_area_id', 'full_name', 'sex', 'date_of_birth', 'age_years', 'phone',
        'education_level', 'in_school', 'employment_status', 'occupation', 'skills',
        'disability', 'displacement_status',
    ];

    protected $attributes = ['status' => self::STATUS_SUBMITTED];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'in_school' => 'boolean',
            'reviewed_at' => 'datetime',
        ];
    }

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(CensusCampaign::class, 'census_campaign_id');
    }

    public function geographicArea(): BelongsTo
    {
        return $this->belongsTo(GeographicArea::class);
    }

    public function enumerator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'enumerator_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /** Age from the date of birth when known, otherwise the age given at collection. */
    protected function age(): Attribute
    {
        return Attribute::get(fn () => $this->date_of_birth?->age ?? $this->age_years);
    }
}
