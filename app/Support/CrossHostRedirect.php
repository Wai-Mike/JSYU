<?php

namespace App\Support;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class CrossHostRedirect
{
    /**
     * Redirect to a URL that may live on another host (e.g. the admin subdomain).
     *
     * Inertia's XHR visits cannot follow a redirect to another origin, so when the
     * target host differs we ask Inertia to do a full page visit instead.
     */
    public static function to(Request $request, string $url): Response
    {
        $targetHost = parse_url($url, PHP_URL_HOST);

        if ($targetHost && $targetHost !== $request->getHost()) {
            return Inertia::location($url);
        }

        return redirect($url);
    }
}
