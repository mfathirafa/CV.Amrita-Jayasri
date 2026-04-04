<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\TransaksiMasuk;
use App\Models\Barang;
use App\Models\Supplier;

class TransaksiMasukController extends Controller
{
    // GET /api/transaksi-masuk - List semua transaksi masuk
    public function index(Request $request)
    {
        $query = TransaksiMasuk::with(['barang', 'supplier', 'user']);

        // Filter berdasarkan tanggal
        if ($request->has('start_date') && $request->start_date != '') {
            $query->where('tanggal_masuk', '>=', $request->start_date);
        }

        if ($request->has('end_date') && $request->end_date != '') {
            $query->where('tanggal_masuk', '<=', $request->end_date);
        }

        // Filter berdasarkan barang
        if ($request->has('barang_id') && $request->barang_id != '') {
            $query->where('barang_id', $request->barang_id);
        }

        $transaksi = $query->orderBy('tanggal_masuk', 'desc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Data transaksi masuk berhasil diambil.',
            'data'    => $transaksi,
        ], 200);
    }

    // POST /api/transaksi-masuk - Catat transaksi masuk
    public function store(Request $request)
    {
        $request->validate([
            'barang_id'      => 'required|exists:barang,id',
            'supplier_id'    => 'required|exists:supplier,id',
            'jumlah'         => 'required|integer|min:1',
            'harga_beli'     => 'required|numeric|min:0',
            'tanggal_masuk'  => 'required|date',
            'keterangan'     => 'nullable|string',
        ]);

        // Gunakan DB Transaction supaya data konsisten
        // Artinya: kalau salah satu langkah gagal, semua dibatalkan
        DB::beginTransaction();

        try {
            // 1. Simpan transaksi masuk
            $transaksi = TransaksiMasuk::create([
                'barang_id'     => $request->barang_id,
                'supplier_id'   => $request->supplier_id,
                'user_id'       => $request->user()->id, // ambil dari token login
                'jumlah'        => $request->jumlah,
                'harga_beli'    => $request->harga_beli,
                'tanggal_masuk' => $request->tanggal_masuk,
                'keterangan'    => $request->keterangan,
            ]);

            // 2. Otomatis tambah stok barang
            $barang = Barang::find($request->barang_id);
            $barang->stok += $request->jumlah;
            $barang->save();

            DB::commit(); // Simpan semua perubahan

            // Load relasi untuk response
            $transaksi->load(['barang', 'supplier', 'user']);

            return response()->json([
                'success' => true,
                'message' => 'Transaksi barang masuk berhasil dicatat. Stok bertambah ' . $request->jumlah . ' unit.',
                'data'    => $transaksi,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack(); // Batalkan semua perubahan jika ada error

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    // GET /api/transaksi-masuk/{id} - Detail transaksi masuk
    public function show($id)
    {
        $transaksi = TransaksiMasuk::with(['barang', 'supplier', 'user'])->find($id);

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