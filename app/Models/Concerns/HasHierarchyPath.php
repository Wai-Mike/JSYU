<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use InvalidArgumentException;

/**
 * Self-referencing tree with a materialised ancestry path, e.g. "/1/4/" for a
 * record whose parent is 4 and grandparent is 1. Roots have the path "/".
 */
trait HasHierarchyPath
{
    public static function bootHasHierarchyPath(): void
    {
        static::saving(function ($model) {
            if ($model->exists && $model->parent_id && $model->isSelfOrAncestorOf($model->parent_id)) {
                throw new InvalidArgumentException('A record cannot be moved under itself or one of its descendants.');
            }

            $parent = $model->parent_id ? static::query()->find($model->parent_id) : null;
            $model->path = $parent ? $parent->path.$parent->id.'/' : '/';
        });

        // Keep descendant paths in sync when a record moves
        static::updated(function ($model) {
            if (! $model->wasChanged('path')) {
                return;
            }

            $oldPrefix = $model->getOriginal('path').$model->id.'/';
            $newPrefix = $model->path.$model->id.'/';

            static::query()->where('path', 'like', $oldPrefix.'%')->get()->each(function ($descendant) use ($oldPrefix, $newPrefix) {
                $descendant->path = $newPrefix.substr($descendant->path, strlen($oldPrefix));
                $descendant->saveQuietly();
            });
        });
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(static::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(static::class, 'parent_id');
    }

    /** IDs of all ancestors, root first. */
    public function ancestorIds(): array
    {
        return array_map('intval', array_filter(explode('/', $this->path)));
    }

    /** Whether this record is $id or one of its ancestors. */
    public function isSelfOrAncestorOf(int $id): bool
    {
        if ($id === $this->id) {
            return true;
        }

        $other = static::query()->find($id);

        return $other !== null && in_array($this->id, $other->ancestorIds(), true);
    }

    /** Restrict a query to this record and everything below it. */
    public function scopeWithinSubtree(Builder $query, self $root): Builder
    {
        return $query->where(fn ($q) => $q
            ->whereKey($root->getKey())
            ->orWhere('path', 'like', $root->path.$root->id.'/%'));
    }
}
