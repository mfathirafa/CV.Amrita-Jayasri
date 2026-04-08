<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Barang;

class StokController extends Controller
{
    // GET /api/stok - List semua stok barang realtime
    public function index(Request $request)
    {
        $query = Barang::select(
            'id',
            'nama_barang',
            'kategori',
            'stok',
            'stok_minimum',
            'harga'
        );

        // Filter berdasarkan kategori
        if ($request->has('kategori') && $request->kategori != '') {
            $query->where('kategori', $request->kategori);
        }

        // Search nama barang
        if ($request->has('search') && $request->search != '') {
            $query->where('nama_barang', 'like', '%' . $request->search . '%');
        }

        $barang = $query->orderBy('nama_barang', 'asc')->get();

        // Tandai setiap barang apakah stoknya rendah
        $barang->transform(function ($item) {
            $item->status_stok = $item->stok <= $item->stok_minimum ? 'rendah' : 'aman';
            return $item;
        });

        return response()->json([
            'success' => true,
            'message' => 'Data stok barang berhasil diambil.',
            'data'    => $barang,
        ], 200);
    }

    // GET /api/stok/rendah - List barang stok rendah
    public function stokRendah()
    {
        $barang = Barang::select(
                'id',
                'nama_barang',
                'kategori',
                'stok',
                'stok_minimum',
                'harga'
            )
            ->whereColumn('stok', '<=', 'stok_minimum') // stok <= stok_minimum
            ->orderBy('stok', 'asc')                    // yang paling sedikit tampil dulu
            ->get();

        $barang->transform(function ($item) {
            $item->kekurangan = $item->stok_minimum - $item->stok; // berapa unit yang kurang
            $item->status_stok = 'rendah';
            return $item;
        });

        return response()->json([
            'success' => true,
            'message' => 'Data barang dengan stok rendah berhasil diambil.',
            'total'   => $barang->count(),
            'data'    => $barang,
        ], 200);
    }

    // GET /api/notifikasi - Untuk badge navbar
    public function notifikasi()
    {
        // Hitung jumlah barang yang stoknya rendah
        $jumlahStokRendah = Barang::whereColumn('stok', '<=', 'stok_minimum')->count();

        // Ambil 5 barang stok rendah teratas untuk preview di navbar
        $preview = Barang::select('id', 'nama_barang', 'stok', 'stok_minimum')
            ->whereColumn('stok', '<=', 'stok_minimum')
            ->orderBy('stok', 'asc')
            ->limit(5)
            ->get();

        return response()->json([
            'success'           => true,
            'message'           => 'Data notifikasi berhasil diambil.',
            'total_stok_rendah' => $jumlahStokRendah,
            'ada_notifikasi'    => $jumlahStokRendah > 0,
            'preview'           => $preview,
        ], 200);
    }
}