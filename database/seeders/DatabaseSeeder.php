<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            // Reference data, also safe for production: php artisan db:seed --class=JongleiGeographySeeder
            JongleiGeographySeeder::class,
            UserSeeder::class,
            PostSeeder::class,
        ]);
    }
}
