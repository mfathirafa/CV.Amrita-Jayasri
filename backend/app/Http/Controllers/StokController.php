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
            'id',
            'id_referensi',
            'nama_barang',
            'kategori',
            'stok',
            'stok_minimum', // tetap diambil untuk logika status, tapi tidak ditampilkan
            'harga',
            'satuan'
        );

        if ($request->has('kategori') && $request->kategori != '') {
            $query->where('kategori', Sanitizer::clean($request->kategori));
        }

        if ($request->has('search') && $request->search != '') {
            $query->where('nama_barang', 'like', '%' . Sanitizer::clean($request->search) . '%');
        }

        $perPage = min((int) $request->get("per_page", 10), 1000);
        $barang  = $query->orderBy('nama_barang', 'asc')->paginate($perPage);

        // Hitung total nilai inventaris semua barang (tidak terpengaruh pagination)
        $totalNilaiInventaris = Barang::selectRaw('SUM(harga * stok) as total')->value('total') ?? 0;
        $totalJenisBarang     = Barang::count();
        $totalUnitBarang      = Barang::sum('stok');

        $items = collect($barang->items())->transform(function ($item) {
            $hargaTotal = $item->harga * $item->stok;
            $statusStok = $item->stok <= $item->stok_minimum ? 'rendah' : 'aman';

            return [
                'id'           => $item->id,
                'id_referensi' => $item->id_referensi,
                'nama_barang'  => $item->nama_barang,
                'kategori'     => $item->kategori,
                'stok'         => $item->stok,
                'satuan'       => $item->satuan,
                'harga_satuan' => (float) $item->harga,
                'harga_total'  => (float) $hargaTotal,
                'status_stok'  => $statusStok,
                // tren & stok_minimum tidak ditampilkan
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Data stok barang berhasil diambil.',
            'ringkasan' => [
                'total_jenis_barang'   => $totalJenisBarang,
                'total_unit_barang'    => (int) $totalUnitBarang,
                'total_nilai_inventaris' => (float) $totalNilaiInventaris,
            ],
            'data' => $items,
            'meta' => [
                'current_page' => $barang->currentPage(),
                'per_page'     => $barang->perPage(),
                'total'        => $barang->total(),
                'last_page'    => $barang->lastPage(),
                'from'         => $barang->firstItem(),
                'to'           => $barang->lastItem(),
            ],
        ], 200);
    }

    // GET /api/stok/rendah
    public function stokRendah()
    {
        $barang = Cache::remember('stok_rendah', 300, function () {
            return Barang::select(
                    'id',
                    'id_referensi',
                    'nama_barang',
                    'kategori',
                    'stok',
                    'stok_minimum',
                    'harga',
                    'satuan'
                )
                ->whereColumn('stok', '<=', 'stok_minimum')
                ->orderBy('stok', 'asc')
                ->get()
                ->transform(function ($item) {
                    return [
                        'id'           => $item->id,
                        'id_referensi' => $item->id_referensi,
                        'nama_barang'  => $item->nama_barang,
                        'kategori'     => $item->kategori,
                        'stok'         => $item->stok,
                        'stok_minimum' => $item->stok_minimum,
                        'satuan'       => $item->satuan,
                        'harga_satuan' => (float) $item->harga,
                        'harga_total'  => (float) ($item->harga * $item->stok),
                        'kekurangan'   => $item->stok_minimum - $item->stok,
                        'status_stok'  => 'rendah',
                    ];
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