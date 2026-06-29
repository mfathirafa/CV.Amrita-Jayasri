import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Box, Users, Truck, ArrowDownRight,
  ArrowUpRight, Activity, BarChart2, ArrowDownLeft,
  Search, Bell, CircleUser, ChevronDown, CalendarDays,
  Package, PenTool, Zap, CheckCircle2, ChevronLeft, ChevronRight, Loader2, Plus,
  Menu, X
} from 'lucide-react';

import SuccessTransactionModal from './SuccessTransactionModal';
import logoAmrita from './assets/Logo Amrita.png';

const BarangMasuk = ({ onNavigate, onLogout }) => {
  // === STATE UNTUK MENU HP ===
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // === STATE UNTUK KONTROL DROPDOWN & FORM ===
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchBarang, setSearchBarang] = useState('');
  const [selectedBarang, setSelectedBarang] = useState(null);

  const [jumlah, setJumlah] = useState('');
  const [hargaBeli, setHargaBeli] = useState('');
  const [tanggalMasuk, setTanggalMasuk] = useState('');

  // State Form Pemasok (Supplier)
  const [isPemasokBaru, setIsPemasokBaru] = useState(false); // Mode toggle
  const [pemasokId, setPemasokId] = useState(''); // Untuk supplier lama
  const [namaPemasokBaru, setNamaPemasokBaru] = useState(''); // Untuk supplier baru
  const [alamatPemasokBaru, setAlamatPemasokBaru] = useState(''); // Untuk supplier baru
  const [teleponPemasokBaru, setTeleponPemasokBaru] = useState(''); // Untuk supplier baru

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // === STATE UNTUK DATA API ===
  const [daftarBarang, setDaftarBarang] = useState([]);
  const [daftarPemasok, setDaftarPemasok] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // === AMBIL DATA MASTER BARANG & PEMASOK DARI API ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const rawApiUrl = import.meta.env.VITE_API_URL || 'https://cvamritajayasri.my.id/api';
        const cleanApiUrl = rawApiUrl.replace(/\/$/, "");

        const baseApi = cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`;

        const headers = {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        // Helper to fetch all pages
        const fetchAllPages = async (endpoint) => {
          let allData = [];
          let currentPage = 1;
          let lastPage = 1;
          let hasMore = true;

          while (hasMore) {
            const url = `${endpoint}?per_page=1000&page=${currentPage}`;
            const response = await fetch(url, { method: 'GET', headers });
            const data = await response.json();

            if (response.ok || data.success) {
              let arrayData = [];
              if (Array.isArray(data)) arrayData = data;
              else if (Array.isArray(data.data)) arrayData = data.data;
              else if (data.data && Array.isArray(data.data.data)) arrayData = data.data.data;

              allData = [...allData, ...arrayData];

              let extractedLastPage = 1;
              if (data.last_page) extractedLastPage = data.last_page;
              else if (data.meta && data.meta.last_page) extractedLastPage = data.meta.last_page;
              else if (data.data && data.data.last_page) extractedLastPage = data.data.last_page;

              lastPage = Math.max(lastPage, extractedLastPage);

              if (arrayData.length < 1000 || currentPage >= lastPage) {
                hasMore = false;
              } else {
                currentPage++;
              }
            } else {
              hasMore = false;
            }
          }
          return allData;
        };

        // Fetch Data Barang (Semua Data)
        const allBarang = await fetchAllPages(`${baseApi}/barang`);
        setDaftarBarang(allBarang);

        // Fetch Data Pemasok (Supplier) (Semua Data)
        const allPemasok = await fetchAllPages(`${baseApi}/supplier`);
        setDaftarPemasok(allPemasok);

        // Set tanggal default ke hari ini
        const today = new Date().toISOString().split('T')[0];
        setTanggalMasuk(today);

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

  const filteredBarang = daftarBarang.filter(item => {
    const nama = String(item.nama_barang || '').replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"');
    const ref = item.id_referensi || '';
    const search = searchBarang.toLowerCase();
    return nama.toLowerCase().includes(search) || ref.toLowerCase().includes(search);
  });

  const handleSelectBarang = (item) => {
    setSelectedBarang(item);
    setIsDropdownOpen(false);
    setSearchBarang('');
    if (item.harga) {
      setHargaBeli(Math.floor(Number(item.harga)).toString());
    }
  };

  // === FUNGSI NAVIGASI HP ===
  const handleNavigation = (path) => {
    setIsMobileMenuOpen(false);
    onNavigate(path);
  };

  // === FUNGSI EKSEKUSI API POST TRANSAKSI MASUK ===
  const handleSimpanTransaksi = async () => {
    // 1. Validasi Input agar tidak ada form kosong
    if (!selectedBarang || !jumlah || !hargaBeli || !tanggalMasuk) {
      alert("Data Barang, Jumlah, Harga Beli, dan Tanggal harus diisi!");
      return;
    }

    // Validasi Pemasok
    if (isPemasokBaru && (!namaPemasokBaru || !alamatPemasokBaru || !teleponPemasokBaru)) {
      alert("Mohon lengkapi form data Supplier Baru (Nama, Alamat, Telepon).");
      return;
    }
    if (!isPemasokBaru && !pemasokId) {
      alert("Mohon pilih Supplier dari daftar.");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const rawApiUrl = import.meta.env.VITE_API_URL || 'https://cvamritajayasri.my.id/api';
      const cleanApiUrl = rawApiUrl.replace(/\/$/, "");
      const baseApi = cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`;

      // 2. Siapkan Payload untuk API
      const payload = {
        barang_id: selectedBarang.id,
        jumlah: parseInt(jumlah, 10),
        harga_beli: parseFloat(hargaBeli),
        tanggal_masuk: tanggalMasuk
      };

      if (isPemasokBaru) {
        payload.nama_supplier = namaPemasokBaru;
        payload.alamat_supplier = alamatPemasokBaru;
        payload.telepon_supplier = teleponPemasokBaru;
      } else {
        payload.supplier_id = parseInt(pemasokId, 10);
      }

      // 3. Eksekusi Request POST
      const response = await fetch(`${baseApi}/transaksi-masuk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const json = await response.json();

      // 4. Handle Respons
      if (response.ok && json.success) {
        setIsSuccessModalOpen(true);

        // Bersihkan form setelah sukses
        setSelectedBarang(null);
        setPemasokId('');
        setNamaPemasokBaru('');
        setAlamatPemasokBaru('');
        setTeleponPemasokBaru('');
        setJumlah('');
        setHargaBeli('');
      } else {
        alert(json.message || "Gagal menyimpan transaksi masuk.");
      }
    } catch (error) {
      console.error("Error Simpan Transaksi:", error);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">

        {/* ================= MOBILE OVERLAY ================= */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* ================= SIDEBAR RESPONSIF ================= */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-gray-100 flex flex-col shrink-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* LOGO DI SINI */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden bg-gray-50">
                <img src={logoAmrita} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-[#5452F6] font-bold text-[13px] leading-tight tracking-wide uppercase">
                  CV. AMRITA<br />JAYASRI
                </h1>
                <p className="text-gray-400 font-medium text-[10px] mt-0.5">Sistem Inventaris ATK</p>
              </div>
            </div>
            {/* Tombol Tutup Sidebar di HP */}
            <button className="md:hidden text-gray-400 hover:text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-2 scrollbar-hide">
            <button onClick={() => handleNavigation('dashboard')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </button>
            <button onClick={() => handleNavigation('data-barang')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
              <Box className="w-5 h-5" /> Data Barang
            </button>
            <button onClick={() => handleNavigation('pemasok')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
              <Truck className="w-5 h-5" /> Pemasok
            </button>
            <button onClick={() => handleNavigation('konsumen')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
              <Users className="w-5 h-5" /> Konsumen
            </button>
            <button onClick={() => handleNavigation('barang-masuk')} className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0EFFF] text-[#5452F6] rounded-xl font-bold text-sm transition-colors text-left">
              <ArrowDownRight className="w-5 h-5" /> Barang Masuk
            </button>
            <button onClick={() => handleNavigation('barang-keluar')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
              <ArrowUpRight className="w-5 h-5" /> Barang Keluar
            </button>
            <button onClick={() => handleNavigation('monitoring-stok')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
              <Activity className="w-5 h-5" /> Monitoring Stok
            </button>
            <button onClick={() => handleNavigation('laporan')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
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
        <main className="flex-1 flex flex-col overflow-hidden relative w-full">

          {/* === HEADER RESPONSIF === */}
          <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0 shrink-0">
            <div className="flex items-center gap-3">
              <button className="md:hidden text-gray-500 hover:text-gray-800 p-1" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="font-bold text-[#1E232C] text-sm md:text-base hidden sm:block">SIMPB - CV. Amrita Jayasri</h2>
              <h2 className="font-bold text-[#1E232C] text-sm sm:hidden">SIMPB</h2>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <div className="relative w-72 hidden md:block">
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
              <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(prev => !prev)}
                  className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                >
                  <CircleUser className="w-7 h-7 md:w-8 md:h-8 text-[#5452F6]" strokeWidth={1.5} />
                  <span className="text-sm font-semibold text-[#1E232C] hidden md:block">Administrator</span>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-1 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-800">Administrator</p>
                      <p className="text-[10px] text-gray-400 truncate">admin@amrita.com</p>
                    </div>
                    <button
                      onClick={() => { setIsProfileOpen(false); onLogout && onLogout(); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors rounded-b-xl"
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-12 relative w-full">
            {/* Konten Utama */}
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end mb-6 md:mb-8 gap-4 md:gap-4">
              <div>
                <p className="text-[10px] md:text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Manajemen Inventaris</p>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Catat Kiriman Masuk</h1>
                <p className="text-xs md:text-sm text-gray-500 mt-1 max-w-xl">Tambahkan kedatangan stok baru ke gudang pusat. Pastikan semua detail sesuai dengan faktur fisik untuk kepatuhan audit.</p>
              </div>

              <div className="bg-white rounded-[16px] md:rounded-[20px] p-4 md:p-5 shadow-sm border border-gray-100 flex gap-3 md:gap-4 items-center shrink-0 w-full md:w-auto">
                <div className="w-10 h-10 rounded-lg bg-[#EBF4FF] flex items-center justify-center shrink-0">
                  <BarChart2 className="w-5 h-5 text-[#5452F6]" />
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">VOLUME HARIAN</p>
                  <div className="flex items-end gap-2">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-none">124</h3>
                    <span className="text-[10px] md:text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

              {/* KOLOM FORM KIRI */}
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                <div className="bg-white rounded-[20px] p-4 md:p-8 shadow-sm border border-gray-100 flex flex-col relative">
                  <div className="flex justify-between items-center mb-4 md:mb-6">
                    <h3 className="text-sm md:text-base font-bold text-gray-800">Detail Transaksi</h3>
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-gray-300" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                    {/* PILIH BARANG */}
                    <div>
                      <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 md:mb-2">PILIH BARANG</label>
                      <div className="relative">
                        <div
                          onClick={() => !isLoading && setIsDropdownOpen(!isDropdownOpen)}
                          className={`w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#F4F7FC] border ${isDropdownOpen ? 'border-[#5452F6] ring-1 ring-[#5452F6]' : 'border-gray-100'} rounded-xl text-xs md:text-sm flex justify-between items-center ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'} transition-all`}
                        >
                          {isLoading ? (
                            <div className="flex items-center text-gray-500">
                              <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin mr-2" /> Memuat data...
                            </div>
                          ) : (
                            <>
                              <span className={selectedBarang ? 'text-gray-800 font-semibold truncate pr-2' : 'text-gray-500'}>
                                {selectedBarang ? String(selectedBarang.nama_barang || '').replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"') : 'Pilih barang...'}
                              </span>
                              <ChevronDown className={`w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 transition-transform shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </>
                          )}
                        </div>

                        {isDropdownOpen && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                            <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 max-w-[calc(100vw-2rem)] md:max-w-none">
                              <div className="p-2 md:p-3 border-b border-gray-50 bg-gray-50/50">
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
                                  <input
                                    type="text"
                                    placeholder="Cari nama barang atau SKU..."
                                    value={searchBarang}
                                    onChange={(e) => setSearchBarang(e.target.value)}
                                    className="w-full pl-8 md:pl-9 pr-3 py-2 md:py-2.5 bg-white border border-gray-200 rounded-lg text-[10px] md:text-xs focus:outline-none focus:border-[#5452F6] transition-colors"
                                    autoFocus
                                  />
                                </div>
                              </div>
                              <div className="max-h-48 md:max-h-56 overflow-y-auto">
                                {filteredBarang.length > 0 ? (
                                  filteredBarang.map((item) => (
                                    <div
                                      key={item.id}
                                      onClick={() => handleSelectBarang(item)}
                                      className="px-3 md:px-4 py-2.5 md:py-3 hover:bg-[#F0EFFF] cursor-pointer flex items-center gap-2.5 md:gap-3 border-b border-gray-50 last:border-0 transition-colors group"
                                    >
                                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gray-50 group-hover:bg-white flex items-center justify-center shrink-0 border border-gray-100 transition-colors">
                                        <Box className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 group-hover:text-[#5452F6]" />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-[11px] md:text-xs font-bold text-gray-800 group-hover:text-[#5452F6] truncate">{String(item.nama_barang || '').replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"')}</p>
                                        <p className="text-[9px] md:text-[10px] text-gray-400 uppercase font-medium mt-0.5 truncate">{item.id_referensi}</p>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="px-4 py-6 text-center text-[10px] md:text-xs text-gray-500 font-medium">
                                    Pencarian tidak ditemukan.
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* PILIH PEMASOK */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5 md:mb-2">
                        <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">PILIH SUPPLIER</label>
                        <button
                          onClick={() => setIsPemasokBaru(!isPemasokBaru)}
                          className="text-[9px] md:text-[10px] font-bold text-[#5452F6] hover:underline uppercase flex items-center gap-1"
                        >
                          {isPemasokBaru ? 'Pilih Dari Daftar' : <><Plus className="w-2.5 h-2.5 md:w-3 md:h-3" /> Tambah Baru</>}
                        </button>
                      </div>

                      {isPemasokBaru ? (
                        <div className="p-3 md:p-4 bg-[#F0EFFF]/50 border border-indigo-100 rounded-xl space-y-2.5 md:space-y-3 animate-in fade-in">
                          <input
                            type="text"
                            placeholder="Nama Supplier / Pemasok..."
                            value={namaPemasokBaru}
                            onChange={(e) => setNamaPemasokBaru(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm focus:outline-none focus:border-[#5452F6]"
                          />
                          <input
                            type="text"
                            placeholder="Alamat Lengkap..."
                            value={alamatPemasokBaru}
                            onChange={(e) => setAlamatPemasokBaru(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm focus:outline-none focus:border-[#5452F6]"
                          />
                          <input
                            type="tel"
                            placeholder="Nomor Telepon..."
                            value={teleponPemasokBaru}
                            onChange={(e) => setTeleponPemasokBaru(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm focus:outline-none focus:border-[#5452F6]"
                          />
                        </div>
                      ) : (
                        <div className="relative animate-in fade-in">
                          <select
                            value={pemasokId}
                            onChange={(e) => setPemasokId(e.target.value)}
                            disabled={isLoading}
                            className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#F4F7FC] border border-gray-100 rounded-xl text-xs md:text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#5452F6] appearance-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            <option value="">-- Pilih Pemasok --</option>
                            {daftarPemasok.map((supplier) => (
                              <option key={supplier.id} value={supplier.id}>
                                {String(supplier.nama_supplier || '').replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"')}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 pointer-events-none" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                    {/* Jumlah */}
                    <div>
                      <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 md:mb-2">JUMLAH (QTY)</label>
                      <div className="flex items-center bg-[#F4F7FC] border border-gray-100 rounded-xl px-3 md:px-4 py-2.5 md:py-3 focus-within:ring-1 focus-within:ring-[#5452F6] focus-within:bg-white transition-colors">
                        <input
                          type="number"
                          placeholder="0"
                          value={jumlah}
                          onChange={(e) => setJumlah(e.target.value)}
                          className="bg-transparent text-xs md:text-sm font-semibold text-gray-800 focus:outline-none flex-grow min-w-0"
                        />
                        <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase ml-2 tracking-wider shrink-0">UNIT</span>
                      </div>
                    </div>
                    {/* Harga Beli */}
                    <div>
                      <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 md:mb-2">HARGA BELI</label>
                      <div className="flex items-center bg-[#F4F7FC] border border-gray-100 rounded-xl px-3 md:px-4 py-2.5 md:py-3 focus-within:ring-1 focus-within:ring-[#5452F6] focus-within:bg-white transition-colors">
                        <span className="text-xs md:text-sm font-bold text-gray-400 mr-2 shrink-0">Rp</span>
                        <input
                          type="number"
                          placeholder="0"
                          value={hargaBeli}
                          onChange={(e) => setHargaBeli(e.target.value)}
                          className="bg-transparent text-xs md:text-sm font-semibold text-gray-800 focus:outline-none flex-grow min-w-0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tanggal */}
                  <div className="mb-6 md:mb-8 z-0 relative">
                    <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 md:mb-2">TANGGAL KEDATANGAN</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={tanggalMasuk}
                        onChange={(e) => setTanggalMasuk(e.target.value)}
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#F4F7FC] border border-gray-100 rounded-xl text-xs md:text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#5452F6] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Tombol Simpan */}
                  <button
                    onClick={handleSimpanTransaksi}
                    disabled={isSubmitting}
                    className="w-full py-3 md:py-3.5 bg-[#5452F6] hover:bg-[#4341E3] text-white rounded-xl text-xs md:text-sm font-bold transition-all shadow-lg shadow-indigo-500/30 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-auto"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" /> Menyimpan...</>
                    ) : (
                      "Simpan Transaksi"
                    )}
                  </button>
                </div>
              </div>

              {/* KOLOM KANAN (Masuk Terbaru) */}
              <div className="space-y-6 md:space-y-8">
                <div className="bg-white rounded-[20px] p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col h-full lg:h-auto">
                  <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
                    <ArrowDownRight className="w-4 h-4 text-[#5452F6]" /> Masuk Terbaru
                  </h3>
                  <div className="space-y-4 mb-4 md:mb-6 flex-1">
                    {masukTerbaru.map((item, index) => (
                      <div key={index} className="flex justify-between items-center gap-2 md:gap-4 border-b border-gray-50 pb-3 md:pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
                          <div className={`w-8 h-8 md:w-9 md:h-9 ${item.bgColor} rounded-lg flex items-center justify-center shrink-0`}>
                            <item.icon className={`w-4 h-4 md:w-4.5 md:h-4.5 ${item.iconColor}`} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs md:text-sm font-bold text-gray-800 truncate">{item.name}</p>
                            <p className="text-[9px] md:text-[10px] text-gray-500 font-medium truncate">{item.details}</p>
                          </div>
                        </div>
                        <span className="text-[10px] md:text-xs font-bold text-gray-800 shrink-0">{item.price}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => onNavigate('laporan')}
                    className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-[#5452F6] text-[10px] md:text-xs font-bold rounded-xl transition-colors mt-auto border border-gray-100"
                  >
                    LIHAT SEMUA TRANSAKSI
                  </button>
                </div>
              </div>
            </div>

            {/* TABEL RIWAYAT */}
            <div className="mt-6 md:mt-8 bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-6 py-4 md:py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                <h3 className="text-sm md:text-base font-bold text-gray-800">Riwayat Barang Masuk</h3>
              </div>
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[700px] md:min-w-[900px]">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="py-3 md:py-4 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">TANGGAL</th>
                      <th className="py-3 md:py-4 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">BARANG</th>
                      <th className="py-3 md:py-4 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">PEMASOK</th>
                      <th className="py-3 md:py-4 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">JUMLAH</th>
                      <th className="py-3 md:py-4 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">HARGA BELI</th>
                      <th className="py-3 md:py-4 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">TOTAL</th>
                      <th className="py-3 md:py-4 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {riwayatMasuk.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 md:py-4 px-4 md:px-6 text-xs md:text-sm font-medium text-gray-600 whitespace-nowrap">{item.tanggal}</td>
                        <td className="py-3 md:py-4 px-4 md:px-6 text-xs md:text-sm font-bold text-gray-800 min-w-[150px]">{item.barang}</td>
                        <td className="py-3 md:py-4 px-4 md:px-6 text-xs md:text-sm font-medium text-gray-600 max-w-[150px] md:max-w-[200px] truncate">{item.pemasok}</td>
                        <td className="py-3 md:py-4 px-4 md:px-6 text-xs md:text-sm font-bold text-gray-800">{item.jumlah}</td>
                        <td className="py-3 md:py-4 px-4 md:px-6 text-xs md:text-sm font-medium text-gray-600 whitespace-nowrap">{item.hargaBeli}</td>
                        <td className="py-3 md:py-4 px-4 md:px-6 text-xs md:text-sm font-bold text-[#5452F6] whitespace-nowrap">{item.total}</td>
                        <td className="py-3 md:py-4 px-4 md:px-6">
                          <span className="px-2.5 md:px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 md:mt-12 text-center">
              <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">© 2026 CV. AMRITA JAYASRI • MANAJEMEN INVENTARIS BERKINERJA TINGGI</p>
            </div>

          </div>
        </main>
      </div>

      <SuccessTransactionModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onNavigate={onNavigate}
        transactionData={{
          id: '#TRX-' + Math.floor(10000 + Math.random() * 90000),
          barang: selectedBarang ? String(selectedBarang.nama_barang || '').replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"') : 'Belum dipilih',
          jumlah: jumlah || '0'
        }}
      />
    </>
  );
};

export default BarangMasuk;