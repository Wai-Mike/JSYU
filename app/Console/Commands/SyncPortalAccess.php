<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Models\RoleAssignment;
use App\Models\User;
use App\Services\Access\AccessControl;
use App\Services\Access\AccessRegistry;
use Illuminate\Console\Command;

class SyncPortalAccess extends Command
{
    protected $signature = 'portal:sync-access {--grant-super-admin= : Email of a user to make Super Administrator}';

    protected $description = 'Create missing portal roles/permissions from config/portal.php';

    public function handle(AccessRegistry $registry, AccessControl $access): int
    {
        $registry->sync();
        $this->info('Portal roles and permissions are in sync.');

        if ($email = $this->option('grant-super-admin')) {
            $user = User::query()->where('email', $email)->first();

            if (! $user) {
                $this->error("No user with email {$email}.");

                return self::FAILURE;
            }

            RoleAssignment::query()->firstOrCreate([
                'user_id' => $user->id,
                'role_id' => Role::query()->where('key', Role::SUPER_ADMIN)->value('id'),
                'geographic_area_id' => null,
            ]);
            $access->syncAccountType($user);

            $this->info("{$user->name} is now a Super Administrator.");
        }

        return self::SUCCESS;
    }
}
