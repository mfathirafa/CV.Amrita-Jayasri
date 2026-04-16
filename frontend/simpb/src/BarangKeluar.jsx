import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Box, Truck, Users, 
  ArrowDownRight, ArrowUpRight, Activity, 
  BarChart2, Search, Bell, Plus, 
  Calendar, AlertTriangle, TrendingUp, Minus, AlertCircle, CircleUser,
  ChevronDown, MapPin, Info, ArrowDownLeft, Loader2, ChevronLeft, ChevronRight
} from 'lucide-react';

import SuccessTransactionModal from './SuccessTransactionModal';

const BarangKeluar = ({ onLogout, onNavigate }) => {
  // === STATE UNTUK KONTROL DROPDOWN & FORM ===
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchBarang, setSearchBarang] = useState('');
  const [selectedBarang, setSelectedBarang] = useState(null);
  
  const [jumlah, setJumlah] = useState('');
  const [hargaSatuan, setHargaSatuan] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // === STATE UNTUK DATA API ===
  const [daftarBarang, setDaftarBarang] = useState([]);
  const [isLoadingBarang, setIsLoadingBarang] = useState(true);

  // === MOCK DATA TABEL RIWAYAT ===
  const riwayatKeluar = [
    { tanggal: '14 Okt 2025', barang: 'Kertas HVS A4 80gr', penerima: 'Divisi Keuangan', jumlah: '15 Rim', hargaSatuan: 'Rp 45.000', total: 'Rp 675.000', status: 'Dikirim', statusColor: 'bg-orange-50 text-orange-600 border-orange-100' },
    { tanggal: '14 Okt 2025', barang: 'Tinta Epson T664 Black', penerima: 'Divisi IT', jumlah: '4 Botol', hargaSatuan: 'Rp 85.000', total: 'Rp 340.000', status: 'Selesai', statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { tanggal: '12 Okt 2025', barang: 'Buku Sinar Dunia A5', penerima: 'Divisi SDM', jumlah: '10 Pack', hargaSatuan: 'Rp 28.000', total: 'Rp 280.000', status: 'Selesai', statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { tanggal: '10 Okt 2025', barang: 'Pulpen Pilot G2 Biru', penerima: 'Divisi Pemasaran', jumlah: '5 Lusin', hargaSatuan: 'Rp 35.000', total: 'Rp 175.000', status: 'Selesai', statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  ];

  // === AMBIL DATA MASTER BARANG DARI API ===
  useEffect(() => {
    const fetchBarang = async () => {
      try {
        setIsLoadingBarang(true);
        const token = localStorage.getItem('token');
        const rawApiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
        const cleanApiUrl = rawApiUrl.replace(/\/$/, ""); 
        
        const endpoint = cleanApiUrl.endsWith('/api') 
          ? `${cleanApiUrl}/barang` 
          : `${cleanApiUrl}/api/barang`;

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          const arrayData = Array.isArray(data) ? data : (data.data || []);
          setDaftarBarang(arrayData);
        }
      } catch (error) {
        console.error("Error Fetching Barang:", error);
      } finally {
        setIsLoadingBarang(false);
      }
    };

    fetchBarang();
  }, []);

  // Filter pencarian barang
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
    // Auto-fill harga satuan (menghilangkan desimal berlebih)
    if (item.harga) {
        setHargaSatuan(Math.floor(Number(item.harga)).toString());
    }
  };

  const handleKonfirmasiPengiriman = () => {
    // Validasi sederhana jika stok tidak cukup
    if (selectedBarang && Number(jumlah) > selectedBarang.stok) {
        alert("Peringatan: Jumlah barang keluar melebihi stok yang ada di gudang!");
        return;
    }
    
    setIsSuccessModalOpen(true);
  };

  // === PERHITUNGAN STATUS INVENTARIS DINAMIS ===
  const currentStok = selectedBarang ? selectedBarang.stok : 0;
  const proyeksiStok = selectedBarang ? currentStok - (Number(jumlah) || 0) : 0;
  const persentaseKeluar = currentStok > 0 ? ((Number(jumlah) || 0) / currentStok * 100).toFixed(1) : 0;
  const isStokCukup = proyeksiStok >= 0;

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
            <button onClick={() => onNavigate('barang-masuk')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
              <ArrowDownRight className="w-5 h-5" /> Barang Masuk
            </button>
            
            {/* Active Menu */}
            <button onClick={() => onNavigate('barang-keluar')} className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0EFFF] text-[#5452F6] rounded-xl font-bold text-sm transition-colors text-left">
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
          <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 z-10 sticky top-0 shrink-0">
            <div className="flex items-center">
              <h2 className="font-bold text-[#1E232C] text-base hidden md:block">SIMPB - CV. Amrita Jayasri</h2>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="relative w-72 hidden sm:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Cari transaksi..." className="w-full pl-11 pr-4 py-2.5 bg-[#F4F7FC] border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-[#5452F6] focus:ring-1 focus:ring-[#5452F6] transition-all" />
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

          <div className="flex-1 overflow-y-auto p-8 pb-12">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Barang Keluar</h1>
              <p className="text-sm text-gray-500 mt-1">Kelola transaksi pengeluaran stok inventaris</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Form Transaksi Keluar Baru */}
              <div className="lg:col-span-2 bg-white rounded-[20px] p-8 shadow-sm border border-gray-100 relative">
                <h3 className="text-base font-bold text-gray-800 mb-1">Transaksi Keluar Baru</h3>
                <p className="text-xs text-gray-400 mb-8 font-medium">Daftarkan alat tulis kantor (ATK) yang keluar untuk distribusi divisi.</p>

                <div className="space-y-6">
                  {/* === CUSTOM DROPDOWN PILIH BARANG === */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Pilih Barang (ATK)</label>
                    <div className="relative">
                      <div 
                        onClick={() => !isLoadingBarang && setIsDropdownOpen(!isDropdownOpen)}
                        className={`w-full px-4 py-3 bg-[#F4F7FC] border ${isDropdownOpen ? 'border-[#5452F6] ring-1 ring-[#5452F6]' : 'border-gray-100'} rounded-xl text-sm flex justify-between items-center ${isLoadingBarang ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'} transition-all`}
                      >
                        {isLoadingBarang ? (
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
                                    className="px-4 py-3 hover:bg-[#F0EFFF] cursor-pointer flex items-center justify-between border-b border-gray-50 last:border-0 transition-colors group"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-white flex items-center justify-center shrink-0 border border-gray-100 transition-colors">
                                        <Box className="w-4 h-4 text-gray-400 group-hover:text-[#5452F6]" />
                                      </div>
                                      <div>
                                        <p className="text-xs font-bold text-gray-800 group-hover:text-[#5452F6]">{item.nama_barang}</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-medium mt-0.5">{item.id_referensi}</p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-[10px] text-gray-400 font-medium">Stok:</p>
                                      <p className={`text-xs font-bold ${item.stok <= item.stok_minimum ? 'text-red-500' : 'text-emerald-600'}`}>{item.stok}</p>
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

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Penerima</label>
                    <div className="relative">
                      <select className="w-full bg-[#F4F7FC] border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 appearance-none focus:outline-none focus:border-[#5452F6]">
                        <option>Contoh: Divisi Keuangan</option>
                        <option>Contoh: Divisi SDM</option>
                        <option>Contoh: PT. Maju Bersama Nusantara</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Jumlah</label>
                      <div className={`flex items-center bg-[#F4F7FC] border ${selectedBarang && !isStokCukup ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-100'} rounded-xl px-4 py-3 focus-within:ring-1 focus-within:ring-[#5452F6] focus-within:bg-white transition-colors`}>
                        <input 
                          type="number" 
                          value={jumlah}
                          onChange={(e) => setJumlah(e.target.value)}
                          className={`bg-transparent w-full text-sm font-semibold outline-none ${selectedBarang && !isStokCukup ? 'text-red-500' : 'text-gray-800'}`} 
                          placeholder="0" 
                        />
                        <span className="text-[10px] font-bold text-gray-400 ml-2 uppercase">
                          {selectedBarang ? selectedBarang.satuan : 'UNIT'}
                        </span>
                      </div>
                      {selectedBarang && !isStokCukup && (
                        <p className="text-[10px] font-bold text-red-500 mt-1.5 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Melebihi stok gudang!
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Harga Satuan</label>
                      <div className="flex items-center bg-[#F4F7FC] border border-gray-100 rounded-xl px-4 py-3 focus-within:ring-1 focus-within:ring-[#5452F6] focus-within:bg-white transition-colors">
                        <span className="text-[10px] font-bold text-gray-400 mr-2">IDR</span>
                        <input 
                          type="number" 
                          value={hargaSatuan}
                          onChange={(e) => setHargaSatuan(e.target.value)}
                          className="bg-transparent w-full text-sm font-semibold outline-none text-gray-800" 
                          placeholder="0" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative z-0">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Tanggal Keluar</label>
                    <div className="relative">
                      <input type="text" placeholder="mm/dd/yyyy" className="w-full bg-[#F4F7FC] border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#5452F6] focus:bg-white transition-colors" />
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button className="text-gray-400 text-sm font-bold hover:text-gray-600 transition-colors">Batalkan Draft</button>
                    <button 
                      onClick={handleKonfirmasiPengiriman}
                      disabled={!selectedBarang || !isStokCukup}
                      className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all ${
                        !selectedBarang || !isStokCukup 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-[#5452F6] text-white shadow-lg shadow-indigo-500/30 hover:bg-[#4341E3]'
                      }`}
                    >
                      Konfirmasi Pengiriman <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar Kanan Content */}
              <div className="space-y-8">
                
                {/* Status Inventaris Dinamis */}
                <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status Inventaris</p>
                      <h3 className="text-sm font-bold text-gray-800">Ketersediaan Stok</h3>
                    </div>
                    {selectedBarang ? (
                      isStokCukup ? (
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md uppercase border border-emerald-100">Mencukupi</span>
                      ) : (
                        <span className="text-[9px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md uppercase border border-red-100">Tidak Cukup</span>
                      )
                    ) : (
                      <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md uppercase">Pilih Barang</span>
                    )}
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-gray-500">Stok Gudang Saat Ini</span>
                      <span className="text-gray-800">
                        {selectedBarang ? `${currentStok} ${selectedBarang.satuan}` : '-'}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex">
                      {selectedBarang && isStokCukup && (
                         <>
                           <div className="h-full bg-gray-300 transition-all duration-500" style={{ width: `${100 - persentaseKeluar}%` }}></div>
                           <div className="h-full bg-red-400 transition-all duration-500" style={{ width: `${persentaseKeluar}%` }}></div>
                         </>
                      )}
                    </div>
                  </div>

                  <div className={`rounded-xl p-4 flex items-center gap-4 mb-4 border transition-colors ${selectedBarang && !isStokCukup ? 'bg-red-50 border-red-100' : 'bg-gray-50/50 border-gray-50'}`}>
                    <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm ${selectedBarang && !isStokCukup ? 'text-red-500' : 'text-[#5452F6]'}`}>
                      <Box className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${selectedBarang && !isStokCukup ? 'text-red-400' : 'text-gray-400'}`}>Proyeksi Sisa Stok</p>
                      <p className={`text-sm font-bold ${selectedBarang && !isStokCukup ? 'text-red-600' : 'text-gray-800'}`}>
                        {selectedBarang ? `${proyeksiStok} ${selectedBarang.satuan}` : '-'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#EEF2FF] p-4 rounded-xl flex gap-3 border border-indigo-50">
                    <Info className="w-4 h-4 text-[#5452F6] shrink-0 mt-0.5" />
                    <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                      {selectedBarang 
                        ? `Pengiriman ini mewakili ${persentaseKeluar}% dari total stok SKU spesifik saat ini.`
                        : `Silakan pilih barang untuk melihat proyeksi sisa stok setelah pengiriman.`
                      }
                    </p>
                  </div>
                </div>

                {/* Rute Tujuan Card */}
                <div className="bg-white rounded-[20px] overflow-hidden shadow-sm border border-gray-100 group relative h-48">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-110" 
                       style={{ backgroundImage: `url('https://api.maptiler.com/maps/basic-v2/static/110.42, -7.00, 10/600x400.png?key=get_your_own_key')` }}>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/20"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                    <div className="flex items-center gap-2 text-[9px] font-bold text-white/70 uppercase tracking-widest mb-2">
                      <MapPin className="w-3 h-3 text-[#5452F6]" /> Rute Tujuan
                    </div>
                    <h4 className="font-bold text-sm mb-1">Semarang Central Logistics</h4>
                    <p className="text-[10px] text-white/70 font-medium">Estimasi Tiba: 14 Okt, 16:30</p>
                  </div>
                </div>

                {/* Terakhir Keluar */}
                <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Terakhir Keluar</h3>
                    <button 
                      onClick={() => onNavigate('laporan')} 
                      className="text-[10px] font-bold text-[#5452F6] hover:underline"
                    >
                      LIHAT SEMUA
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        <div>
                          <p className="text-xs font-bold text-gray-800 leading-none">INV-98234</p>
                          <p className="text-[9px] text-gray-400 mt-1 font-medium">Divisi Keuangan</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-red-500">-15 rim</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        <div>
                          <p className="text-xs font-bold text-gray-800 leading-none">INV-98231</p>
                          <p className="text-[9px] text-gray-400 mt-1 font-medium">Divisi SDM</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-red-500">-5 pack</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ================= TABEL RIWAYAT BARANG KELUAR ================= */}
            <div className="mt-8 bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h3 className="text-base font-bold text-gray-800">Riwayat Barang Keluar</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">TANGGAL</th>
                                <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">BARANG</th>
                                <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">PENERIMA</th>
                                <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">JUMLAH</th>
                                <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">HARGA SATUAN</th>
                                <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">TOTAL</th>
                                <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">STATUS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {riwayatKeluar.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-6 text-sm font-medium text-gray-600">{item.tanggal}</td>
                                    <td className="py-4 px-6 text-sm font-bold text-gray-800">{item.barang}</td>
                                    <td className="py-4 px-6 text-sm font-medium text-gray-600">{item.penerima}</td>
                                    <td className="py-4 px-6 text-sm font-bold text-gray-800">{item.jumlah}</td>
                                    <td className="py-4 px-6 text-sm font-medium text-gray-600">{item.hargaSatuan}</td>
                                    <td className="py-4 px-6 text-sm font-bold text-gray-800">{item.total}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${item.statusColor}`}>
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
                    <p className="text-xs text-gray-500 font-medium">Menampilkan 4 dari 24 transaksi</p>
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
          id: '#OUT-' + Math.floor(10000 + Math.random() * 90000),
          barang: selectedBarang ? selectedBarang.nama_barang : 'Belum dipilih',
          jumlah: jumlah || '0'
        }}
      />
    </>
  );
};

export default BarangKeluar;