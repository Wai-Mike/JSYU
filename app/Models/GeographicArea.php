<?php

namespace App\Models;

use App\Models\Concerns\HasHierarchyPath;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GeographicArea extends Model
{
    use HasHierarchyPath;

    protected $fillable = ['parent_id', 'level', 'name', 'code', 'is_active'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function organisationUnits(): HasMany
    {
        return $this->hasMany(OrganisationUnit::class);
    }

    public function aliases(): HasMany
    {
        return $this->hasMany(GeographicAreaAlias::class);
    }

    /**
     * Find a child of $parent by its name or a recorded alias, ignoring case
     * and punctuation. Returns null rather than guessing when nothing matches.
     */
    public static function resolve(string $name, ?self $parent = null, ?string $level = null): ?self
    {
        $normalized = GeographicAreaAlias::normalize($name);

        $candidates = static::query()
            ->where('parent_id', $parent?->id)
            ->when($level, fn ($q) => $q->where('level', $level))
            ->get();

        return $candidates->first(fn (self $area) => GeographicAreaAlias::normalize($area->name) === $normalized)
            ?? $candidates->first(fn (self $area) => $area->aliases()->where('normalized', $normalized)->exists());
    }

    /** "Jonglei › Bor South › Kolnyang" style label. */
    public function fullName(): string
    {
        $ancestors = static::query()->whereKey($this->ancestorIds())->pluck('name', 'id');

        return collect($this->ancestorIds())
            ->map(fn ($id) => $ancestors[$id] ?? null)
            ->filter()
            ->push($this->name)
            ->implode(' › ');
    }
}
