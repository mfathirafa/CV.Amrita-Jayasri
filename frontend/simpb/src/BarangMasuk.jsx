import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Box, Users, Truck, ArrowDownRight, 
  ArrowUpRight, Activity, BarChart2, ArrowDownLeft, 
  Search, Bell, CircleUser, ChevronDown, CalendarDays,
  Package, PenTool, Zap, CheckCircle2, ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';

import SuccessTransactionModal from './SuccessTransactionModal';

const BarangMasuk = ({ onNavigate, onLogout }) => {
  // === STATE UNTUK KONTROL DROPDOWN & FORM ===
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchBarang, setSearchBarang] = useState('');
  const [selectedBarang, setSelectedBarang] = useState(null);
  
  const [jumlah, setJumlah] = useState('');
  const [hargaBeli, setHargaBeli] = useState('');
  const [pemasokId, setPemasokId] = useState(''); // State baru untuk pilihan Pemasok
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // === STATE UNTUK DATA API ===
  const [daftarBarang, setDaftarBarang] = useState([]);
  const [daftarPemasok, setDaftarPemasok] = useState([]); // State baru untuk list Pemasok
  const [isLoading, setIsLoading] = useState(true);

  // === AMBIL DATA MASTER BARANG & PEMASOK DARI API ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const rawApiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
        const cleanApiUrl = rawApiUrl.replace(/\/$/, ""); 
        
        // Pengecekan agar URL tidak dobel /api/api
        const baseApi = cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`;
        
        const headers = {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        // Fetch Data Barang
        const resBarang = await fetch(`${baseApi}/barang`, { method: 'GET', headers });
        const dataBarang = await resBarang.json();
        if (resBarang.ok) {
          setDaftarBarang(Array.isArray(dataBarang) ? dataBarang : (dataBarang.data || []));
        }

        // Fetch Data Pemasok (Supplier)
        const resPemasok = await fetch(`${baseApi}/supplier`, { method: 'GET', headers });
        const dataPemasok = await resPemasok.json();
        if (resPemasok.ok) {
          setDaftarPemasok(Array.isArray(dataPemasok) ? dataPemasok : (dataPemasok.data || []));
        }

      } catch (error) {
        console.error("Error Fetching Data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mock data untuk Masuk Terbaru (Widget Kanan)
  const masukTerbaru = [
    { name: 'Printer Laser Jet Pro', details: '5 Unit • Hari Ini, 09:42', price: 'Rp 12.5jt', icon: Package, iconColor: 'text-purple-600', bgColor: 'bg-purple-100' },
    { name: 'Box Pulpen Biru', details: '50 Pack • Kemarin', price: 'Rp 1.2jt', icon: PenTool, iconColor: 'text-blue-600', bgColor: 'bg-blue-100' },
    { name: 'Kertas F4 70gsm', details: '100 Rim • Kemarin', price: 'Rp 4.5jt', icon: Zap, iconColor: 'text-orange-600', bgColor: 'bg-orange-100' }
  ];

  // Mock data untuk Tabel Riwayat di bawah
  const riwayatMasuk = [
    { tanggal: '12 Nov 2025', barang: 'Kertas A4 80gsm', pemasok: 'PT. Alat Tulis Kencana', jumlah: '100 Rim', hargaBeli: 'Rp 45.000', total: 'Rp 4.500.000', status: 'Sukses' },
    { tanggal: '12 Nov 2025', barang: 'Pulpen Pilot G2 Biru', pemasok: 'CV. Global Logistik Sejahtera', jumlah: '50 Pack', hargaBeli: 'Rp 24.000', total: 'Rp 1.200.000', status: 'Sukses' },
    { tanggal: '10 Nov 2025', barang: 'Tinta Epson T664 Black', pemasok: 'PT. Sinar Jaya Elektronik', jumlah: '20 Botol', hargaBeli: 'Rp 75.000', total: 'Rp 1.500.000', status: 'Sukses' },
    { tanggal: '09 Nov 2025', barang: 'Bantex Binder A4 Biru', pemasok: 'UD. Karya Mandiri Abadi', jumlah: '30 Unit', hargaBeli: 'Rp 35.000', total: 'Rp 1.050.000', status: 'Sukses' },
  ];

  // Logika Filter Pencarian Dropdown menggunakan data rill API
  const filteredBarang = daftarBarang.filter(item => {
    const nama = item.nama_barang || '';
    const ref = item.id_referensi || '';
    const search = searchBarang.toLowerCase();
    return nama.toLowerCase().includes(search) || ref.toLowerCase().includes(search);
  });

  const handleSelectBarang = (item) => {
    setSelectedBarang(item);
    setIsDropdownOpen(false);
    setSearchBarang('');
    // Auto-fill harga beli (menghilangkan desimal berlebih jika ada)
    if (item.harga) {
        setHargaBeli(Math.floor(Number(item.harga)).toString());
    }
  };

  const handleSimpanTransaksi = () => {
    // Di sini nantinya kamu akan menambahkan logika fetch POST ke API transaksi
    // Menggunakan parameter: selectedBarang.id, pemasokId, jumlah, hargaBeli
    setIsSuccessModalOpen(true);
  };

  return (
    <>
      <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
        
        {/* ================= SIDEBAR ================= */}
        <aside className="w-[260px] bg-white border-r border-gray-100 flex flex-col z-20 shrink-0 hidden md:flex">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#5452F6] rounded-xl flex items-center justify-center shrink-0 shadow-sm shadow-indigo-100">
                <Box className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-[#5452F6] font-bold text-[13px] leading-tight tracking-wide uppercase">
                  CV. AMRITA<br/>JAYASRI
                </h1>
                <p className="text-gray-400 font-medium text-[10px] mt-0.5">Sistem Inventaris ATK</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-2 scrollbar-hide">
            <button onClick={() => onNavigate('dashboard')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </button>
            <button onClick={() => onNavigate('data-barang')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
              <Box className="w-5 h-5" /> Data Barang
            </button>
            <button onClick={() => onNavigate('pemasok')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
              <Truck className="w-5 h-5" /> Pemasok
            </button>
            <button onClick={() => onNavigate('konsumen')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
              <Users className="w-5 h-5" /> Konsumen
            </button>
            <button onClick={() => onNavigate('barang-masuk')} className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0EFFF] text-[#5452F6] rounded-xl font-bold text-sm transition-colors text-left">
              <ArrowDownRight className="w-5 h-5" /> Barang Masuk
            </button>
            <button onClick={() => onNavigate('barang-keluar')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
              <ArrowUpRight className="w-5 h-5" /> Barang Keluar
            </button>
            <button onClick={() => onNavigate('monitoring-stok')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
              <Activity className="w-5 h-5" /> Monitoring Stok
            </button>
            <button onClick={() => onNavigate('laporan')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
              <BarChart2 className="w-5 h-5" /> Laporan
            </button>
          </nav>

          <div className="p-4 border-t border-gray-100 mt-auto">
            <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 w-full text-[#64748B] hover:bg-gray-50 hover:text-[#334155] rounded-xl font-semibold text-sm transition-colors">
              <ArrowDownLeft className="w-5 h-5 text-[#829AB1]" strokeWidth={2.5} /> Keluar
            </button>
          </div>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* === HEADER === */}
          <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 z-10 sticky top-0 shrink-0">
            <div className="flex items-center">
              <h2 className="font-bold text-[#1E232C] text-base hidden md:block">SIMPB - CV. Amrita Jayasri</h2>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="relative w-72 hidden sm:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Cari stok alat tulis..." 
                  className="w-full pl-11 pr-4 py-2.5 bg-[#F4F7FC] border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-[#5452F6] transition-all" 
                />
              </div>
              
              <button className="relative text-gray-500 hover:text-gray-800 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="h-6 w-px bg-gray-200"></div>
              
              <div className="flex items-center gap-2.5 cursor-pointer">
                <CircleUser className="w-8 h-8 text-[#5452F6]" strokeWidth={1.5} />
                <span className="text-sm font-semibold text-[#1E232C]">Administrator</span>
              </div>
            </div>
          </header>

          {/* ================= PAGE CONTENT ================= */}
          <div className="flex-1 overflow-y-auto p-8 pb-12 relative">
              
            {/* Breadcrumbs & Judul */}
            <div className="flex justify-between items-start mb-8 gap-4">
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Manajemen Inventaris</p>
                <h1 className="text-2xl font-bold text-gray-800">Catat Kiriman Masuk</h1>
                <p className="text-sm text-gray-500 mt-1 max-w-xl">Tambahkan kedatangan stok baru ke gudang pusat. Pastikan semua detail sesuai dengan faktur fisik untuk kepatuhan audit.</p>
              </div>
              
              {/* Volume Harian */}
              <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 flex gap-4 items-center shrink-0">
                <div className="w-10 h-10 rounded-lg bg-[#EBF4FF] flex items-center justify-center">
                  <BarChart2 className="w-5 h-5 text-[#5452F6]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">VOLUME HARIAN</p>
                  <div className="flex items-end gap-2">
                      <h3 className="text-2xl font-bold text-gray-800 leading-none">124</h3>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid Konten Atas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Kolom Kiri - Detail Transaksi */}
              <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white rounded-[20px] p-8 shadow-sm border border-gray-100 flex flex-col relative">
                      <div className="flex justify-between items-center mb-6">
                          <h3 className="text-base font-bold text-gray-800">Detail Transaksi</h3>
                          <CheckCircle2 className="w-5 h-5 text-gray-300" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          {/* === CUSTOM DROPDOWN PILIH BARANG === */}
                          <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">PILIH BARANG</label>
                              <div className="relative">
                                  <div 
                                    onClick={() => !isLoading && setIsDropdownOpen(!isDropdownOpen)}
                                    className={`w-full px-4 py-3 bg-[#F4F7FC] border ${isDropdownOpen ? 'border-[#5452F6] ring-1 ring-[#5452F6]' : 'border-gray-100'} rounded-xl text-sm flex justify-between items-center ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'} transition-all`}
                                  >
                                    {isLoading ? (
                                        <div className="flex items-center text-gray-500">
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" /> Memuat data...
                                        </div>
                                    ) : (
                                        <>
                                            <span className={selectedBarang ? 'text-gray-800 font-semibold' : 'text-gray-500'}>
                                              {selectedBarang ? selectedBarang.nama_barang : 'Pilih barang...'}
                                            </span>
                                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                        </>
                                    )}
                                  </div>

                                  {isDropdownOpen && (
                                    <>
                                      <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                                      <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                        <div className="p-3 border-b border-gray-50 bg-gray-50/50">
                                          <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input 
                                              type="text" 
                                              placeholder="Cari nama barang atau SKU..." 
                                              value={searchBarang}
                                              onChange={(e) => setSearchBarang(e.target.value)}
                                              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#5452F6] transition-colors"
                                              autoFocus
                                            />
                                          </div>
                                        </div>
                                        <div className="max-h-56 overflow-y-auto">
                                          {filteredBarang.length > 0 ? (
                                            filteredBarang.map((item) => (
                                              <div 
                                                key={item.id}
                                                onClick={() => handleSelectBarang(item)}
                                                className="px-4 py-3 hover:bg-[#F0EFFF] cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-0 transition-colors group"
                                              >
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-white flex items-center justify-center shrink-0 border border-gray-100 transition-colors">
                                                  <Box className="w-4 h-4 text-gray-400 group-hover:text-[#5452F6]" />
                                                </div>
                                                <div>
                                                  <p className="text-xs font-bold text-gray-800 group-hover:text-[#5452F6]">{item.nama_barang}</p>
                                                  <p className="text-[10px] text-gray-400 uppercase font-medium mt-0.5">{item.id_referensi}</p>
                                                </div>
                                              </div>
                                            ))
                                          ) : (
                                            <div className="px-4 py-6 text-center text-xs text-gray-500 font-medium">
                                              Pencarian tidak ditemukan.
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </>
                                  )}
                              </div>
                          </div>

                          {/* === DROPDOWN PILIH PEMASOK DARI API === */}
                          <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">PILIH PEMASOK</label>
                              <div className="relative">
                                  <select 
                                    value={pemasokId}
                                    onChange={(e) => setPemasokId(e.target.value)}
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 bg-[#F4F7FC] border border-gray-100 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#5452F6] appearance-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                                  >
                                      <option value="">-- Pilih Pemasok --</option>
                                      {daftarPemasok.map((supplier) => (
                                          <option key={supplier.id} value={supplier.id}>
                                              {supplier.nama_supplier}
                                          </option>
                                      ))}
                                  </select>
                                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                              </div>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          {/* Jumlah */}
                          <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">JUMLAH (QTY)</label>
                              <div className="flex items-center bg-[#F4F7FC] border border-gray-100 rounded-xl px-4 py-3 focus-within:ring-1 focus-within:ring-[#5452F6] focus-within:bg-white transition-colors">
                                  <input 
                                    type="number" 
                                    placeholder="0" 
                                    value={jumlah}
                                    onChange={(e) => setJumlah(e.target.value)}
                                    className="bg-transparent text-sm font-semibold text-gray-800 focus:outline-none flex-grow" 
                                  />
                                  <span className="text-xs font-bold text-gray-400 uppercase ml-2 tracking-wider">UNIT</span>
                              </div>
                          </div>
                          {/* Harga Beli */}
                          <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">HARGA BELI</label>
                              <div className="flex items-center bg-[#F4F7FC] border border-gray-100 rounded-xl px-4 py-3 focus-within:ring-1 focus-within:ring-[#5452F6] focus-within:bg-white transition-colors">
                                  <span className="text-sm font-bold text-gray-400 mr-2">Rp</span>
                                  <input 
                                    type="number" 
                                    placeholder="0" 
                                    value={hargaBeli}
                                    onChange={(e) => setHargaBeli(e.target.value)}
                                    className="bg-transparent text-sm font-semibold text-gray-800 focus:outline-none flex-grow" 
                                  />
                              </div>
                          </div>
                      </div>

                      {/* Tanggal */}
                      <div className="mb-8 z-0 relative">
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">TANGGAL KEDATANGAN</label>
                          <div className="relative">
                              <input type="date" className="w-full px-4 py-3 bg-[#F4F7FC] border border-gray-100 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#5452F6] focus:bg-white transition-colors" />
                          </div>
                      </div>

                      {/* Tombol Simpan */}
                      <button 
                        onClick={handleSimpanTransaksi}
                        className="w-full py-3.5 bg-[#5452F6] hover:bg-[#4341E3] text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/30"
                      >
                          Simpan Transaksi
                      </button>
                  </div>
              </div>

              {/* Kolom Kanan */}
              <div className="space-y-8">
                  {/* Masuk Terbaru */}
                  <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col">
                      <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2">
                          <ArrowDownRight className="w-4 h-4 text-[#5452F6]" /> Masuk Terbaru
                      </h3>
                      
                      <div className="space-y-4 mb-6">
                          {masukTerbaru.map((item, index) => (
                          <div key={index} className="flex justify-between items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                              <div className="flex items-center gap-3">
                                  <div className={`w-9 h-9 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                                      <item.icon className={`w-4.5 h-4.5 ${item.iconColor}`} />
                                  </div>
                                  <div>
                                      <p className="text-sm font-bold text-gray-800">{item.name}</p>
                                      <p className="text-[10px] text-gray-500 font-medium">{item.details}</p>
                                  </div>
                              </div>
                              <span className="text-xs font-bold text-gray-800">{item.price}</span>
                          </div>
                          ))}
                      </div>

                      <button 
                        onClick={() => onNavigate('laporan')}
                        className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-[#5452F6] text-xs font-bold rounded-xl transition-colors mt-auto border border-gray-100"
                      >
                          LIHAT SEMUA TRANSAKSI
                      </button>
                  </div>

                  {/* Info Gudang Card */}
                  <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden h-48 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=600&auto=format&fit=crop')` }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-0"></div>
                      <div className="relative z-10 mt-auto text-white">
                          <span className="text-[9px] font-bold text-white bg-[#D97706] px-2 py-0.5 rounded-md uppercase tracking-wider mb-2 inline-block shadow-sm">TIPS GUDANG</span>
                          <h4 className="text-sm font-bold text-white leading-snug mb-1">Optimalkan alur penerimaan Anda dengan pemindaian digital.</h4>
                          <p className="text-[10px] text-gray-200 font-medium max-w-sm">Kurangi kesalahan hingga 40% menggunakan aplikasi pemindai Amrita Mobile.</p>
                      </div>
                  </div>
              </div>
            </div>

            {/* ================= TABEL RIWAYAT BARANG MASUK ================= */}
            <div className="mt-8 bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h3 className="text-base font-bold text-gray-800">Riwayat Barang Masuk</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">TANGGAL</th>
                                <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">BARANG</th>
                                <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">PEMASOK</th>
                                <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">JUMLAH</th>
                                <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">HARGA BELI</th>
                                <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">TOTAL</th>
                                <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">STATUS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {riwayatMasuk.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-6 text-sm font-medium text-gray-600">{item.tanggal}</td>
                                    <td className="py-4 px-6 text-sm font-bold text-gray-800">{item.barang}</td>
                                    <td className="py-4 px-6 text-sm font-medium text-gray-600 max-w-[200px] truncate">{item.pemasok}</td>
                                    <td className="py-4 px-6 text-sm font-bold text-gray-800">{item.jumlah}</td>
                                    <td className="py-4 px-6 text-sm font-medium text-gray-600">{item.hargaBeli}</td>
                                    <td className="py-4 px-6 text-sm font-bold text-[#5452F6]">{item.total}</td>
                                    <td className="py-4 px-6">
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 bg-white gap-3">
                    <p className="text-xs text-gray-500 font-medium">Menampilkan 4 dari 12 transaksi</p>
                    <div className="flex items-center gap-1.5 pagination-pills">
                        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 border border-gray-100"><ChevronLeft className="w-4 h-4" /></button>
                        <button className="w-8 h-8 flex items-center justify-center bg-[#5452F6] text-white rounded-lg text-xs font-bold">1</button>
                        <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg text-xs font-bold border border-gray-100">2</button>
                        <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg text-xs font-bold border border-gray-100">3</button>
                        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 border border-gray-100"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>

            {/* Footer Teks Kecil */}
            <div className="mt-12 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">© 2026 CV. AMRITA JAYASRI • MANAJEMEN INVENTARIS BERKINERJA TINGGI</p>
            </div>

          </div>
        </main>
      </div>

      {/* RENDER MODAL SUKSES TRANSAKSI */}
      <SuccessTransactionModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onNavigate={onNavigate}
        transactionData={{
          id: '#TRX-' + Math.floor(10000 + Math.random() * 90000),
          barang: selectedBarang ? selectedBarang.nama_barang : 'Belum dipilih', // Menyesuaikan properti baru
          jumlah: jumlah || '0'
        }}
      />
    </>
  );
};

export default BarangMasuk;