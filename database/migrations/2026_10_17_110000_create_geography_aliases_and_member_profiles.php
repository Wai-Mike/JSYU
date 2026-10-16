<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Alternative names for an area ("Bor South" → Bor) so imports and
        // free-text input resolve to one canonical record instead of duplicates
        Schema::create('geographic_area_aliases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('geographic_area_id')->constrained()->cascadeOnDelete();
            $table->string('alias', 150);
            // Lower-cased, punctuation-free form used for matching
            $table->string('normalized', 150);
            $table->timestamps();

            $table->unique(['geographic_area_id', 'normalized']);
            $table->index('normalized');
        });

        // Member-specific profile for a person. Identity (name, contact email,
        // phone, gender, login link) stays on `people`; this holds the rest.
        Schema::create('member_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('person_id')->unique()->constrained('people')->restrictOnDelete();
            // Structured names are optional: existing single-field names are never auto-split
            $table->string('first_name', 80)->nullable();
            $table->string('middle_name', 80)->nullable();
            $table->string('last_name', 80)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('alternative_phone', 40)->nullable();
            // Place of origin: the most specific area chosen (county, payam or boma)
            $table->foreignId('home_area_id')->nullable()->constrained('geographic_areas')->nullOnDelete();
            // Current residence may be anywhere in the world, so ISO country code + free text
            $table->char('current_country_code', 2)->nullable();
            $table->string('current_location', 150)->nullable();
            $table->text('bio')->nullable();
            $table->string('photo_disk', 30)->nullable();
            $table->string('photo_path')->nullable();
            // private = only me; officials = me + authorised JSYU officers; members = also signed-in members
            $table->string('visibility', 20)->default('officials');
            $table->timestamps();

            $table->index('home_area_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('member_profiles');
        Schema::dropIfExists('geographic_area_aliases');
    }
};
