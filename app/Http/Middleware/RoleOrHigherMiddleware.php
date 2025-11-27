<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleOrHigherMiddleware
{
    /**
     * Role hierarchy (higher index = higher privilege)
     */
    private const ROLE_HIERARCHY = [
        'student' => 1,
        'admin' => 2,
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();
        $userRoleLevel = self::ROLE_HIERARCHY[$user->role] ?? 0;
        
        // Check if user has one of the required roles or a higher role
        $hasAccess = false;
        foreach ($roles as $role) {
            $requiredRoleLevel = self::ROLE_HIERARCHY[$role] ?? 0;
            
            // User has access if they have the exact role or a higher role
            if ($user->role === $role || $userRoleLevel >= $requiredRoleLevel) {
                $hasAccess = true;
                break;
            }
        }

        if (!$hasAccess) {
            abort(403, 'Unauthorized access.');
        }

        return $next($request);
    }
}

