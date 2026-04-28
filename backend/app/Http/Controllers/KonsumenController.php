<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Konsumen;
use App\Helpers\Sanitizer;

class KonsumenController extends Controller
{
    // GET /api/konsumen
    public function index(Request $request)
    {
        $query = Konsumen::query();

        if ($request->has('search') && $request->search != '') {
            $query->where('nama_konsumen', 'like', '%' . Sanitizer::clean($request->search) . '%');
        }

        $perPage  = min((int) $request->get('per_page', 10), 100);
        $konsumen = $query->orderBy('nama_konsumen', 'asc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Data konsumen berhasil diambil.',
            'data'    => $konsumen->items(),
            'meta'    => [
                'current_page' => $konsumen->currentPage(),
                'per_page'     => $konsumen->perPage(),
                'total'        => $konsumen->total(),
                'last_page'    => $konsumen->lastPage(),
                'from'         => $konsumen->firstItem(),
                'to'           => $konsumen->lastItem(),
            ],
        ], 200);
    }

    // POST /api/konsumen
    public function store(Request $request)
    {
        $request->validate([
            'nama_konsumen' => 'required|string|max:200',
            'alamat'        => 'nullable|string|max:500',
            'no_telepon'    => 'nullable|string|max:20|regex:/^[0-9\-\+\(\)\s]+$/',
        ]);

        $konsumen = Konsumen::create([
            'nama_konsumen' => Sanitizer::clean($request->nama_konsumen),
            'alamat'        => Sanitizer::cleanNullable($request->alamat),
            'no_telepon'    => Sanitizer::cleanNullable($request->no_telepon),
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
            'alamat'        => 'nullable|string|max:500',
            'no_telepon'    => 'nullable|string|max:20|regex:/^[0-9\-\+\(\)\s]+$/',
        ]);

        $konsumen->update([
            'nama_konsumen' => Sanitizer::clean($request->nama_konsumen),
            'alamat'        => Sanitizer::cleanNullable($request->alamat),
            'no_telepon'    => Sanitizer::cleanNullable($request->no_telepon),
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