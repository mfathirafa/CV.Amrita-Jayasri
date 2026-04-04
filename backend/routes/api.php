<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\SupplierController;

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
    
    // Supplier`
        Route::get('/supplier',         [SupplierController::class, 'index']);
        Route::post('/supplier',        [SupplierController::class, 'store']);
        Route::get('/supplier/{id}',    [SupplierController::class, 'show']);
        Route::put('/supplier/{id}',    [SupplierController::class, 'update']);
        Route::delete('/supplier/{id}', [SupplierController::class, 'destroy']);
        
});