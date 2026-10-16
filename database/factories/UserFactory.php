<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => bcrypt('password'), // Default password for testing
            'role' => 'student',
            'google_id' => null,
            'firebase_uid' => null,
            'avatar' => null,
            'email_verified_at' => now(),
        ];
    }

    /**
     * Indicate that the user is an expert.
     */
    public function expert(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'expert',
        ]);
    }
}
