<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class SessionHandoffController extends Controller
{
    /**
     * Sign the user in on this host from a link made by App\Support\SessionHandoff.
     */
    public function __invoke(Request $request): RedirectResponse
    {
        // Each link works once
        abort_unless(Cache::add('session-handoff:'.$request->query('nonce'), true, now()->addMinutes(2)), 403, 'This sign-in link has already been used.');

        $target = (string) $request->query('to');

        // Only continue to a page on this host
        abort_unless(parse_url($target, PHP_URL_HOST) === $request->getHost(), 403);

        Auth::login(User::findOrFail($request->query('user')));
        $request->session()->regenerate();

        return redirect()->to($target);
    }
}
