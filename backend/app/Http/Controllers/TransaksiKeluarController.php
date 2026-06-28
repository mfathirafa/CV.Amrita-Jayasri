<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\TransaksiKeluar;
use App\Models\Barang;
use App\Models\Konsumen;
use App\Helpers\Sanitizer;

class TransaksiKeluarController extends Controller
{
    // GET /api/transaksi-keluar
    public function index(Request $request)
    {
        $query = TransaksiKeluar::with([
            'barang:id,nama_barang,satuan',
            'user:id,name',
            'konsumen:id,nama_konsumen'
        ]);

        if ($request->has('start_date') && $request->start_date != '') {
            $query->where('tanggal_keluar', '>=', $request->start_date);
        }

        if ($request->has('end_date') && $request->end_date != '') {
            $query->where('tanggal_keluar', '<=', $request->end_date);
        }

        if ($request->has('barang_id') && $request->barang_id != '') {
            $query->where('barang_id', (int) $request->barang_id);
        }

        if ($request->has('konsumen_id') && $request->konsumen_id != '') {
            $query->where('konsumen_id', (int) $request->konsumen_id);
        }

        $perPage   = min((int) $request->get('per_page', 10), 100);
        $transaksi = $query->orderBy('tanggal_keluar', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Data transaksi keluar berhasil diambil.',
            'data'    => $transaksi->items(),
            'meta'    => [
                'current_page' => $transaksi->currentPage(),
                'per_page'     => $transaksi->perPage(),
                'total'        => $transaksi->total(),
                'last_page'    => $transaksi->lastPage(),
            ],
        ], 200);
    }

    // POST /api/transaksi-keluar
    public function store(Request $request)
    {
        $request->validate([
            'barang_id'        => 'required|integer|exists:barang,id',
            'konsumen_id'      => 'nullable|integer|exists:konsumen,id',
            'nama_konsumen'    => 'nullable|string|max:200',  // ← baru: input manual
            'alamat_konsumen'  => 'nullable|string|max:500',  // ← baru: opsional
            'telepon_konsumen' => 'nullable|string|max:20',   // ← baru: opsional
            'nama_instansi'    => 'nullable|string|max:200',
            'jumlah'           => 'required|numeric|min:0.01|max:999999',
            'harga_jual'       => 'required|numeric|min:0|max:999999999',
            'tanggal_keluar'   => 'required|date|before_or_equal:today',
            'keterangan'       => 'nullable|string|max:500',
        ]);

        // =============================================
        // LOGIKA KONSUMEN — pilih existing atau buat baru
        // =============================================
        $konsumenId = $request->konsumen_id;

        if (!$konsumenId && $request->nama_konsumen) {
            // Cek apakah konsumen dengan nama ini sudah ada
            $konsumen = Konsumen::whereRaw(
                'LOWER(nama_konsumen) = ?',
                [strtolower(Sanitizer::clean($request->nama_konsumen))]
            )->first();

            if ($konsumen) {
                // Pakai konsumen yang sudah ada
                $konsumenId = $konsumen->id;
            } else {
                // Buat konsumen baru otomatis
                $konsumen   = Konsumen::create([
                    'nama_konsumen' => Sanitizer::clean($request->nama_konsumen),
                    'alamat'        => Sanitizer::cleanNullable($request->alamat_konsumen),
                    'no_telepon'    => Sanitizer::cleanNullable($request->telepon_konsumen),
                ]);
                $konsumenId = $konsumen->id;
            }
        }

        // Validasi stok mencukupi
        $barang = Barang::find($request->barang_id);

        if ($barang->stok < $request->jumlah) {
            return response()->json([
                'success' => false,
                'message' => 'Stok tidak mencukupi. Stok tersedia: ' . $barang->stok . ' unit, yang diminta: ' . $request->jumlah . ' unit.',
            ], 422);
        }

        DB::beginTransaction();

        try {
            $transaksi = TransaksiKeluar::create([
                'barang_id'      => $request->barang_id,
                'user_id'        => $request->user()->id,
                'konsumen_id'    => $konsumenId,
                'nama_instansi'  => Sanitizer::cleanNullable($request->nama_instansi ?? $request->nama_konsumen),
                'jumlah'         => $request->jumlah,
                'harga_jual'     => $request->harga_jual,
                'tanggal_keluar' => $request->tanggal_keluar,
                'keterangan'     => Sanitizer::cleanNullable($request->keterangan),
            ]);

            // Otomatis kurangi stok barang
            $barang->stok -= $request->jumlah;
            $barang->save();

            DB::commit();

            // Hapus cache
            \Illuminate\Support\Facades\Cache::forget('dashboard_data');
            \Illuminate\Support\Facades\Cache::forget('stok_rendah');
            \Illuminate\Support\Facades\Cache::forget('notifikasi_stok');

            $transaksi->load(['barang:id,nama_barang,satuan', 'user:id,name', 'konsumen:id,nama_konsumen']);

            return response()->json([
                'success' => true,
                'message' => 'Transaksi barang keluar berhasil dicatat. Stok berkurang ' . $request->jumlah . ' unit. Sisa stok: ' . $barang->stok . ' unit.',
                'data'    => $transaksi,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan transaksi.',
            ], 500);
        }
    }

    // GET /api/transaksi-keluar/{id}
    public function show($id)
    {
        $transaksi = TransaksiKeluar::with([
            'barang:id,nama_barang,satuan',
            'user:id,name',
            'konsumen:id,nama_konsumen'
        ])->find($id);

        if (!$transaksi) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail transaksi keluar berhasil diambil.',
            'data'    => $transaksi,
        ], 200);
    }
}