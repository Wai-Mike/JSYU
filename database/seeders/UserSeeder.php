<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create or update primary admin user
        $admin = User::updateOrCreate(
            ['email' => 'waimichael35@gmail.com'],
            [
                'name' => 'Wai Michael',
                'password' => bcrypt('12345'), // TODO: change this password in production
                'role' => 'admin',
                'date_of_birth' => '1990-01-15',
                'gender' => 'male',
                'state' => 'Active',
                'email_verified_at' => now(),
            ]
        );

        // Create or update student user
        $student = User::updateOrCreate(
            ['email' => 'student@gmail.com'],
            [
                'name' => 'Student User',
                'password' => bcrypt('12345678'), // You should change this password
                'role' => 'student',
                'date_of_birth' => '2005-06-20',
                'gender' => 'female',
                'state' => 'Active',
                'email_verified_at' => now(),
            ]
        );
    }

    /**
     * Reverse the database seeds (rollback).
     * This method will be called when running: php artisan db:seed:rollback --class=UserSeeder
     */
    public function down(): void
    {
        // Delete the admin user
        User::where('email', 'admin@gmail.com')->delete();
    }
}
