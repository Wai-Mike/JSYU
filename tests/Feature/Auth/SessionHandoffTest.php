<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Support\SessionHandoff;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SessionHandoffTest extends TestCase
{
    use RefreshDatabase;

    private const TARGET = 'http://portal.jsyu.test/member/membership';

    public function test_shared_session_cookie_needs_no_handoff()
    {
        config(['session.domain' => '.jsyu.test']);

        $this->assertSame(self::TARGET, SessionHandoff::url(User::factory()->create(), self::TARGET));
    }

    public function test_handoff_link_signs_the_user_in_on_the_portal_once()
    {
        config(['session.domain' => 'localhost']);
        $user = User::factory()->create();

        $link = SessionHandoff::url($user, self::TARGET);
        $this->assertStringStartsWith('http://portal.jsyu.test/auth/handoff?', $link);

        $this->get($link)->assertRedirect(self::TARGET);
        $this->assertAuthenticatedAs($user);

        auth()->logout();
        $this->get($link)->assertForbidden();
        $this->assertGuest();
    }

    public function test_tampered_handoff_link_is_rejected()
    {
        config(['session.domain' => 'localhost']);
        $user = User::factory()->create();
        $other = User::factory()->create();

        $link = str_replace('user='.$user->id, 'user='.$other->id, SessionHandoff::url($user, self::TARGET));

        $this->get($link)->assertForbidden();
        $this->assertGuest();
    }
}
