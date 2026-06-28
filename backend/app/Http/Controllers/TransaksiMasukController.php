<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\TransaksiMasuk;
use App\Models\Barang;
use App\Models\Supplier;
use App\Helpers\Sanitizer;

class TransaksiMasukController extends Controller
{
    // GET /api/transaksi-masuk
    public function index(Request $request)
    {
        $query = TransaksiMasuk::with([
            'barang:id,nama_barang,satuan',
            'supplier:id,nama_supplier',
            'user:id,name'
        ]);

        if ($request->has('start_date') && $request->start_date != '') {
            $query->where('tanggal_masuk', '>=', $request->start_date);
        }

        if ($request->has('end_date') && $request->end_date != '') {
            $query->where('tanggal_masuk', '<=', $request->end_date);
        }

        if ($request->has('barang_id') && $request->barang_id != '') {
            $query->where('barang_id', (int) $request->barang_id);
        }

        if ($request->has('supplier_id') && $request->supplier_id != '') {
            $query->where('supplier_id', (int) $request->supplier_id);
        }

        $perPage   = min((int) $request->get('per_page', 10), 100);
        $transaksi = $query->orderBy('tanggal_masuk', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Data transaksi masuk berhasil diambil.',
            'data'    => $transaksi->items(),
            'meta'    => [
                'current_page' => $transaksi->currentPage(),
                'per_page'     => $transaksi->perPage(),
                'total'        => $transaksi->total(),
                'last_page'    => $transaksi->lastPage(),
            ],
        ], 200);
    }

    // POST /api/transaksi-masuk
    public function store(Request $request)
    {
        $request->validate([
            'barang_id'      => 'required|integer|exists:barang,id',
            'supplier_id'    => 'nullable|integer|exists:supplier,id',
            'nama_supplier'  => 'nullable|string|max:200',  // ← baru: input manual
            'alamat_supplier'=> 'nullable|string|max:500',  // ← baru: opsional
            'telepon_supplier'=> 'nullable|string|max:20',  // ← baru: opsional
            'jumlah'         => 'required|numeric|min:0.01|max:999999',
            'harga_beli'     => 'required|numeric|min:0|max:999999999',
            'tanggal_masuk'  => 'required|date|before_or_equal:today',
            'keterangan'     => 'nullable|string|max:500',
        ]);

        // =============================================
        // LOGIKA SUPPLIER — pilih existing atau buat baru
        // =============================================
        $supplierId = $request->supplier_id;

        if (!$supplierId && $request->nama_supplier) {
            // Cek apakah supplier dengan nama ini sudah ada
            $supplier = Supplier::whereRaw(
                'LOWER(nama_supplier) = ?',
                [strtolower(Sanitizer::clean($request->nama_supplier))]
            )->first();

            if ($supplier) {
                // Pakai supplier yang sudah ada
                $supplierId = $supplier->id;
            } else {
                // Buat supplier baru otomatis
                $supplier   = Supplier::create([
                    'nama_supplier' => Sanitizer::clean($request->nama_supplier),
                    'alamat'        => Sanitizer::cleanNullable($request->alamat_supplier),
                    'no_telepon'    => Sanitizer::cleanNullable($request->telepon_supplier),
                ]);
                $supplierId = $supplier->id;
            }
        }

        // Wajib ada supplier (dari ID atau nama)
        if (!$supplierId) {
            return response()->json([
                'success' => false,
                'message' => 'Supplier harus diisi. Pilih supplier yang ada atau ketik nama supplier baru.',
            ], 422);
        }

        DB::beginTransaction();

        try {
            $transaksi = TransaksiMasuk::create([
                'barang_id'     => $request->barang_id,
                'supplier_id'   => $supplierId,
                'user_id'       => $request->user()->id,
                'jumlah'        => $request->jumlah,
                'harga_beli'    => $request->harga_beli,
                'tanggal_masuk' => $request->tanggal_masuk,
                'keterangan'    => Sanitizer::cleanNullable($request->keterangan),
            ]);

            // Otomatis tambah stok barang
            $barang = Barang::find($request->barang_id);
            $barang->stok += $request->jumlah;
            $barang->save();

            DB::commit();

            // Hapus cache
            \Illuminate\Support\Facades\Cache::forget('dashboard_data');
            \Illuminate\Support\Facades\Cache::forget('stok_rendah');
            \Illuminate\Support\Facades\Cache::forget('notifikasi_stok');

            $transaksi->load(['barang:id,nama_barang,satuan', 'supplier:id,nama_supplier', 'user:id,name']);

            return response()->json([
                'success' => true,
                'message' => 'Transaksi barang masuk berhasil dicatat. Stok bertambah ' . $request->jumlah . ' unit.',
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

    // GET /api/transaksi-masuk/{id}
    public function show($id)
    {
        $transaksi = TransaksiMasuk::with([
            'barang:id,nama_barang,satuan',
            'supplier:id,nama_supplier',
            'user:id,name'
        ])->find($id);

        if (!$transaksi) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail transaksi masuk berhasil diambil.',
            'data'    => $transaksi,
        ], 200);
    }
}