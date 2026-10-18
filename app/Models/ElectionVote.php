<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

/**
 * One choice on a secret ballot. Random ids and no timestamps, so ballots
 * cannot be matched to voters by insertion order or time.
 */
class ElectionVote extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $fillable = ['election_id', 'election_position_id', 'election_candidate_id'];

    /** Random (v4) ids rather than Laravel's default time-ordered ones, which would reveal voting order. */
    public function newUniqueId(): string
    {
        return (string) \Illuminate\Support\Str::uuid();
    }
}
