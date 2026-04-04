<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// ========================
// AUTH ROUTES (public)
// ========================
Route::post('/login', [AuthController::class, 'login']);

// ========================
// PROTECTED ROUTES (butuh login)
// ========================
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);

});