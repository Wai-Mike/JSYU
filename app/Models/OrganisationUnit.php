<?php

namespace App\Models;

use App\Models\Concerns\HasHierarchyPath;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrganisationUnit extends Model
{
    use HasHierarchyPath;

    protected $fillable = ['parent_id', 'type', 'name', 'code', 'description', 'geographic_area_id', 'is_active'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function geographicArea(): BelongsTo
    {
        return $this->belongsTo(GeographicArea::class);
    }

    public function positions(): HasMany
    {
        return $this->hasMany(Position::class)->orderBy('sort_order')->orderBy('title');
    }
}
