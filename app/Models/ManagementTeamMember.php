<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A seat on a management team. The name is stored as entered so the history
 * stays readable even for past leaders who have no person record.
 */
class ManagementTeamMember extends Model
{
    protected $fillable = ['person_id', 'name', 'position_title', 'sort_order'];

    public function team(): BelongsTo
    {
        return $this->belongsTo(ManagementTeam::class, 'management_team_id');
    }

    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class);
    }
}
