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
        'census.view' => ['census_supervisor', 'state_executive'],
        'census.collect' => ['census_enumerator', 'census_supervisor'],
        'census.review' => ['census_supervisor'],
        'census.manage' => ['census_supervisor'],
        'elections.view' => ['election_officer', 'state_executive'],
        'elections.manage' => ['election_officer'],
        'elections.certify' => ['state_executive'],
    ];

    public function up(): void
    {
        // A census exercise over a period, optionally limited to one area
        Schema::create('census_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('geographic_area_id')->nullable()->constrained()->restrictOnDelete();
            $table->date('starts_on');
            $table->date('ends_on')->nullable();
            // draft → open (collecting) → closed
            $table->string('status', 20)->default('draft');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('census_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('census_campaign_id')->constrained()->restrictOnDelete();
            // The most specific area known: county, payam or boma
            $table->foreignId('geographic_area_id')->constrained()->restrictOnDelete();
            $table->foreignId('enumerator_id')->nullable()->constrained('users')->nullOnDelete();

            // Identity
            $table->string('full_name');
            $table->string('sex', 10);
            $table->date('date_of_birth')->nullable();
            // Used when the exact date of birth is unknown
            $table->unsignedTinyInteger('age_years')->nullable();
            $table->string('phone', 40)->nullable();

            // Education
            $table->string('education_level', 30)->nullable();
            $table->boolean('in_school')->nullable();

            // Employment & skills
            $table->string('employment_status', 30)->nullable();
            $table->string('occupation', 150)->nullable();
            $table->text('skills')->nullable();

            // Sensitive: only shown to holders of census.sensitive
            $table->string('disability', 20)->nullable();
            $table->string('displacement_status', 20)->nullable();

            // submitted → approved | rejected
            $table->string('status', 20)->default('submitted');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_note')->nullable();
            $table->timestamps();

            $table->index(['census_campaign_id', 'status']);
            $table->index(['census_campaign_id', 'full_name']);
            $table->index('geographic_area_id');
        });

        // Elections in which eligible members vote online
        Schema::create('elections', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            // Electorate: approved members whose home area is here or below. Null = all approved members.
            $table->foreignId('geographic_area_id')->nullable()->constrained()->restrictOnDelete();
            $table->dateTime('opens_at');
            $table->dateTime('closes_at');
            // draft → open → closed → published (results certified and shown to members)
            $table->string('status', 20)->default('draft');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('certified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        Schema::create('election_positions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('election_id')->constrained()->cascadeOnDelete();
            $table->string('title', 150);
            // How many candidates a voter may choose for this position
            $table->unsignedSmallInteger('seats')->default(1);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('election_candidates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('election_position_id')->constrained()->cascadeOnDelete();
            $table->foreignId('person_id')->nullable()->constrained('people')->nullOnDelete();
            $table->string('name');
            $table->text('statement')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        // Who has voted (never what they chose). The unique key makes double voting impossible.
        Schema::create('election_voters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('election_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamp('voted_at');

            $table->unique(['election_id', 'user_id']);
        });

        // Secret ballot: no voter reference, no timestamps, and random ids so
        // ballots cannot be matched to voters by order or time.
        Schema::create('election_votes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('election_id')->constrained()->cascadeOnDelete();
            $table->foreignId('election_position_id')->constrained()->cascadeOnDelete();
            $table->foreignId('election_candidate_id')->constrained()->cascadeOnDelete();

            $table->index(['election_position_id', 'election_candidate_id']);
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
        Permission::query()->whereIn('key', [...array_keys(self::GRANTS), 'census.sensitive'])->delete();

        Schema::dropIfExists('election_votes');
        Schema::dropIfExists('election_voters');
        Schema::dropIfExists('election_candidates');
        Schema::dropIfExists('election_positions');
        Schema::dropIfExists('elections');
        Schema::dropIfExists('census_records');
        Schema::dropIfExists('census_campaigns');
    }
};
