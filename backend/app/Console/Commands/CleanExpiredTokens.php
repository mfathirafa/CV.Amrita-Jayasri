<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Laravel\Sanctum\PersonalAccessToken;

class CleanExpiredTokens extends Command
{
    protected $signature   = 'tokens:clean';
    protected $description = 'Hapus token yang sudah expired';

    public function handle()
    {
        $deleted = PersonalAccessToken::where('expires_at', '<', now())->delete();
        $this->info("Token expired dihapus: {$deleted}");
    }
}