<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Records that a member voted in an election. Never linked to their choices. */
class ElectionVoter extends Model
{
    public $timestamps = false;

    protected $fillable = ['election_id', 'user_id', 'voted_at'];

    protected function casts(): array
    {
        return ['voted_at' => 'datetime'];
    }
}
