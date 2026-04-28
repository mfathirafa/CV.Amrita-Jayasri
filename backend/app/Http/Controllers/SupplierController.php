<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Supplier;
use App\Helpers\Sanitizer;

class SupplierController extends Controller
{
    // GET /api/supplier - List semua supplier + search
    public function index(Request $request)
    {
        $query = Supplier::query();

        // Fitur search berdasarkan nama supplier
        if ($request->has('search') && $request->search != '') {
            $query->where('nama_supplier', 'like', '%' . $request->search . '%');
        }

        $supplier = $query->orderBy('nama_supplier', 'asc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Data supplier berhasil diambil.',
            'data'    => $supplier,
        ], 200);
    }

    // POST /api/supplier - Tambah supplier baru
    public function store(Request $request)
    {
        $request->validate([
            'nama_supplier' => 'required|string|max:200',
            'alamat'        => 'nullable|string',
            'no_telepon'    => 'nullable|string|max:20',
        ]);

        $supplier = Supplier::create([
            'nama_supplier' => Sanitizer::clean($request->nama_supplier),
            'alamat'        => Sanitizer::clean($request->alamat),
            'no_telepon'    => Sanitizer::clean($request->no_telepon),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Supplier berhasil ditambahkan.',
            'data'    => $supplier,
        ], 201);
    }

    // GET /api/supplier/{id} - Detail satu supplier
    public function show($id)
    {
        $supplier = Supplier::find($id);

        if (!$supplier) {
            return response()->json([
                'success' => false,
                'message' => 'Supplier tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail supplier berhasil diambil.',
            'data'    => $supplier,
        ], 200);
    }

    // PUT /api/supplier/{id} - Edit supplier
    public function update(Request $request, $id)
    {
        $supplier = Supplier::find($id);

        if (!$supplier) {
            return response()->json([
                'success' => false,
                'message' => 'Supplier tidak ditemukan.',
            ], 404);
        }

        $request->validate([
            'nama_supplier' => 'required|string|max:200',
            'alamat'        => 'nullable|string',
            'no_telepon'    => 'nullable|string|max:20',
        ]);

        $supplier->update([
            'nama_supplier' => Sanitizer::clean($request->nama_supplier),
            'alamat'        => Sanitizer::clean($request->alamat),
            'no_telepon'    => Sanitizer::clean($request->no_telepon),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Supplier berhasil diperbarui.',
            'data'    => $supplier,
        ], 200);
    }

    // DELETE /api/supplier/{id} - Hapus supplier
    public function destroy($id)
    {
        $supplier = Supplier::find($id);

        if (!$supplier) {
            return response()->json([
                'success' => false,
                'message' => 'Supplier tidak ditemukan.',
            ], 404);
        }

        // Cek apakah supplier masih punya riwayat transaksi masuk
        $adaTransaksi = $supplier->transaksiMasuk()->count() > 0;

        if ($adaTransaksi) {
            return response()->json([
                'success' => false,
                'message' => 'Supplier tidak dapat dihapus karena masih memiliki riwayat transaksi barang masuk.',
            ], 409);
        }

        $supplier->delete();

        return response()->json([
            'success' => true,
            'message' => 'Supplier berhasil dihapus.',
        ], 200);
    }
}