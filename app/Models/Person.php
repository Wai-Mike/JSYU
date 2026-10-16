<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * A real individual known to the Union. Separate from login accounts: a person
 * may or may not have a user account, and one account links to at most one person.
 */
class Person extends Model
{
    use SoftDeletes;

    protected $table = 'people';

    protected $fillable = ['user_id', 'full_name', 'email', 'phone', 'gender', 'geographic_area_id', 'notes'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function geographicArea(): BelongsTo
    {
        return $this->belongsTo(GeographicArea::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function memberProfile(): HasOne
    {
        return $this->hasOne(MemberProfile::class);
    }
}
