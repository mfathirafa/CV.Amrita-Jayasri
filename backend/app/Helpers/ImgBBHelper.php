<?php

namespace App\Helpers;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;

class ImgBBHelper
{
    public static function upload(UploadedFile $file): array|null
    {
        $apiKey  = env('IMGBB_API_KEY');
        $base64  = base64_encode(file_get_contents($file->getRealPath()));

        $response = Http::asForm()->post("https://api.imgbb.com/1/upload?key={$apiKey}", [
            'image' => $base64,
            'name'  => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
        ]);

        if ($response->successful() && $response->json('success')) {
            return [
                'url'       => $response->json('data.url'),
                'delete_url'=> $response->json('data.delete_url'),
                'thumb_url' => $response->json('data.thumb.url'),
            ];
        }

        return null;
    }
}