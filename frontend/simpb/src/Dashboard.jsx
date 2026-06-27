import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Box, Truck, Users, 
  ArrowDownRight, ArrowUpRight, Activity, 
  BarChart2, Bell, Plus, 
  Calendar, AlertTriangle, TrendingUp, AlertCircle, CircleUser, Loader2,
  Menu, X, CheckCircle // <-- DIPERBAIKI: Menambahkan CheckCircle ke dalam import
} from 'lucide-react';

import DateRangePickerModal from './DateRangePickerModal';
import logoAmrita from './assets/Logo Amrita.png';

const Dashboard = ({ onLogout, onNavigate }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // === STATE UNTUK MENYIMPAN DATA DARI API DASHBOARD ===
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // === MEMANGGIL API DASHBOARD ===
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const rawApiUrl = import.meta.env.VITE_API_URL || 'https://cvamritajayasri.my.id/api';
        const cleanApiUrl = rawApiUrl.replace(/\/$/, ""); 
        
        // Pengecekan URL agar tidak menumpuk /api/api
        const baseApi = cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`;
        
        const response = await fetch(`${baseApi}/dashboard`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        const json = await response.json();
        
        if (json.success) {
          setDashboardData(json.data);
        } else {
          console.error("Gagal mengambil data dashboard:", json.message);
        }
      } catch (error) {
        console.error("Error Fetching Dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // === FUNGSI HELPER & FORMATTING ===
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(angka || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleNavigation = (path) => {
    setIsMobileMenuOpen(false);
    onNavigate(path);
  };

  // === MENYIAPKAN DATA UNTUK RENDER ===
  const stats = dashboardData?.statistik || {};
  const bulanIni = dashboardData?.bulan_ini || {};
  const stokKritisList = dashboardData?.stok_kritis || [];
  const chartData = dashboardData?.grafik_7_hari || [];
  
  // === LOGIKA SKALA GRAFIK YANG LEBIH RAPI ===
  const allValues = chartData.flatMap(d => [
    Number(d.masuk || d.total_masuk || d.jumlah_masuk || 0), 
    Number(d.keluar || d.total_keluar || d.jumlah_keluar || 0)
  ]);
  const maxValueFromData = allValues.length > 0 ? Math.max(...allValues) : 0;
  
  let maxChartValue = 10;
  if (maxValueFromData > 0) {
    if (maxValueFromData <= 10) {
        maxChartValue = 10;
    } else {
        const pow10 = Math.pow(10, Math.floor(Math.log10(maxValueFromData)));
        maxChartValue = Math.ceil(maxValueFromData / pow10) * pow10;
        if (maxChartValue === maxValueFromData) maxChartValue += pow10;
    }
  }

  // Menggabungkan transaksi masuk dan keluar menjadi satu array
  const txMasuk = (dashboardData?.transaksi_masuk_terbaru || []).map(t => ({ ...t, type: 'masuk', date: t.tanggal_masuk }));
  const txKeluar = (dashboardData?.transaksi_keluar_terbaru || []).map(t => ({ ...t, type: 'keluar', date: t.tanggal_keluar }));
  
  const combinedTx = [...txMasuk, ...txKeluar]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      
      {/* ================= MOBILE OVERLAY ================= */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-gray-100 flex flex-col shrink-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logoAmrita} alt="Logo CV Amrita Jayasri" className="w-12 h-12 object-contain shrink-0 drop-shadow-sm" />
            <div>
              <h1 className="text-[#5452F6] font-bold text-[13px] leading-tight tracking-wide">
                CV. AMRITA<br/>JAYASRI
              </h1>
              <p className="text-gray-400 font-medium text-[10px] mt-0.5">
                Sistem Inventaris ATK
              </p>
            </div>
          </div>
          <button className="md:hidden text-gray-400 hover:text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-2">
          <button onClick={() => handleNavigation('dashboard')} className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0EFFF] text-[#5452F6] rounded-xl font-bold text-sm transition-colors text-left">
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
          <button onClick={() => handleNavigation('monitoring-stok')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
            <Activity className="w-5 h-5" /> Monitoring Stok
          </button>
          <button onClick={() => handleNavigation('laporan')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
            <BarChart2 className="w-5 h-5" /> Laporan
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100 mt-auto">
          <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 w-full text-[#64748B] hover:bg-red-50 hover:text-red-500 rounded-xl font-semibold text-sm transition-colors">
            <ArrowDownRight className="w-5 h-5 rotate-90" /> Keluar
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col overflow-hidden relative w-full">
        <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0 shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-gray-500 hover:text-gray-800 p-1" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="font-bold text-[#1E232C] text-sm md:text-base hidden sm:block">SIMPB - CV. Amrita Jayasri</h2>
            <h2 className="font-bold text-[#1E232C] text-sm sm:hidden">SIMPB</h2>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            
            {/* ================= NOTIFIKASI BELL ================= */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  if(isProfileOpen) setIsProfileOpen(false);
                }}
                className="relative text-gray-500 hover:text-gray-800 transition-colors p-1"
              >
                <Bell className="w-5 h-5" />
                {stokKritisList.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* DROPDOWN NOTIFIKASI */}
              {isNotifOpen && (
                <div className="absolute right-0 top-full mt-3 w-72 md:w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-1 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center">
                    <p className="text-sm font-bold text-gray-800">Notifikasi</p>
                    {stokKritisList.length > 0 && (
                      <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        {stokKritisList.length} Peringatan
                      </span>
                    )}
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {isLoading ? (
                      <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-[#5452F6]" /></div>
                    ) : stokKritisList.length === 0 ? (
                      <div className="px-4 py-8 text-center flex flex-col items-center">
                        <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                        <p className="text-xs text-gray-500 font-medium">Semua stok dalam kondisi aman.</p>
                      </div>
                    ) : (
                      stokKritisList.map((item) => (
                        <div 
                          key={item.id} 
                          onClick={() => { setIsNotifOpen(false); onNavigate('monitoring-stok'); }}
                          className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 p-1.5 bg-red-50 rounded-lg shrink-0 group-hover:bg-red-100 transition-colors">
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                            </div>
                            <div>
                              <p className="text-[11px] md:text-xs font-bold text-gray-800 mb-1 leading-tight">{item.nama_barang}</p>
                              <p className="text-[10px] text-gray-500">Stok tersisa: <span className="font-bold text-red-600">{item.stok} {item.satuan}</span> (Min: {item.stok_minimum})</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {stokKritisList.length > 0 && (
                    <div className="px-4 py-2.5 border-t border-gray-50 text-center">
                      <button 
                        onClick={() => { setIsNotifOpen(false); onNavigate('monitoring-stok'); }}
                        className="text-[11px] font-bold text-[#5452F6] hover:text-[#4341E3] transition-colors"
                      >
                        Lihat Semua Pemantauan
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
            
            {/* ================= PROFILE MENU ================= */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  if(isNotifOpen) setIsNotifOpen(false);
                }}
                className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
              >
                <CircleUser className="w-7 h-7 md:w-8 md:h-8 text-[#5452F6]" strokeWidth={1.5} />
                <span className="text-sm font-semibold text-[#1E232C] hidden md:block">Administrator</span>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-3 w-44 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-1 animate-in fade-in zoom-in-95">
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
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Ringkasan Dashboard</h1>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Sistem Informasi Manajemen Persediaan Barang ATK</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <button 
                onClick={() => setShowDatePicker(true)}
                className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-white border border-gray-200 shadow-sm rounded-xl text-xs md:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Calendar className="w-4 h-4 text-[#5452F6]" /> <span className="hidden sm:inline">Rentang Tanggal</span>
              </button>
              <button onClick={() => onNavigate('barang-masuk')} className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-[#5452F6] hover:bg-[#4341E3] rounded-xl text-xs md:text-sm font-semibold text-white transition-colors shadow-lg shadow-indigo-500/30">
                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Transaksi Masuk</span><span className="sm:hidden">Masuk</span>
              </button>
              <button onClick={() => onNavigate('barang-keluar')} className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-[#5452F6] hover:bg-[#4341E3] rounded-xl text-xs md:text-sm font-semibold text-white transition-colors shadow-lg shadow-indigo-500/30">
                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Transaksi Keluar</span><span className="sm:hidden">Keluar</span>
              </button>
            </div>
          </div>

          {/* ================= 4 KARTU STATISTIK ATAS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            <div className="bg-[#FAEDFF] p-4 md:p-5 rounded-[20px] shadow-sm flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#A855F7] text-white rounded-lg flex items-center justify-center"><Box className="w-4 h-4 md:w-5 md:h-5" /></div>
              </div>
              <h3 className="text-[10px] md:text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Total Jenis Item ATK</h3>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">{isLoading ? '...' : stats.total_barang}</p>
              <div className="w-12 md:w-16 h-1.5 bg-[#5452F6] rounded-full mt-2"></div>
            </div>

            <div className="bg-[#EEF2FF] p-4 md:p-5 rounded-[20px] shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#5452F6] opacity-80 text-white rounded-lg flex items-center justify-center"><ArrowDownRight className="w-4 h-4 md:w-5 md:h-5" /></div>
              </div>
              <h3 className="text-[10px] md:text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Masuk (Bulan Ini)</h3>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">{isLoading ? '...' : bulanIni.transaksi_masuk}</p>
              <div className="flex items-center gap-1 mt-2 text-gray-500">
                <TrendingUp className="w-3 h-3" />
                <p className="text-[9px] md:text-[10px] font-medium">Total: {stats.total_transaksi_masuk} Transaksi</p>
              </div>
            </div>

            <div className="bg-[#ECFDF5] p-4 md:p-5 rounded-[20px] shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#10B981] text-white rounded-lg flex items-center justify-center"><ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" /></div>
              </div>
              <h3 className="text-[10px] md:text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Keluar (Bulan Ini)</h3>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">{isLoading ? '...' : bulanIni.transaksi_keluar}</p>
              <div className="flex items-center gap-1 mt-2 text-gray-500">
                <TrendingUp className="w-3 h-3" />
                <p className="text-[9px] md:text-[10px] font-medium">Total: {stats.total_transaksi_keluar} Transaksi</p>
              </div>
            </div>

            <div className="bg-[#FEF2F2] p-4 md:p-5 rounded-[20px] shadow-sm flex flex-col border border-red-50">
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#EF4444] text-white rounded-lg flex items-center justify-center"><AlertTriangle className="w-4 h-4 md:w-5 md:h-5" /></div>
                {stats.total_stok_kritis > 0 && (
                  <span className="text-[8px] md:text-[9px] font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full uppercase">Tindakan</span>
                )}
              </div>
              <h3 className="text-[10px] md:text-[11px] font-bold text-red-500 uppercase tracking-wider mb-1">Stok Kritis</h3>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">{isLoading ? '...' : stats.total_stok_kritis}</p>
              <div className="flex items-center gap-1 mt-2 text-red-500">
                <AlertCircle className="w-3 h-3" />
                <p className="text-[9px] md:text-[10px] font-bold">Item di bawah minimum</p>
              </div>
            </div>
          </div>

          {/* ================= LAYOUT 2 KOLOM (KIRI & KANAN) ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 items-start w-full">
            
            {/* --- KOLOM KIRI (Spans 2/3) --- */}
            <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6 w-full">
              
              {/* ================= GRAFIK 7 HARI ================= */}
              <div className="bg-white rounded-[20px] p-4 md:p-6 shadow-sm border border-gray-100 w-full overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-gray-800">Tren Barang Masuk & Keluar</h3>
                    <p className="text-[11px] md:text-xs text-gray-500">Data historis 7 hari terakhir</p>
                  </div>
                  <div className="flex gap-3 md:gap-4 text-[10px] md:text-xs font-bold text-gray-500">
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#5452F6]"></span> Masuk</div>
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#D1D5DB]"></span> Keluar</div>
                  </div>
                </div>
                
                <div className="overflow-x-auto w-full pb-2">
                  <div className="relative h-[200px] md:h-[260px] ml-8 md:ml-10 mt-10 md:mt-12 min-w-[300px]">
                    {/* Y-Axis Labels */}
                    <div className="absolute -left-8 md:-left-10 top-0 bottom-6 md:bottom-8 w-6 md:w-8 flex flex-col justify-between text-right text-[9px] md:text-[10px] text-gray-400 font-bold">
                      <span>{maxChartValue}</span>
                      <span>{Math.round(maxChartValue / 2)}</span>
                      <span>0</span>
                    </div>

                    {/* Grid Background Lines */}
                    <div className="absolute inset-0 bottom-6 md:bottom-8 border-b border-gray-100 flex flex-col justify-between pointer-events-none">
                      <div className="w-full border-t border-gray-50"></div>
                      <div className="w-full border-t border-gray-50"></div>
                      <div className="w-full"></div>
                    </div>

                    {/* Chart Area */}
                    <div className="absolute inset-0 bottom-6 md:bottom-8 border-l border-gray-100 flex items-end justify-around px-1 md:px-2 z-10">
                      {isLoading ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <Loader2 className="w-5 h-5 md:w-6 h-6 animate-spin text-[#5452F6]" />
                        </div>
                      ) : (
                        chartData.map((data, index) => {
                          const valMasuk = Number(data.masuk || data.total_masuk || data.jumlah_masuk || 0);
                          const valKeluar = Number(data.keluar || data.total_keluar || data.jumlah_keluar || 0);

                          const pctMasuk = maxChartValue > 0 ? (valMasuk / maxChartValue) * 100 : 0;
                          const pctKeluar = maxChartValue > 0 ? (valKeluar / maxChartValue) * 100 : 0;

                          return (
                            <div key={index} className="flex-1 flex justify-center items-end gap-0.5 md:gap-1.5 h-full relative group">
                              <div className="opacity-0 group-hover:opacity-100 absolute -top-10 md:-top-12 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] md:text-[11px] font-medium px-3 py-1.5 rounded-lg shadow-xl pointer-events-none transition-all duration-200 whitespace-nowrap z-50 flex flex-col items-center">
                                <span>Masuk: {valMasuk} | Keluar: {valKeluar}</span>
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45 rounded-sm"></div>
                              </div>

                              {/* Bar Masuk */}
                              <div 
                                className="w-3 sm:w-4 md:w-6 bg-[#5452F6] rounded-t-sm md:rounded-t-md hover:opacity-80 transition-all duration-500" 
                                style={{ height: `${pctMasuk}%`, minHeight: valMasuk > 0 ? '4px' : '0px' }}
                              ></div>
                              
                              {/* Bar Keluar */}
                              <div 
                                className="w-3 sm:w-4 md:w-6 bg-[#D1D5DB] rounded-t-sm md:rounded-t-md hover:opacity-80 transition-all duration-500" 
                                style={{ height: `${pctKeluar}%`, minHeight: valKeluar > 0 ? '4px' : '0px' }}
                              ></div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* X-Axis Labels */}
                    {!isLoading && (
                      <div className="absolute bottom-0 left-0 right-0 h-6 md:h-8 flex items-center justify-around px-1 md:px-2">
                        {chartData.map((data, index) => {
                          const labelHari = data.label || data.hari || data.tanggal || '-';
                          return (
                            <div key={`label-${index}`} className="flex-1 text-center text-[8px] md:text-[10px] text-gray-400 font-bold truncate">
                              {labelHari}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ================= TRANSAKSI TERAKHIR ================= */}
              <div className="bg-white rounded-[20px] p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col w-full overflow-hidden">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-gray-800">Transaksi Terakhir</h3>
                    <p className="text-[11px] md:text-xs text-gray-500">Aktivitas masuk & keluar terbaru</p>
                  </div>
                </div>

                <div className="flex-1 overflow-x-auto w-full pb-2">
                  <div className="min-w-[450px] md:min-w-[600px]">
                    <div className="grid grid-cols-12 gap-2 md:gap-4 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 md:mb-4 px-2">
                      <div className="col-span-4">DETAIL BARANG</div>
                      <div className="col-span-2">TIPE</div>
                      <div className="col-span-3">TANGGAL</div>
                      <div className="col-span-2">JUMLAH</div>
                      <div className="col-span-1 text-right md:text-left">STATUS</div>
                    </div>

                    <div className="space-y-1">
                      {isLoading ? (
                        <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 md:w-6 h-6 animate-spin text-[#5452F6]" /></div>
                      ) : combinedTx.length === 0 ? (
                        <p className="text-center text-xs text-gray-500 py-8">Belum ada transaksi.</p>
                      ) : (
                        combinedTx.map((tx) => (
                          <div key={`${tx.type}-${tx.id}`} className="grid grid-cols-12 gap-2 md:gap-4 items-center px-2 py-2.5 md:py-3 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0">
                            <div className="col-span-4 flex items-center gap-2 md:gap-3">
                              <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
                                 <Box className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-[11px] md:text-sm font-bold text-gray-800 truncate" title={tx.barang?.nama_barang}>
                                  {tx.barang?.nama_barang || 'Barang Tidak Diketahui'}
                                </p>
                                <p className="text-[9px] md:text-[10px] text-gray-500 truncate">{tx.barang?.id_referensi || '-'}</p>
                              </div>
                            </div>
                            <div className="col-span-2">
                              {tx.type === 'masuk' ? (
                                <span className="flex items-center gap-1 w-fit px-1.5 md:px-2 py-0.5 md:py-1 bg-[#ECFDF5] text-[#059669] rounded-md text-[8px] md:text-[9px] font-bold uppercase tracking-wider">
                                  <ArrowDownRight className="w-2.5 h-2.5 md:w-3 md:h-3" /> MASUK
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 w-fit px-1.5 md:px-2 py-0.5 md:py-1 bg-[#FFF7ED] text-[#D97706] rounded-md text-[8px] md:text-[9px] font-bold uppercase tracking-wider">
                                  <ArrowUpRight className="w-2.5 h-2.5 md:w-3 md:h-3" /> KELUAR
                                </span>
                              )}
                            </div>
                            <div className="col-span-3 text-[10px] md:text-xs text-gray-600 font-medium truncate">{formatDate(tx.date)}</div>
                            <div className="col-span-2 text-[10px] md:text-xs font-bold text-gray-800 truncate">{tx.jumlah} {tx.barang?.satuan || ''}</div>
                            <div className="col-span-1 text-[9px] md:text-[11px] font-bold text-[#059669] text-right md:text-left">Selesai</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* --- KOLOM KANAN (Spans 1/3) --- */}
            <div className="flex flex-col gap-4 md:gap-6 w-full">
              
              {/* ================= TOTAL NILAI PERSEDIAAN ================= */}
              <div className="bg-gradient-to-br from-[#5452F6] to-[#7C3AED] rounded-[20px] p-5 md:p-6 shadow-md text-white relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
                  <BarChart2 className="w-24 h-24 md:w-32 md:h-32" />
                </div>
                
                <h3 className="text-[10px] md:text-xs font-bold text-white/80 uppercase tracking-wider mb-2 relative z-10">Nilai Persediaan Keseluruhan</h3>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 md:mb-4 relative z-10 truncate" title={formatRupiah(stats.total_nilai_stok)}>
                  {isLoading ? '...' : formatRupiah(stats.total_nilai_stok)}
                </p>
              </div>

              {/* ================= DISTRIBUSI STOK ================= */}
              <div className="bg-white rounded-[20px] p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col">
                <h3 className="text-base md:text-lg font-bold text-gray-800">Distribusi Stok</h3>
                <p className="text-[11px] md:text-xs text-gray-500 mb-4 md:mb-6">Berdasarkan kategori barang</p>
                
                <div className="flex-1 flex flex-col justify-center items-center relative mt-2">
                  <div className="relative w-32 h-32 md:w-40 md:h-40">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#9CA3AF" strokeWidth="12" fill="none" strokeDasharray="251.2" strokeDashoffset="213.5" />
                      <circle cx="50" cy="50" r="40" stroke="#92400E" strokeWidth="12" fill="none" strokeDasharray="251.2" strokeDashoffset="163.2" className="transform origin-center rotate-[54deg]" />
                      <circle cx="50" cy="50" r="40" stroke="#374151" strokeWidth="12" fill="none" strokeDasharray="251.2" strokeDashoffset="150.7" className="transform origin-center rotate-[126deg]" />
                      <circle cx="50" cy="50" r="40" stroke="#5452F6" strokeWidth="12" fill="none" strokeDasharray="251.2" strokeDashoffset="113" className="transform origin-center rotate-[216deg]" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full m-3 shadow-inner">
                      <span className="text-xl md:text-2xl font-bold text-gray-800">{isLoading ? '...' : stats.total_barang}</span>
                      <span className="text-[7px] md:text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-1">Total Item</span>
                    </div>
                  </div>

                  <div className="w-full mt-4 md:mt-6 space-y-2 md:space-y-2.5">
                    <div className="flex justify-between items-center text-[10px] md:text-[11px]">
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#5452F6]"></span> <span className="text-gray-700 font-bold">Kertas</span></div>
                      <span className="text-gray-500 font-semibold">40%</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] md:text-[11px]">
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#374151]"></span> <span className="text-gray-700 font-bold">Alat Tulis</span></div>
                      <span className="text-gray-500 font-semibold">25%</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] md:text-[11px]">
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#92400E]"></span> <span className="text-gray-700 font-bold">Tinta</span></div>
                      <span className="text-gray-500 font-semibold">20%</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] md:text-[11px]">
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#9CA3AF]"></span> <span className="text-gray-700 font-bold">Arsip</span></div>
                      <span className="text-gray-500 font-semibold">15%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= PERINGATAN STOK KRITIS ================= */}
              <div className="bg-white rounded-[20px] p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col h-fit">
                <div className="flex items-center gap-2 mb-4 md:mb-5">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <h3 className="text-sm font-bold text-gray-800">Peringatan Stok Kritis</h3>
                </div>

                <div className="space-y-2 md:space-y-3 mb-4 md:mb-6 max-h-[140px] md:max-h-[160px] overflow-y-auto pr-1">
                  {isLoading ? (
                    <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin text-[#5452F6]" /></div>
                  ) : stokKritisList.length === 0 ? (
                    <p className="text-[11px] md:text-xs text-emerald-600 text-center py-4 font-medium">Stok dalam kondisi aman.</p>
                  ) : (
                    stokKritisList.map((item) => (
                      <div key={item.id} className="bg-[#FEF2F2] border-l-4 border-red-500 p-2 md:p-3 rounded-r-lg flex justify-between items-center">
                        <div className="overflow-hidden mr-2">
                          <p className="text-[11px] md:text-xs font-bold text-gray-800 truncate" title={item.nama_barang}>{item.nama_barang}</p>
                          <p className="text-[8px] md:text-[9px] text-gray-500 uppercase mt-0.5 truncate">Minimal: {item.stok_minimum} {item.satuan}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs md:text-sm font-bold text-red-600">{item.stok} {item.satuan}</p>
                          <span className="text-[7px] md:text-[8px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Sisa</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button onClick={() => onNavigate('monitoring-stok')} className="w-full py-2 md:py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-[11px] md:text-xs font-bold rounded-xl transition-colors mt-auto border border-gray-100">
                  Lihat Semua Stok
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      <DateRangePickerModal 
        isOpen={showDatePicker} 
        onClose={() => setShowDatePicker(false)} 
      />

    </div>
  );
};

export default Dashboard;