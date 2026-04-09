<?php

return [

    'paths' => ['api/*','sanctum/csrf-cookies'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',    // React Vite (development)
        'http://localhost:3000',    // React CRA (development)
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        'https://cv-amrita-jayasri.vercel.app',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,   // ← penting untuk Sanctum!

];