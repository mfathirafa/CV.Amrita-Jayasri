<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // === transaksi_masuk ===
        Schema::table('transaksi_masuk', function (Blueprint $table) {
            // Drop foreign key lama
            $table->dropForeign(['barang_id']);
            // Ubah kolom jadi nullable
            $table->unsignedBigInteger('barang_id')->nullable()->change();
            // Tambah foreign key baru dengan nullOnDelete
            $table->foreign('barang_id')
                  ->references('id')->on('barang')
                  ->nullOnDelete();
        });

        // === transaksi_keluar ===
        Schema::table('transaksi_keluar', function (Blueprint $table) {
            $table->dropForeign(['barang_id']);
            $table->unsignedBigInteger('barang_id')->nullable()->change();
            $table->foreign('barang_id')
                  ->references('id')->on('barang')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        // Revert: kembalikan ke restrictOnDelete (tidak nullable)
        Schema::table('transaksi_masuk', function (Blueprint $table) {
            $table->dropForeign(['barang_id']);
            $table->unsignedBigInteger('barang_id')->nullable(false)->change();
            $table->foreign('barang_id')
                  ->references('id')->on('barang')
                  ->restrictOnDelete();
        });

        Schema::table('transaksi_keluar', function (Blueprint $table) {
            $table->dropForeign(['barang_id']);
            $table->unsignedBigInteger('barang_id')->nullable(false)->change();
            $table->foreign('barang_id')
                  ->references('id')->on('barang')
                  ->restrictOnDelete();
        });
    }
};