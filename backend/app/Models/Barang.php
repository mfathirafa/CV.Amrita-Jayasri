<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    protected $table = 'barang';

    protected $fillable = [
        'id_referensi',
        'nama_barang',
        'kategori',
        'harga',
        'stok',
        'stok_minimum',
        'satuan',
        'foto_url',
        'foto_public_id',
    ];

    // Relasi ke transaksi masuk
    public function transaksiMasuk()
    {
        return $this->hasMany(TransaksiMasuk::class, 'barang_id');
    }

    // Relasi ke transaksi keluar
    public function transaksiKeluar()
    {
        return $this->hasMany(TransaksiKeluar::class, 'barang_id');
    }
}