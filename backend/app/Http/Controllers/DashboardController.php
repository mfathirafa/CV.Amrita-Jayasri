<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use App\Models\Barang;
use App\Models\Supplier;
use App\Models\Konsumen;
use App\Models\TransaksiMasuk;
use App\Models\TransaksiKeluar;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Cache dashboard selama 5 menit
        $data = Cache::remember('dashboard_data', 300, function () {

            // Statistik utama
            $totalBarang          = Barang::count();
            $totalSupplier        = Supplier::count();
            $totalKonsumen        = Konsumen::count();
            $totalTransaksiMasuk  = TransaksiMasuk::count();
            $totalTransaksiKeluar = TransaksiKeluar::count();
            $totalNilaiStok       = Barang::selectRaw('SUM(harga * stok) as total')->value('total') ?? 0;

            // Transaksi bulan ini
            $bulanIni = now()->format('Y-m');

            $transaksiMasukBulanIni = TransaksiMasuk::where(
                DB::raw('DATE_FORMAT(tanggal_masuk, "%Y-%m")'), $bulanIni
            )->count();

            $transaksiKeluarBulanIni = TransaksiKeluar::where(
                DB::raw('DATE_FORMAT(tanggal_keluar, "%Y-%m")'), $bulanIni
            )->count();

            // Grafik 7 hari terakhir
            $grafik = [];
            for ($i = 6; $i >= 0; $i--) {
                $tanggal = Carbon::today()->subDays($i);
                $label   = $tanggal->locale('id')->dayName;

                $masuk  = TransaksiMasuk::whereDate('tanggal_masuk', $tanggal)->sum('jumlah');
                $keluar = TransaksiKeluar::whereDate('tanggal_keluar', $tanggal)->sum('jumlah');

                $grafik[] = [
                    'label'   => substr($label, 0, 3),
                    'tanggal' => $tanggal->format('Y-m-d'),
                    'masuk'   => (int) $masuk,
                    'keluar'  => (int) $keluar,
                ];
            }

            // Stok kritis
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

            // Transaksi terbaru
            $transaksiMasukTerbaru = TransaksiMasuk::with([
                'barang:id,nama_barang,satuan',
                'supplier:id,nama_supplier',
            ])->orderBy('created_at', 'desc')->limit(5)->get();

            $transaksiKeluarTerbaru = TransaksiKeluar::with([
                'barang:id,nama_barang,satuan',
                'konsumen:id,nama_konsumen',
            ])->orderBy('created_at', 'desc')->limit(5)->get();

            return [
                'statistik' => [
                    'total_barang'            => $totalBarang,
                    'total_supplier'          => $totalSupplier,
                    'total_konsumen'          => $totalKonsumen,
                    'total_transaksi_masuk'   => $totalTransaksiMasuk,
                    'total_transaksi_keluar'  => $totalTransaksiKeluar,
                    'total_nilai_stok'        => (float) $totalNilaiStok,
                    'total_stok_kritis'       => $stokKritis->count(),
                ],
                'bulan_ini' => [
                    'transaksi_masuk'  => $transaksiMasukBulanIni,
                    'transaksi_keluar' => $transaksiKeluarBulanIni,
                ],
                'grafik_7_hari'            => $grafik,
                'stok_kritis'              => $stokKritis,
                'transaksi_masuk_terbaru'  => $transaksiMasukTerbaru,
                'transaksi_keluar_terbaru' => $transaksiKeluarTerbaru,
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Data dashboard berhasil diambil.',
            'data'    => $data,
        ], 200);
    }
}