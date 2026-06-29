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
    public function index(Request $request)
    {
        // Tentukan rentang tanggal grafik
        $startDate = $request->has('start_date')
            ? Carbon::parse($request->start_date)->startOfDay()
            : Carbon::today()->subDays(6)->startOfDay();

        $endDate = $request->has('end_date')
            ? Carbon::parse($request->end_date)->endOfDay()
            : Carbon::today()->endOfDay();

        // Kalau filter custom, jangan cache (data spesifik per request)
        $isCustomRange = $request->has('start_date') || $request->has('end_date');
        $cacheKey      = 'dashboard_data';

        // Statistik utama (selalu dari cache 5 menit, tidak tergantung filter tanggal)
        $statistik = Cache::remember('dashboard_statistik', 300, function () {
            $totalNilaiStok = Barang::selectRaw('SUM(harga * stok) as total')->value('total') ?? 0;
            $bulanIni       = now()->format('Y-m');

            return [
                'total_barang'           => Barang::count(),
                'total_supplier'         => Supplier::count(),
                'total_konsumen'         => Konsumen::count(),
                'total_transaksi_masuk'  => TransaksiMasuk::count(),
                'total_transaksi_keluar' => TransaksiKeluar::count(),
                'total_nilai_stok'       => (float) $totalNilaiStok,
                'total_stok_kritis'      => Barang::whereColumn('stok', '<=', 'stok_minimum')->count(),
                'bulan_ini' => [
                    'transaksi_masuk'  => TransaksiMasuk::where(
                        DB::raw('DATE_FORMAT(tanggal_masuk, "%Y-%m")'), $bulanIni
                    )->count(),
                    'transaksi_keluar' => TransaksiKeluar::where(
                        DB::raw('DATE_FORMAT(tanggal_keluar, "%Y-%m")'), $bulanIni
                    )->count(),
                ],
            ];
        });

        // Grafik — dinamis sesuai rentang tanggal
        $grafik     = [];
        $diffInDays = $startDate->diffInDays($endDate);

        // Kalau rentang <= 31 hari → per hari, kalau > 31 hari → per bulan
        if ($diffInDays <= 31) {
            $current = $startDate->copy();
            while ($current->lte($endDate)) {
                $label  = $current->locale('id')->isoFormat('ddd DD/MM');
                $masuk  = TransaksiMasuk::whereDate('tanggal_masuk', $current)->sum('jumlah');
                $keluar = TransaksiKeluar::whereDate('tanggal_keluar', $current)->sum('jumlah');

                $grafik[] = [
                    'label'   => $label,
                    'tanggal' => $current->format('Y-m-d'),
                    'masuk'   => (float) $masuk,
                    'keluar'  => (float) $keluar,
                ];
                $current->addDay();
            }
        } else {
            // Per bulan
            $current = $startDate->copy()->startOfMonth();
            while ($current->lte($endDate)) {
                $endOfMonth = $current->copy()->endOfMonth();
                $label      = $current->locale('id')->isoFormat('MMM YYYY');

                $masuk  = TransaksiMasuk::whereBetween('tanggal_masuk', [
                    $current->format('Y-m-d'), $endOfMonth->format('Y-m-d')
                ])->sum('jumlah');

                $keluar = TransaksiKeluar::whereBetween('tanggal_keluar', [
                    $current->format('Y-m-d'), $endOfMonth->format('Y-m-d')
                ])->sum('jumlah');

                $grafik[] = [
                    'label'   => $label,
                    'tanggal' => $current->format('Y-m-d'),
                    'masuk'   => (float) $masuk,
                    'keluar'  => (float) $keluar,
                ];
                $current->addMonth();
            }
        }

        // Stok kritis (cache 5 menit)
        $stokKritis = Cache::remember('dashboard_stok_kritis', 300, function () {
            return Barang::select('id', 'nama_barang', 'kategori', 'stok', 'stok_minimum', 'satuan')
                ->whereColumn('stok', '<=', 'stok_minimum')
                ->orderBy('stok', 'asc')
                ->limit(10)
                ->get()
                ->transform(function ($item) {
                    $item->kekurangan  = $item->stok_minimum - $item->stok;
                    $item->status_stok = 'rendah';
                    return $item;
                });
        });

        // Transaksi terbaru (cache 5 menit)
        $transaksiMasukTerbaru = Cache::remember('dashboard_masuk_terbaru', 300, function () {
            return TransaksiMasuk::with([
                'barang:id,nama_barang,satuan',
                'supplier:id,nama_supplier',
            ])->orderBy('created_at', 'desc')->limit(5)->get();
        });

        $transaksiKeluarTerbaru = Cache::remember('dashboard_keluar_terbaru', 300, function () {
            return TransaksiKeluar::with([
                'barang:id,nama_barang,satuan',
                'konsumen:id,nama_konsumen',
            ])->orderBy('created_at', 'desc')->limit(5)->get();
        });

        return response()->json([
            'success' => true,
            'message' => 'Data dashboard berhasil diambil.',
            'data' => [
                'statistik'               => $statistik,
                'bulan_ini'               => $statistik['bulan_ini'],
                'filter' => [
                    'start_date'  => $startDate->format('Y-m-d'),
                    'end_date'    => $endDate->format('Y-m-d'),
                    'is_custom'   => $isCustomRange,
                    'total_hari'  => $diffInDays + 1,
                    'mode_grafik' => $diffInDays <= 31 ? 'harian' : 'bulanan',
                ],
                'grafik_7_hari'            => $grafik, // nama tetap sama biar frontend tidak perlu ganti
                'stok_kritis'              => $stokKritis,
                'transaksi_masuk_terbaru'  => $transaksiMasukTerbaru,
                'transaksi_keluar_terbaru' => $transaksiKeluarTerbaru,
            ],
        ], 200);
    }
}