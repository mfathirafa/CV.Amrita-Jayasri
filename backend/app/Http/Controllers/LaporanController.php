<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TransaksiMasuk;
use App\Models\TransaksiKeluar;
use App\Models\Barang;

class LaporanController extends Controller
{
    // GET /api/laporan/transaksi-masuk
    // Laporan barang masuk dengan filter tanggal
    public function transaksiMasuk(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        $transaksi = TransaksiMasuk::with(['barang', 'supplier', 'user'])
            ->whereBetween('tanggal_masuk', [
                $request->start_date,
                $request->end_date
            ])
            ->orderBy('tanggal_masuk', 'asc')
            ->get();

        // Hitung total keseluruhan
        $totalJumlahBarang = $transaksi->sum('jumlah');
        $totalNilai        = $transaksi->sum(function ($item) {
            return $item->jumlah * $item->harga_beli;
        });

        return response()->json([
            'success' => true,
            'message' => 'Laporan transaksi masuk berhasil diambil.',
            'periode' => [
                'start_date' => $request->start_date,
                'end_date'   => $request->end_date,
            ],
            'ringkasan' => [
                'total_transaksi'    => $transaksi->count(),
                'total_jumlah_barang'=> $totalJumlahBarang,
                'total_nilai'        => $totalNilai,
            ],
            'data' => $transaksi,
        ], 200);
    }

    // GET /api/laporan/transaksi-keluar
    // Laporan barang keluar dengan filter tanggal
    public function transaksiKeluar(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        $transaksi = TransaksiKeluar::with(['barang', 'user'])
            ->whereBetween('tanggal_keluar', [
                $request->start_date,
                $request->end_date
            ])
            ->orderBy('tanggal_keluar', 'asc')
            ->get();

        // Hitung total keseluruhan
        $totalJumlahBarang = $transaksi->sum('jumlah');
        $totalNilai        = $transaksi->sum(function ($item) {
            return $item->jumlah * $item->harga_jual;
        });

        return response()->json([
            'success' => true,
            'message' => 'Laporan transaksi keluar berhasil diambil.',
            'periode' => [
                'start_date' => $request->start_date,
                'end_date'   => $request->end_date,
            ],
            'ringkasan' => [
                'total_transaksi'     => $transaksi->count(),
                'total_jumlah_barang' => $totalJumlahBarang,
                'total_nilai'         => $totalNilai,
            ],
            'data' => $transaksi,
        ], 200);
    }

    // GET /api/laporan/stok
    // Laporan stok semua barang saat ini
    public function stok(Request $request)
    {
        $query = Barang::select(
            'id',
            'nama_barang',
            'kategori',
            'harga',
            'stok',
            'stok_minimum'
        );

        // Filter kategori
        if ($request->has('kategori') && $request->kategori != '') {
            $query->where('kategori', $request->kategori);
        }

        $barang = $query->orderBy('kategori')->orderBy('nama_barang')->get();

        // Tambahkan info status dan nilai stok
        $barang->transform(function ($item) {
            $item->status_stok  = $item->stok <= $item->stok_minimum ? 'rendah' : 'aman';
            $item->nilai_stok   = $item->stok * $item->harga;
            return $item;
        });

        // Hitung ringkasan
        $totalNilaiStok  = $barang->sum('nilai_stok');
        $totalStokRendah = $barang->where('status_stok', 'rendah')->count();

        // Ambil daftar kategori unik untuk filter frontend
        $daftarKategori = Barang::distinct()->pluck('kategori');

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