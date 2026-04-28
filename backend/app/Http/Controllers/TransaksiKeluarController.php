<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\TransaksiKeluar;
use App\Models\Barang;
use App\Helpers\Sanitizer;

class TransaksiKeluarController extends Controller
{
    // GET /api/transaksi-keluar - List semua transaksi keluar
    public function index(Request $request)
    {
        $query = TransaksiKeluar::with(['barang', 'user']);

        // Filter berdasarkan tanggal
        if ($request->has('start_date') && $request->start_date != '') {
            $query->where('tanggal_keluar', '>=', $request->start_date);
        }

        if ($request->has('end_date') && $request->end_date != '') {
            $query->where('tanggal_keluar', '<=', $request->end_date);
        }

        // Filter berdasarkan barang
        if ($request->has('barang_id') && $request->barang_id != '') {
            $query->where('barang_id', $request->barang_id);
        }

         if ($request->has('konsumen_id') && $request->konsumen_id != '') {
            $query->where('konsumen_id', $request->konsumen_id);
        }

        $transaksi = $query->orderBy('tanggal_keluar', 'desc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Data transaksi keluar berhasil diambil.',
            'data'    => $transaksi,
        ], 200);
    }

    // POST /api/transaksi-keluar - Catat transaksi keluar
    public function store(Request $request)
    {
        $request->validate([
            'barang_id'      => 'required|exists:barang,id',
            'konsumen_id'    => 'required|exists:konsumen,id',
            'nama_instansi'  => 'required|string|max:200',
            'jumlah'         => 'required|integer|min:1',
            'harga_jual'     => 'required|numeric|min:0',
            'tanggal_keluar' => 'required|date',
            'keterangan'     => 'nullable|string',
        ]);

        // ============================================
        // VALIDASI STOK MENCUKUPI (sesuai SRS FR-013)
        // ============================================
        $barang = Barang::find($request->barang_id);

        if ($barang->stok < $request->jumlah) {
            return response()->json([
                'success' => false,
                'message' => 'Stok tidak mencukupi. Stok tersedia: ' . $barang->stok . ' unit, yang diminta: ' . $request->jumlah . ' unit.',
            ], 422);
        }

        // Gunakan DB Transaction supaya data konsisten
        DB::beginTransaction();

        try {
            // 1. Simpan transaksi keluar
            $transaksi = TransaksiKeluar::create([
                'barang_id'      => $request->barang_id,
                'user_id'        => $request->user()->id,
                'konsumen_id'    => $request->konsumen_id,
                'nama_instansi'  => Sanitizer::cleanNullable($request->nama_instansi),
                'jumlah'         => $request->jumlah,
                'harga_jual'     => $request->harga_jual,
                'tanggal_keluar' => $request->tanggal_keluar,
                'keterangan'     => Sanitizer::cleanNullable($request->keterangan),
            ]);

            // 2. Otomatis kurangi stok barang
            $barang->stok -= $request->jumlah;
            $barang->save();

            DB::commit();

            // Load relasi untuk response
            $transaksi->load(['barang', 'user', 'konsumen']);

            return response()->json([
                'success' => true,
                'message' => 'Transaksi barang keluar berhasil dicatat. Stok berkurang ' . $request->jumlah . ' unit. Sisa stok: ' . $barang->stok . ' unit.',
                'data'    => $transaksi,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    // GET /api/transaksi-keluar/{id} - Detail transaksi keluar
    public function show($id)
    {
        $transaksi = TransaksiKeluar::with(['barang', 'user', 'konsumen'])->find($id);

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