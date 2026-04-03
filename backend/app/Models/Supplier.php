<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $table = 'supplier';

    protected $fillable = [
        'nama_supplier',
        'alamat',
        'no_telepon',
    ];

    // Relasi ke transaksi masuk
    public function transaksiMasuk()
    {
        return $this->hasMany(TransaksiMasuk::class, 'supplier_id');
    }
}