<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Supplier;
use App\Models\Barang;

class ExcelDataSeeder extends Seeder
{
    public function run(): void
    {
        $dataFile = database_path('data/excel_import.json');
        if (!file_exists($dataFile)) {
            $this->command?->warn("File {$dataFile} tidak ditemukan, seeding dilewati.");
            return;
        }

        $raw = file_get_contents($dataFile);
        $data = json_decode($raw, true);

        if (!$data || !isset($data['barang'])) {
            $this->command?->warn("Format data excel_import.json tidak valid.");
            return;
        }

        $adminId = User::where('email', 'admin@amrita.com')->value('id') ?? 1;

        // 1. Seed Suppliers
        $this->command?->info("Memproses supplier...");
        $supplierMap = []; // nama_supplier => id
        foreach ($data['suppliers'] as $suppName) {
            $supplier = Supplier::firstOrCreate(
                ['nama_supplier' => $suppName],
                [
                    'alamat'     => 'Purwokerto',
                    'no_telepon' => '-',
                ]
            );
            $supplierMap[$suppName] = $supplier->id;
        }

        // 2. Seed Barang
        $this->command?->info("Memproses barang (" . count($data['barang']) . " item)...");
        $barangMap = []; // "nama_barang|satuan" => id
        $now = now();
        $barangToInsert = [];

        // Ambil existing barang untuk cek duplikasi
        $existingBarang = Barang::all(['id', 'nama_barang', 'satuan'])->keyBy(function ($item) {
            return strtolower(trim($item->nama_barang)) . '|' . strtolower(trim($item->satuan));
        });

        foreach ($data['barang'] as $b) {
            $key = strtolower(trim($b['nama_barang'])) . '|' . strtolower(trim($b['satuan']));

            if (isset($existingBarang[$key])) {
                $barangMap[$key] = $existingBarang[$key]->id;
            } else {
                $barangToInsert[] = [
                    'id_referensi'   => $b['id_referensi'],
                    'nama_barang'    => $b['nama_barang'],
                    'kategori'       => $b['kategori'],
                    'harga'          => $b['harga'],
                    'stok'           => $b['stok'],
                    'stok_minimum'   => $b['stok_minimum'] ?? 5,
                    'satuan'         => $b['satuan'] ?? 'pcs',
                    'foto_url'       => null,
                    'foto_delete_url'=> null,
                    'created_at'     => $now,
                    'updated_at'     => $now,
                ];
            }
        }

        // Bulk insert barang in chunks
        if (!empty($barangToInsert)) {
            foreach (array_chunk($barangToInsert, 300) as $chunk) {
                DB::table('barang')->insert($chunk);
            }
            // Re-fetch map
            $existingBarang = Barang::all(['id', 'nama_barang', 'satuan'])->keyBy(function ($item) {
                return strtolower(trim($item->nama_barang)) . '|' . strtolower(trim($item->satuan));
            });
            foreach ($data['barang'] as $b) {
                $key = strtolower(trim($b['nama_barang'])) . '|' . strtolower(trim($b['satuan']));
                if (isset($existingBarang[$key])) {
                    $barangMap[$key] = $existingBarang[$key]->id;
                }
            }
        }

        // 3. Seed Transaksi Masuk (jika tabel transaksi_masuk masih kosong)
        $txCount = DB::table('transaksi_masuk')->count();
        if ($txCount === 0 && !empty($data['transactions'])) {
            $this->command?->info("Memproses transaksi masuk (" . count($data['transactions']) . " transaksi)...");
            $txToInsert = [];

            foreach ($data['transactions'] as $tx) {
                $bId = $barangMap[$tx['barang_key']] ?? null;
                $sId = $supplierMap[$tx['supplier_name']] ?? null;

                if ($bId && $sId) {
                    $txToInsert[] = [
                        'barang_id'     => $bId,
                        'supplier_id'   => $sId,
                        'user_id'       => $adminId,
                        'jumlah'        => $tx['jumlah'],
                        'harga_beli'    => $tx['harga_beli'],
                        'tanggal_masuk' => $tx['tanggal'],
                        'keterangan'    => $tx['keterangan'] ?? 'Import awal Excel',
                        'created_at'    => $now,
                        'updated_at'    => $now,
                    ];
                }
            }

            foreach (array_chunk($txToInsert, 500) as $chunk) {
                DB::table('transaksi_masuk')->insert($chunk);
            }
        }

        $this->command?->info("Excel data seeder selesai!");
    }
}
