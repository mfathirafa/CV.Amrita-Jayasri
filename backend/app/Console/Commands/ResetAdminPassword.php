<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class ResetAdminPassword extends Command
{
    protected $signature = 'admin:reset-password';
    protected $description = 'Reset admin password';

    public function handle()
    {
        User::where('email', 'admin@amrita.com')
            ->update([
                'password' => Hash::make('password123')
            ]);

        $this->info('Password admin berhasil direset!');
    }
}