<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Offices, departments, committees… independent of geography but optionally tied to an area
        Schema::create('organisation_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('organisation_units')->restrictOnDelete();
            $table->string('type', 30);
            $table->string('name');
            $table->string('code', 50)->nullable()->unique();
            $table->text('description')->nullable();
            $table->foreignId('geographic_area_id')->nullable()->constrained()->restrictOnDelete();
            $table->string('path', 500)->default('/')->index();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['parent_id', 'name']);
            $table->index('type');
        });

        // Shared person profile; separate from login accounts (users)
        Schema::create('people', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->unique()->constrained()->nullOnDelete();
            $table->string('full_name');
            $table->string('email')->nullable()->index();
            $table->string('phone', 40)->nullable();
            $table->string('gender', 20)->nullable();
            $table->foreignId('geographic_area_id')->nullable()->constrained()->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('full_name');
        });

        Schema::create('positions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organisation_unit_id')->constrained()->restrictOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->boolean('is_leadership')->default(true);
            $table->unsignedSmallInteger('seats')->default(1);
            $table->unsignedSmallInteger('term_months')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['organisation_unit_id', 'title']);
        });

        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('position_id')->constrained()->restrictOnDelete();
            $table->foreignId('person_id')->constrained('people')->restrictOnDelete();
            $table->string('status', 20)->default('active');
            $table->date('starts_on');
            $table->date('term_ends_on')->nullable();
            $table->date('ended_on')->nullable();
            $table->string('end_reason', 30)->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('appointed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('ended_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('replaces_appointment_id')->nullable()->constrained('appointments')->nullOnDelete();
            $table->timestamps();

            $table->index(['position_id', 'status']);
            $table->index(['person_id', 'status']);
        });

        // Private, permission-checked file attachments (appointment letters, etc.)
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->morphs('documentable');
            $table->string('title')->nullable();
            $table->string('disk', 30);
            $table->string('path');
            $table->string('original_name');
            $table->string('mime_type', 120);
            $table->unsignedBigInteger('size');
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
        Schema::dropIfExists('appointments');
        Schema::dropIfExists('positions');
        Schema::dropIfExists('people');
        Schema::dropIfExists('organisation_units');
    }
};
