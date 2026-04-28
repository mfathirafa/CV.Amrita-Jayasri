<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    // LOGIN
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email|max:100',
            'password' => 'required|string|min:6|max:100',
        ]);

        // Tambah proteksi dari karakter berbahaya
        if (preg_match('/[<>{}]/', $request->email)) {
            return response()->json([
                'success' => false,
                'message' => 'Input tidak valid.',
            ], 422);
        }

        if (!Auth::attempt([
            'email'    => $request->email,
            'password' => $request->password
        ])) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password tidak valid.',
            ], 401);
        }

        $user = Auth::user();

        if (!$user->is_active) {
            Auth::logout();
            return response()->json([
                'success' => false,
                'message' => 'Akun Anda tidak aktif. Hubungi administrator.',
            ], 403);
        }

        // Hapus token lama
        $user->tokens()->delete();

        // Buat token baru dengan expiry 24 jam
        $token = $user->createToken('auth_token', ['*'], now()->addHours(24))->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'data'    => [
                'user'       => [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                ],
                'token'      => $token,
                'expires_at' => now()->addHours(24)->toDateTimeString(),
            ],
        ], 200);
    }
    
    public function fixPassword()
    {
        \App\Models\User::where('email', 'admin@amrita.com')
            ->update(['password' => \Illuminate\Support\Facades\Hash::make('password123')]);
        
        return response()->json(['message' => 'Password fixed!']);
    }
    // LOGOUT
    public function logout(Request $request)
    {
        // Hapus token yang sedang dipakai
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.',
        ], 200);
    }
}