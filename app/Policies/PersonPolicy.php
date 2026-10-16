<?php

namespace App\Policies;

use App\Models\Person;
use App\Models\User;
use App\Services\Access\AccessControl;

class PersonPolicy
{
    public function __construct(private readonly AccessControl $access) {}

    public function viewAny(User $user): bool
    {
        return $this->access->hasAnywhere($user, 'people.view');
    }

    public function view(User $user, Person $person): bool
    {
        return $this->access->allows($user, 'people.view', $person->geographic_area_id);
    }

    public function create(User $user, ?int $areaId = null): bool
    {
        return $this->access->allows($user, 'people.manage', $areaId);
    }

    public function update(User $user, Person $person): bool
    {
        return $this->access->allows($user, 'people.manage', $person->geographic_area_id);
    }
}
