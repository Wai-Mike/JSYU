<?php

namespace App\Services\Access;

use App\Models\GeographicArea;
use App\Models\RoleAssignment;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

/**
 * Answers "may this user do X here?" from role assignments.
 *
 * - A state-wide assignment (no area) grants its permissions everywhere.
 * - An area assignment grants only the role's *scoped* permissions, and only
 *   for records in that area or below it (e.g. a county and its payams).
 * - Records with no area (state-level) need a state-wide grant.
 */
class AccessControl
{
    /** @var array<int, Collection> per-user cache for the current request */
    private array $grants = [];

    public function flush(?User $user = null): void
    {
        if ($user) {
            unset($this->grants[$user->id]);
        } else {
            $this->grants = [];
        }
    }

    /**
     * May $user use $permission for a record located in $area (null = state level)?
     */
    public function allows(?User $user, string $permission, GeographicArea|int|null $area = null): bool
    {
        if (! $user) {
            return false;
        }

        $scopes = $this->scopesFor($user, $permission);

        if ($scopes === null) {
            return true; // state-wide
        }

        if ($area === null || $scopes->isEmpty()) {
            return false;
        }

        $area = $area instanceof GeographicArea ? $area : GeographicArea::query()->find($area);

        if (! $area) {
            return false;
        }

        $lineage = [...$area->ancestorIds(), $area->id];

        return $scopes->contains(fn (GeographicArea $scope) => in_array($scope->id, $lineage, true));
    }

    /**
     * Does $user hold $permission somewhere inside or above $area? Unlike
     * allows(), a county grant also matches a state-wide record (e.g. a
     * campaign or election the county takes part in). Null = state level.
     */
    public function overlaps(?User $user, string $permission, GeographicArea|int|null $area = null): bool
    {
        if (! $user) {
            return false;
        }

        $scopes = $this->scopesFor($user, $permission);

        if ($scopes === null) {
            return true;
        }

        if ($area === null) {
            return $scopes->isNotEmpty();
        }

        $area = $area instanceof GeographicArea ? $area : GeographicArea::query()->find($area);

        if (! $area) {
            return false;
        }

        $lineage = [...$area->ancestorIds(), $area->id];

        return $scopes->contains(fn (GeographicArea $scope) => in_array($scope->id, $lineage, true)
            || in_array($area->id, $scope->ancestorIds(), true));
    }

    /** Does $user hold $permission anywhere (state-wide or in any area)? */
    public function hasAnywhere(?User $user, string $permission): bool
    {
        if (! $user) {
            return false;
        }

        $scopes = $this->scopesFor($user, $permission);

        return $scopes === null || $scopes->isNotEmpty();
    }

    /** Does $user hold $permission state-wide? */
    public function hasStatewide(?User $user, string $permission): bool
    {
        return $user !== null && $this->scopesFor($user, $permission) === null;
    }

    /**
     * Areas in which $user holds $permission. Null means unrestricted
     * (state-wide); an empty collection means no access at all.
     *
     * @return Collection<int, GeographicArea>|null
     */
    public function scopesFor(User $user, string $permission): ?Collection
    {
        $grants = $this->grantsFor($user)->where('permission', $permission);

        if ($grants->contains(fn ($g) => $g['area'] === null)) {
            return null;
        }

        // Area grants only count for scoped permissions
        if (! ($this->isScoped($permission))) {
            return collect();
        }

        return $grants->pluck('area')->filter()->unique('id')->values();
    }

    /**
     * Restrict $query to records whose area column falls inside the user's
     * scopes for $permission. State-level records (null area) are only kept
     * for state-wide holders.
     */
    public function scopeQuery(Builder $query, User $user, string $permission, string $areaColumn = 'geographic_area_id'): Builder
    {
        $scopes = $this->scopesFor($user, $permission);

        if ($scopes === null) {
            return $query;
        }

        if ($scopes->isEmpty()) {
            return $query->whereRaw('1 = 0');
        }

        return $query->whereIn($areaColumn, function ($sub) use ($scopes) {
            $sub->select('id')->from('geographic_areas')->where(function ($w) use ($scopes) {
                foreach ($scopes as $scope) {
                    $w->orWhere('id', $scope->id)->orWhere('path', 'like', $scope->path.$scope->id.'/%');
                }
            });
        });
    }

    /** Every permission key the user holds anywhere; drives the portal navigation. */
    public function permissionKeys(?User $user): array
    {
        if (! $user) {
            return [];
        }

        return $this->grantsFor($user)
            ->filter(fn ($g) => $g['area'] === null || ($this->isScoped($g['permission'])))
            ->pluck('permission')
            ->unique()
            ->sort()
            ->values()
            ->all();
    }

    /**
     * Keep the legacy users.role column ("admin" = staff account) consistent
     * with role assignments so existing post-login redirects keep working.
     */
    public function syncAccountType(User $user): void
    {
        $this->flush($user);

        if (! in_array($user->role, ['admin', 'student'], true)) {
            return;
        }

        $type = $this->hasAnywhere($user, 'portal.access') ? 'admin' : 'student';

        if ($user->role !== $type) {
            $user->forceFill(['role' => $type])->saveQuietly();
        }
    }

    /** Permission keys contain dots, so read the config array instead of using dot notation. */
    private function isScoped(string $permission): bool
    {
        return (bool) (config('portal.permissions')[$permission]['scoped'] ?? false);
    }

    /** @return Collection<int, array{permission: string, area: ?GeographicArea}> */
    private function grantsFor(User $user): Collection
    {
        return $this->grants[$user->id] ??= RoleAssignment::query()
            ->where('user_id', $user->id)
            ->with(['role.permissions:id,key', 'geographicArea'])
            ->get()
            ->flatMap(fn (RoleAssignment $a) => $a->role->permissions->map(fn ($p) => [
                'permission' => $p->key,
                'area' => $a->geographicArea,
            ]));
    }
}
