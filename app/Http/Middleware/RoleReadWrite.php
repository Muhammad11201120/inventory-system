<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleReadWrite
{
    /**
     * Allow admin/manager for all, and allow user for read-only (GET/HEAD).
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (! $user) {
            abort(403);
        }

        if ($user->hasAnyRole(['admin', 'manager'])) {
            return $next($request);
        }

        if (in_array($request->method(), ['GET', 'HEAD'], true) && $user->hasRole('user')) {
            return $next($request);
        }

        abort(403);
    }
}


