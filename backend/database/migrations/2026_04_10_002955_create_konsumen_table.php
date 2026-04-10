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
        Schema::create('konsumen', function (Blueprint $table) {
            $table->id();
            $table->string('nama_konsumen', 200);
            $table->text('alamat')->nullable();
            $table->string('no_telepon', 20)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('konsumen');
    }
};
