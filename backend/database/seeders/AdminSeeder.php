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
            ]
        );

        // User 2
        User::updateOrCreate(
            ['email' => 'backend@amrita.com'],
            [
                'name'      => 'Muhammad Fathi Rafa',
                'password'  => Hash::make('password123'),
                'is_active' => 1,
            ]
        );

        // User 3
        User::updateOrCreate(
            ['email' => 'frontend@amrita.com'],
            [
                'name'      => 'Staff Gudang',
                'password'  => Hash::make('password123'),
                'is_active' => 1,
            ]
        );

        // User 4
        User::updateOrCreate(
            ['email' => 'tester@amrita.com'],
            [
                'name'      => 'Manager Amrita',
                'password'  => Hash::make('password123'),
                'is_active' => 1,
            ]
        );

        $this->command->info('Admin seeder selesai! 4 user berhasil dibuat.');
    }
}