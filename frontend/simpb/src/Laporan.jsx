import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Box, Truck, Users, 
  ArrowDownRight, ArrowUpRight, ArrowDownLeft, Activity, 
  BarChart2, Search, Bell, CircleUser, 
  Calendar, FileText, Download, FileSpreadsheet, 
  ChevronDown, Filter, Loader2, ArrowUpDown
} from 'lucide-react';

// === IMPORT KOMPONEN MODAL ===
import ExportModal from './ExportModal';

const Laporan = ({ onLogout, onNavigate }) => {
  // === STATE UNTUK FILTER TANGGAL & TAB ===
  const [startDate, setStartDate] = useState('2026-03-01');
  const [endDate, setEndDate] = useState('2026-04-30'); 
  const [activeTab, setActiveTab] = useState('semua');

  // === STATE UNTUK PENCARIAN & PENGURUTAN ===
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('terbaru');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // === STATE UNTUK DATA API ===
  const [laporanData, setLaporanData] = useState([]);
  const [ringkasan, setRingkasan] = useState({ total_transaksi: 0, total_jumlah_barang: 0, total_nilai: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // === STATE UNTUK MODAL EKSPOR ===
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [initialExportFormat, setInitialExportFormat] = useState('excel');

  // === FUNGSI AMBIL DATA DARI API (GET) ===
  const fetchLaporan = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const rawApiUrl = import.meta.env.VITE_API_URL || 'http://103.253.213.251/api';
      const cleanApiUrl = rawApiUrl.replace(/\/$/, ""); 
      
      const baseApi = cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`;
      
      const headers = { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` };
      const params = `?start_date=${startDate}&end_date=${endDate}`;

      let masukData = [];
      let keluarData = [];

      if (activeTab === 'masuk' || activeTab === 'semua') {
        const resMasuk = await fetch(`${baseApi}/laporan/transaksi-masuk${params}`, { headers });
        const jsonMasuk = await resMasuk.json();
        if (jsonMasuk.success) {
          masukData = jsonMasuk.data.map(item => ({ ...item, _type: 'masuk' }));
        }
      }

      if (activeTab === 'keluar' || activeTab === 'semua') {
        const resKeluar = await fetch(`${baseApi}/laporan/transaksi-keluar${params}`, { headers });
        const jsonKeluar = await resKeluar.json();
        if (jsonKeluar.success) {
          keluarData = jsonKeluar.data.map(item => ({ ...item, _type: 'keluar' }));
        }
      }

      let combinedData = [...masukData, ...keluarData];
      setLaporanData(combinedData);

      const total_transaksi = combinedData.length;
      const total_jumlah_barang = combinedData.reduce((acc, curr) => acc + curr.jumlah, 0);
      const total_nilai = combinedData.reduce((acc, curr) => {
        const harga = curr._type === 'masuk' ? curr.harga_beli : curr.harga_jual;
        return acc + (curr.jumlah * parseFloat(harga || 0));
      }, 0);

      setRingkasan({ total_transaksi, total_jumlah_barang, total_nilai });

    } catch (error) {
      console.error("Error Fetching Laporan:", error);
      setLaporanData([]);
      setRingkasan({ total_transaksi: 0, total_jumlah_barang: 0, total_nilai: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, [startDate, endDate, activeTab]); 

  // === FUNGSI EKSEKUSI EKSPOR DARI MODAL ===
  const handleExecuteExport = (config) => {
    console.log("Memproses Ekspor dengan konfigurasi:", config);
    alert(`Mengekspor data dalam format ${config.format.toUpperCase()} untuk rentang: ${config.range}`);
    // Panggil API endpoint untuk download disini
  };

  // === LOGIKA FILTER PENCARIAN & PENGURUTAN (LOKAL) ===
  const processedData = laporanData
    .filter(item => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      const idPrefix = item._type === 'masuk' ? 'TRX-M-' : 'TRX-K-';
      const fullId = `${idPrefix}${String(item.id).padStart(4, '0')}`.toLowerCase();
      const namaBarang = item.barang?.nama_barang?.toLowerCase() || '';
      const entitas = (item.supplier?.nama_supplier || item.nama_instansi || item.konsumen?.nama_konsumen || '').toLowerCase();
      
      return fullId.includes(searchLower) || namaBarang.includes(searchLower) || entitas.includes(searchLower);
    })
    .sort((a, b) => {
      if (sortOrder === 'terbaru') return new Date(b.created_at) - new Date(a.created_at);
      if (sortOrder === 'terlama') return new Date(a.created_at) - new Date(b.created_at);
      
      const totalA = a.jumlah * parseFloat(a._type === 'masuk' ? a.harga_beli : a.harga_jual);
      const totalB = b.jumlah * parseFloat(b._type === 'masuk' ? b.harga_beli : b.harga_jual);
      
      if (sortOrder === 'tertinggi') return totalB - totalA;
      if (sortOrder === 'terendah') return totalA - totalB;
      
      return 0;
    });

  // === FUNGSI HELPER FORMATTING ===
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(angka || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
  };

  const displayDateRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;

  const getSortLabel = () => {
    switch (sortOrder) {
      case 'terbaru': return 'Terbaru';
      case 'terlama': return 'Terlama';
      case 'tertinggi': return 'Nilai Tertinggi';
      case 'terendah': return 'Nilai Terendah';
      default: return 'Terbaru';
    }
  };

  return (
    <>
      <div className="flex h-screen bg-[#F4F7FC] font-sans overflow-hidden">
        
        {/* ================= SIDEBAR ================= */}
        <aside className="w-[260px] bg-white border-r border-gray-100 flex flex-col z-20 shrink-0 hidden md:flex">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#5452F6] rounded-xl flex items-center justify-center shrink-0 shadow-sm shadow-indigo-100">
                <Box className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-[#5452F6] font-bold text-[13px] leading-tight tracking-wide uppercase">CV. AMRITA<br/>JAYASRI</h1>
                <p className="text-gray-400 font-medium text-[10px] mt-0.5">Sistem Inventaris ATK</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-4 space-y-1.5 mt-2 overflow-y-auto scrollbar-hide">
            <button onClick={() => onNavigate('dashboard')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left"><LayoutDashboard className="w-5 h-5" /> Dashboard</button>
            <button onClick={() => onNavigate('data-barang')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left"><Box className="w-5 h-5" /> Data Barang</button>
            <button onClick={() => onNavigate('pemasok')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left"><Truck className="w-5 h-5" /> Pemasok</button>
            <button onClick={() => onNavigate('konsumen')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left"><Users className="w-5 h-5" /> Konsumen</button>
            <button onClick={() => onNavigate('barang-masuk')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left"><ArrowDownRight className="w-5 h-5" /> Barang Masuk</button>
            <button onClick={() => onNavigate('barang-keluar')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left"><ArrowUpRight className="w-5 h-5" /> Barang Keluar</button>
            <button onClick={() => onNavigate('monitoring-stok')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left"><Activity className="w-5 h-5" /> Monitoring Stok</button>
            <button onClick={() => onNavigate('laporan')} className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0EFFF] text-[#5452F6] rounded-xl font-bold text-sm transition-colors text-left"><BarChart2 className="w-5 h-5" /> Laporan</button>
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
                  placeholder="Cari ID, Barang, atau Instansi..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-[#F4F7FC] border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-[#5452F6] focus:ring-1 focus:ring-[#5452F6] transition-all" 
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

          <div className="flex-1 overflow-y-auto p-8 pb-12">
            
            {/* === TOP SECTION === */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              
              {/* Kiri: Card Text & Tombol */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex-1 flex flex-col justify-center">
                  <h3 className="text-[11px] font-black text-[#5452F6] uppercase tracking-[0.15em] mb-2">Inventaris Perusahaan</h3>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Laporan Transaksi</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Hasilkan log komprehensif dari pergerakan stok masuk dan keluar.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  
                  {/* === TOMBOL EKSPOR EXCEL === */}
                  <button 
                    onClick={() => {
                      setInitialExportFormat('excel');
                      setIsExportModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap shadow-sm"
                  >
                    <FileSpreadsheet className="w-4 h-4" /> Ekspor Excel
                  </button>

                  {/* === TOMBOL UNDUH PDF === */}
                  <button 
                    onClick={() => {
                      setInitialExportFormat('pdf');
                      setIsExportModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-[#5452F6] text-white rounded-xl text-xs font-bold hover:bg-[#4341E3] transition-all shadow-md shadow-indigo-100 whitespace-nowrap"
                  >
                    <Download className="w-4 h-4" /> Unduh PDF
                  </button>
                  
                </div>
              </div>

              {/* Kanan: Filter Tanggal & Tipe */}
              <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  
                  {/* 1. Rentang Tanggal */}
                  <div>
                    <label className="text-[10px] font-black text-gray-800 uppercase tracking-widest mb-4 block">Rentang Tanggal</label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input 
                          type="date" 
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full pl-8 pr-1 py-3 bg-[#F4F7FC] border border-transparent rounded-xl text-[10px] font-bold text-gray-600 focus:outline-none focus:bg-white focus:border-[#5452F6] transition-colors" 
                        />
                      </div>
                      <span className="text-gray-300 text-[10px] font-bold">-</span>
                      <div className="relative flex-1">
                        <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input 
                          type="date" 
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full pl-8 pr-1 py-3 bg-[#F4F7FC] border border-transparent rounded-xl text-[10px] font-bold text-gray-600 focus:outline-none focus:bg-white focus:border-[#5452F6] transition-colors" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Tipe Transaksi */}
                  <div>
                    <label className="text-[10px] font-black text-gray-800 uppercase tracking-widest mb-4 block">Tipe Transaksi</label>
                    <div className="relative">
                      <select 
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-[#F4F7FC] border border-transparent rounded-xl text-[11px] font-bold text-gray-600 appearance-none focus:outline-none focus:bg-white focus:border-[#5452F6] transition-colors cursor-pointer"
                      >
                        <option value="semua">Semua Transaksi</option>
                        <option value="masuk">Transaksi Masuk</option>
                        <option value="keluar">Transaksi Keluar</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                </div>

                <div className="flex items-center gap-2 mt-auto pt-2">
                  <div className="w-2 h-2 bg-[#5452F6] rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-bold text-gray-500">Sinkronisasi data langsung aktif</span>
                </div>
              </div>
            </div>

            {/* === MIDDLE TOOLBAR === */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                <div className="flex items-center bg-white p-1 rounded-[14px] border border-gray-100 shadow-sm">
                  {['semua', 'masuk', 'keluar'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-2 text-xs font-bold rounded-xl capitalize transition-all ${
                        activeTab === tab 
                          ? 'bg-white shadow-sm text-[#5452F6]' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <button className="flex items-center gap-3 px-5 py-2.5 bg-white border border-gray-100 rounded-[14px] text-xs font-bold text-gray-600 shadow-sm pointer-events-none">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {displayDateRange}
                </button>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                {/* Dropdown Urutkan */}
                <div className="relative">
                  <button 
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center gap-3 px-5 py-2.5 bg-white border border-gray-100 rounded-[14px] text-xs font-bold text-gray-600 shadow-sm"
                  >
                    <span className="text-gray-400 font-medium">Urutkan:</span> {getSortLabel()}
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
                  </button>

                  {isSortOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)}></div>
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2">
                        <button onClick={() => { setSortOrder('terbaru'); setIsSortOpen(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-gray-50 transition-colors ${sortOrder === 'terbaru' ? 'text-[#5452F6] bg-indigo-50/50' : 'text-gray-600'}`}>Terbaru</button>
                        <button onClick={() => { setSortOrder('terlama'); setIsSortOpen(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-gray-50 transition-colors ${sortOrder === 'terlama' ? 'text-[#5452F6] bg-indigo-50/50' : 'text-gray-600'}`}>Terlama</button>
                        <button onClick={() => { setSortOrder('tertinggi'); setIsSortOpen(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-gray-50 transition-colors ${sortOrder === 'tertinggi' ? 'text-[#5452F6] bg-indigo-50/50' : 'text-gray-600'}`}>Nilai Tertinggi</button>
                        <button onClick={() => { setSortOrder('terendah'); setIsSortOpen(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-gray-50 transition-colors ${sortOrder === 'terendah' ? 'text-[#5452F6] bg-indigo-50/50' : 'text-gray-600'}`}>Nilai Terendah</button>
                      </div>
                    </>
                  )}
                </div>
                
                <button className="flex items-center justify-center p-2.5 bg-white border border-gray-100 rounded-[14px] shadow-sm text-gray-500 hover:text-[#5452F6] transition-colors cursor-not-allowed opacity-50">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* === TABLE AREA === */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden mb-8 min-h-[300px] relative">
              <div className="p-6 border-b border-gray-50">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">
                    Log Transaksi Terperinci
                  </h3>
                </div>
              </div>
              
              {isLoading ? (
                <div className="absolute inset-0 z-10 bg-white/80 flex flex-col items-center justify-center mt-20">
                  <Loader2 className="w-8 h-8 text-[#5452F6] animate-spin mb-4" />
                  <p className="text-sm font-bold text-gray-500">Menarik data laporan...</p>
                </div>
              ) : processedData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center mt-10">
                  <FileText className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-800">Tidak Ada Transaksi</h3>
                  <p className="text-sm text-gray-500 mt-1">Belum ada data transaksi yang sesuai filter.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                      <tr className="bg-white text-[10px] font-black text-gray-800 uppercase tracking-widest border-b border-gray-100">
                        <th className="py-5 px-8">ID Transaksi</th>
                        <th className="py-5 px-6">Tanggal & Waktu</th>
                        <th className="py-5 px-6">Produk</th>
                        <th className="py-5 px-6 text-center">Tipe</th>
                        <th className="py-5 px-6 text-center">Jumlah</th>
                        <th className="py-5 px-8 text-right">Total Nilai</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {processedData.map((item) => {
                        const isMasuk = item._type === 'masuk';
                        const idPrefix = isMasuk ? '#TRX-M-' : '#TRX-K-';
                        const tanggalText = isMasuk ? item.tanggal_masuk : item.tanggal_keluar;
                        
                        const harga = isMasuk ? item.harga_beli : item.harga_jual;
                        const totalNilai = item.jumlah * parseFloat(harga);
                        const formattedRupiah = formatRupiah(totalNilai);

                        const infoTujuan = isMasuk 
                          ? `Supplier: ${item.supplier?.nama_supplier || 'Umum'}`
                          : `Klien: ${item.nama_instansi || item.konsumen?.nama_konsumen || 'Umum'}`;
                        
                        return (
                          <tr key={`${item._type}-${item.id}`} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-5 px-8">
                              <span className="text-xs font-black text-[#5452F6] hover:underline cursor-pointer">
                                {idPrefix}{String(item.id).padStart(4, '0')}
                              </span>
                            </td>
                            <td className="py-5 px-6">
                              <p className="text-xs font-bold text-gray-800">{formatDate(tanggalText)}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{formatTime(item.created_at)}</p>
                            </td>
                            <td className="py-5 px-6">
                              <p className="text-xs font-black text-gray-800 truncate max-w-[200px]" title={item.barang?.nama_barang}>
                                {item.barang?.nama_barang}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-0.5 font-medium uppercase tracking-wider">
                                SKU: {item.barang?.id_referensi}
                              </p>
                            </td>
                            <td className="py-5 px-6 text-center">
                              {isMasuk ? (
                                <span className="text-[10px] font-black px-3 py-1.5 rounded-[10px] capitalize tracking-wide bg-[#EEF2FF] text-[#5452F6] inline-flex items-center">
                                  <ArrowDownLeft className="w-3.5 h-3.5 mr-1.5" /> Masuk
                                </span>
                              ) : (
                                <span className="text-[10px] font-black px-3 py-1.5 rounded-[10px] capitalize tracking-wide bg-[#FFF1E7] text-[#E06A26] inline-flex items-center">
                                  <ArrowUpRight className="w-3.5 h-3.5 mr-1.5" /> Keluar
                                </span>
                              )}
                            </td>
                            <td className="py-5 px-6 text-center">
                              <p className="text-xs font-black text-gray-800">
                                {isMasuk ? '+' : '-'} {item.jumlah} Unit
                              </p>
                              <p className="text-[10px] text-gray-400 mt-0.5 font-medium truncate max-w-[150px]" title={infoTujuan}>
                                {infoTujuan}
                              </p>
                            </td>
                            <td className="py-5 px-8 text-right">
                              <p className="text-sm font-black text-gray-800">{formattedRupiah}</p>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              
              <div className="p-6 bg-white border-t border-gray-100 flex justify-between items-center">
                <p className="text-xs font-medium text-gray-500">
                  Menampilkan <span className="font-bold text-gray-800">{processedData.length > 0 ? 1 : 0}</span> sampai <span className="font-bold text-gray-800">{processedData.length}</span> dari <span className="font-bold text-gray-800">{ringkasan.total_transaksi}</span> total data di rentang ini
                </p>
                <div className="flex items-center gap-1.5 ml-auto">
                  <button className="text-[11px] font-bold text-gray-500 hover:text-gray-800 mr-2 transition-colors">Sebelumnya</button>
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#5452F6] text-white text-[11px] font-bold">1</button>
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-600 text-[11px] font-bold transition-colors">2</button>
                  <button className="text-[11px] font-bold text-gray-500 hover:text-gray-800 ml-2 transition-colors">Berikutnya</button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* === KOMPONEN MODAL EKSPOR BARU === */}
      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        onExport={handleExecuteExport}
        initialFormat={initialExportFormat}
      />
    </>
  );
};

export default Laporan;