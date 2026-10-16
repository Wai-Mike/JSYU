<?php

use App\Services\Access\AccessRegistry;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Create the configured roles/permissions and give existing admins the
     * Super Administrator role so nobody loses portal access.
     */
    public function up(): void
    {
        app(AccessRegistry::class)->sync();

        $superAdminId = DB::table('roles')->where('key', 'super_admin')->value('id');

        DB::table('users')->where('role', 'admin')->pluck('id')->each(function ($userId) use ($superAdminId) {
            DB::table('role_assignments')->insertOrIgnore([
                'user_id' => $userId,
                'role_id' => $superAdminId,
                'geographic_area_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });
    }

    public function down(): void
    {
        // Tables are dropped by the preceding migration's down()
    }
};
