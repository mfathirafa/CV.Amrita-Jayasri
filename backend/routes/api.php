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
Route::middleware('throttle:login')->post('/login', [AuthController::class, 'login']);

// ========================
// PROTECTED ROUTES (butuh login)
// ========================
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);

    // ----------------------------------------------------
    // READ-ONLY ROUTES (Admin & Viewer / Pengunjung)
    // ----------------------------------------------------
    Route::get('/barang',                 [BarangController::class, 'index']);
    Route::get('/barang/{id}',            [BarangController::class, 'show']);

    Route::get('/supplier',               [SupplierController::class, 'index']);
    Route::get('/supplier/{id}',          [SupplierController::class, 'show']);

    Route::get('/konsumen',               [KonsumenController::class, 'index']);
    Route::get('/konsumen/{id}',          [KonsumenController::class, 'show']);

    Route::get('/transaksi-masuk',         [TransaksiMasukController::class, 'index']);
    Route::get('/transaksi-masuk/{id}',     [TransaksiMasukController::class, 'show']);

    Route::get('/transaksi-keluar',        [TransaksiKeluarController::class, 'index']);
    Route::get('/transaksi-keluar/{id}',   [TransaksiKeluarController::class, 'show']);

    Route::get('/stok',                   [StokController::class, 'index']);
    Route::get('/stok/rendah',            [StokController::class, 'stokRendah']);
    Route::get('/notifikasi',             [StokController::class, 'notifikasi']);

    Route::get('/dashboard',              [DashboardController::class, 'index']);

    Route::get('/laporan/transaksi-masuk', [LaporanController::class, 'transaksiMasuk']);
    Route::get('/laporan/transaksi-keluar',[LaporanController::class, 'transaksiKeluar']);
    Route::get('/laporan/stok',            [LaporanController::class, 'stok']);

    // ----------------------------------------------------
    // WRITE ROUTES (Hanya Admin - viewer dilarang)
    // ----------------------------------------------------
    Route::middleware('admin.only')->group(function () {
        // Barang (CUD)
        Route::post('/barang',         [BarangController::class, 'store']);
        Route::put('/barang/{id}',     [BarangController::class, 'update']);
        Route::delete('/barang/{id}',  [BarangController::class, 'destroy']);

        // Supplier (CUD)
        Route::post('/supplier',        [SupplierController::class, 'store']);
        Route::put('/supplier/{id}',    [SupplierController::class, 'update']);
        Route::delete('/supplier/{id}', [SupplierController::class, 'destroy']);

        // Konsumen (CUD)
        Route::post('/konsumen',        [KonsumenController::class, 'store']);
        Route::put('/konsumen/{id}',    [KonsumenController::class, 'update']);
        Route::delete('/konsumen/{id}', [KonsumenController::class, 'destroy']);

        // Transaksi Masuk (C, D)
        Route::post('/transaksi-masuk',        [TransaksiMasukController::class, 'store']);
        Route::delete('/transaksi-masuk/{id}', [TransaksiMasukController::class, 'destroy']);

        // Transaksi Keluar (C, D)
        Route::post('/transaksi-keluar',        [TransaksiKeluarController::class, 'store']);
        Route::delete('/transaksi-keluar/{id}', [TransaksiKeluarController::class, 'destroy']);
    });
});
