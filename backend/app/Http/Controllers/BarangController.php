<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Barang;

class BarangController extends Controller
{
    // GET /api/barang - List semua barang + search
    public function index(Request $request)
    {
        $query = Barang::query();

        // Fitur search berdasarkan nama barang
        if ($request->has('search') && $request->search != '') {
            $query->where('nama_barang', 'like', '%' . $request->search . '%');
        }

        $barang = $query->orderBy('nama_barang', 'asc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Data barang berhasil diambil.',
            'data'    => $barang,
        ], 200);
    }

    // POST /api/barang - Tambah barang baru
    public function store(Request $request)
    {
        $request->validate([
            'nama_barang'  => 'required|string|max:200',
            'kategori'     => 'required|string|max:100',
            'harga'        => 'required|numeric|min:0',
            'stok'         => 'required|integer|min:0',
            'stok_minimum' => 'required|integer|min:0',
            'satuan'       => 'nullable|string|max:50',
        ]);

        $count        = \App\Models\Barang::count() + 1;
        $idReferensi  = 'BRG-ATK' . str_pad($count, 3, '0', STR_PAD_LEFT);


        $barang = Barang::create([
            'id_referensi' => $idReferensi,
            'nama_barang'  => $request->nama_barang,
            'kategori'     => $request->kategori,
            'harga'        => $request->harga,
            'stok'         => $request->stok,
            'stok_minimum' => $request->stok_minimum,
            'satuan'       => $request->satuan ?? 'Unit',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Barang berhasil ditambahkan.',
            'data'    => $barang,
        ], 201);
    }

    // GET /api/barang/{id} - Detail satu barang
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

    // PUT /api/barang/{id} - Edit barang
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
        ]);

        $barang->update([
            'nama_barang'  => $request->nama_barang,
            'kategori'     => $request->kategori,
            'harga'        => $request->harga,
            'stok'         => $request->stok,
            'stok_minimum' => $request->stok_minimum,
            'satuan'       => $request->satuan ?? $barang->satuan,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Barang berhasil diperbarui.',
            'data'    => $barang,
        ], 200);
    }

    // DELETE /api/barang/{id} - Hapus barang
    public function destroy($id)
    {
        $barang = Barang::find($id);

        if (!$barang) {
            return response()->json([
                'success' => false,
                'message' => 'Barang tidak ditemukan.',
            ], 404);
        }

        // Cek apakah barang masih punya riwayat transaksi
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