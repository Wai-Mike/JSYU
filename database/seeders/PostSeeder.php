<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'waimichael35@gmail.com')->first();
        if (! $admin) {
            return;
        }

        $seedPosts = [
            [
                'title' => 'Annual Work Plan 2026/2027: What we are delivering',
                'type' => Post::TYPE_ARTICLE,
                'excerpt' => 'A summary of our priority programs across all 9 counties, with inclusion of youth with disabilities.',
                'content' => "This year we are focusing on economic empowerment, peacebuilding, education, climate resilience, health awareness, sports and culture, and volunteerism.\n\nYouth with disabilities are a primary focus and are represented in our youth structure, including the Speaker position.\n\nFollow the Work Plan page for details and updates as implementation progresses across all 9 counties.",
                'featured_image' => '/images/hero-section.jpeg',
            ],
            [
                'title' => 'Fishing livelihoods in the SUDD swamps: training and ethics',
                'type' => Post::TYPE_PROGRAM,
                'excerpt' => 'Workshops for youth on better fishing behaviours, ethics, and good practices in the SUDD swamps.',
                'content' => "We are initiating income-generating activities that include workshops on:\n- Better fishing behaviours and ethics\n- Sustainable good practices of fishing in the SUDD swamps\n\nThis is part of our Youth Economic Empowerment & Livelihoods program.",
                'featured_image' => '/images/chairman-new.jpeg',
            ],
        ];

        foreach ($seedPosts as $seed) {
            $slug = Str::slug($seed['title']);

            Post::updateOrCreate(
                ['slug' => $slug],
                [
                    'user_id' => $admin->id,
                    'title' => $seed['title'],
                    'excerpt' => $seed['excerpt'],
                    'content' => $seed['content'],
                    'type' => $seed['type'],
                    'status' => Post::STATUS_PUBLISHED,
                    'published_at' => now(),
                    'featured_image' => $seed['featured_image'],
                ]
            );
        }
    }
}

