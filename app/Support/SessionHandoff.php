<?php

namespace App\Support;

use App\Models\User;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class SessionHandoff
{
    /**
     * The URL to send a signed-in user to on another host.
     *
     * When the session cookie is shared across subdomains (SESSION_DOMAIN=.jsyu.org)
     * the target URL is returned untouched. Otherwise (browsers refuse to share a
     * cookie between localhost and portal.localhost) the user goes through a
     * one-minute, single-use signed link that signs them in on the target host.
     */
    public static function url(User $user, string $target): string
    {
        $host = parse_url($target, PHP_URL_HOST);

        if (! $host || $host === request()->getHost() || self::cookieCovers($host)) {
            return $target;
        }

        $path = URL::temporarySignedRoute('auth.handoff', now()->addMinute(), [
            'user' => $user->getKey(),
            'nonce' => Str::random(32),
            'to' => $target,
        ], absolute: false);

        $port = parse_url($target, PHP_URL_PORT);

        return parse_url($target, PHP_URL_SCHEME).'://'.$host.($port ? ':'.$port : '').$path;
    }

    private static function cookieCovers(string $host): bool
    {
        $domain = ltrim((string) config('session.domain'), '.');

        // A cookie domain without a dot (e.g. "localhost") is never shared with subdomains
        if (! str_contains($domain, '.')) {
            return false;
        }

        return $host === $domain || str_ends_with($host, '.'.$domain);
    }
}
