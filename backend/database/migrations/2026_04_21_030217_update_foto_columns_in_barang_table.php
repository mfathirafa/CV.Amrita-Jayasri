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
        Schema::table('barang', function (Blueprint $table) {
            // Ganti foto_public_id jadi foto_delete_url
            $table->renameColumn('foto_public_id', 'foto_delete_url');
        });
    }

    public function down(): void
    {
        Schema::table('barang', function (Blueprint $table) {
            $table->renameColumn('foto_delete_url', 'foto_public_id');
        });
    }
};
