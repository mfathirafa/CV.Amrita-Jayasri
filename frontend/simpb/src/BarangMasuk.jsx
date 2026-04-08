import React from 'react';
import { 
  LayoutDashboard, Box, Users, Truck, ArrowDownRight, 
  ArrowUpRight, Activity, BarChart2, LogOut, 
  Search, Bell, CircleUser, ChevronDown, CalendarDays,
  Package, PenTool, Zap, CheckCircle2
} from 'lucide-react';

const BarangMasuk = ({ onNavigate, onLogout }) => {
  // Mock data untuk Masuk Terbaru
  const masukTerbaru = [
    { name: 'Printer Laser Jet Pro', details: '5 Unit • Hari Ini, 09:42', price: 'Rp 12.5jt', icon: Package, iconColor: 'text-purple-600', bgColor: 'bg-purple-100' },
    { name: 'Box Pulpen Biru', details: '50 Pack • Kemarin', price: 'Rp 1.2jt', icon: PenTool, iconColor: 'text-blue-600', bgColor: 'bg-blue-100' },
    { name: 'Kertas F4 70gsm', details: '100 Rim • Kemarin', price: 'Rp 4.5jt', icon: Zap, iconColor: 'text-orange-600', bgColor: 'bg-orange-100' }
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      
      {/* ================= SIDEBAR (Presisi w-[260px]) ================= */}
      <aside className="w-[260px] bg-white border-r border-gray-100 flex flex-col z-20 shrink-0 hidden md:flex">
        
        {/* LOGO AREA */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#5452F6] rounded-xl flex items-center justify-center shrink-0 shadow-sm shadow-indigo-100">
              <Box className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-[#5452F6] font-bold text-[13px] leading-tight tracking-wide uppercase">
                CV. AMRITA<br/>JAYASRI
              </h1>
              <p className="text-gray-400 font-medium text-[10px] mt-0.5">
                Sistem Inventaris ATK
              </p>
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
          
          {/* Menu Barang Masuk Aktif */}
          <button 
            onClick={() => onNavigate('barang-masuk')}
            className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0EFFF] text-[#5452F6] rounded-xl font-bold text-sm transition-colors text-left"
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

        <div className="p-4 border-t border-gray-100 mt-auto">
          <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-xl font-semibold text-sm transition-colors">
            <LogOut className="w-5 h-5 rotate-90" /> Keluar
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* === HEADER (Sama dengan Barang Keluar) === */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 z-10 sticky top-0 shrink-0">
          <div className="flex items-center">
            <h2 className="font-bold text-[#1E232C] text-base hidden md:block">SIMPB - CV. Amrita Jayasri</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative w-72 hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari stok alat tulis..." 
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

        {/* ================= PAGE CONTENT ================= */}
        <div className="flex-1 overflow-y-auto p-8 pb-12 relative">
            
          {/* Breadcrumbs & Judul */}
          <div className="flex justify-between items-start mb-8 gap-4">
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Manajemen Inventaris</p>
              <h1 className="text-2xl font-bold text-gray-800">Catat Kiriman Masuk</h1>
              <p className="text-sm text-gray-500 mt-1 max-w-xl">Tambahkan kedatangan stok baru ke gudang pusat. Pastikan semua detail sesuai dengan faktur fisik untuk kepatuhan audit.</p>
            </div>
            
            {/* Volume Harian */}
            <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 flex gap-4 items-center shrink-0">
              <div className="w-10 h-10 rounded-lg bg-[#EBF4FF] flex items-center justify-center">
                <BarChart2 className="w-5 h-5 text-[#5452F6]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">VOLUME HARIAN</p>
                <div className="flex items-end gap-2">
                    <h3 className="text-2xl font-bold text-gray-800 leading-none">124</h3>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Konten */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Kolom Kiri - Detail Transaksi */}
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-[20px] p-8 shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-base font-bold text-gray-800">Detail Transaksi</h3>
                        <CheckCircle2 className="w-5 h-5 text-gray-300" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Pilih Barang */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">PILIH BARANG</label>
                            <div className="relative">
                                <select className="w-full px-4 py-3 bg-[#F4F7FC] border border-gray-100 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#5452F6] appearance-none">
                                    <option>Kertas A4 80gsm</option>
                                    <option>Pulpen Pilot G2 Biru</option>
                                    <option>Bantex Binder A4</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                        {/* Pilih Pemasok */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">PILIH PEMASOK</label>
                            <div className="relative">
                                <select className="w-full px-4 py-3 bg-[#F4F7FC] border border-gray-100 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#5452F6] appearance-none">
                                    <option>PT. Alat Tulis Kencana</option>
                                    <option>CV. Global Logistik Sejahtera</option>
                                    <option>UD. Karya Mandiri Abadi</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Jumlah */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">JUMLAH (QTY)</label>
                            <div className="flex items-center bg-[#F4F7FC] border border-gray-100 rounded-xl px-4 py-3">
                                <input type="text" placeholder="0" className="bg-transparent text-sm text-gray-700 focus:outline-none flex-grow" />
                                <span className="text-xs font-bold text-gray-400 uppercase ml-2 tracking-wider">UNIT</span>
                            </div>
                        </div>
                        {/* Harga Beli */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">HARGA BELI</label>
                            <div className="flex items-center bg-[#F4F7FC] border border-gray-100 rounded-xl px-4 py-3">
                                <span className="text-sm font-semibold text-gray-500 mr-2">Rp</span>
                                <input type="text" placeholder="0.00" className="bg-transparent text-sm text-gray-700 focus:outline-none flex-grow" />
                            </div>
                        </div>
                    </div>

                    {/* Tanggal */}
                    <div className="mb-8">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">TANGGAL</label>
                        <div className="relative">
                            <input type="text" placeholder="mm/dd/yyyy" className="w-full px-4 py-3 bg-[#F4F7FC] border border-gray-100 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#5452F6]" />
                            <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                    </div>

                    <button className="w-full py-3.5 bg-[#5452F6] hover:bg-[#4341E3] text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/30">
                        Simpan Transaksi
                    </button>
                </div>
            </div>

            {/* Kolom Kanan */}
            <div className="space-y-8">
                {/* Masuk Terbaru */}
                <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <ArrowDownRight className="w-4 h-4 text-[#5452F6]" /> Masuk Terbaru
                    </h3>
                    
                    <div className="space-y-4 mb-6">
                        {masukTerbaru.map((item, index) => (
                        <div key={index} className="flex justify-between items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                                    <item.icon className={`w-4.5 h-4.5 ${item.iconColor}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">{item.name}</p>
                                    <p className="text-[10px] text-gray-500 font-medium">{item.details}</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-gray-800">{item.price}</span>
                        </div>
                        ))}
                    </div>

                    <button 
                      onClick={() => onNavigate('laporan')}
                      className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-[#5452F6] text-xs font-bold rounded-xl transition-colors mt-auto border border-gray-100"
                    >
                        LIHAT SEMUA TRANSAKSI
                    </button>
                </div>

                {/* Info Gudang Card */}
                <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden h-48 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=600&auto=format&fit=crop')` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-0"></div>
                    <div className="relative z-10 mt-auto text-white">
                        <span className="text-[9px] font-bold text-white bg-[#D97706] px-2 py-0.5 rounded-md uppercase tracking-wider mb-2 inline-block">TIPS GUDANG</span>
                        <h4 className="text-sm font-bold text-white leading-snug mb-1">Optimalkan alur penerimaan Anda dengan pemindaian digital.</h4>
                        <p className="text-[10px] text-gray-200 font-medium max-w-sm">Kurangi kesalahan hingga 40% menggunakan aplikasi pemindai Amrita Mobile.</p>
                    </div>
                </div>
            </div>
          </div>

          {/* Footer Teks Kecil */}
          <div className="mt-12 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">© 2026 CV. AMRITA JAYASRI • MANAJEMEN INVENTARIS BERKINERJA TINGGI</p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default BarangMasuk;