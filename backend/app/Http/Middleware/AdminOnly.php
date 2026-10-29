<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware: hanya izinkan user dengan role 'admin'.
 * User dengan role 'viewer' mendapat 403 Forbidden.
 */
class AdminOnly
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Anda hanya memiliki hak lihat (read-only).',
            ], 403);
        }

        return $next($request);
    }
}
