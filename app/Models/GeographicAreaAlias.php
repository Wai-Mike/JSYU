<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class GeographicAreaAlias extends Model
{
    protected $fillable = ['geographic_area_id', 'alias'];

    protected static function booted(): void
    {
        static::saving(fn (self $alias) => $alias->normalized = self::normalize($alias->alias));
    }

    /** "Canal/Pigi", "canal-pigi" and "Canal Pigi" all normalise to "canal pigi". */
    public static function normalize(string $name): string
    {
        return Str::of($name)->lower()->replaceMatches('/[^a-z0-9]+/', ' ')->squish()->toString();
    }

    public function area(): BelongsTo
    {
        return $this->belongsTo(GeographicArea::class, 'geographic_area_id');
    }
}
