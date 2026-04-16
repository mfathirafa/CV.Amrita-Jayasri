<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Barang;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class BarangController extends Controller
{
    // GET /api/barang
    public function index(Request $request)
    {
        $query = Barang::query();

        if ($request->has('search') && $request->search != '') {
            $query->where('nama_barang', 'like', '%' . $request->search . '%');
        }

        if ($request->has('kategori') && $request->kategori != '') {
            $query->where('kategori', $request->kategori);
        }

        $barang = $query->orderBy('nama_barang', 'asc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Data barang berhasil diambil.',
            'data'    => $barang,
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
            'foto'         => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        // Auto generate id_referensi
        $count       = Barang::count() + 1;
        $idReferensi = 'BRG-ATK' . str_pad($count, 3, '0', STR_PAD_LEFT);

        // Upload foto ke Cloudinary kalau ada
        $fotoUrl      = null;
        $fotoPublicId = null;

        if ($request->hasFile('foto')) {
            $upload       = Cloudinary::upload(
                $request->file('foto')->getRealPath(),
                ['folder' => 'amrita/barang']
            );
            $fotoUrl      = $upload->getSecurePath();
            $fotoPublicId = $upload->getPublicId();
        }

        $barang = Barang::create([
            'id_referensi' => $idReferensi,
            'nama_barang'  => $request->nama_barang,
            'kategori'     => $request->kategori,
            'harga'        => $request->harga,
            'stok'         => $request->stok,
            'stok_minimum' => $request->stok_minimum,
            'satuan'       => $request->satuan ?? 'Unit',
            'foto_url'     => $fotoUrl,
            'foto_public_id' => $fotoPublicId,
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

    // POST /api/barang/{id} (pakai POST bukan PUT karena ada file upload)
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
            'foto'         => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $fotoUrl      = $barang->foto_url;
        $fotoPublicId = $barang->foto_public_id;

        if ($request->hasFile('foto')) {
            // Hapus foto lama dari Cloudinary kalau ada
            if ($barang->foto_public_id) {
                Cloudinary::destroy($barang->foto_public_id);
            }

            // Upload foto baru
            $upload       = Cloudinary::upload(
                $request->file('foto')->getRealPath(),
                ['folder' => 'amrita/barang']
            );
            $fotoUrl      = $upload->getSecurePath();
            $fotoPublicId = $upload->getPublicId();
        }

        $barang->update([
            'nama_barang'    => $request->nama_barang,
            'kategori'       => $request->kategori,
            'harga'          => $request->harga,
            'stok'           => $request->stok,
            'stok_minimum'   => $request->stok_minimum,
            'satuan'         => $request->satuan ?? $barang->satuan,
            'foto_url'       => $fotoUrl,
            'foto_public_id' => $fotoPublicId,
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

        // Hapus foto dari Cloudinary kalau ada
        if ($barang->foto_public_id) {
            Cloudinary::destroy($barang->foto_public_id);
        }

        $barang->delete();

        return response()->json([
            'success' => true,
            'message' => 'Barang berhasil dihapus.',
        ], 200);
    }
}