import React from 'react';
import { 
  LayoutDashboard, Box, Truck, Users, 
  ArrowDownRight, ArrowUpRight, Activity, 
  BarChart2, Search, Bell, User, Plus, 
  Calendar, AlertTriangle, TrendingUp
} from 'lucide-react';

const Dashboard = ({ onLogout }) => {
  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-[260px] bg-white border-r border-gray-100 flex flex-col z-20 shrink-0">
        <div className="p-6">
          <div className="bg-[#3A36DB] rounded-2xl p-4 flex items-center gap-3 shadow-lg shadow-blue-500/20">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <div className="space-y-1 w-4">
                <div className="h-0.5 w-full bg-white rounded-full"></div>
                <div className="h-0.5 w-full bg-white rounded-full"></div>
                <div className="h-0.5 w-2/3 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-white font-bold text-sm leading-tight">CV. AMRITA<br/>JAYASRI</h1>
              <p className="text-white/70 text-[10px] mt-0.5">Sistem Inventaris ATK</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-[#F0EFFF] text-[#3A36DB] rounded-xl font-bold text-sm transition-colors">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors">
            <Box className="w-5 h-5" /> Data Barang
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors">
            <Truck className="w-5 h-5" /> Pemasok
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors">
            <Users className="w-5 h-5" /> Konsumen
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors">
            <ArrowDownRight className="w-5 h-5" /> Barang Masuk
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors">
            <ArrowUpRight className="w-5 h-5" /> Barang Keluar
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors">
            <Activity className="w-5 h-5" /> Monitoring Stok
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors">
            <BarChart2 className="w-5 h-5" /> Laporan
          </a>
        </nav>

        {/* Tombol Keluar (opsional, jika ingin kembali ke login) */}
        <div className="p-4 border-t border-gray-100">
          <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-xl font-semibold text-sm transition-colors">
            <ArrowDownRight className="w-5 h-5 rotate-90" /> Keluar
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 z-10 sticky top-0 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-gray-800 hidden md:block">SIMPB - CV. Amrita Jayasri</h2>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Cari stok alat tulis..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3A36DB] focus:ring-1 focus:ring-[#3A36DB] transition-all" />
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="relative text-gray-500 hover:text-gray-800 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute 0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-[#F0EFFF] text-[#3A36DB] flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-gray-700">Administrator</span>
            </div>
          </div>
        </header>

        {/* ================= AREA SCROLL DASHBOARD ================= */}
        {/* Class overflow-y-auto di bawah ini yang membuat halamannya bisa di-scroll */}
        <div className="flex-1 overflow-y-auto p-8 pb-12">
          
          {/* Top Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Ringkasan Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Sistem Informasi Manajemen Persediaan Barang ATK</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <Calendar className="w-4 h-4" /> Bulan Ini
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#3A36DB] hover:bg-blue-700 rounded-xl text-sm font-semibold text-white transition-colors shadow-lg shadow-blue-500/30">
                <Plus className="w-4 h-4" /> Transaksi Masuk
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#3A36DB] hover:bg-blue-700 rounded-xl text-sm font-semibold text-white transition-colors shadow-lg shadow-blue-500/30">
                <Plus className="w-4 h-4" /> Transaksi Keluar
              </button>
            </div>
          </div>

          {/* 4 Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-[#FAEDFF] p-5 rounded-[20px] shadow-sm flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-purple-500 text-white rounded-lg flex items-center justify-center"><Box className="w-5 h-5" /></div>
                <span className="text-xs font-bold text-emerald-600 bg-white/60 px-2 py-1 rounded-md">+12%</span>
              </div>
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Total Item ATK</h3>
              <p className="text-3xl font-bold text-gray-800">2,450</p>
              <div className="w-12 h-1 bg-purple-500 rounded-full mt-4"></div>
            </div>

            <div className="bg-[#EBF4FF] p-5 rounded-[20px] shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center"><ArrowDownRight className="w-5 h-5" /></div>
                <span className="text-xs font-bold text-emerald-600 bg-white/60 px-2 py-1 rounded-md">+8%</span>
              </div>
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Masuk (Minggu Ini)</h3>
              <p className="text-3xl font-bold text-gray-800">412</p>
              <p className="text-[10px] text-gray-500 mt-2">↑ Lebih tinggi dari minggu lalu</p>
            </div>

            <div className="bg-[#E6F9F0] p-5 rounded-[20px] shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-lg flex items-center justify-center"><ArrowUpRight className="w-5 h-5" /></div>
                <span className="text-xs font-bold text-gray-600 bg-white/60 px-2 py-1 rounded-md">Stabil</span>
              </div>
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Keluar (Minggu Ini)</h3>
              <p className="text-3xl font-bold text-gray-800">305</p>
              <p className="text-[10px] text-gray-500 mt-2">— Konsisten dengan rata-rata</p>
            </div>

            <div className="bg-[#FFF0F0] p-5 rounded-[20px] shadow-sm flex flex-col border border-red-100">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-red-500 text-white rounded-lg flex items-center justify-center"><AlertTriangle className="w-5 h-5" /></div>
                <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-1 rounded-md uppercase">Perlu Tindakan</span>
              </div>
              <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Stok Kritis</h3>
              <p className="text-3xl font-bold text-gray-800">12</p>
              <p className="text-[10px] text-red-500 font-medium mt-2">! Item di bawah batas minimum</p>
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
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#3A36DB]"></span> Masuk</div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#D1D5DB]"></span> Keluar</div>
                </div>
              </div>
              
              <div className="h-56 flex items-end justify-between gap-2 px-2 mt-8">
                <div className="h-full flex flex-col justify-between text-xs text-gray-400 font-medium pb-6">
                  <span>100</span><span>50</span><span>0</span>
                </div>
                {[
                  { in: '60%', out: '40%', day: 'Sen' }, { in: '85%', out: '50%', day: 'Sel' },
                  { in: '45%', out: '70%', day: 'Rab' }, { in: '75%', out: '55%', day: 'Kam' },
                  { in: '50%', out: '65%', day: 'Jum' }, { in: '30%', out: '20%', day: 'Sab' },
                  { in: '15%', out: '10%', day: 'Min' },
                ].map((data, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1 h-full justify-end relative group">
                    <div className="flex items-end gap-1.5 w-full h-[85%] justify-center">
                      <div className="w-1/3 bg-[#3A36DB] rounded-t-sm hover:opacity-80 transition-opacity" style={{ height: data.in }}></div>
                      <div className="w-1/3 bg-gray-200 rounded-t-sm hover:opacity-80 transition-opacity" style={{ height: data.out }}></div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{data.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut Chart */}
            <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col">
              <h3 className="text-lg font-bold text-gray-800">Distribusi Stok</h3>
              <p className="text-xs text-gray-500 mb-8">Berdasarkan kategori barang</p>
              
              <div className="flex-1 flex flex-col justify-center items-center relative">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#F3F4F6" strokeWidth="15" fill="none" />
                    <circle cx="50" cy="50" r="40" stroke="#F59E0B" strokeWidth="15" fill="none" strokeDasharray="25 100" strokeDashoffset="-40" />
                    <circle cx="50" cy="50" r="40" stroke="#10B981" strokeWidth="15" fill="none" strokeDasharray="35 100" strokeDashoffset="-65" />
                    <circle cx="50" cy="50" r="40" stroke="#3A36DB" strokeWidth="15" fill="none" strokeDasharray="40 100" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-800">2.4k</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Total Item</span>
                  </div>
                </div>

                <div className="w-full mt-8 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#3A36DB]"></span> <span className="text-gray-600 font-medium">Kertas</span></div>
                    <span className="font-bold text-gray-800">40%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> <span className="text-gray-600 font-medium">Alat Tulis</span></div>
                    <span className="font-bold text-gray-800">25%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= BOTTOM SECTION (NEW) ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Transaksi Terakhir (Kiri) */}
            <div className="lg:col-span-2 bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Transaksi Terakhir</h3>
                  <p className="text-xs text-gray-500">Aktivitas gudang ATK terbaru</p>
                </div>
                <a href="#" className="text-sm font-bold text-[#3A36DB] hover:text-blue-800 transition-colors">Lihat Semua Transaksi</a>
              </div>

              <div className="flex-1 overflow-x-auto">
                <div className="min-w-[600px]">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">
                    <div className="col-span-4">DETAIL BARANG</div>
                    <div className="col-span-2">TIPE</div>
                    <div className="col-span-3">TANGGAL</div>
                    <div className="col-span-2">JUMLAH</div>
                    <div className="col-span-1">STATUS</div>
                  </div>

                  {/* List Transaksi */}
                  <div className="space-y-2">
                    
                    {/* Item 1 */}
                    <div className="grid grid-cols-12 gap-4 items-center px-2 py-3 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0">
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center"><Box className="w-5 h-5 text-gray-400"/></div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 truncate">Kertas HVS A4 80gr</p>
                          <p className="text-[10px] text-gray-500">PAP-SID-A480</p>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="flex items-center gap-1 w-fit px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold">
                          <ArrowDownRight className="w-3 h-3" /> MASUK
                        </span>
                      </div>
                      <div className="col-span-3 text-sm text-gray-600 font-medium">24 Mei 2024</div>
                      <div className="col-span-2 text-sm font-bold text-gray-800">50 Rim</div>
                      <div className="col-span-1 text-xs font-bold text-emerald-500">Selesai</div>
                    </div>

                    {/* Item 2 */}
                    <div className="grid grid-cols-12 gap-4 items-center px-2 py-3 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0">
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center"><Box className="w-5 h-5 text-gray-400"/></div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 truncate">Pulpen Pilot G2 Biru</p>
                          <p className="text-[10px] text-gray-500">PEN-PLT-G2B</p>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="flex items-center gap-1 w-fit px-2 py-1 bg-orange-50 text-orange-600 rounded-md text-[10px] font-bold">
                          <ArrowUpRight className="w-3 h-3" /> KELUAR
                        </span>
                      </div>
                      <div className="col-span-3 text-sm text-gray-600 font-medium">24 Mei 2024</div>
                      <div className="col-span-2 text-sm font-bold text-gray-800">12 Lusin</div>
                      <div className="col-span-1 text-xs font-bold text-emerald-500">Selesai</div>
                    </div>

                    {/* Item 3 */}
                    <div className="grid grid-cols-12 gap-4 items-center px-2 py-3 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0">
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center"><Box className="w-5 h-5 text-gray-400"/></div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 truncate">Bantex Binder A4</p>
                          <p className="text-[10px] text-gray-500">BND-BTX-A4B</p>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="flex items-center gap-1 w-fit px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold">
                          <ArrowDownRight className="w-3 h-3" /> MASUK
                        </span>
                      </div>
                      <div className="col-span-3 text-sm text-gray-600 font-medium">23 Mei 2024</div>
                      <div className="col-span-2 text-sm font-bold text-gray-800">20 Pcs</div>
                      <div className="col-span-1 text-xs font-bold text-emerald-500">Selesai</div>
                    </div>

                    {/* Item 4 */}
                    <div className="grid grid-cols-12 gap-4 items-center px-2 py-3 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0">
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center"><Box className="w-5 h-5 text-gray-400"/></div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 truncate">Buku Sinar Dunia A5</p>
                          <p className="text-[10px] text-gray-500">BKO-SID-A558</p>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="flex items-center gap-1 w-fit px-2 py-1 bg-orange-50 text-orange-600 rounded-md text-[10px] font-bold">
                          <ArrowUpRight className="w-3 h-3" /> KELUAR
                        </span>
                      </div>
                      <div className="col-span-3 text-sm text-gray-600 font-medium">23 Mei 2024</div>
                      <div className="col-span-2 text-sm font-bold text-gray-800">5 Pack</div>
                      <div className="col-span-1 text-xs font-bold text-amber-600">Proses</div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Kolom Kanan (Peringatan & Nilai Persediaan) */}
            <div className="flex flex-col gap-6">
              
              {/* Peringatan Stok Kritis */}
              <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-bold text-gray-800">Peringatan Stok Kritis</h3>
                </div>

                <div className="space-y-3 mb-6">
                  {/* Warning Item 1 */}
                  <div className="bg-[#FFF5F5] border-l-4 border-red-500 p-3 rounded-r-lg flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-gray-800">Tinta Epson 003 Hitam</p>
                      <p className="text-[10px] text-gray-500 uppercase">RAK UTAMA-A1</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600">2 Botol</p>
                      <p className="text-[10px] text-gray-500">Min: 10</p>
                    </div>
                  </div>

                  {/* Warning Item 2 */}
                  <div className="bg-[#FFF5F5] border-l-4 border-red-500 p-3 rounded-r-lg flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-gray-800">Paper Clip No. 3</p>
                      <p className="text-[10px] text-gray-500 uppercase">LACI STOK-B4</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600">3 Box</p>
                      <p className="text-[10px] text-gray-500">Min: 15</p>
                    </div>
                  </div>

                  {/* Warning Item 3 */}
                  <div className="bg-[#FFF8E6] border-l-4 border-amber-500 p-3 rounded-r-lg flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-gray-800">Flashdisk 32GB</p>
                      <p className="text-[10px] text-gray-500 uppercase">LEMARI-C2</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-amber-600">4 Pcs</p>
                      <p className="text-[10px] text-gray-500">Min: 5</p>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-800 text-sm font-bold rounded-xl transition-colors mt-auto">
                  Buat Permintaan Pengadaan
                </button>
              </div>

              {/* Nilai Persediaan */}
              <div className="bg-gradient-to-br from-[#5452F6] to-[#716EFC] rounded-[20px] p-6 shadow-md text-white relative overflow-hidden">
                {/* Background Pattern Elements (Optional decorative) */}
                <div className="absolute right-0 bottom-0 opacity-10">
                  <BarChart2 className="w-32 h-32 transform translate-x-4 translate-y-8" />
                </div>
                
                <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-2 relative z-10">Nilai Persediaan</h3>
                <p className="text-3xl font-bold mb-4 relative z-10">Rp 124.5Jt</p>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/20 rounded-lg text-xs font-bold relative z-10">
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