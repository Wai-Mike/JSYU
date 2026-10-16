<?php

namespace Database\Seeders;

use App\Services\Geography\JongleiGeography;
use Illuminate\Database\Seeder;

/** Approved South Sudan → Jonglei State → nine counties. Safe to run repeatedly. */
class JongleiGeographySeeder extends Seeder
{
    public function run(JongleiGeography $geography): void
    {
        $report = $geography->sync();

        foreach (['created', 'adopted', 'aliases'] as $section) {
            foreach ($report[$section] as $line) {
                $this->command?->info(ucfirst($section).": {$line}");
            }
        }

        foreach ($report['conflicts'] as $line) {
            $this->command?->warn("Conflict: {$line}");
        }

        if (! array_filter($report)) {
            $this->command?->info('Jonglei geography already up to date.');
        }
    }
}
