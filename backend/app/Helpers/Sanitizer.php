<?php

namespace App\Helpers;

class Sanitizer
{
    public static function clean(string $input): string
    {
        // Hapus karakter berbahaya
        $input = strip_tags($input);
        $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
        $input = trim($input);

        return $input;
    }
}