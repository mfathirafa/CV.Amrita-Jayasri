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

        $perPage = min((int) $request->get('per_page', 50), 500);

        $query = TransaksiMasuk::with(['barang', 'supplier', 'user'])
            ->whereBetween('tanggal_masuk', [$request->start_date, $request->end_date])
            ->orderBy('tanggal_masuk', 'asc');

        // Ringkasan dihitung dari semua data (tanpa pagination)
        $all         = (clone $query)->get();
        $totalJumlah = $all->sum('jumlah');
        $totalNilai  = $all->sum(fn($i) => $i->jumlah * $i->harga_beli);
        $totalCount  = $all->count();

        $paginated = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Laporan transaksi masuk berhasil diambil.',
            'periode' => [
                'start_date' => $request->start_date,
                'end_date'   => $request->end_date,
            ],
            'ringkasan' => [
                'total_transaksi'     => $totalCount,
                'total_jumlah_barang' => $totalJumlah,
                'total_nilai'         => $totalNilai,
            ],
            'data' => $paginated->items(),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'per_page'     => $paginated->perPage(),
                'total'        => $paginated->total(),
                'last_page'    => $paginated->lastPage(),
            ],
        ], 200);
    }

    // GET /api/laporan/transaksi-keluar
    public function transaksiKeluar(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        $perPage = min((int) $request->get('per_page', 50), 500);

        $query = TransaksiKeluar::with(['barang', 'user', 'konsumen'])
            ->whereBetween('tanggal_keluar', [$request->start_date, $request->end_date]);

        if ($request->has('konsumen_id') && $request->konsumen_id != '') {
            $query->where('konsumen_id', $request->konsumen_id);
        }

        $query->orderBy('tanggal_keluar', 'asc');

        $all         = (clone $query)->get();
        $totalJumlah = $all->sum('jumlah');
        $totalNilai  = $all->sum(fn($i) => $i->jumlah * $i->harga_jual);
        $totalCount  = $all->count();

        $paginated = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Laporan transaksi keluar berhasil diambil.',
            'periode' => [
                'start_date' => $request->start_date,
                'end_date'   => $request->end_date,
            ],
            'ringkasan' => [
                'total_transaksi'     => $totalCount,
                'total_jumlah_barang' => $totalJumlah,
                'total_nilai'         => $totalNilai,
            ],
            'data' => $paginated->items(),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'per_page'     => $paginated->perPage(),
                'total'        => $paginated->total(),
                'last_page'    => $paginated->lastPage(),
            ],
        ], 200);
    }

    // GET /api/laporan/stok
    public function stok(Request $request)
    {
        $perPage = min((int) $request->get('per_page', 50), 500);

        $query = Barang::select(
            'id', 'id_referensi', 'nama_barang',
            'kategori', 'harga', 'stok', 'stok_minimum', 'satuan'
        );

        if ($request->has('kategori') && $request->kategori != '') {
            $query->where('kategori', $request->kategori);
        }

        $query->orderBy('kategori')->orderBy('nama_barang');

        // Ringkasan dari semua data
        $all = (clone $query)->get()->transform(function ($item) {
            $item->status_stok = $item->stok <= $item->stok_minimum ? 'rendah' : 'aman';
            $item->nilai_stok  = $item->stok * $item->harga;
            return $item;
        });

        $totalNilaiStok  = $all->sum('nilai_stok');
        $totalStokRendah = $all->where('status_stok', 'rendah')->count();
        $daftarKategori  = Barang::distinct()->orderBy('kategori')->pluck('kategori');

        // Paginated data
        $paginated = $query->paginate($perPage);
        $items = collect($paginated->items())->transform(function ($item) {
            $item->status_stok = $item->stok <= $item->stok_minimum ? 'rendah' : 'aman';
            $item->nilai_stok  = $item->stok * $item->harga;
            return $item;
        });

        return response()->json([
            'success' => true,
            'message' => 'Laporan stok berhasil diambil.',
            'ringkasan' => [
                'total_jenis_barang' => $all->count(),
                'total_nilai_stok'   => $totalNilaiStok,
                'total_stok_rendah'  => $totalStokRendah,
                'total_stok_aman'    => $all->count() - $totalStokRendah,
            ],
            'daftar_kategori' => $daftarKategori,
            'data'            => $items,
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'per_page'     => $paginated->perPage(),
                'total'        => $paginated->total(),
                'last_page'    => $paginated->lastPage(),
            ],
        ], 200);
    }
}