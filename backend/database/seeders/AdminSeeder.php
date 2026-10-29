<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Admin utama
        User::updateOrCreate(
            ['email' => 'admin@amrita.com'],
            [
                'name'      => 'Admin Amrita',
                'password'  => Hash::make('password123'),
                'is_active' => 1,
                'role'      => 'admin',
            ]
        );

        // User 2
        User::updateOrCreate(
            ['email' => 'backend@amrita.com'],
            [
                'name'      => 'Muhammad Fathi Rafa',
                'password'  => Hash::make('password123'),
                'is_active' => 1,
                'role'      => 'admin',
            ]
        );

        // User 3
        User::updateOrCreate(
            ['email' => 'frontend@amrita.com'],
            [
                'name'      => 'Staff Gudang',
                'password'  => Hash::make('password123'),
                'is_active' => 1,
                'role'      => 'admin',
            ]
        );

        // User 4
        User::updateOrCreate(
            ['email' => 'tester@amrita.com'],
            [
                'name'      => 'Manager Amrita',
                'password'  => Hash::make('password123'),
                'is_active' => 1,
                'role'      => 'admin',
            ]
        );

        // User Pengunjung (Viewer - Read Only)
        User::updateOrCreate(
            ['email' => 'pengunjung@amrita.com'],
            [
                'name'      => 'Tamu Pengunjung',
                'password'  => Hash::make('password123'),
                'is_active' => 1,
                'role'      => 'viewer',
            ]
        );

        $this->command->info('Admin seeder selesai! Akun admin & pengunjung (viewer) berhasil dibuat.');
    }
}
