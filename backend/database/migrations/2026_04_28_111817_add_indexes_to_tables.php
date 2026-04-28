<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Index untuk pencarian barang
        Schema::table('barang', function (Blueprint $table) {
            $table->index('kategori');
            $table->index('stok');
            $table->index('nama_barang');
        });

        // Index untuk filter transaksi masuk
        Schema::table('transaksi_masuk', function (Blueprint $table) {
            $table->index('tanggal_masuk');
            $table->index('barang_id');
            $table->index('supplier_id');
        });

        // Index untuk filter transaksi keluar
        Schema::table('transaksi_keluar', function (Blueprint $table) {
            $table->index('tanggal_keluar');
            $table->index('barang_id');
            $table->index('konsumen_id');
        });
    }

    public function down(): void
    {
        Schema::table('barang', function (Blueprint $table) {
            $table->dropIndex(['kategori']);
            $table->dropIndex(['stok']);
            $table->dropIndex(['nama_barang']);
        });

        Schema::table('transaksi_masuk', function (Blueprint $table) {
            $table->dropIndex(['tanggal_masuk']);
            $table->dropIndex(['barang_id']);
            $table->dropIndex(['supplier_id']);
        });

        Schema::table('transaksi_keluar', function (Blueprint $table) {
            $table->dropIndex(['tanggal_keluar']);
            $table->dropIndex(['barang_id']);
            $table->dropIndex(['konsumen_id']);
        });
    }
};
