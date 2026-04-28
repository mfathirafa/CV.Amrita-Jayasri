<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Models\Barang;
use App\Helpers\Sanitizer;

class StokController extends Controller
{
    // GET /api/stok
    public function index(Request $request)
    {
        $query = Barang::select(
            'id', 'id_referensi', 'nama_barang',
            'kategori', 'stok', 'stok_minimum', 'harga', 'satuan'
        );

        if ($request->has('kategori') && $request->kategori != '') {
            $query->where('kategori', Sanitizer::clean($request->kategori));
        }

        if ($request->has('search') && $request->search != '') {
            $query->where('nama_barang', 'like', '%' . Sanitizer::clean($request->search) . '%');
        }

        $perPage = min((int) $request->get('per_page', 10), 100);
        $barang  = $query->orderBy('nama_barang', 'asc')->paginate($perPage);

        $items = collect($barang->items())->transform(function ($item) {
            $item->status_stok = $item->stok <= $item->stok_minimum ? 'rendah' : 'aman';
            return $item;
        });

        return response()->json([
            'success' => true,
            'message' => 'Data stok barang berhasil diambil.',
            'data'    => $items,
            'meta'    => [
                'current_page' => $barang->currentPage(),
                'per_page'     => $barang->perPage(),
                'total'        => $barang->total(),
                'last_page'    => $barang->lastPage(),
            ],
        ], 200);
    }

    // GET /api/stok/rendah
    public function stokRendah()
    {
        // Cache 5 menit
        $barang = Cache::remember('stok_rendah', 300, function () {
            return Barang::select('id', 'id_referensi', 'nama_barang', 'kategori', 'stok', 'stok_minimum', 'satuan', 'harga')
                ->whereColumn('stok', '<=', 'stok_minimum')
                ->orderBy('stok', 'asc')
                ->get()
                ->transform(function ($item) {
                    $item->kekurangan  = $item->stok_minimum - $item->stok;
                    $item->status_stok = 'rendah';
                    return $item;
                });
        });

        return response()->json([
            'success' => true,
            'message' => 'Data barang dengan stok rendah berhasil diambil.',
            'total'   => $barang->count(),
            'data'    => $barang,
        ], 200);
    }

    // GET /api/notifikasi
    public function notifikasi()
    {
        // Cache 3 menit
        $result = Cache::remember('notifikasi_stok', 180, function () {
            $jumlahStokRendah = Barang::whereColumn('stok', '<=', 'stok_minimum')->count();

            $preview = Barang::select('id', 'nama_barang', 'stok', 'stok_minimum', 'satuan')
                ->whereColumn('stok', '<=', 'stok_minimum')
                ->orderBy('stok', 'asc')
                ->limit(5)
                ->get();

            return [
                'total_stok_rendah' => $jumlahStokRendah,
                'ada_notifikasi'    => $jumlahStokRendah > 0,
                'preview'           => $preview,
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Data notifikasi berhasil diambil.',
            ...$result,
        ], 200);
    }
}