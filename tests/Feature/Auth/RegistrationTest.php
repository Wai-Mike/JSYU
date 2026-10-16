<?php

namespace Tests\Feature\Auth;

use App\Models\GeographicArea;
use App\Models\User;
use App\Services\Geography\JongleiGeography;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        app(JongleiGeography::class)->sync();
        Event::fake([Registered::class]);
        Notification::fake();
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'first_name' => 'Nyandeng',
            'middle_name' => 'Achol',
            'last_name' => 'Mabior',
            'gender' => 'female',
            'date_of_birth' => '2001-04-12',
            'email' => 'Nyandeng@Example.com',
            'phone' => '+211 912 345 678',
            'alternative_phone' => '',
            'home_area_id' => GeographicArea::query()->where('code', 'SS-JG-BOR')->value('id'),
            'current_country_code' => 'ss',
            'current_location' => 'Bor',
            'bio' => 'Student and peace volunteer.',
            'visibility' => 'officials',
            'password' => 'password',
            'password_confirmation' => 'password',
            'terms' => true,
        ], $overrides);
    }

    public function test_registration_screen_can_be_rendered()
    {
        $this->get('/register')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page->component('auth/register')->has('areas', 9)->has('visibilities', 3));
    }

    public function test_new_members_register_with_their_full_profile()
    {
        $this->post('/register', $this->payload())->assertSessionHasNoErrors();

        $this->assertAuthenticated();

        $user = User::query()->where('email', 'nyandeng@example.com')->firstOrFail();
        $this->assertSame('Nyandeng Achol Mabior', $user->name);

        $person = $user->person;
        $this->assertSame('+211 912 345 678', $person->phone);
        $this->assertSame('female', $person->gender);

        $profile = $person->memberProfile;
        $this->assertSame('Nyandeng', $profile->first_name);
        $this->assertSame('Mabior', $profile->last_name);
        $this->assertSame('2001-04-12', $profile->date_of_birth->toDateString());
        $this->assertSame('Bor', $profile->homeArea->name);
        $this->assertSame('SS', $profile->current_country_code);
        $this->assertSame('officials', $profile->visibility);
    }

    public function test_membership_details_are_required()
    {
        $this->post('/register', $this->payload([
            'first_name' => '',
            'phone' => 'call me',
            'home_area_id' => '',
            'terms' => false,
        ]))->assertSessionHasErrors(['first_name', 'phone', 'home_area_id', 'terms']);

        $this->assertGuest();
    }

    public function test_home_area_must_be_inside_jonglei()
    {
        $country = GeographicArea::query()->where('code', 'SS')->value('id');

        $this->post('/register', $this->payload(['home_area_id' => $country]))->assertSessionHasErrors('home_area_id');
    }
}
