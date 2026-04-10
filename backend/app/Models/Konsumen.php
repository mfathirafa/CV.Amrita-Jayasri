<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Konsumen extends Model
{
    protected $table = 'konsumen';

    protected $fillable = [
        'nama_konsumen',
        'alamat',
        'no_telepon',
    ];

    // Relasi ke transaksi keluar
    public function transaksiKeluar()
    {
        return $this->hasMany(TransaksiKeluar::class, 'konsumen_id');
    }
}