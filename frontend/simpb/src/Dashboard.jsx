import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Box, Truck, Users, 
  ArrowDownRight, ArrowUpRight, Activity, 
  BarChart2, Search, Bell, Plus, 
  Calendar, AlertTriangle, TrendingUp, AlertCircle, CircleUser, Loader2
} from 'lucide-react';

import DateRangePickerModal from './DateRangePickerModal';

const Dashboard = ({ onLogout, onNavigate }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // === STATE UNTUK MENYIMPAN DATA DARI API DASHBOARD ===
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // === MEMANGGIL API DASHBOARD ===
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const rawApiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
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

  // === MENYIAPKAN DATA UNTUK RENDER (Aman jika null) ===
  const stats = dashboardData?.statistik || {};
  const bulanIni = dashboardData?.bulan_ini || {};
  const stokKritisList = dashboardData?.stok_kritis || [];
  const chartData = dashboardData?.grafik_7_hari || [];
  
  // === LOGIKA UNTUK SKALA GRAFIK YANG LEBIH TANGGUH ===
  // Mengambil semua nilai (mencari keys yang mungkin dipakai backend)
  const allValues = chartData.flatMap(d => [
    Number(d.masuk || d.total_masuk || d.jumlah_masuk || 0), 
    Number(d.keluar || d.total_keluar || d.jumlah_keluar || 0)
  ]);
  const maxValueFromData = allValues.length > 0 ? Math.max(...allValues) : 0;
  // Jika max value = 15 -> scale jadi 20. Jika 100 -> scale 100. Default minimal 10.
  const maxChartValue = maxValueFromData > 0 ? Math.ceil(maxValueFromData / 10) * 10 : 10;

  // Menggabungkan transaksi masuk dan keluar menjadi satu array untuk tabel "Transaksi Terakhir"
  const txMasuk = (dashboardData?.transaksi_masuk_terbaru || []).map(t => ({ ...t, type: 'masuk', date: t.tanggal_masuk }));
  const txKeluar = (dashboardData?.transaksi_keluar_terbaru || []).map(t => ({ ...t, type: 'keluar', date: t.tanggal_keluar }));
  
  // Gabungkan lalu urutkan berdasarkan waktu (terbaru di atas)
  const combinedTx = [...txMasuk, ...txKeluar]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-[260px] bg-white border-r border-gray-100 flex flex-col z-20 shrink-0 hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#5452F6] rounded-xl flex items-center justify-center shrink-0 shadow-sm shadow-indigo-100">
              <Box className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-[#5452F6] font-bold text-[13px] leading-tight tracking-wide">
                CV. AMRITA<br/>JAYASRI
              </h1>
              <p className="text-gray-400 font-medium text-[10px] mt-0.5">
                Sistem Inventaris ATK
              </p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-2">
          <button onClick={() => onNavigate('dashboard')} className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0EFFF] text-[#5452F6] rounded-xl font-bold text-sm transition-colors text-left">
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
          <button onClick={() => onNavigate('monitoring-stok')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
            <Activity className="w-5 h-5" /> Monitoring Stok
          </button>
          <button onClick={() => onNavigate('laporan')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
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
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 z-10 sticky top-0 shrink-0">
          <div className="flex items-center">
            <h2 className="font-bold text-[#1E232C] text-base hidden md:block">SIMPB - CV. Amrita Jayasri</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-72 hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Cari stok alat tulis..." className="w-full pl-11 pr-4 py-2.5 bg-[#F4F7FC] border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-[#5452F6] focus:ring-1 focus:ring-[#5452F6] transition-all" />
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
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Ringkasan Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Sistem Informasi Manajemen Persediaan Barang ATK</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => setShowDatePicker(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 shadow-sm rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Calendar className="w-4 h-4 text-[#5452F6]" /> Rentang Tanggal
              </button>
              <button onClick={() => onNavigate('barang-masuk')} className="flex items-center gap-2 px-4 py-2.5 bg-[#5452F6] hover:bg-[#4341E3] rounded-xl text-sm font-semibold text-white transition-colors shadow-lg shadow-indigo-500/30">
                <Plus className="w-4 h-4" /> Transaksi Masuk
              </button>
              <button onClick={() => onNavigate('barang-keluar')} className="flex items-center gap-2 px-4 py-2.5 bg-[#5452F6] hover:bg-[#4341E3] rounded-xl text-sm font-semibold text-white transition-colors shadow-lg shadow-indigo-500/30">
                <Plus className="w-4 h-4" /> Transaksi Keluar
              </button>
            </div>
          </div>

          {/* ================= 4 KARTU STATISTIK ATAS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-[#FAEDFF] p-5 rounded-[20px] shadow-sm flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-[#A855F7] text-white rounded-lg flex items-center justify-center"><Box className="w-5 h-5" /></div>
              </div>
              <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Total Jenis Item ATK</h3>
              <p className="text-3xl font-bold text-gray-800">{isLoading ? '...' : stats.total_barang}</p>
              <div className="w-16 h-1.5 bg-[#5452F6] rounded-full mt-2"></div>
            </div>

            <div className="bg-[#EEF2FF] p-5 rounded-[20px] shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-[#5452F6] opacity-80 text-white rounded-lg flex items-center justify-center"><ArrowDownRight className="w-5 h-5" /></div>
              </div>
              <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Masuk (Bulan Ini)</h3>
              <p className="text-3xl font-bold text-gray-800">{isLoading ? '...' : bulanIni.transaksi_masuk}</p>
              <div className="flex items-center gap-1 mt-2 text-gray-500">
                <TrendingUp className="w-3 h-3" />
                <p className="text-[10px] font-medium">Total: {stats.total_transaksi_masuk} Transaksi</p>
              </div>
            </div>

            <div className="bg-[#ECFDF5] p-5 rounded-[20px] shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-[#10B981] text-white rounded-lg flex items-center justify-center"><ArrowUpRight className="w-5 h-5" /></div>
              </div>
              <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Keluar (Bulan Ini)</h3>
              <p className="text-3xl font-bold text-gray-800">{isLoading ? '...' : bulanIni.transaksi_keluar}</p>
              <div className="flex items-center gap-1 mt-2 text-gray-500">
                <TrendingUp className="w-3 h-3" />
                <p className="text-[10px] font-medium">Total: {stats.total_transaksi_keluar} Transaksi</p>
              </div>
            </div>

            <div className="bg-[#FEF2F2] p-5 rounded-[20px] shadow-sm flex flex-col border border-red-50">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-[#EF4444] text-white rounded-lg flex items-center justify-center"><AlertTriangle className="w-5 h-5" /></div>
                {stats.total_stok_kritis > 0 && (
                  <span className="text-[9px] font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full uppercase">Perlu Tindakan</span>
                )}
              </div>
              <h3 className="text-[11px] font-bold text-red-500 uppercase tracking-wider mb-1">Stok Kritis</h3>
              <p className="text-3xl font-bold text-gray-800">{isLoading ? '...' : stats.total_stok_kritis}</p>
              <div className="flex items-center gap-1 mt-2 text-red-500">
                <AlertCircle className="w-3 h-3" />
                <p className="text-[10px] font-bold">Item di bawah batas minimum</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* ================= GRAFIK 7 HARI ================= */}
            <div className="lg:col-span-2 bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Tren Barang Masuk & Keluar</h3>
                  <p className="text-xs text-gray-500">Data historis 7 hari terakhir</p>
                </div>
                <div className="flex gap-4 text-xs font-bold text-gray-500">
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#5452F6]"></span> Masuk</div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#D1D5DB]"></span> Keluar</div>
                </div>
              </div>
              
              <div className="h-56 flex items-end justify-between gap-2 px-2 mt-8 border-l border-b border-gray-100 pb-2 relative">
                {/* Y-Axis Labels */}
                <div className="h-full flex flex-col justify-between text-[10px] text-gray-400 font-bold pr-2 absolute -left-6">
                  <span>{maxChartValue}</span>
                  <span>{Math.round(maxChartValue / 2)}</span>
                  <span>0</span>
                </div>
                
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[#5452F6]" />
                  </div>
                ) : (
                  chartData.map((data, index) => {
                    // Cek dinamis nama property barangkali backend mengirim 'total_masuk' bukan 'masuk'
                    const valMasuk = Number(data.masuk || data.total_masuk || data.jumlah_masuk || 0);
                    const valKeluar = Number(data.keluar || data.total_keluar || data.jumlah_keluar || 0);

                    // Kalkulasi tinggi bar dalam persen
                    const pctMasuk = maxChartValue > 0 ? (valMasuk / maxChartValue) * 100 : 0;
                    const pctKeluar = maxChartValue > 0 ? (valKeluar / maxChartValue) * 100 : 0;
                    
                    // Fallback label harinya
                    const labelHari = data.label || data.hari || data.tanggal || '-';

                    return (
                      <div key={index} className="flex flex-col items-center gap-2 flex-1 h-full justify-end relative group">
                        <div className="flex items-end gap-1.5 w-full h-full justify-center">
                          {/* Tooltip saat dihover */}
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-800 text-white text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none transition-opacity whitespace-nowrap z-10">
                            Masuk: {valMasuk} | Keluar: {valKeluar}
                          </div>
                          
                          {/* Bar Grafik Masuk (Biru) */}
                          <div 
                            className="w-4 md:w-6 bg-[#5452F6] rounded-t-md hover:opacity-80 transition-all duration-500" 
                            style={{ 
                              height: `${pctMasuk}%`, 
                              minHeight: valMasuk > 0 ? '4px' : '0px' // Kasih sedikit tinggi minimal biar terlihat kalau > 0
                            }}
                          ></div>
                          
                          {/* Bar Grafik Keluar (Abu-Abu) */}
                          <div 
                            className="w-4 md:w-6 bg-[#D1D5DB] rounded-t-md hover:opacity-80 transition-all duration-500" 
                            style={{ 
                              height: `${pctKeluar}%`,
                              minHeight: valKeluar > 0 ? '4px' : '0px'
                            }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold mt-2">{labelHari}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* ================= DISTRIBUSI STOK (Statis Kategori Sementara) ================= */}
            <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col">
              <h3 className="text-lg font-bold text-gray-800">Distribusi Stok</h3>
              <p className="text-xs text-gray-500 mb-6">Berdasarkan kategori barang</p>
              
              <div className="flex-1 flex flex-col justify-center items-center relative mt-2">
                <div className="relative w-44 h-44">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#9CA3AF" strokeWidth="12" fill="none" strokeDasharray="251.2" strokeDashoffset="213.5" />
                    <circle cx="50" cy="50" r="40" stroke="#92400E" strokeWidth="12" fill="none" strokeDasharray="251.2" strokeDashoffset="163.2" className="transform origin-center rotate-[54deg]" />
                    <circle cx="50" cy="50" r="40" stroke="#374151" strokeWidth="12" fill="none" strokeDasharray="251.2" strokeDashoffset="150.7" className="transform origin-center rotate-[126deg]" />
                    <circle cx="50" cy="50" r="40" stroke="#5452F6" strokeWidth="12" fill="none" strokeDasharray="251.2" strokeDashoffset="113" className="transform origin-center rotate-[216deg]" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full m-3 shadow-inner">
                    <span className="text-2xl font-bold text-gray-800">{isLoading ? '...' : stats.total_barang}</span>
                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-1">Total Item</span>
                  </div>
                </div>

                <div className="w-full mt-6 space-y-2.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#5452F6]"></span> <span className="text-gray-700 font-bold">Kertas</span></div>
                    <span className="text-gray-500 font-semibold">40%</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#374151]"></span> <span className="text-gray-700 font-bold">Alat Tulis</span></div>
                    <span className="text-gray-500 font-semibold">25%</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#92400E]"></span> <span className="text-gray-700 font-bold">Tinta</span></div>
                    <span className="text-gray-500 font-semibold">20%</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#9CA3AF]"></span> <span className="text-gray-700 font-bold">Arsip</span></div>
                    <span className="text-gray-500 font-semibold">15%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ================= TRANSAKSI TERAKHIR (GABUNGAN MASUK & KELUAR) ================= */}
            <div className="lg:col-span-2 bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Transaksi Terakhir</h3>
                  <p className="text-xs text-gray-500">Aktivitas masuk & keluar terbaru</p>
                </div>
              </div>

              <div className="flex-1 overflow-x-auto">
                <div className="min-w-[600px]">
                  <div className="grid grid-cols-12 gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">
                    <div className="col-span-4">DETAIL BARANG</div>
                    <div className="col-span-2">TIPE</div>
                    <div className="col-span-3">TANGGAL</div>
                    <div className="col-span-2">JUMLAH</div>
                    <div className="col-span-1">STATUS</div>
                  </div>

                  <div className="space-y-1">
                    {isLoading ? (
                      <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-[#5452F6]" /></div>
                    ) : combinedTx.length === 0 ? (
                      <p className="text-center text-xs text-gray-500 py-8">Belum ada transaksi.</p>
                    ) : (
                      combinedTx.map((tx) => (
                        <div key={`${tx.type}-${tx.id}`} className="grid grid-cols-12 gap-4 items-center px-2 py-3 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0">
                          <div className="col-span-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
                               <Box className="w-5 h-5 text-gray-500" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-800 truncate max-w-[150px]" title={tx.barang?.nama_barang}>
                                {tx.barang?.nama_barang || 'Barang Tidak Diketahui'}
                              </p>
                              <p className="text-[10px] text-gray-500">{tx.barang?.id_referensi || '-'}</p>
                            </div>
                          </div>
                          <div className="col-span-2">
                            {tx.type === 'masuk' ? (
                              <span className="flex items-center gap-1 w-fit px-2 py-1 bg-[#ECFDF5] text-[#059669] rounded-md text-[9px] font-bold uppercase tracking-wider">
                                <ArrowDownRight className="w-3 h-3" /> MASUK
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 w-fit px-2 py-1 bg-[#FFF7ED] text-[#D97706] rounded-md text-[9px] font-bold uppercase tracking-wider">
                                <ArrowUpRight className="w-3 h-3" /> KELUAR
                              </span>
                            )}
                          </div>
                          <div className="col-span-3 text-xs text-gray-600 font-medium">{formatDate(tx.date)}</div>
                          <div className="col-span-2 text-xs font-bold text-gray-800">{tx.jumlah} {tx.barang?.satuan || ''}</div>
                          <div className="col-span-1 text-[11px] font-bold text-[#059669]">Selesai</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              
              {/* ================= PERINGATAN STOK KRITIS ================= */}
              <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col">
                <div className="flex items-center gap-2 mb-5">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <h3 className="text-sm font-bold text-gray-800">Peringatan Stok Kritis</h3>
                </div>

                <div className="space-y-3 mb-6 max-h-[160px] overflow-y-auto pr-1">
                  {isLoading ? (
                    <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-[#5452F6]" /></div>
                  ) : stokKritisList.length === 0 ? (
                    <p className="text-xs text-emerald-600 text-center py-4 font-medium">Stok dalam kondisi aman.</p>
                  ) : (
                    stokKritisList.map((item) => (
                      <div key={item.id} className="bg-[#FEF2F2] border-l-4 border-red-500 p-3 rounded-r-lg flex justify-between items-center">
                        <div>
                          <p className="text-xs font-bold text-gray-800 truncate max-w-[120px]" title={item.nama_barang}>{item.nama_barang}</p>
                          <p className="text-[9px] text-gray-500 uppercase mt-0.5">Minimal: {item.stok_minimum} {item.satuan}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-red-600">{item.stok} {item.satuan}</p>
                          <span className="text-[8px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Sisa</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button onClick={() => onNavigate('monitoring-stok')} className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold rounded-xl transition-colors mt-auto border border-gray-100">
                  Lihat Semua Stok
                </button>
              </div>

              {/* ================= TOTAL NILAI PERSEDIAAN ================= */}
              <div className="bg-gradient-to-br from-[#5452F6] to-[#7C3AED] rounded-[20px] p-6 shadow-md text-white relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <BarChart2 className="w-32 h-32" />
                </div>
                
                <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-2 relative z-10">Nilai Persediaan Keseluruhan</h3>
                <p className="text-2xl lg:text-3xl font-bold mb-4 relative z-10 truncate" title={formatRupiah(stats.total_nilai_stok)}>
                  {isLoading ? '...' : formatRupiah(stats.total_nilai_stok)}
                </p>
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