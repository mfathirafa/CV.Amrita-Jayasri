import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, Filter, Plus, Edit2, Trash2, 
  LayoutDashboard, Box, Users, Truck, ArrowDownRight, 
  ArrowUpRight, Activity, BarChart2, AlertTriangle, 
  Banknote, History, ChevronLeft, ChevronRight, CircleUser, FileText, Loader2,
  Menu, X // <-- Tambahan icon untuk menu HP
} from 'lucide-react';

// Import komponen modal yang baru dibuat
import DeleteConfirmModal from './DeleteConfirmModal';

const DataBarang = ({ onNavigate, onLogout }) => {
  // --- STATES ---
  const [activeCategory, setActiveCategory] = useState('Semua Barang');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 
  
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATES UNTUK MENU HP ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- STATES UNTUK MODAL HAPUS ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ id: null, namaBarang: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  // --- KATEGORI ---
  const categories = ['Semua Barang', 'Buku & Jurnal', 'Kertas & Media', 'Alat Tulis', 'Arsip & Penyimpanan', 'Tinta & Toner', 'Aksesoris Meja'];

  // --- FUNGSI FORMAT RUPIAH ---
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  // --- LOGIKA MENGHITUNG STATISTIK ---
  const totalBarang = tableData.length;
  const stokMenipisCount = tableData.filter(item => item.stok <= item.stok_minimum * 1.5).length;
  const nilaiInventaris = tableData.reduce((total, item) => {
    return total + (parseFloat(item.harga) * item.stok);
  }, 0);

  const stats = [
    { title: 'TOTAL BARANG', value: totalBarang.toString(), icon: Box, color: 'bg-purple-100 text-purple-600' },
    { 
      title: 'STOK MENIPIS/KRITIS', 
      value: stokMenipisCount.toString(), 
      icon: AlertTriangle, 
      color: 'bg-red-100 text-red-600', 
      badge: stokMenipisCount > 0 ? 'PERLU TINDAKAN' : 'AMAN', 
      badgeColor: stokMenipisCount > 0 ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white' 
    },
    { title: 'NILAI INVENTARIS', value: formatRupiah(nilaiInventaris), icon: Banknote, color: 'bg-green-100 text-green-600' },
    { title: 'PESANAN AKTIF', value: '24', icon: History, color: 'bg-pink-100 text-pink-600' }
  ];

  // --- FUNGSI HITUNG STATUS STOK ---
  const getStockStatus = (stok, stok_minimum) => {
    const current = Number(stok);
    const min = Number(stok_minimum);
    
    if (current <= 0) return { label: 'HABIS', color: 'bg-red-100 text-red-700' };
    if (current <= min) return { label: 'KRITIS', color: 'bg-red-100 text-red-700' };
    if (current <= min * 1.5) return { label: 'MENIPIS', color: 'bg-orange-100 text-orange-700' };
    return { label: 'AMAN', color: 'bg-emerald-100 text-emerald-700' };
  };

  // --- FUNGSI URL GAMBAR BACKEND (Ganti ke Railway) ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath; 
    
    const rawApiUrl = import.meta.env.VITE_API_URL || 'https://cvamrita-jayasri-production.up.railway.app/api';
    const baseUrl = rawApiUrl.replace(/\/api\/?$/, ""); 
    
    return `${baseUrl}/storage/${imagePath}`; 
  };

  // --- FUNGSI AMBIL DATA DARI BACKEND (Ganti ke Railway) ---
  useEffect(() => {
    const fetchBarang = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const rawApiUrl = import.meta.env.VITE_API_URL || 'https://cvamrita-jayasri-production.up.railway.app/api';
        const cleanApiUrl = rawApiUrl.replace(/\/$/, ""); 
        
        // Tambahkan per_page=100 agar semua data tertarik ke client (untuk pagination frontend)
        const endpoint = cleanApiUrl.endsWith('/api') 
          ? `${cleanApiUrl}/barang?per_page=100` 
          : `${cleanApiUrl}/api/barang?per_page=100`;

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
          setTableData(arrayData);
        } else {
          console.error("Gagal mengambil data:", data);
        }
      } catch (error) {
        console.error("Error Fetching:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBarang();
  }, []);

  // --- FUNGSI NAVIGASI HP (Tutup Sidebar otomatis) ---
  const handleNavigation = (path) => {
    setIsMobileMenuOpen(false);
    onNavigate(path);
  };

  // --- TRIGGER BUKA MODAL HAPUS ---
  const openDeleteModal = (id, namaBarang) => {
    setItemToDelete({ id, namaBarang });
    setIsDeleteModalOpen(true);
  };

  // --- FUNGSI EKSEKUSI HAPUS KE BACKEND (Ganti ke Railway) ---
  const executeDelete = async () => {
    if (!itemToDelete.id) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const rawApiUrl = import.meta.env.VITE_API_URL || 'https://cvamrita-jayasri-production.up.railway.app/api';
      const cleanApiUrl = rawApiUrl.replace(/\/$/, ""); 
      
      const endpoint = cleanApiUrl.endsWith('/api') 
        ? `${cleanApiUrl}/barang/${itemToDelete.id}` 
        : `${cleanApiUrl}/api/barang/${itemToDelete.id}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setTableData(prevData => prevData.filter(item => item.id !== itemToDelete.id));
        setIsDeleteModalOpen(false); 
      } else {
        const errorData = await response.json();
        alert(`Gagal menghapus barang: ${errorData.message || 'Server error'}`);
      }
    } catch (error) {
      console.error("Error Deleting:", error);
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setIsDeleting(false);
    }
  };

  // ========================================================
  // INI BAGIAN FILTER YANG SUDAH KEBAL (CASE-INSENSITIVE)
  // ========================================================
  const filteredData = tableData.filter((item) => {
    const dbCategory = String(item.kategori || '').replace(/&amp;/g, '&').trim().toLowerCase();
    const selectedCategory = activeCategory.trim().toLowerCase();
    
    const matchCategory = activeCategory === 'Semua Barang' || dbCategory === selectedCategory;
    
    const searchLower = searchQuery.toLowerCase().trim();
    const namaBarangLower = String(item.nama_barang || '').toLowerCase();
    const idRefLower = String(item.id_referensi || `BRG-${item.id}`).toLowerCase();
    
    const matchSearch = searchLower === '' || namaBarangLower.includes(searchLower) || idRefLower.includes(searchLower);
    
    return matchCategory && matchSearch;
  });
  // ========================================================

  // --- LOGIKA PAGINATION ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  return (
    <>
      <div className="flex h-screen bg-[#F4F7FC] font-sans overflow-hidden">
        
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
            {/* Tombol Close Sidebar (Hanya muncul di HP) */}
            <button className="md:hidden text-gray-400 hover:text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1.5 mt-2 overflow-y-auto scrollbar-hide">
            <button onClick={() => handleNavigation('dashboard')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </button>
            <button onClick={() => handleNavigation('data-barang')} className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0EFFF] text-[#5452F6] rounded-xl font-bold text-sm transition-colors text-left">
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
            <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-xl font-semibold text-sm transition-colors">
              <ArrowDownRight className="w-5 h-5 rotate-90" /> Keluar
            </button>
          </div>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-1 flex flex-col overflow-hidden relative w-full">
          
          {/* ================= HEADER RESPONSIF ================= */}
          <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0 shrink-0">
            <div className="flex items-center gap-3">
              {/* Tombol Hamburger (Hanya muncul di HP) */}
              <button className="md:hidden text-gray-500 hover:text-gray-800 p-1" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="font-bold text-[#1E232C] text-sm md:text-base hidden sm:block">SIMPB - CV. Amrita Jayasri</h2>
              <h2 className="font-bold text-[#1E232C] text-sm sm:hidden">SIMPB</h2>
            </div>
            
            <div className="flex items-center gap-4 md:gap-6">
              {/* Search Bar Desktop (Tersembunyi di HP, diganti ke area konten) */}
              <div className="relative w-72 hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama atau ID barang..." 
                  className="w-full pl-11 pr-4 py-2.5 bg-[#F4F7FC] border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-[#5452F6] transition-all" 
                />
              </div>
              
              <button onClick={() => alert("Tidak ada notifikasi baru.")} className="relative text-gray-500 hover:text-gray-800 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
              <div onClick={() => alert("Menu Profil Administrator (Segera Hadir)")} className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
                <CircleUser className="w-7 h-7 md:w-8 md:h-8 text-[#5452F6]" strokeWidth={1.5} />
                <span className="text-sm font-semibold text-[#1E232C] hidden md:block">Administrator</span>
              </div>
            </div>
          </header>

          {/* ================= PAGE CONTENT ================= */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-12 w-full">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">Data Barang</h2>
                <p className="text-xs md:text-sm text-gray-500">Kelola dan monitor tingkat stok inventaris kantor pusat</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {/* Search Bar Mobile (Hanya muncul di HP, agar tidak makan tempat di header) */}
                <div className="relative w-full md:hidden">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama atau ID barang..." 
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#5452F6] transition-all" 
                  />
                </div>

                <button 
                  onClick={() => onNavigate('tambah-barang')}
                  className="flex justify-center items-center gap-2 px-4 py-2.5 bg-[#5452F6] hover:bg-[#4341E3] text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/30"
                >
                  <Plus className="w-4 h-4" /> Tambah Barang
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-[20px] p-4 md:p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-28 md:h-32 relative overflow-hidden hover:shadow-md transition-shadow">
                  <div className={`absolute -right-4 -top-4 w-20 h-20 md:w-24 md:h-24 rounded-full opacity-20 ${stat.color.split(' ')[0]}`}></div>
                  <div className="flex justify-between items-start">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    {stat.badge && (
                      <span className={`text-[8px] md:text-[10px] font-bold px-2 py-1 rounded-full ${stat.badgeColor || 'bg-indigo-50 text-[#5452F6]'}`}>
                        {stat.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">{isLoading ? '...' : stat.value}</h3>
                    <p className="text-[9px] md:text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">{stat.title}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 mb-4 md:mb-6 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-colors ${
                    activeCategory === cat 
                      ? 'bg-[#5452F6] text-white shadow-md shadow-indigo-200' 
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden relative min-h-[300px]">
              {isLoading ? (
                <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                  <Loader2 className="w-6 h-6 md:w-8 md:h-8 text-[#5452F6] animate-spin mb-4" />
                  <p className="text-xs md:text-sm font-bold text-gray-500">Menarik data dari database...</p>
                </div>
              ) : currentData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 md:py-20 text-center px-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Box className="w-6 h-6 md:w-8 md:h-8 text-gray-300" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-gray-800">Data Tidak Ditemukan</h3>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">Tidak ada data barang yang sesuai dengan pencarian atau kategori ini.</p>
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-100">
                        <th className="py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Barang</th>
                        <th className="py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Kategori</th>
                        <th className="py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Harga</th>
                        <th className="py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Stok</th>
                        <th className="py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Stok Min.</th>
                        <th className="py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                        <th className="py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {currentData.map((item) => {
                        const status = getStockStatus(item.stok, item.stok_minimum);
                        
                        return (
                          <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-3 md:py-4 px-4 md:px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                                  {/* --- FOTO LANGSUNG MENGGUNAKAN API RAILWAY --- */}
                                  {item.foto_url || item.gambar ? (
                                    <img 
                                      src={getImageUrl(item.foto_url || item.gambar)} 
                                      alt={item.nama_barang} 
                                      className="w-full h-full object-cover relative z-10"
                                      onError={(e) => {
                                        e.target.style.opacity = '0'; 
                                      }}
                                    />
                                  ) : null}
                                  {/* --------------------------------------------- */}
                                  
                                  <div className="absolute inset-0 flex items-center justify-center z-0">
                                    {item.kategori?.includes('Buku') ? <FileText className="w-4 h-4 md:w-5 md:h-5 text-gray-500" /> : <Box className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />}
                                  </div>
                                </div>
                                <div>
                                  <p className="font-bold text-gray-800 text-xs md:text-sm">{item.nama_barang}</p>
                                  <p className="text-[9px] md:text-[11px] text-gray-400 mt-0.5 font-medium">ID: {item.id_referensi || `BRG-${item.id}`}</p>
                                </div>
                              </div>
                            </td>
                            {/* --- PERBAIKAN TEKS KATEGORI DI SINI --- */}
                            <td className="py-3 md:py-4 px-4 md:px-6 text-xs md:text-sm text-gray-600 font-medium">
                              {String(item.kategori || '').replace(/&amp;/g, '&').replace(/&amp;/g, '&')}
                            </td>
                            <td className="py-3 md:py-4 px-4 md:px-6 text-xs md:text-sm font-bold text-gray-800">{formatRupiah(item.harga)}</td>
                            <td className="py-3 md:py-4 px-4 md:px-6 text-xs md:text-sm font-bold text-center text-gray-800">
                              {item.stok} <span className="text-[9px] md:text-[10px] text-gray-400 uppercase font-medium">{item.satuan}</span>
                            </td>
                            <td className="py-3 md:py-4 px-4 md:px-6 text-xs md:text-sm font-medium text-gray-500 text-center">{item.stok_minimum}</td>
                            <td className="py-3 md:py-4 px-4 md:px-6 text-center">
                              <span className={`px-2 md:px-2.5 py-1 rounded-md text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${status.color}`}>
                                {status.label}
                              </span>
                            </td>
                            <td className="py-3 md:py-4 px-4 md:px-6 text-right">
                              <div className="flex items-center justify-end gap-1.5 md:gap-2">
                                <button 
                                  onClick={() => onNavigate('edit-barang', item.id)} 
                                  title="Edit Barang"
                                  className="p-1.5 md:p-2 text-[#5452F6] hover:bg-indigo-50 rounded-lg transition-colors"
                                >
                                  <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                </button>
                                
                                <button 
                                  onClick={() => openDeleteModal(item.id, item.nama_barang)}
                                  title="Hapus Barang"
                                  className="p-1.5 md:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Controls */}
              {!isLoading && filteredData.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-3 md:py-4 border-t border-gray-100 bg-white gap-3">
                  <p className="text-[10px] md:text-xs text-gray-500 font-medium text-center sm:text-left">
                    Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} barang
                  </p>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <button className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-[#5452F6] text-white rounded-lg text-xs md:text-sm font-medium">
                      {currentPage}
                    </button>
                    
                    {totalPages > 1 && currentPage < totalPages && (
                      <span className="text-[10px] md:text-xs font-bold text-gray-400 mx-1">dari {totalPages}</span>
                    )}

                    <button 
                      onClick={handleNextPage}
                      disabled={currentPage >= totalPages}
                      className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 md:mt-8 text-center">
              <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">
                © 2026 CV. AMRITA JAYASRI • MANAJEMEN INVENTARIS BERKINERJA TINGGI
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* RENDER MODAL HAPUS DI SINI */}
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        itemName={itemToDelete.namaBarang}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default DataBarang;