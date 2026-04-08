import React from 'react';
import { 
  LayoutDashboard, Box, Truck, Users, 
  ArrowDownRight, ArrowUpRight, Activity, 
  BarChart2, Search, Bell, Plus, 
  Calendar, AlertTriangle, TrendingUp, Minus, AlertCircle, CircleUser,
  ChevronDown, MapPin, Info, LogOut
} from 'lucide-react';

const BarangKeluar = ({ onLogout, onNavigate }) => {
  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-[260px] bg-white border-r border-gray-100 flex flex-col z-20 shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#5452F6] rounded-xl flex items-center justify-center shrink-0 shadow-sm shadow-indigo-100">
              <Box className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-[#5452F6] font-bold text-[13px] leading-tight tracking-wide">
                CV. AMRITA<br/>JAYASRI
              </h1>
              <p className="text-gray-400 font-medium text-[10px] mt-0.5">Sistem Inventaris ATK</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-2 scrollbar-hide">
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left"
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          
          <button 
            onClick={() => onNavigate('data-barang')} 
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left"
          >
            <Box className="w-5 h-5" /> Data Barang
          </button>
          
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
          
          {/* Active Menu */}
          <button 
            onClick={() => onNavigate('barang-keluar')} 
            className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0EFFF] text-[#5452F6] rounded-xl font-bold text-sm transition-colors text-left"
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
            <LogOut className="w-5 h-5 rotate-90" /> Keluar
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
              <input type="text" placeholder="Cari transaksi..." className="w-full pl-11 pr-4 py-2.5 bg-[#F4F7FC] border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-[#5452F6] focus:ring-1 focus:ring-[#5452F6] transition-all" />
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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Barang Keluar</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola transaksi pengeluaran stok inventaris</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Transaksi Keluar Baru */}
            <div className="lg:col-span-2 bg-white rounded-[20px] p-8 shadow-sm border border-gray-100">
              <h3 className="text-base font-bold text-gray-800 mb-1">Transaksi Keluar Baru</h3>
              <p className="text-xs text-gray-400 mb-8 font-medium">Daftarkan alat tulis kantor (ATK) yang keluar untuk distribusi divisi.</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Pilih Barang (ATK)</label>
                  <div className="relative">
                    <select className="w-full bg-[#F4F7FC] border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 appearance-none focus:outline-none focus:border-[#5452F6]">
                      <option>Kertas A4 80gr Sinar Dunia</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Penerima</label>
                  <div className="relative">
                    <select className="w-full bg-[#F4F7FC] border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 appearance-none focus:outline-none focus:border-[#5452F6]">
                      <option>Contoh: CV Sinar Jaya</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Jumlah</label>
                    <div className="flex items-center bg-[#F4F7FC] border border-gray-100 rounded-xl px-4 py-3">
                      <input type="text" className="bg-transparent w-full text-sm font-semibold outline-none" placeholder="10" />
                      <span className="text-[10px] font-bold text-gray-400 ml-2">PCS/RIM</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Harga Satuan</label>
                    <div className="flex items-center bg-[#F4F7FC] border border-gray-100 rounded-xl px-4 py-3">
                      <span className="text-[10px] font-bold text-gray-400 mr-2">IDR</span>
                      <input type="text" className="bg-transparent w-full text-sm font-semibold outline-none" placeholder="0.00" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Tanggal Keluar</label>
                  <div className="relative">
                    <input type="text" placeholder="mm/dd/yyyy" className="w-full bg-[#F4F7FC] border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#5452F6]" />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button className="text-gray-400 text-sm font-bold hover:text-gray-600 transition-colors">Batalkan Draft</button>
                  <button className="flex items-center gap-2 bg-[#5452F6] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/30 hover:bg-[#4341E3] transition-all">
                    Konfirmasi Pengiriman <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar Kanan Content */}
            <div className="space-y-8">
              {/* Status Inventaris */}
              <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status Inventaris</p>
                    <h3 className="text-sm font-bold text-gray-800">Ketersediaan Stok</h3>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md uppercase">Mencukupi</span>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-gray-500">Stok Gudang Saat Ini</span>
                    <span className="text-gray-800">45 Rim</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-[#5452F6] rounded-full"></div>
                  </div>
                </div>

                <div className="bg-gray-50/50 rounded-xl p-4 flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm text-[#5452F6]">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Proyeksi Sisa Stok</p>
                    <p className="text-sm font-bold text-gray-800">35 Rim</p>
                  </div>
                </div>

                <div className="bg-[#EEF2FF] p-4 rounded-xl flex gap-3 border border-indigo-50">
                  <Info className="w-4 h-4 text-[#5452F6] shrink-0 mt-0.5" />
                  <p className="text-[10px] text-gray-500 leading-relaxed font-medium">Pengiriman ini mewakili 22.2% dari total stok SKU spesifik saat ini.</p>
                </div>
              </div>

              {/* Rute Tujuan Card */}
              <div className="bg-white rounded-[20px] overflow-hidden shadow-sm border border-gray-100 group relative h-48">
                <div className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-110" 
                     style={{ backgroundImage: `url('https://api.maptiler.com/maps/basic-v2/static/110.42, -7.00, 10/600x400.png?key=get_your_own_key')` }}>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/20"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                  <div className="flex items-center gap-2 text-[9px] font-bold text-white/70 uppercase tracking-widest mb-2">
                    <MapPin className="w-3 h-3 text-[#5452F6]" /> Rute Tujuan
                  </div>
                  <h4 className="font-bold text-sm mb-1">Semarang Central Logistics</h4>
                  <p className="text-[10px] text-white/70 font-medium">Estimasi Tiba: 14 Okt, 16:30</p>
                </div>
              </div>

              {/* Terakhir Keluar */}
              <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Terakhir Keluar</h3>
                  <button 
                    onClick={() => onNavigate('laporan')} 
                    className="text-[10px] font-bold text-[#5452F6] hover:underline"
                  >
                    LIHAT SEMUA
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      <div>
                        <p className="text-xs font-bold text-gray-800 leading-none">INV-98234</p>
                        <p className="text-[9px] text-gray-400 mt-1 font-medium">Divisi Keuangan</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-red-500">-15 rim</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      <div>
                        <p className="text-xs font-bold text-gray-800 leading-none">INV-98231</p>
                        <p className="text-[9px] text-gray-400 mt-1 font-medium">Divisi SDM</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-red-500">-5 pack</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BarangKeluar;