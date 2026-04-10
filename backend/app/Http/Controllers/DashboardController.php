<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Barang;
use App\Models\Supplier;
use App\Models\Konsumen;
use App\Models\TransaksiMasuk;
use App\Models\TransaksiKeluar;
use Carbon\Carbon;

class DashboardController extends Controller
{
    // GET /api/dashboard - Ringkasan statistik sistem
    public function index()
    {
        // ========================
        // STATISTIK UTAMA
        // ========================
        $totalBarang = Barang::count();

        $totalSupplier = Supplier::count();

        $totalKonsumen = Konsumen::count();

        $totalTransaksiMasuk = TransaksiMasuk::count();

        $totalTransaksiKeluar = TransaksiKeluar::count();

        // Total nilai stok (harga x stok semua barang)
        $totalNilaiStok = Barang::selectRaw('SUM(harga * stok) as total')
            ->value('total') ?? 0;

        // ========================
        // TRANSAKSI BULAN INI
        // ========================
        $bulanIni = now()->format('Y-m');

        $transaksiMasukBulanIni = TransaksiMasuk::where(
            \DB::raw('DATE_FORMAT(tanggal_masuk, "%Y-%m")'),
            $bulanIni
        )->count();

        $transaksiKeluarBulanIni = TransaksiKeluar::where(
            \DB::raw('DATE_FORMAT(tanggal_keluar, "%Y-%m")'),
            $bulanIni
        )->count();

        // ========================
        // GRAFIK 7 HARI TERAKHIR
        // ========================
        $grafik = [];
        for ($i = 6; $i >= 0; $i--) {
            $tanggal = Carbon::today()->subDays($i);
            $label   = $tanggal->locale('id')->dayName; // Sen, Sel, Rab, dll

            $masuk = TransaksiMasuk::whereDate('tanggal_masuk', $tanggal)
                ->sum('jumlah');

            $keluar = TransaksiKeluar::whereDate('tanggal_keluar', $tanggal)
                ->sum('jumlah');

            $grafik[] = [
                'label'  => substr($label, 0, 3), // 3 huruf pertama
                'tanggal'=> $tanggal->format('Y-m-d'),
                'masuk'  => (int) $masuk,
                'keluar' => (int) $keluar,
            ];
        }

        // ========================
        // STOK KRITIS (rendah)
        // ========================
        $stokKritis = Barang::select('id', 'nama_barang', 'kategori', 'stok', 'stok_minimum', 'satuan')
            ->whereColumn('stok', '<=', 'stok_minimum')
            ->orderBy('stok', 'asc')
            ->limit(10)
            ->get()
            ->transform(function ($item) {
                $item->kekurangan  = $item->stok_minimum - $item->stok;
                $item->status_stok = 'rendah';
                return $item;
            });

        // ========================
        // TRANSAKSI TERBARU
        // ========================
        $transaksiMasukTerbaru = TransaksiMasuk::with(['barang', 'supplier'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $transaksiKeluarTerbaru = TransaksiKeluar::with(['barang', 'konsumen'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Data dashboard berhasil diambil.',
            'data'    => [
                // Statistik utama
                'statistik' => [
                    'total_barang'           => $totalBarang,
                    'total_supplier'         => $totalSupplier,
                    'total_konsumen'         => $totalKonsumen,
                    'total_transaksi_masuk'  => $totalTransaksiMasuk,
                    'total_transaksi_keluar' => $totalTransaksiKeluar,
                    'total_nilai_stok'       => (float) $totalNilaiStok,
                    'total_stok_kritis'      => $stokKritis->count(),
                ],

                // Transaksi bulan ini
                'bulan_ini' => [
                    'transaksi_masuk'  => $transaksiMasukBulanIni,
                    'transaksi_keluar' => $transaksiKeluarBulanIni,
                ],
                
                // Grafik 7 hari terakhir
                'grafik_7_hari' => $grafik,

                // Daftar stok kritis
                'stok_kritis' => $stokKritis,

                // Transaksi terbaru
                'transaksi_masuk_terbaru'  => $transaksiMasukTerbaru,
                'transaksi_keluar_terbaru' => $transaksiKeluarTerbaru,
            ],
        ], 200);
    }
}