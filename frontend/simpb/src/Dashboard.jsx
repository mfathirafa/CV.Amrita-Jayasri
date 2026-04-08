import React from 'react';
import { 
  LayoutDashboard, Box, Truck, Users, 
  ArrowDownRight, ArrowUpRight, Activity, 
  BarChart2, Search, Bell, User, Plus, 
  Calendar, AlertTriangle, TrendingUp, Minus, AlertCircle, CircleUser
} from 'lucide-react';

const Dashboard = ({ onLogout, onNavigate }) => {
  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-[260px] bg-white border-r border-gray-100 flex flex-col z-20 shrink-0">
        
        {/* === LOGO AREA (UPDATED) === */}
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
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0EFFF] text-[#5452F6] rounded-xl font-bold text-sm transition-colors text-left"
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          
          <button 
            onClick={() => onNavigate('data-barang')} 
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left"
          >
            <Box className="w-5 h-5" /> Data Barang
          </button>
          
          {/* TOMBOL PEMASOK SUDAH BISA DIKLIK */}
          <button 
            onClick={() => onNavigate('pemasok')} 
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left"
          >
            <Truck className="w-5 h-5" /> Pemasok
          </button>

          <button 
            onClick={() => onNavigate('konsumen')} 
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left"
          >
            <Users className="w-5 h-5" /> Konsumen
          </button>

          <button 
            onClick={() => onNavigate('barang-masuk')} 
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left"
          >
            <ArrowDownRight className="w-5 h-5" /> Barang Masuk
          </button>

          <button 
            onClick={() => onNavigate('barang-keluar')} 
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left"
          >
            <ArrowUpRight className="w-5 h-5" /> Barang Keluar
          </button>

          <button 
            onClick={() => onNavigate('monitoring-stok')} 
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left"
          >
            <Activity className="w-5 h-5" /> Monitoring Stok
          </button>

          <button 
            onClick={() => onNavigate('laporan')} 
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left"
          >
            <BarChart2 className="w-5 h-5" /> Laporan
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-xl font-semibold text-sm transition-colors">
            <ArrowDownRight className="w-5 h-5 rotate-90" /> Keluar
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* === HEADER (UPDATED) === */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 z-10 sticky top-0 shrink-0">
          
          {/* Kiri: Judul */}
          <div className="flex items-center">
            <h2 className="font-bold text-[#1E232C] text-base hidden md:block">SIMPB - CV. Amrita Jayasri</h2>
          </div>
          
          {/* Kanan: Search, Lonceng, Profil */}
          <div className="flex items-center gap-6">
            
            {/* Search Bar Capsule */}
            <div className="relative w-72 hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari stok alat tulis..." 
                className="w-full pl-11 pr-4 py-2.5 bg-[#F4F7FC] border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-[#5452F6] focus:ring-1 focus:ring-[#5452F6] transition-all" 
              />
            </div>
            
            {/* Bell Icon */}
            <button className="relative text-gray-500 hover:text-gray-800 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-6 w-px bg-gray-200"></div>
            
            {/* Profile */}
            <div className="flex items-center gap-2.5 cursor-pointer">
              <CircleUser className="w-8 h-8 text-[#5452F6]" strokeWidth={1.5} />
              <span className="text-sm font-semibold text-[#1E232C]">Administrator</span>
            </div>
            
          </div>
        </header>

        {/* ================= AREA SCROLL DASHBOARD ================= */}
        <div className="flex-1 overflow-y-auto p-8 pb-12">
          
          {/* Top Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Ringkasan Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Sistem Informasi Manajemen Persediaan Barang ATK</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100/80 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
                <Calendar className="w-4 h-4" /> Bulan Ini
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#5452F6] hover:bg-[#4341E3] rounded-xl text-sm font-semibold text-white transition-colors shadow-lg shadow-indigo-500/30">
                <Plus className="w-4 h-4" /> Transaksi Masuk
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#5452F6] hover:bg-[#4341E3] rounded-xl text-sm font-semibold text-white transition-colors shadow-lg shadow-indigo-500/30">
                <Plus className="w-4 h-4" /> Transaksi Keluar
              </button>
            </div>
          </div>

          {/* 4 Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            
            <div className="bg-[#FAEDFF] p-5 rounded-[20px] shadow-sm flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-[#A855F7] text-white rounded-lg flex items-center justify-center"><Box className="w-5 h-5" /></div>
                <span className="text-[10px] font-bold text-[#A855F7] bg-white/80 px-2.5 py-1 rounded-full">+12%</span>
              </div>
              <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Total Item ATK</h3>
              <p className="text-3xl font-bold text-gray-800">2,450</p>
              <div className="w-16 h-1.5 bg-[#5452F6] rounded-full mt-2"></div>
            </div>

            <div className="bg-[#EEF2FF] p-5 rounded-[20px] shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-[#5452F6] opacity-80 text-white rounded-lg flex items-center justify-center"><ArrowDownRight className="w-5 h-5" /></div>
                <span className="text-[10px] font-bold text-emerald-600 bg-white/80 px-2.5 py-1 rounded-full">+8%</span>
              </div>
              <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Masuk (Minggu Ini)</h3>
              <p className="text-3xl font-bold text-gray-800">412</p>
              <div className="flex items-center gap-1 mt-2 text-gray-500">
                <TrendingUp className="w-3 h-3" />
                <p className="text-[10px] font-medium">Lebih tinggi dari minggu lalu</p>
              </div>
            </div>

            <div className="bg-[#ECFDF5] p-5 rounded-[20px] shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-[#10B981] text-white rounded-lg flex items-center justify-center"><ArrowUpRight className="w-5 h-5" /></div>
                <span className="text-[10px] font-bold text-gray-500 bg-white/80 px-2.5 py-1 rounded-full">Stabil</span>
              </div>
              <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Keluar (Minggu Ini)</h3>
              <p className="text-3xl font-bold text-gray-800">305</p>
              <div className="flex items-center gap-1 mt-2 text-gray-500">
                <Minus className="w-3 h-3" />
                <p className="text-[10px] font-medium">Konsisten dengan rata-rata</p>
              </div>
            </div>

            <div className="bg-[#FEF2F2] p-5 rounded-[20px] shadow-sm flex flex-col border border-red-50">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-[#EF4444] text-white rounded-lg flex items-center justify-center"><AlertTriangle className="w-5 h-5" /></div>
                <span className="text-[9px] font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full uppercase">Perlu Tindakan</span>
              </div>
              <h3 className="text-[11px] font-bold text-red-500 uppercase tracking-wider mb-1">Stok Kritis</h3>
              <p className="text-3xl font-bold text-gray-800">12</p>
              <div className="flex items-center gap-1 mt-2 text-red-500">
                <AlertCircle className="w-3 h-3" />
                <p className="text-[10px] font-bold">Item di bawah batas minimum</p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Bar Chart */}
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
              
              <div className="h-56 flex items-end justify-between gap-2 px-2 mt-8 border-l border-b border-gray-100 pb-2">
                <div className="h-full flex flex-col justify-between text-[10px] text-gray-400 font-bold pr-2 absolute -left-4">
                  <span>100</span><span>50</span><span>0</span>
                </div>
                {[
                  { in: '60%', out: '40%', day: 'Sen' }, { in: '85%', out: '50%', day: 'Sel' },
                  { in: '45%', out: '70%', day: 'Rab' }, { in: '75%', out: '55%', day: 'Kam' },
                  { in: '50%', out: '65%', day: 'Jum' }, { in: '30%', out: '20%', day: 'Sab' },
                  { in: '15%', out: '10%', day: 'Min' },
                ].map((data, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1 h-full justify-end relative group">
                    <div className="flex items-end gap-1.5 w-full h-full justify-center">
                      <div className="w-4 md:w-6 bg-[#5452F6] rounded-t-md hover:opacity-80 transition-opacity" style={{ height: data.in }}></div>
                      <div className="w-4 md:w-6 bg-[#D1D5DB] rounded-t-md hover:opacity-80 transition-opacity" style={{ height: data.out }}></div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold mt-2">{data.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut Chart */}
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
                    <span className="text-2xl font-bold text-gray-800">2.4k</span>
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

          {/* ================= BOTTOM SECTION ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Transaksi Terakhir */}
            <div className="lg:col-span-2 bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Transaksi Terakhir</h3>
                  <p className="text-xs text-gray-500">Aktivitas gudang ATK terbaru</p>
                </div>
                <a href="#" className="text-xs font-bold text-[#5452F6] hover:text-[#4341E3] transition-colors">Lihat Semua Transaksi</a>
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
                    {/* Item 1 */}
                    <div className="grid grid-cols-12 gap-4 items-center px-2 py-3 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0">
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
                           <Box className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 truncate">Kertas HVS A4 80gr</p>
                          <p className="text-[10px] text-gray-500">PAP-SID-A480</p>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="flex items-center gap-1 w-fit px-2 py-1 bg-[#ECFDF5] text-[#059669] rounded-md text-[9px] font-bold uppercase tracking-wider">
                          <ArrowDownRight className="w-3 h-3" /> MASUK
                        </span>
                      </div>
                      <div className="col-span-3 text-xs text-gray-600 font-medium">24 Mei 2024</div>
                      <div className="col-span-2 text-xs font-bold text-gray-800">50 Rim</div>
                      <div className="col-span-1 text-[11px] font-bold text-[#059669]">Selesai</div>
                    </div>

                    {/* Item 2 */}
                    <div className="grid grid-cols-12 gap-4 items-center px-2 py-3 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0">
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
                          <Box className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 truncate">Pulpen Pilot G2 Biru</p>
                          <p className="text-[10px] text-gray-500">PEN-PLT-G2B</p>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="flex items-center gap-1 w-fit px-2 py-1 bg-[#FFF7ED] text-[#D97706] rounded-md text-[9px] font-bold uppercase tracking-wider">
                          <ArrowUpRight className="w-3 h-3" /> KELUAR
                        </span>
                      </div>
                      <div className="col-span-3 text-xs text-gray-600 font-medium">24 Mei 2024</div>
                      <div className="col-span-2 text-xs font-bold text-gray-800">12 Lusin</div>
                      <div className="col-span-1 text-[11px] font-bold text-[#059669]">Selesai</div>
                    </div>

                    {/* Item 3 */}
                    <div className="grid grid-cols-12 gap-4 items-center px-2 py-3 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0">
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
                          <Box className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 truncate">Bantex Binder A4</p>
                          <p className="text-[10px] text-gray-500">BND-BTX-A4B</p>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="flex items-center gap-1 w-fit px-2 py-1 bg-[#ECFDF5] text-[#059669] rounded-md text-[9px] font-bold uppercase tracking-wider">
                          <ArrowDownRight className="w-3 h-3" /> MASUK
                        </span>
                      </div>
                      <div className="col-span-3 text-xs text-gray-600 font-medium">23 Mei 2024</div>
                      <div className="col-span-2 text-xs font-bold text-gray-800">20 Pcs</div>
                      <div className="col-span-1 text-[11px] font-bold text-[#059669]">Selesai</div>
                    </div>

                    {/* Item 4 */}
                    <div className="grid grid-cols-12 gap-4 items-center px-2 py-3 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0">
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
                          <Box className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 truncate">Buku Sinar Dunia A5</p>
                          <p className="text-[10px] text-gray-500">BKO-SID-A558</p>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="flex items-center gap-1 w-fit px-2 py-1 bg-[#FFF7ED] text-[#D97706] rounded-md text-[9px] font-bold uppercase tracking-wider">
                          <ArrowUpRight className="w-3 h-3" /> KELUAR
                        </span>
                      </div>
                      <div className="col-span-3 text-xs text-gray-600 font-medium">23 Mei 2024</div>
                      <div className="col-span-2 text-xs font-bold text-gray-800">5 Pack</div>
                      <div className="col-span-1 text-[11px] font-bold text-[#D97706]">Proses</div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Kolom Kanan (Peringatan & Nilai Persediaan) */}
            <div className="flex flex-col gap-6">
              
              <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col">
                <div className="flex items-center gap-2 mb-5">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <h3 className="text-sm font-bold text-gray-800">Peringatan Stok Kritis</h3>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="bg-[#FEF2F2] border-l-4 border-red-500 p-3 rounded-r-lg flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-gray-800">Tinta Epson 003 Hitam</p>
                      <p className="text-[9px] text-gray-500 uppercase mt-0.5">RAK UTAMA-A1</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600">2 Botol</p>
                      <p className="text-[9px] text-gray-500">Min: 10</p>
                    </div>
                  </div>

                  <div className="bg-[#FEF2F2] border-l-4 border-red-500 p-3 rounded-r-lg flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-gray-800">Paper Clip No. 3</p>
                      <p className="text-[9px] text-gray-500 uppercase mt-0.5">LACI STOK-B4</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600">3 Box</p>
                      <p className="text-[9px] text-gray-500">Min: 15</p>
                    </div>
                  </div>

                  <div className="bg-[#FFFBEB] border-l-4 border-amber-500 p-3 rounded-r-lg flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-gray-800">Flashdisk 32GB</p>
                      <p className="text-[9px] text-gray-500 uppercase mt-0.5">LEMARI-C2</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-amber-600">4 Pcs</p>
                      <p className="text-[9px] text-gray-500">Min: 5</p>
                    </div>
                  </div>
                </div>

                <button className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold rounded-xl transition-colors mt-auto border border-gray-100">
                  Buat Permintaan Pengadaan
                </button>
              </div>

              <div className="bg-gradient-to-br from-[#5452F6] to-[#7C3AED] rounded-[20px] p-6 shadow-md text-white relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <BarChart2 className="w-32 h-32" />
                </div>
                
                <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-2 relative z-10">Nilai Persediaan</h3>
                <p className="text-3xl font-bold mb-4 relative z-10">Rp 124.5Jt</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 rounded-lg text-[10px] font-bold relative z-10">
                  <TrendingUp className="w-3 h-3" /> +2.4% dari bulan lalu
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;