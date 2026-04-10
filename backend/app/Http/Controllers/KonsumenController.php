<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Konsumen;

class KonsumenController extends Controller
{
    // GET /api/konsumen
    public function index(Request $request)
    {
        $query = Konsumen::query();

        if ($request->has('search') && $request->search != '') {
            $query->where('nama_konsumen', 'like', '%' . $request->search . '%');
        }

        $konsumen = $query->orderBy('nama_konsumen', 'asc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Data konsumen berhasil diambil.',
            'data'    => $konsumen,
        ], 200);
    }

    // POST /api/konsumen
    public function store(Request $request)
    {
        $request->validate([
            'nama_konsumen' => 'required|string|max:200',
            'alamat'        => 'nullable|string',
            'no_telepon'    => 'nullable|string|max:20',
        ]);

        $konsumen = Konsumen::create([
            'nama_konsumen' => $request->nama_konsumen,
            'alamat'        => $request->alamat,
            'no_telepon'    => $request->no_telepon,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Konsumen berhasil ditambahkan.',
            'data'    => $konsumen,
        ], 201);
    }

    // GET /api/konsumen/{id}
    public function show($id)
    {
        $konsumen = Konsumen::find($id);

        if (!$konsumen) {
            return response()->json([
                'success' => false,
                'message' => 'Konsumen tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail konsumen berhasil diambil.',
            'data'    => $konsumen,
        ], 200);
    }

    // PUT /api/konsumen/{id}
    public function update(Request $request, $id)
    {
        $konsumen = Konsumen::find($id);

        if (!$konsumen) {
            return response()->json([
                'success' => false,
                'message' => 'Konsumen tidak ditemukan.',
            ], 404);
        }

        $request->validate([
            'nama_konsumen' => 'required|string|max:200',
            'alamat'        => 'nullable|string',
            'no_telepon'    => 'nullable|string|max:20',
        ]);

        $konsumen->update([
            'nama_konsumen' => $request->nama_konsumen,
            'alamat'        => $request->alamat,
            'no_telepon'    => $request->no_telepon,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Konsumen berhasil diperbarui.',
            'data'    => $konsumen,
        ], 200);
    }

    // DELETE /api/konsumen/{id}
    public function destroy($id)
    {
        $konsumen = Konsumen::find($id);

        if (!$konsumen) {
            return response()->json([
                'success' => false,
                'message' => 'Konsumen tidak ditemukan.',
            ], 404);
        }

        // Cek apakah masih punya riwayat transaksi
        if ($konsumen->transaksiKeluar()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Konsumen tidak dapat dihapus karena masih memiliki riwayat transaksi.',
            ], 409);
        }

        $konsumen->delete();

        return response()->json([
            'success' => true,
            'message' => 'Konsumen berhasil dihapus.',
        ], 200);
    }
}