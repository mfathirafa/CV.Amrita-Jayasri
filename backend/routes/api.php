<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\KonsumenController;
use App\Http\Controllers\TransaksiMasukController;
use App\Http\Controllers\TransaksiKeluarController;
use App\Http\Controllers\StokController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LaporanController;

// ========================
// AUTH ROUTES (public)
// ========================
// Route::get('/fix-password', [AuthController::class, 'fixPassword']);
Route::post('/login', [AuthController::class, 'login']);
// Login — maksimal 5x percobaan per menit per IP
Route::middleware('throttle:5,1')->post('/login', [AuthController::class, 'login']);

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
    
    
    // Konsumen
        Route::get('/konsumen',         [KonsumenController::class, 'index']);
        Route::post('/konsumen',        [KonsumenController::class, 'store']);
        Route::get('/konsumen/{id}',    [KonsumenController::class, 'show']);
        Route::put('/konsumen/{id}',    [KonsumenController::class, 'update']);
        Route::delete('/konsumen/{id}', [KonsumenController::class, 'destroy']);

    // Transaksi Masuk
        Route::get('/transaksi-masuk',       [TransaksiMasukController::class, 'index']);
        Route::post('/transaksi-masuk',      [TransaksiMasukController::class, 'store']);
        Route::get('/transaksi-masuk/{id}',  [TransaksiMasukController::class, 'show']);

    // Transaksi Keluar
        Route::get('/transaksi-keluar',      [TransaksiKeluarController::class, 'index']);
        Route::post('/transaksi-keluar',     [TransaksiKeluarController::class, 'store']);
        Route::get('/transaksi-keluar/{id}', [TransaksiKeluarController::class, 'show']);

    // Stok & Notifikasi
        Route::get('/stok',          [StokController::class, 'index']);
        Route::get('/stok/rendah',   [StokController::class, 'stokRendah']);
        Route::get('/notifikasi',    [StokController::class, 'notifikasi']);

    // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index']);

    // Laporan
        Route::get('/laporan/transaksi-masuk',  [LaporanController::class, 'transaksiMasuk']);
        Route::get('/laporan/transaksi-keluar', [LaporanController::class, 'transaksiKeluar']);
        Route::get('/laporan/stok',             [LaporanController::class, 'stok']);
});