<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'      => 'Admin Amrita',
            'email'     => 'admin@amrita.com',
            'password'  => Hash::make('password123'),
            'is_active' => 1,
        ]);
    }
}