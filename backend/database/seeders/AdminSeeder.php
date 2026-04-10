<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@amrita.com'],
            [
                'name'      => 'Admin Amrita',
                'password'  => Hash::make('password123'),
                'is_active' => 1,
            ]
        );

        $this->command->info('Admin seeder selesai!');
    }
}