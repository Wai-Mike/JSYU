<?php

use App\Models\Permission;
use App\Models\Role;
use App\Services\Access\AccessRegistry;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** New permissions and the existing roles that receive them by default. */
    private const GRANTS = [
        'members.review' => ['membership_officer'],
        'teams.view' => ['state_executive', 'secretariat_admin', 'department_head', 'county_coordinator', 'payam_coordinator'],
        'teams.manage' => ['secretariat_admin'],
    ];

    public function up(): void
    {
        // Officers approve or reject a member's application; existing members start as pending
        Schema::table('member_profiles', function (Blueprint $table) {
            $table->string('status', 20)->default('pending')->after('visibility');
            $table->foreignId('reviewed_by')->nullable()->after('status')->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            $table->text('review_note')->nullable()->after('reviewed_at');

            $table->index('status');
        });

        // A leadership team for a term (e.g. "State Executive 2023–2026"). Previous
        // teams are kept as history and may include people with no record in `people`.
        Schema::create('management_teams', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            // Null = state-level team; otherwise the county/payam the team leads
            $table->foreignId('geographic_area_id')->nullable()->constrained()->restrictOnDelete();
            $table->date('starts_on');
            $table->date('ends_on')->nullable();
            $table->boolean('is_current')->default(false);
            $table->text('description')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['geographic_area_id', 'is_current']);
        });

        Schema::create('management_team_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('management_team_id')->constrained()->cascadeOnDelete();
            // Optional link to the person record; the name is kept as entered for history
            $table->foreignId('person_id')->nullable()->constrained('people')->nullOnDelete();
            $table->string('name');
            $table->string('position_title', 150);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        app(AccessRegistry::class)->sync();

        $permissions = Permission::query()->whereIn('key', array_keys(self::GRANTS))->pluck('id', 'key');

        foreach (self::GRANTS as $permission => $roles) {
            Role::query()->whereIn('key', $roles)->get()
                ->each(fn (Role $role) => $role->permissions()->syncWithoutDetaching([$permissions[$permission]]));
        }
    }

    public function down(): void
    {
        Permission::query()->whereIn('key', array_keys(self::GRANTS))->delete();

        Schema::dropIfExists('management_team_members');
        Schema::dropIfExists('management_teams');

        Schema::table('member_profiles', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropConstrainedForeignId('reviewed_by');
            $table->dropColumn(['status', 'reviewed_at', 'review_note']);
        });
    }
};
