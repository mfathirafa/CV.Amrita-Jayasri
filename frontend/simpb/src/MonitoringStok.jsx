import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Box, Truck, Users, 
  ArrowDownRight, ArrowUpRight, Activity, 
  BarChart2, Search, Bell, CircleUser, ArrowDownLeft,
  Package, AlertTriangle, ShoppingCart, Coins,
  FileText, PenTool, Printer, ChevronLeft, ChevronRight,
  Filter, Download, Edit2, Loader2,
  Menu, X 
} from 'lucide-react';

// === IMPORT LIBRARY PDF ===
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const MonitoringStok = ({ onLogout, onNavigate }) => {
  // === STATE UNTUK MENU HP ===
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // === STATES ===
  const [tableData, setTableData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    total_jenis_barang: 0,
    total_unit_barang: 0,
    total_nilai_inventaris: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // === STATES TAMBAHAN UNTUK FILTER ===
  const [activeFilter, setActiveFilter] = useState('semua');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // === FUNGSI AMBIL DATA DARI BACKEND API/STOK ===
  useEffect(() => {
    const fetchStok = async (isBackgroundRefresh = false) => {
      try {
        if (!isBackgroundRefresh) setIsLoading(true);
        
        const token = localStorage.getItem('token');
        const rawApiUrl = import.meta.env.VITE_API_URL || 'http://103.253.213.251/api';
        const cleanApiUrl = rawApiUrl.replace(/\/$/, ""); 
        
        const endpoint = cleanApiUrl.endsWith('/api') 
          ? `${cleanApiUrl}/stok` 
          : `${cleanApiUrl}/api/stok`;

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setTableData(data.data || []);
          if (data.ringkasan) {
            setSummaryStats(data.ringkasan);
          }
        } else {
          console.error("Gagal mengambil data stok:", data);
        }
      } catch (error) {
        console.error("Error Fetching Stok:", error);
      } finally {
        if (!isBackgroundRefresh) setIsLoading(false);
      }
    };

    fetchStok();

    const intervalId = setInterval(() => {
      fetchStok(true); 
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  // === MENGHITUNG STATISTIK KARTU ===
  const totalItems = summaryStats.total_jenis_barang > 0 ? summaryStats.total_jenis_barang : tableData.length;
  const valuasiTotal = summaryStats.total_nilai_inventaris || 0;
  
  const stokRendahCount = tableData.filter(item => 
    (item.status_stok && item.status_stok.toLowerCase() === 'kritis') || 
    (item.stok_minimum && Number(item.stok) <= Number(item.stok_minimum) && Number(item.stok) > 0)
  ).length;
  
  const stokHabisCount = tableData.filter(item => 
    (item.status_stok && item.status_stok.toLowerCase() === 'habis') || 
    Number(item.stok) <= 0
  ).length;

  const formatRupiahCard = (angka) => {
    if (angka >= 1000000000) {
      return `Rp ${(angka / 1000000000).toFixed(1)}M`;
    } else if (angka >= 1000000) {
      return `Rp ${(angka / 1000000).toFixed(1)}Jt`;
    }
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const formatRupiahTable = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
  };

  // === FUNGSI STATUS & ICON DINAMIS ===
  const getStatus = (item) => {
    const statusApi = (item.status_stok || '').toLowerCase();
    const current = Number(item.stok);
    const minimum = Number(item.stok_minimum || 0);

    if (statusApi === 'habis' || current <= 0) return { label: 'PESAN SEGERA', color: 'bg-orange-100 text-orange-700' };
    if (statusApi === 'kritis' || (minimum > 0 && current <= minimum)) return { label: 'STOK RENDAH', color: 'bg-red-100 text-red-600' };
    return { label: 'OPTIMAL', color: 'bg-emerald-100 text-emerald-600' };
  };

  const getCategoryIcon = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('kertas') || cat.includes('buku') || cat.includes('jurnal')) return { icon: FileText, color: 'text-gray-500' };
    if (cat.includes('tulis') || cat.includes('pulpen')) return { icon: PenTool, color: 'text-blue-500' };
    if (cat.includes('tinta') || cat.includes('toner')) return { icon: Printer, color: 'text-purple-500' };
    return { icon: Box, color: 'text-indigo-500' };
  };

  // === FILTER & PAGINATION ===
  const filteredData = tableData.filter((item) => {
    // Filter Pencarian
    const search = searchQuery.toLowerCase();
    const matchesSearch = (item.nama_barang || '').toLowerCase().includes(search) || 
                          (item.id_referensi || '').toLowerCase().includes(search);
    
    if (!matchesSearch) return false;

    // Filter Status (Dropdown)
    if (activeFilter === 'semua') return true;
    
    const statusLabel = getStatus(item).label;
    if (activeFilter === 'habis' && statusLabel === 'PESAN SEGERA') return true;
    if (activeFilter === 'kritis' && statusLabel === 'STOK RENDAH') return true;
    if (activeFilter === 'optimal' && statusLabel === 'OPTIMAL') return true;
    
    return false;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // === FUNGSI EKSPOR PDF ===
  const handleExportPDF = () => {
    if (filteredData.length === 0) {
      alert("Tidak ada data untuk diekspor!");
      return;
    }

    try {
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      
      // Header
      doc.setFontSize(16);
      doc.setTextColor(30, 35, 44); 
      doc.text('Laporan Monitoring Stok - CV. Amrita Jayasri', 14, 15);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 22);
      
      const filterLabel = activeFilter === 'semua' ? 'Semua Status' : activeFilter === 'habis' ? 'Stok Habis' : activeFilter === 'kritis' ? 'Stok Kritis' : 'Optimal';
      doc.text(`Filter Aktif: ${filterLabel}`, 14, 28);

      // Persiapan Data Tabel
      const tableColumn = ["ID Barang", "Nama Barang", "Kategori", "Harga Satuan", "Total Harga", "Sisa Stok", "Status"];
      const tableRows = filteredData.map(item => {
        return [
          item.id_referensi || `BRG-${item.id}`,
          item.nama_barang || '-',
          item.kategori || '-',
          formatRupiahTable(item.harga_satuan),
          formatRupiahTable(item.harga_total),
          `${item.stok} ${item.satuan}`,
          getStatus(item).label
        ];
      });

      // Render Tabel
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [84, 82, 246] },
        styles: { fontSize: 8, cellPadding: 3, valign: 'middle' },
        columnStyles: { 
          3: { halign: 'right' }, 
          4: { halign: 'right' },
          5: { halign: 'center' },
          6: { halign: 'center' }
        }
      });

      doc.save(`Laporan_Stok_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("Gagal membuat PDF:", error);
      alert("Terjadi kesalahan saat membuat file PDF.");
    }
  };

  const handleNavigation = (path) => {
    setIsMobileMenuOpen(false);
    onNavigate(path);
  };

  return (
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
          <button className="md:hidden text-gray-400 hover:text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 mt-2 overflow-y-auto scrollbar-hide">
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
          <button onClick={() => handleNavigation('barang-keluar')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
            <ArrowUpRight className="w-5 h-5" /> Barang Keluar
          </button>
          <button onClick={() => handleNavigation('monitoring-stok')} className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0EFFF] text-[#5452F6] rounded-xl font-bold text-sm transition-colors text-left">
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
        <header className="h-16 md:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0 shrink-0">
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
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
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
            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
            <div className="flex items-center gap-2.5 cursor-pointer">
              <CircleUser className="w-7 h-7 md:w-8 md:h-8 text-[#5452F6]" strokeWidth={1.5} />
              <span className="text-sm font-semibold text-[#1E232C] hidden md:block">Administrator</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-12 w-full">
          {/* Section Level Stok */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">Level Stok</h1>
            <p className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest">RINGKASAN STATUS INVENTARIS REAL-TIME</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Total SKU */}
            <div className="bg-white p-4 md:p-5 rounded-[20px] md:rounded-[24px] shadow-sm border border-gray-100 flex flex-col h-32 md:h-40 relative">
              <div className="flex justify-between items-start">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Package className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>
              <div className="mt-auto">
                <h3 className="text-2xl md:text-3xl font-black text-gray-800 leading-none">{isLoading && tableData.length === 0 ? '...' : totalItems}</h3>
                <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5 md:mt-2">TOTAL ITEM SKU</p>
              </div>
            </div>

            {/* STOK RENDAH */}
            <div className="bg-white p-4 md:p-5 rounded-[20px] md:rounded-[24px] shadow-sm border border-gray-100 flex flex-col h-32 md:h-40 relative">
              <div className="flex justify-between items-start">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                  <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                {stokRendahCount > 0 && (
                  <span className="text-[8px] md:text-[10px] font-bold text-white bg-red-500 px-2 md:px-2.5 py-1 rounded-full shadow-sm shadow-red-200 animate-pulse">PERLU TINDAKAN</span>
                )}
              </div>
              <div className="mt-auto">
                <h3 className="text-2xl md:text-3xl font-black text-gray-800 leading-none">{isLoading && tableData.length === 0 ? '...' : stokRendahCount}</h3>
                <p className="text-[9px] md:text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1.5 md:mt-2">STOK RENDAH (KRITIS)</p>
              </div>
            </div>

            {/* HABIS */}
            <div className="bg-white p-4 md:p-5 rounded-[20px] md:rounded-[24px] shadow-sm border border-gray-100 flex flex-col h-32 md:h-40 relative">
              <div className="flex justify-between items-start">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>
              <div className="mt-auto">
                <h3 className="text-2xl md:text-3xl font-black text-gray-800 leading-none">{isLoading && tableData.length === 0 ? '...' : stokHabisCount}</h3>
                <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5 md:mt-2">HABIS / PESAN SEGERA</p>
              </div>
            </div>

            {/* NILAI STOK */}
            <div className="bg-gradient-to-br from-[#5452F6] to-[#7C3AED] p-4 md:p-5 rounded-[20px] md:rounded-[24px] shadow-md text-white flex flex-col h-32 md:h-40 relative overflow-hidden">
              <div className="flex justify-between items-start z-10">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Coins className="w-4 h-4 md:w-5 h-5" />
                </div>
              </div>
              <div className="mt-auto z-10">
                <h3 className="text-2xl md:text-3xl font-black leading-none">{isLoading && tableData.length === 0 ? '...' : formatRupiahCard(valuasiTotal)}</h3>
                <p className="text-[9px] md:text-[10px] font-bold text-white/70 uppercase tracking-widest mt-1.5 md:mt-2">VALUASI INVENTARIS</p>
              </div>
              <Coins className="absolute -right-4 -bottom-4 w-20 h-20 md:w-28 md:h-28 opacity-10" />
            </div>
          </div>

          {/* Table Area */}
          <div className="bg-white rounded-[20px] md:rounded-[24px] shadow-sm border border-gray-100 overflow-hidden relative min-h-[300px]">
            {/* Header Tabel Responsif */}
            <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50/30 gap-4 sm:gap-0">
              <h3 className="text-base md:text-lg font-bold text-gray-800">Status Inventaris</h3>
              <div className="flex gap-2 w-full sm:w-auto">
                {/* Search input di mobile untuk tabel */}
                <div className="relative flex-1 sm:hidden">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Cari..." 
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#5452F6]" 
                  />
                </div>
                
                {/* TOMBOL FILTER */}
                <div className="relative">
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center justify-center gap-2 px-3 md:px-4 py-2 border rounded-xl text-xs font-bold transition-colors w-full sm:w-auto ${activeFilter !== 'semua' ? 'bg-indigo-50 border-indigo-200 text-[#5452F6]' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Filter className="w-3.5 h-3.5" /> 
                    <span className="hidden sm:inline">
                      {activeFilter === 'semua' ? 'Filter' : 
                       activeFilter === 'habis' ? 'Stok Habis' : 
                       activeFilter === 'kritis' ? 'Stok Kritis' : 'Optimal'}
                    </span>
                  </button>
                  
                  {isFilterOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)}></div>
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2">
                        <button onClick={() => { setActiveFilter('semua'); setCurrentPage(1); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${activeFilter === 'semua' ? 'text-[#5452F6] bg-indigo-50/50' : 'text-gray-600 hover:bg-gray-50'}`}>Semua Status</button>
                        <button onClick={() => { setActiveFilter('habis'); setCurrentPage(1); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${activeFilter === 'habis' ? 'text-orange-600 bg-orange-50/50' : 'text-gray-600 hover:bg-gray-50'}`}>Stok Habis</button>
                        <button onClick={() => { setActiveFilter('kritis'); setCurrentPage(1); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${activeFilter === 'kritis' ? 'text-red-600 bg-red-50/50' : 'text-gray-600 hover:bg-gray-50'}`}>Stok Kritis</button>
                        <button onClick={() => { setActiveFilter('optimal'); setCurrentPage(1); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${activeFilter === 'optimal' ? 'text-emerald-600 bg-emerald-50/50' : 'text-gray-600 hover:bg-gray-50'}`}>Optimal</button>
                      </div>
                    </>
                  )}
                </div>

                {/* TOMBOL EKSPOR PDF */}
                <button 
                  onClick={handleExportPDF}
                  className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-[#5452F6] text-white rounded-xl text-xs font-bold hover:bg-[#4341E3] shadow-md shadow-indigo-100 transition-colors w-full sm:w-auto"
                >
                  <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Ekspor PDF</span>
                </button>
              </div>
            </div>

            {isLoading && tableData.length === 0 ? (
              <div className="absolute inset-0 z-10 bg-white/80 flex flex-col items-center justify-center">
                <Loader2 className="w-6 h-6 md:w-8 md:h-8 text-[#5452F6] animate-spin mb-4" />
                <p className="text-xs md:text-sm font-bold text-gray-500">Menganalisis stok gudang...</p>
              </div>
            ) : currentData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 md:py-20 text-center px-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Box className="w-6 h-6 md:w-8 md:h-8 text-gray-300" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-800">Data Tidak Ditemukan</h3>
                <p className="text-xs md:text-sm text-gray-500 mt-1">Belum ada barang di database atau tidak cocok dengan pencarian dan filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[800px] md:min-w-[1000px]">
                  <thead>
                    <tr className="bg-gray-50/80 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                      <th className="py-3 md:py-5 px-4 md:px-6">NAMA BARANG / ID</th>
                      <th className="py-3 md:py-5 px-4 md:px-6">KATEGORI</th>
                      <th className="py-3 md:py-5 px-4 md:px-6 text-right">HARGA SATUAN</th>
                      <th className="py-3 md:py-5 px-4 md:px-6 text-right">TOTAL HARGA</th>
                      <th className="py-3 md:py-5 px-4 md:px-6 text-center">STOK</th>
                      <th className="py-3 md:py-5 px-4 md:px-6 text-center">STATUS</th>
                      <th className="py-3 md:py-5 px-4 md:px-6 text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentData.map((item) => {
                      const status = getStatus(item);
                      const iconData = getCategoryIcon(item.kategori);
                      const IconComponent = iconData.icon;

                      return (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-all duration-200">
                          <td className="py-3 md:py-4 px-4 md:px-6">
                            <div className="flex items-center gap-3 md:gap-3.5">
                              <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-inner shrink-0">
                                <IconComponent className={`w-4 h-4 md:w-5 md:h-5 ${iconData.color}`} />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-gray-800 text-xs md:text-sm leading-tight truncate">{item.nama_barang}</p>
                                <p className="text-[9px] md:text-[10px] text-gray-400 mt-0.5 md:mt-1 font-bold uppercase tracking-wider truncate">{item.id_referensi || `BRG-${item.id}`}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 md:py-4 px-4 md:px-6">
                            <span className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase bg-gray-100 px-2 py-1 rounded-md tracking-wider">
                              {item.kategori || '-'}
                            </span>
                          </td>
                          <td className="py-3 md:py-4 px-4 md:px-6 text-right text-xs md:text-sm font-bold text-gray-600 whitespace-nowrap">
                            {formatRupiahTable(item.harga_satuan)}
                          </td>
                          <td className="py-3 md:py-4 px-4 md:px-6 text-right text-xs md:text-sm font-black text-[#5452F6] whitespace-nowrap">
                            {formatRupiahTable(item.harga_total)}
                          </td>
                          <td className="py-3 md:py-4 px-4 md:px-6 text-center text-xs md:text-sm font-black text-gray-800 whitespace-nowrap">
                            {item.stok} <span className="text-[9px] md:text-[10px] uppercase font-bold text-gray-400 ml-1">{item.satuan}</span>
                          </td>
                          <td className="py-3 md:py-4 px-4 md:px-6 text-center">
                            <span className={`text-[8px] md:text-[9px] font-black px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg uppercase tracking-widest whitespace-nowrap ${status.color}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="py-3 md:py-4 px-4 md:px-6 text-right">
                            <button 
                              onClick={() => onNavigate('edit-barang', item.id)}
                              className="p-1.5 md:p-2 text-[#5452F6] hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
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
              <div className="p-4 md:p-6 bg-gray-50/30 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 mt-auto">
                <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center sm:text-left">
                  Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} Item
                </p>
                <div className="flex gap-1 md:gap-1.5">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                  <button className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-lg bg-[#5452F6] text-white text-[10px] md:text-xs font-bold shadow-md shadow-indigo-100">
                    {currentPage}
                  </button>
                  {totalPages > 1 && currentPage < totalPages && (
                    <button 
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 text-[10px] md:text-xs font-bold hover:bg-gray-50 transition-colors"
                    >
                      {currentPage + 1}
                    </button>
                  )}
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
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