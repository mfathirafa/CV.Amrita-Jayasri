<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TransaksiMasuk;
use App\Models\TransaksiKeluar;
use App\Models\Barang;

class LaporanController extends Controller
{
    // GET /api/laporan/transaksi-masuk
    public function transaksiMasuk(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        $transaksi = TransaksiMasuk::with(['barang', 'supplier', 'user'])
            ->whereBetween('tanggal_masuk', [$request->start_date, $request->end_date])
            ->orderBy('tanggal_masuk', 'asc')
            ->get();

        $totalJumlah = $transaksi->sum('jumlah');
        $totalNilai  = $transaksi->sum(fn($i) => $i->jumlah * $i->harga_beli);

        return response()->json([
            'success' => true,
            'message' => 'Laporan transaksi masuk berhasil diambil.',
            'periode' => [
                'start_date' => $request->start_date,
                'end_date'   => $request->end_date,
            ],
            'ringkasan' => [
                'total_transaksi'     => $transaksi->count(),
                'total_jumlah_barang' => $totalJumlah,
                'total_nilai'         => $totalNilai,
            ],
            'data' => $transaksi,
        ], 200);
    }

    // GET /api/laporan/transaksi-keluar
    public function transaksiKeluar(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        $query = TransaksiKeluar::with(['barang', 'user', 'konsumen'])
            ->whereBetween('tanggal_keluar', [$request->start_date, $request->end_date]);

        // Filter berdasarkan konsumen (opsional)
        if ($request->has('konsumen_id') && $request->konsumen_id != '') {
            $query->where('konsumen_id', $request->konsumen_id);
        }

        $transaksi   = $query->orderBy('tanggal_keluar', 'asc')->get();
        $totalJumlah = $transaksi->sum('jumlah');
        $totalNilai  = $transaksi->sum(fn($i) => $i->jumlah * $i->harga_jual);

        return response()->json([
            'success' => true,
            'message' => 'Laporan transaksi keluar berhasil diambil.',
            'periode' => [
                'start_date' => $request->start_date,
                'end_date'   => $request->end_date,
            ],
            'ringkasan' => [
                'total_transaksi'     => $transaksi->count(),
                'total_jumlah_barang' => $totalJumlah,
                'total_nilai'         => $totalNilai,
            ],
            'data' => $transaksi,
        ], 200);
    }

    // GET /api/laporan/stok
    public function stok(Request $request)
    {
        $query = Barang::select(
            'id', 'id_referensi', 'nama_barang',
            'kategori', 'harga', 'stok', 'stok_minimum', 'satuan'
        );

        if ($request->has('kategori') && $request->kategori != '') {
            $query->where('kategori', $request->kategori);
        }

        $barang = $query->orderBy('kategori')->orderBy('nama_barang')->get();

        $barang->transform(function ($item) {
            $item->status_stok = $item->stok <= $item->stok_minimum ? 'rendah' : 'aman';
            $item->nilai_stok  = $item->stok * $item->harga;
            return $item;
        });

        $totalNilaiStok  = $barang->sum('nilai_stok');
        $totalStokRendah = $barang->where('status_stok', 'rendah')->count();
        $daftarKategori  = Barang::distinct()->pluck('kategori');

        return response()->json([
            'success' => true,
            'message' => 'Laporan stok berhasil diambil.',
            'ringkasan' => [
                'total_jenis_barang' => $barang->count(),
                'total_nilai_stok'   => $totalNilaiStok,
                'total_stok_rendah'  => $totalStokRendah,
                'total_stok_aman'    => $barang->count() - $totalStokRendah,
            ],
            'daftar_kategori' => $daftarKategori,
            'data'            => $barang,
        ], 200);
    }
}