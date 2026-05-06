import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Box, Truck, Users, 
  ArrowDownRight, ArrowUpRight, Activity, 
  BarChart2, Search, Bell, CircleUser, ArrowDownLeft,
  Package, AlertTriangle, ShoppingCart, Coins,
  FileText, Zap, ChevronLeft, ChevronRight,
  Filter, Download, PenTool, Printer, Edit2, Loader2,
  TrendingUp, TrendingDown, Minus // <-- IMPORT ICON BARU DI SINI
} from 'lucide-react';

const MonitoringStok = ({ onLogout, onNavigate }) => {
  // === STATES ===
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // === FUNGSI AMBIL DATA DARI BACKEND (DENGAN POLLING REAL-TIME) ===
  useEffect(() => {
    const fetchBarang = async (isBackgroundRefresh = false) => {
      try {
        if (!isBackgroundRefresh) setIsLoading(true);
        
        const token = localStorage.getItem('token');
        const rawApiUrl = import.meta.env.VITE_API_URL || 'http://103.253.213.251/api';
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
          setTableData(arrayData);
        } else {
          console.error("Gagal mengambil data:", data);
        }
      } catch (error) {
        console.error("Error Fetching:", error);
      } finally {
        if (!isBackgroundRefresh) setIsLoading(false);
      }
    };

    fetchBarang();

    const intervalId = setInterval(() => {
      fetchBarang(true); 
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  // === PERHITUNGAN STATISTIK OTOMATIS ===
  const totalItems = tableData.length;
  const stokRendahCount = tableData.filter(item => Number(item.stok) <= Number(item.stok_minimum) && Number(item.stok) > 0).length;
  const stokHabisCount = tableData.filter(item => Number(item.stok) <= 0).length;
  const valuasiTotal = tableData.reduce((total, item) => total + (parseFloat(item.harga) * Number(item.stok)), 0);

  // Format Rupiah
  const formatRupiah = (angka) => {
    if (angka >= 1000000000) {
      return `Rp ${(angka / 1000000000).toFixed(1)}M`;
    } else if (angka >= 1000000) {
      return `Rp ${(angka / 1000000).toFixed(1)}Jt`;
    }
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  // === FUNGSI STATUS & ICON DINAMIS ===
  const getStatus = (stok, min) => {
    const current = Number(stok);
    const minimum = Number(min);
    if (current <= 0) return { label: 'PESAN SEGERA', color: 'bg-orange-100 text-orange-700', trend: 'flat' };
    if (current <= minimum) return { label: 'STOK RENDAH', color: 'bg-red-100 text-red-600', trend: 'down' };
    return { label: 'OPTIMAL', color: 'bg-emerald-100 text-emerald-600', trend: 'up' };
  };

  const getCategoryIcon = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('kertas') || cat.includes('buku')) return { icon: FileText, color: 'text-gray-500' };
    if (cat.includes('tulis') || cat.includes('pulpen')) return { icon: PenTool, color: 'text-blue-500' };
    if (cat.includes('tinta') || cat.includes('toner')) return { icon: Printer, color: 'text-purple-500' };
    return { icon: Box, color: 'text-indigo-500' };
  };

  // === FUNGSI TREN YANG SUDAH DIREVISI MENJADI PANAH ===
  const renderTrendIcon = (trend) => {
    if (trend === 'up') {
      return (
        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center mx-auto" title="Stok Aman">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
        </div>
      );
    }
    if (trend === 'down') {
      return (
        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center mx-auto" title="Stok Menurun">
          <TrendingDown className="w-4 h-4 text-red-600" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center mx-auto" title="Stok Habis / Statis">
        <Minus className="w-4 h-4 text-orange-600" />
      </div>
    );
  };

  // === FILTER & PAGINATION ===
  const filteredData = tableData.filter((item) => {
    const search = searchQuery.toLowerCase();
    return (item.nama_barang || '').toLowerCase().includes(search) || 
           (item.id_referensi || '').toLowerCase().includes(search);
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex h-screen bg-[#F4F7FC] font-sans overflow-hidden">
      
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
        
        <nav className="flex-1 px-4 space-y-1.5 mt-2 overflow-y-auto scrollbar-hide">
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
          <button onClick={() => onNavigate('barang-keluar')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
            <ArrowUpRight className="w-5 h-5" /> Barang Keluar
          </button>
          <button onClick={() => onNavigate('monitoring-stok')} className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0EFFF] text-[#5452F6] rounded-xl font-bold text-sm transition-colors text-left">
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
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-10 sticky top-0 shrink-0">
          <div className="flex items-center">
            <h2 className="font-bold text-[#1E232C] text-base hidden md:block">SIMPB - CV. Amrita Jayasri</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative w-72 hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama barang atau ID..." 
                className="w-full pl-11 pr-4 py-2.5 bg-[#F4F7FC] border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-[#5452F6] focus:ring-1 focus:ring-[#5452F6] transition-all" 
              />
            </div>
            <button className="relative text-gray-500 hover:text-gray-800 transition-colors">
              <Bell className="w-5 h-5" />
              {stokRendahCount + stokHabisCount > 0 && (
                <span className="absolute -top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
            <div className="h-6 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2.5 cursor-pointer">
              <CircleUser className="w-8 h-8 text-[#5452F6]" strokeWidth={1.5} />
              <span className="text-sm font-semibold text-[#1E232C]">Administrator</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 pb-12">
          {/* Section Level Stok */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Level Stok</h1>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">RINGKASAN STATUS INVENTARIS REAL-TIME</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total SKU */}
            <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex flex-col h-40 relative">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-auto">
                <h3 className="text-3xl font-black text-gray-800 leading-none">{isLoading && tableData.length === 0 ? '...' : totalItems}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">TOTAL ITEM SKU</p>
              </div>
            </div>

            {/* STOK RENDAH */}
            <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex flex-col h-40 relative">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                {stokRendahCount > 0 && (
                  <span className="text-[10px] font-bold text-white bg-red-500 px-2.5 py-1 rounded-full shadow-sm shadow-red-200 animate-pulse">PERLU TINDAKAN</span>
                )}
              </div>
              <div className="mt-auto">
                <h3 className="text-3xl font-black text-gray-800 leading-none">{isLoading && tableData.length === 0 ? '...' : stokRendahCount}</h3>
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-2">STOK RENDAH (KRITIS)</p>
              </div>
            </div>

            {/* HABIS */}
            <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex flex-col h-40 relative">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                  <ShoppingCart className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-auto">
                <h3 className="text-3xl font-black text-gray-800 leading-none">{isLoading && tableData.length === 0 ? '...' : stokHabisCount}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">HABIS / PESAN SEGERA</p>
              </div>
            </div>

            {/* NILAI STOK */}
            <div className="bg-gradient-to-br from-[#5452F6] to-[#7C3AED] p-5 rounded-[24px] shadow-md text-white flex flex-col h-40 relative overflow-hidden">
              <div className="flex justify-between items-start z-10">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Coins className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-auto z-10">
                <h3 className="text-3xl font-black leading-none">{isLoading && tableData.length === 0 ? '...' : formatRupiah(valuasiTotal)}</h3>
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mt-2">VALUASI INVENTARIS</p>
              </div>
              <Coins className="absolute -right-4 -bottom-4 w-28 h-28 opacity-10" />
            </div>
          </div>

          {/* Table Area */}
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden relative min-h-[300px]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
              <h3 className="text-lg font-bold text-gray-800">Status Inventaris</h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                  <Filter className="w-3.5 h-3.5" /> Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#5452F6] text-white rounded-xl text-xs font-bold hover:bg-[#4341E3] shadow-md shadow-indigo-100 transition-colors">
                  <Download className="w-3.5 h-3.5" /> Ekspor Data
                </button>
              </div>
            </div>

            {isLoading && tableData.length === 0 ? (
              <div className="absolute inset-0 z-10 bg-white/80 flex flex-col items-center justify-center mt-20">
                <Loader2 className="w-8 h-8 text-[#5452F6] animate-spin mb-4" />
                <p className="text-sm font-bold text-gray-500">Menganalisis stok gudang...</p>
              </div>
            ) : currentData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center mt-10">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Box className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Data Tidak Ditemukan</h3>
                <p className="text-sm text-gray-500 mt-1">Belum ada barang di database atau tidak cocok dengan pencarian.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/80 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                      <th className="py-5 px-6">NAMA BARANG / ID</th>
                      <th className="py-5 px-6">KATEGORI</th>
                      <th className="py-5 px-6 text-center">STOK</th>
                      <th className="py-5 px-6 text-center">MIN.</th>
                      <th className="py-5 px-6 text-center">TREN</th>
                      <th className="py-5 px-6 text-center">STATUS</th>
                      <th className="py-5 px-6 text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentData.map((item, index) => {
                      const status = getStatus(item.stok, item.stok_minimum);
                      const iconData = getCategoryIcon(item.kategori);
                      const IconComponent = iconData.icon;

                      return (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-all duration-200">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3.5">
                              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-inner">
                                <IconComponent className={`w-5 h-5 ${iconData.color}`} />
                              </div>
                              <div>
                                <p className="font-bold text-gray-800 text-sm leading-tight">{item.nama_barang}</p>
                                <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-wider">{item.id_referensi || `BRG-${item.id}`}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-[10px] font-bold text-gray-500 uppercase bg-gray-100 px-2 py-1 rounded-md tracking-wider">
                              {item.kategori}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center text-sm font-black text-gray-800">
                            {item.stok} <span className="text-[10px] uppercase font-bold text-gray-400 ml-1">{item.satuan}</span>
                          </td>
                          <td className="py-4 px-6 text-center text-xs font-bold text-gray-300">{item.stok_minimum}</td>
                          <td className="py-4 px-6 text-center">{renderTrendIcon(status.trend)}</td>
                          <td className="py-4 px-6 text-center">
                            <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest ${status.color}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button 
                              onClick={() => onNavigate('edit-barang', item.id)}
                              className="p-2 text-[#5452F6] hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination */}
            {(tableData.length > 0 || !isLoading) && filteredData.length > 0 && (
              <div className="p-6 bg-gray-50/30 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 mt-auto">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} Item
                </p>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#5452F6] text-white text-xs font-bold shadow-md shadow-indigo-100">
                    {currentPage}
                  </button>
                  {totalPages > 1 && currentPage < totalPages && (
                    <button 
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 text-xs font-bold hover:bg-gray-50 transition-colors"
                    >
                      {currentPage + 1}
                    </button>
                  )}
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MonitoringStok;