<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Position extends Model
{
    protected $fillable = ['organisation_unit_id', 'title', 'description', 'is_leadership', 'seats', 'term_months', 'sort_order', 'is_active'];

    protected function casts(): array
    {
        return [
            'is_leadership' => 'boolean',
            'is_active' => 'boolean',
            'seats' => 'integer',
            'term_months' => 'integer',
        ];
    }

    public function organisationUnit(): BelongsTo
    {
        return $this->belongsTo(OrganisationUnit::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function activeAppointments(): HasMany
    {
        return $this->appointments()->where('status', Appointment::STATUS_ACTIVE);
    }
}
