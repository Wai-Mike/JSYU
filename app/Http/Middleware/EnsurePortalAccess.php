<?php

namespace App\Http\Middleware;

use App\Services\Access\AccessControl;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/** Only users holding portal.access (state-wide or for any area) may enter the admin portal. */
class EnsurePortalAccess
{
    public function __construct(private readonly AccessControl $access) {}

    public function handle(Request $request, Closure $next): Response
    {
        if (! $this->access->hasAnywhere($request->user(), 'portal.access')) {
            // Members share the portal: its home page takes them to the member area
            if ($request->routeIs('admin.dashboard')) {
                return redirect()->route('member.dashboard');
            }

            abort(403, 'You do not have access to the management portal.');
        }

        return $next($request);
    }
}
