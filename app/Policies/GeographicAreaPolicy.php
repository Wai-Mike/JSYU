<?php

namespace App\Policies;

use App\Models\GeographicArea;
use App\Models\User;
use App\Services\Access\AccessControl;

class GeographicAreaPolicy
{
    public function __construct(private readonly AccessControl $access) {}

    public function viewAny(User $user): bool
    {
        return $this->access->hasAnywhere($user, 'geography.view');
    }

    /** Create a child of $parent; top-level areas need a state-wide grant. */
    public function create(User $user, ?GeographicArea $parent = null): bool
    {
        return $this->access->allows($user, 'geography.manage', $parent);
    }

    public function update(User $user, GeographicArea $area): bool
    {
        return $this->access->allows($user, 'geography.manage', $area);
    }

    public function delete(User $user, GeographicArea $area): bool
    {
        // Deleting an area changes the parent's jurisdiction, so require authority over the parent
        return $this->access->allows($user, 'geography.manage', $area->parent_id);
    }
}
