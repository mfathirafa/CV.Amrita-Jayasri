import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Box, Truck, Users, ArrowDownRight, 
  ArrowUpRight, Activity, BarChart2, ArrowDownLeft, 
  Search, Bell, CircleUser, ChevronDown, CalendarDays,
  Package, PenTool, Zap, CheckCircle2, ChevronLeft, ChevronRight, Loader2, Plus,
  Menu, X 
} from 'lucide-react';

import SuccessTransactionModal from './SuccessTransactionModal';
import logoAmrita from './assets/Logo Amrita.png';

const BarangKeluar = ({ onLogout, onNavigate }) => {
  // === STATE UNTUK MENU HP ===
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // === STATE UNTUK KONTROL DROPDOWN & FORM ===
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchBarang, setSearchBarang] = useState('');
  const [selectedBarang, setSelectedBarang] = useState(null);
  
  // State Form Barang
  const [jumlah, setJumlah] = useState('');
  const [hargaSatuan, setHargaSatuan] = useState('');
  const [tanggalKeluar, setTanggalKeluar] = useState('');
  const [keterangan, setKeterangan] = useState('');
  
  // State Form Konsumen (Penerima)
  const [isKonsumenBaru, setIsKonsumenBaru] = useState(false); // Mode toggle
  const [selectedKonsumenId, setSelectedKonsumenId] = useState(''); // Untuk konsumen lama
  const [namaKonsumenBaru, setNamaKonsumenBaru] = useState(''); // Untuk konsumen baru
  const [alamatKonsumenBaru, setAlamatKonsumenBaru] = useState(''); // Untuk konsumen baru
  const [teleponKonsumenBaru, setTeleponKonsumenBaru] = useState(''); // Untuk konsumen baru
  
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastTransactionData, setLastTransactionData] = useState(null);

  // === STATE UNTUK DATA API ===
  const [daftarBarang, setDaftarBarang] = useState([]);
  const [isLoadingBarang, setIsLoadingBarang] = useState(true);
  
  const [daftarKonsumen, setDaftarKonsumen] = useState([]);
  const [isLoadingKonsumen, setIsLoadingKonsumen] = useState(true);

  // === AMBIL DATA MASTER BARANG & KONSUMEN DARI API ===
  useEffect(() => {
    const fetchMasterData = async () => {
      const token = localStorage.getItem('token');
      const rawApiUrl = import.meta.env.VITE_API_URL || 'https://cvamritajayasri.my.id/api';
      const cleanApiUrl = rawApiUrl.replace(/\/$/, ""); 
      const baseApi = cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`;
      
      const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // 1. Fetch Barang
      try {
        setIsLoadingBarang(true);
        const resBarang = await fetch(`${baseApi}/barang`, { method: 'GET', headers });
        const dataBarang = await resBarang.json();
        if (resBarang.ok) {
          setDaftarBarang(Array.isArray(dataBarang) ? dataBarang : (dataBarang.data || []));
        }
      } catch (error) {
        console.error("Error Fetching Barang:", error);
      } finally {
        setIsLoadingBarang(false);
      }

      // 2. Fetch Konsumen (Untuk Dropdown Penerima)
      try {
        setIsLoadingKonsumen(true);
        const resKonsumen = await fetch(`${baseApi}/konsumen`, { method: 'GET', headers });
        const dataKonsumen = await resKonsumen.json();
        if (resKonsumen.ok) {
          setDaftarKonsumen(Array.isArray(dataKonsumen) ? dataKonsumen : (dataKonsumen.data || []));
        }
      } catch (error) {
        console.error("Error Fetching Konsumen:", error);
      } finally {
        setIsLoadingKonsumen(false);
      }
    };

    fetchMasterData();
    
    const today = new Date().toISOString().split('T')[0];
    setTanggalKeluar(today);
  }, []);

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
    if (item.harga) {
        setHargaSatuan(Math.floor(Number(item.harga)).toString());
    }
  };

  // === FUNGSI NAVIGASI HP ===
  const handleNavigation = (path) => {
    setIsMobileMenuOpen(false);
    onNavigate(path);
  };

  // === FUNGSI SIMPAN (POST) TRANSAKSI KELUAR ===
  const handleKonfirmasiPengiriman = async () => {
    // Validasi Umum
    if (!selectedBarang || !jumlah || !hargaSatuan || !tanggalKeluar) {
        alert("Mohon lengkapi data barang, jumlah, harga, dan tanggal.");
        return;
    }

    // Validasi Konsumen
    if (isKonsumenBaru && (!namaKonsumenBaru || !alamatKonsumenBaru || !teleponKonsumenBaru)) {
        alert("Mohon lengkapi form data Konsumen Baru (Nama, Alamat, Telepon).");
        return;
    }
    if (!isKonsumenBaru && !selectedKonsumenId) {
        alert("Mohon pilih Konsumen Penerima dari daftar.");
        return;
    }

    // Validasi Stok
    if (Number(jumlah) > selectedBarang.stok) {
        alert("Peringatan: Jumlah barang keluar melebihi stok yang ada di gudang!");
        return;
    }

    // Susun Payload Dasar
    const payload = {
        barang_id: selectedBarang.id,
        jumlah: Number(jumlah),
        harga_jual: Number(hargaSatuan),
        tanggal_keluar: tanggalKeluar,
    };

    // Tambahkan Payload Konsumen (Pilih Mode: Baru atau Lama)
    if (isKonsumenBaru) {
        payload.nama_konsumen = namaKonsumenBaru;
        payload.alamat_konsumen = alamatKonsumenBaru;
        payload.telepon_konsumen = teleponKonsumenBaru;
    } else {
        const konsumenTerpilih = daftarKonsumen.find(k => k.id.toString() === selectedKonsumenId);
        payload.konsumen_id = Number(selectedKonsumenId);
        payload.nama_instansi = konsumenTerpilih ? konsumenTerpilih.nama_konsumen : "Umum";
    }

    // Opsional Keterangan
    if (keterangan) {
        payload.keterangan = keterangan;
    }

    try {
        setIsSubmitting(true);
        const token = localStorage.getItem('token');
        const rawApiUrl = import.meta.env.VITE_API_URL || 'https://cvamritajayasri.my.id/api';
        const cleanApiUrl = rawApiUrl.replace(/\/$/, ""); 
        const baseApi = cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`;

        // URL DIUPDATE MENJADI /transaksi-keluar
        const response = await fetch(`${baseApi}/transaksi-keluar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const json = await response.json();

        if (response.ok && json.success) {
            // Capture data transaksi SEBELUM form direset
            setLastTransactionData({
                id: '#OUT-' + (json.data?.id || Math.floor(10000 + Math.random() * 90000)),
                barang: selectedBarang ? selectedBarang.nama_barang : '-',
                jumlah: jumlah || '0'
            });
            setIsSuccessModalOpen(true);
            handleBatalkanDraft(); // Reset form setelah sukses
        } else {
            alert(`Gagal: ${json.message || "Terjadi kesalahan saat menyimpan transaksi"}`);
        }
    } catch (error) {
        console.error("Error submitting transaksi:", error);
        alert("Terjadi kesalahan koneksi jaringan.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleBatalkanDraft = () => {
      setSelectedBarang(null);
      setJumlah('');
      setHargaSatuan('');
      setSelectedKonsumenId('');
      setNamaKonsumenBaru('');
      setAlamatKonsumenBaru('');
      setTeleponKonsumenBaru('');
      setKeterangan('');
  };

  const currentStok = selectedBarang ? selectedBarang.stok : 0;
  const proyeksiStok = selectedBarang ? currentStok - (Number(jumlah) || 0) : 0;
  const persentaseKeluar = currentStok > 0 ? ((Number(jumlah) || 0) / currentStok * 100).toFixed(1) : 0;
  const isStokCukup = proyeksiStok >= 0;

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
              {/* LOGO BARU */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden bg-gray-50">
                <img src={logoAmrita} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-[#5452F6] font-bold text-[13px] leading-tight tracking-wide uppercase">
                  CV. AMRITA<br/>JAYASRI
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
            <button onClick={() => handleNavigation('barang-masuk')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
              <ArrowDownRight className="w-5 h-5" /> Barang Masuk
            </button>
            <button onClick={() => handleNavigation('barang-keluar')} className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0EFFF] text-[#5452F6] rounded-xl font-bold text-sm transition-colors text-left">
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
                <input type="text" placeholder="Cari transaksi..." className="w-full pl-11 pr-4 py-2.5 bg-[#F4F7FC] border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-[#5452F6] focus:ring-1 focus:ring-[#5452F6] transition-all" />
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

          <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-12 w-full">
            <div className="mb-6 md:mb-8">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Barang Keluar</h1>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Kelola transaksi pengeluaran stok inventaris</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
              {/* Form Transaksi Keluar Baru */}
              <div className="lg:col-span-2 bg-white rounded-[20px] p-4 md:p-8 shadow-sm border border-gray-100 relative">
                <h3 className="text-sm md:text-base font-bold text-gray-800 mb-1">Transaksi Keluar Baru</h3>
                <p className="text-[10px] md:text-xs text-gray-400 mb-6 md:mb-8 font-medium">Daftarkan alat tulis kantor (ATK) yang keluar untuk distribusi divisi.</p>

                <div className="space-y-4 md:space-y-6">
                  {/* DROPDOWN PILIH BARANG */}
                  <div>
                    <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 md:mb-2">Pilih Barang (ATK)</label>
                    <div className="relative">
                      <div 
                        onClick={() => !isLoadingBarang && setIsDropdownOpen(!isDropdownOpen)}
                        className={`w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#F4F7FC] border ${isDropdownOpen ? 'border-[#5452F6] ring-1 ring-[#5452F6]' : 'border-gray-100'} rounded-xl text-xs md:text-sm flex justify-between items-center ${isLoadingBarang ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'} transition-all`}
                      >
                        {isLoadingBarang ? (
                            <div className="flex items-center text-gray-500">
                                <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin mr-2" /> Memuat data...
                            </div>
                        ) : (
                            <>
                                <span className={selectedBarang ? 'text-gray-800 font-semibold truncate pr-2' : 'text-gray-500'}>
                                  {selectedBarang ? selectedBarang.nama_barang : 'Pilih barang...'}
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
                                    className="px-3 md:px-4 py-2.5 md:py-3 hover:bg-[#F0EFFF] cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-50 last:border-0 transition-colors group gap-2 md:gap-0"
                                  >
                                    <div className="flex items-center gap-2.5 md:gap-3 w-full md:w-auto">
                                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gray-50 group-hover:bg-white flex items-center justify-center shrink-0 border border-gray-100 transition-colors">
                                        <Box className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 group-hover:text-[#5452F6]" />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-[11px] md:text-xs font-bold text-gray-800 group-hover:text-[#5452F6] truncate">{item.nama_barang}</p>
                                        <p className="text-[9px] md:text-[10px] text-gray-400 uppercase font-medium mt-0.5 truncate">{item.id_referensi}</p>
                                      </div>
                                    </div>
                                    <div className="text-left md:text-right pl-9 md:pl-0 w-full md:w-auto">
                                      <p className="text-[9px] md:text-[10px] text-gray-400 font-medium inline md:block mr-1 md:mr-0">Stok:</p>
                                      <p className={`text-[10px] md:text-xs font-bold inline md:block ${item.stok <= item.stok_minimum ? 'text-red-500' : 'text-emerald-600'}`}>{item.stok}</p>
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

                  {/* KONSUMEN (PENERIMA) - DENGAN FITUR TAMBAH BARU */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5 md:mb-2">
                      <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Penerima (Konsumen)</label>
                      <button 
                        onClick={() => setIsKonsumenBaru(!isKonsumenBaru)}
                        className="text-[9px] md:text-[10px] font-bold text-[#5452F6] hover:underline uppercase flex items-center gap-1"
                      >
                        {isKonsumenBaru ? 'Pilih Dari Daftar' : <><Plus className="w-2.5 h-2.5 md:w-3 md:h-3" /> Tambah Baru</>}
                      </button>
                    </div>

                    {isKonsumenBaru ? (
                      <div className="p-3 md:p-4 bg-[#F0EFFF]/50 border border-indigo-100 rounded-xl space-y-2.5 md:space-y-3 animate-in fade-in">
                        <input 
                          type="text" 
                          placeholder="Nama Instansi / Konsumen..." 
                          value={namaKonsumenBaru}
                          onChange={(e) => setNamaKonsumenBaru(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm focus:outline-none focus:border-[#5452F6]"
                        />
                        <input 
                          type="text" 
                          placeholder="Alamat Lengkap..." 
                          value={alamatKonsumenBaru}
                          onChange={(e) => setAlamatKonsumenBaru(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm focus:outline-none focus:border-[#5452F6]"
                        />
                        <input 
                          type="tel" 
                          placeholder="Nomor Telepon..." 
                          value={teleponKonsumenBaru}
                          onChange={(e) => setTeleponKonsumenBaru(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm focus:outline-none focus:border-[#5452F6]"
                        />
                      </div>
                    ) : (
                      <div className="relative animate-in fade-in">
                        <select 
                          value={selectedKonsumenId}
                          onChange={(e) => setSelectedKonsumenId(e.target.value)}
                          className="w-full bg-[#F4F7FC] border border-gray-100 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm text-gray-700 appearance-none focus:outline-none focus:border-[#5452F6]"
                        >
                          <option value="" disabled>Pilih Instansi / Konsumen Penerima...</option>
                          {isLoadingKonsumen ? (
                            <option disabled>Memuat data konsumen...</option>
                          ) : (
                            daftarKonsumen.map(konsumen => (
                              <option key={konsumen.id} value={konsumen.id}>
                                {konsumen.nama_konsumen}
                              </option>
                            ))
                          )}
                        </select>
                        <ChevronDown className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 pointer-events-none" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 md:mb-2">Jumlah</label>
                      <div className={`flex items-center bg-[#F4F7FC] border ${selectedBarang && !isStokCukup ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-100'} rounded-xl px-3 md:px-4 py-2.5 md:py-3 focus-within:ring-1 focus-within:ring-[#5452F6] focus-within:bg-white transition-colors`}>
                        <input 
                          type="number" 
                          value={jumlah}
                          onChange={(e) => setJumlah(e.target.value)}
                          className={`bg-transparent w-full text-xs md:text-sm font-semibold outline-none min-w-0 ${selectedBarang && !isStokCukup ? 'text-red-500' : 'text-gray-800'}`} 
                          placeholder="0" 
                        />
                        <span className="text-[9px] md:text-[10px] font-bold text-gray-400 ml-2 uppercase shrink-0">
                          {selectedBarang ? selectedBarang.satuan : 'UNIT'}
                        </span>
                      </div>
                      {selectedBarang && !isStokCukup && (
                        <p className="text-[9px] md:text-[10px] font-bold text-red-500 mt-1.5 flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5 md:w-3 md:h-3" /> Melebihi stok gudang!
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 md:mb-2">Harga Satuan</label>
                      <div className="flex items-center bg-[#F4F7FC] border border-gray-100 rounded-xl px-3 md:px-4 py-2.5 md:py-3 focus-within:ring-1 focus-within:ring-[#5452F6] focus-within:bg-white transition-colors">
                        <span className="text-[10px] font-bold text-gray-400 mr-2 shrink-0">IDR</span>
                        <input 
                          type="number" 
                          value={hargaSatuan}
                          onChange={(e) => setHargaSatuan(e.target.value)}
                          className="bg-transparent w-full text-xs md:text-sm font-semibold outline-none text-gray-800 min-w-0" 
                          placeholder="0" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative z-0">
                    <div>
                      <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 md:mb-2">Tanggal Keluar</label>
                      <div className="relative">
                        <input 
                          type="date" 
                          value={tanggalKeluar}
                          onChange={(e) => setTanggalKeluar(e.target.value)}
                          className="w-full bg-[#F4F7FC] border border-gray-100 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm text-gray-700 focus:outline-none focus:border-[#5452F6] focus:bg-white transition-colors" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 md:mb-2">Keterangan (Opsional)</label>
                      <input 
                        type="text" 
                        value={keterangan}
                        onChange={(e) => setKeterangan(e.target.value)}
                        placeholder="Catatan pengiriman..." 
                        className="w-full bg-[#F4F7FC] border border-gray-100 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm text-gray-700 focus:outline-none focus:border-[#5452F6] focus:bg-white transition-colors" 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-50 mt-4 gap-4 sm:gap-0">
                    <button onClick={handleBatalkanDraft} className="text-gray-400 text-xs md:text-sm font-bold hover:text-gray-600 transition-colors w-full sm:w-auto text-center">Batalkan Draft</button>
                    <button 
                      onClick={handleKonfirmasiPengiriman}
                      disabled={!selectedBarang || !isStokCukup || isSubmitting}
                      className={`flex items-center justify-center gap-2 px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold text-xs md:text-sm transition-all w-full sm:w-auto ${
                        !selectedBarang || !isStokCukup || isSubmitting
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-[#5452F6] text-white shadow-lg shadow-indigo-500/30 hover:bg-[#4341E3]'
                      }`}
                    >
                      {isSubmitting ? (
                        <><Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" /> Memproses...</>
                      ) : (
                        <>Konfirmasi Pengiriman <ArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4" /></>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar Kanan Content */}
              <div className="space-y-6 md:space-y-8">
                
                {/* Status Inventaris Dinamis */}
                <div className="bg-white rounded-[20px] p-4 md:p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4 md:mb-6">
                    <div>
                      <p className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 md:mb-1">Status Inventaris</p>
                      <h3 className="text-xs md:text-sm font-bold text-gray-800">Ketersediaan Stok</h3>
                    </div>
                    {selectedBarang ? (
                      isStokCukup ? (
                        <span className="text-[8px] md:text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 md:px-2.5 py-1 rounded-md uppercase border border-emerald-100">Mencukupi</span>
                      ) : (
                        <span className="text-[8px] md:text-[9px] font-bold text-red-600 bg-red-50 px-2 md:px-2.5 py-1 rounded-md uppercase border border-red-100">Tidak Cukup</span>
                      )
                    ) : (
                      <span className="text-[8px] md:text-[9px] font-bold text-gray-500 bg-gray-100 px-2 md:px-2.5 py-1 rounded-md uppercase">Pilih Barang</span>
                    )}
                  </div>

                  <div className="mb-4 md:mb-6">
                    <div className="flex justify-between text-[10px] md:text-xs font-bold mb-1.5 md:mb-2">
                      <span className="text-gray-500">Stok Gudang Saat Ini</span>
                      <span className="text-gray-800">
                        {selectedBarang ? `${currentStok} ${selectedBarang.satuan}` : '-'}
                      </span>
                    </div>
                    <div className="w-full h-1.5 md:h-2 bg-gray-100 rounded-full overflow-hidden flex">
                      {selectedBarang && isStokCukup && (
                         <>
                            <div className="h-full bg-gray-300 transition-all duration-500" style={{ width: `${100 - persentaseKeluar}%` }}></div>
                            <div className="h-full bg-red-400 transition-all duration-500" style={{ width: `${persentaseKeluar}%` }}></div>
                         </>
                      )}
                    </div>
                  </div>

                  <div className={`rounded-xl p-3 md:p-4 flex items-center gap-3 md:gap-4 mb-2 md:mb-4 border transition-colors ${selectedBarang && !isStokCukup ? 'bg-red-50 border-red-100' : 'bg-gray-50/50 border-gray-50'}`}>
                    <div className={`w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm shrink-0 ${selectedBarang && !isStokCukup ? 'text-red-500' : 'text-[#5452F6]'}`}>
                      <Box className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div>
                      <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${selectedBarang && !isStokCukup ? 'text-red-400' : 'text-gray-400'}`}>Proyeksi Sisa Stok</p>
                      <p className={`text-xs md:text-sm font-bold ${selectedBarang && !isStokCukup ? 'text-red-600' : 'text-gray-800'}`}>
                        {selectedBarang ? `${proyeksiStok} ${selectedBarang.satuan}` : '-'}
                      </p>
                    </div>
                  </div>
                </div>
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
        transactionData={lastTransactionData}
      />
    </>
  );
};

export default BarangKeluar;