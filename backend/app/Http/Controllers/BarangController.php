<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Barang;
use App\Helpers\Sanitizer;
use App\Helpers\ImgBBHelper;

class BarangController extends Controller
{
    // GET /api/barang
    public function index(Request $request)
    {
        $query = Barang::query();

        if ($request->has('search') && $request->search != '') {
            $query->where('nama_barang', 'like', '%' . Sanitizer::clean($request->search) . '%');
        }

        if ($request->has('kategori') && $request->kategori != '') {
            $query->where('kategori', Sanitizer::clean($request->kategori));
        }

        // Pagination — default 10 per halaman, maks 100
        $perPage = min((int) $request->get('per_page', 10), 100);
        $barang  = $query->orderBy('nama_barang', 'asc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Data barang berhasil diambil.',
            'data'    => $barang->items(),
            'meta'    => [
                'current_page' => $barang->currentPage(),
                'per_page'     => $barang->perPage(),
                'total'        => $barang->total(),
                'last_page'    => $barang->lastPage(),
                'from'         => $barang->firstItem(),
                'to'           => $barang->lastItem(),
            ],
        ], 200);
    }

    // POST /api/barang
    public function store(Request $request)
    {
        $request->validate([
            'nama_barang'  => 'required|string|max:200',
            'kategori'     => 'required|string|max:100',
            'harga'        => 'required|numeric|min:0',
            'stok'         => 'required|integer|min:0',
            'stok_minimum' => 'required|integer|min:0',
            'satuan'       => 'nullable|string|max:50',
            'foto'         => [
                'nullable',
                'file',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
                'dimensions:min_width=50,min_height=50,max_width=5000,max_height=5000',
            ],
        ]);

        // Auto generate id_referensi
        $lastId      = DB::table('barang')->max('id') ?? 0;
        $nextNumber  = $lastId + 1;
        $idReferensi = 'BRG-ATK' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        // Pastikan tidak duplikat
        while (Barang::where('id_referensi', $idReferensi)->exists()) {
            $nextNumber++;
            $idReferensi = 'BRG-ATK' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
        }

        // Upload foto ke ImgBB kalau ada
        $fotoUrl       = null;
        $fotoDeleteUrl = null;

        if ($request->hasFile('foto')) {
            $upload = ImgBBHelper::upload($request->file('foto'));
            if ($upload) {
                $fotoUrl       = $upload['url'];
                $fotoDeleteUrl = $upload['delete_url'];
            }
        }

        $barang = Barang::create([
            'id_referensi'   => $idReferensi,
            'nama_barang'    => Sanitizer::clean($request->nama_barang),
            'kategori'       => Sanitizer::clean($request->kategori),
            'harga'          => $request->harga,
            'stok'           => $request->stok,
            'stok_minimum'   => $request->stok_minimum,
            'satuan'         => Sanitizer::clean($request->satuan ?? 'Unit'),
            'foto_url'       => $fotoUrl,
            'foto_delete_url'=> $fotoDeleteUrl,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Barang berhasil ditambahkan.',
            'data'    => $barang,
        ], 201);
    }

    // GET /api/barang/{id}
    public function show($id)
    {
        $barang = Barang::find($id);

        if (!$barang) {
            return response()->json([
                'success' => false,
                'message' => 'Barang tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail barang berhasil diambil.',
            'data'    => $barang,
        ], 200);
    }

    // POST /api/barang/{id} — pakai POST karena ada file upload
    public function update(Request $request, $id)
    {
        $barang = Barang::find($id);

        if (!$barang) {
            return response()->json([
                'success' => false,
                'message' => 'Barang tidak ditemukan.',
            ], 404);
        }

        $request->validate([
            'nama_barang'  => 'required|string|max:200',
            'kategori'     => 'required|string|max:100',
            'harga'        => 'required|numeric|min:0',
            'stok'         => 'required|integer|min:0',
            'stok_minimum' => 'required|integer|min:0',
            'satuan'       => 'nullable|string|max:50',
            'foto'         => [
                'nullable',
                'file',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
                'dimensions:min_width=50,min_height=50,max_width=5000,max_height=5000',
            ],
        ]);

        $fotoUrl       = $barang->foto_url;
        $fotoDeleteUrl = $barang->foto_delete_url;

        if ($request->hasFile('foto')) {
            $upload = ImgBBHelper::upload($request->file('foto'));
            if ($upload) {
                $fotoUrl       = $upload['url'];
                $fotoDeleteUrl = $upload['delete_url'];
            }
        }

        $barang->update([
            'nama_barang'    => Sanitizer::clean($request->nama_barang),
            'kategori'       => Sanitizer::clean($request->kategori),
            'harga'          => $request->harga,
            'stok'           => $request->stok,
            'stok_minimum'   => $request->stok_minimum,
            'satuan'         => Sanitizer::clean($request->satuan ?? $barang->satuan),
            'foto_url'       => $fotoUrl,
            'foto_delete_url'=> $fotoDeleteUrl,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Barang berhasil diperbarui.',
            'data'    => $barang,
        ], 200);
    }

    // DELETE /api/barang/{id}
    public function destroy($id)
    {
        $barang = Barang::find($id);

        if (!$barang) {
            return response()->json([
                'success' => false,
                'message' => 'Barang tidak ditemukan.',
            ], 404);
        }

        $adaTransaksiMasuk  = $barang->transaksiMasuk()->count() > 0;
        $adaTransaksiKeluar = $barang->transaksiKeluar()->count() > 0;

        if ($adaTransaksiMasuk || $adaTransaksiKeluar) {
            return response()->json([
                'success' => false,
                'message' => 'Barang tidak dapat dihapus karena masih memiliki riwayat transaksi.',
            ], 409);
        }

        $barang->delete();

        return response()->json([
            'success' => true,
            'message' => 'Barang berhasil dihapus.',
        ], 200);
    }
}