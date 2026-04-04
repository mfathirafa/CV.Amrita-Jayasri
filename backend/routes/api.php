<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BarangController;

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

    // Barang
        Route::get('/barang',          [BarangController::class, 'index']);
        Route::post('/barang',         [BarangController::class, 'store']);
        Route::get('/barang/{id}',     [BarangController::class, 'show']);
        Route::put('/barang/{id}',     [BarangController::class, 'update']);
        Route::delete('/barang/{id}',  [BarangController::class, 'destroy']);

});