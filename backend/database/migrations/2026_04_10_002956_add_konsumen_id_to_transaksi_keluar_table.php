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
        Schema::table('transaksi_keluar', function (Blueprint $table) {
            // Tambah kolom konsumen_id
            $table->foreignId('konsumen_id')
                ->nullable()
                ->after('user_id')
                ->constrained('konsumen')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('transaksi_keluar', function (Blueprint $table) {
            $table->dropForeign(['konsumen_id']);
            $table->dropColumn('konsumen_id');
        });
    }
};
