import React from 'react';
import { 
  LayoutDashboard, Box, Truck, Users, 
  ArrowDownRight, ArrowUpRight, Activity, 
  BarChart2, LogOut, Search, Bell, CircleUser,
  ChevronDown, Camera, Lock, Info, Save,
  RotateCcw, QrCode, ShieldCheck,
  AlertTriangle // <--- SUDAH DITAMBAHKAN
} from 'lucide-react';

const TambahBarang = ({ onNavigate, onLogout }) => {
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
          
          <button onClick={() => onNavigate('data-barang')} className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0EFFF] text-[#5452F6] rounded-xl font-bold text-sm transition-colors text-left">
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
          <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-xl font-semibold text-sm transition-colors">
            <LogOut className="w-5 h-5 rotate-90" /> Keluar
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* === HEADER === */}
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
                className="w-full pl-11 pr-4 py-2.5 bg-[#F4F7FC] border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-[#5452F6] transition-all" 
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
        <div className="flex-1 overflow-y-auto p-8 pb-12 relative text-left">
          
          {/* Breadcrumbs & Title */}
          <div className="mb-8">
            <p className="text-xs font-medium text-gray-400 mb-2">
              Data Barang <span className="mx-2">›</span> <span className="text-gray-800 font-bold">Form Tambah Barang</span>
            </p>
            <h1 className="text-2xl font-bold text-gray-800">Detail Informasi Barang</h1>
            <p className="text-sm text-gray-500 mt-1">Lengkapi informasi di bawah ini untuk menambahkan atau memperbarui data barang di sistem inventaris.</p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Kolom Kiri: Foto & ID */}
              <div className="lg:col-span-4 flex flex-col items-center">
                <div className="w-full aspect-square bg-[#F4F7FC] rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group mb-6">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unggah Foto Barang</p>
                </div>

                <div className="w-full">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">ID REFERENSI SISTEM</label>
                  <div className="flex items-center justify-between bg-[#E9ECF5] px-4 py-3 rounded-xl border border-gray-100">
                    <span className="text-sm font-bold text-[#5452F6]">BRG-2023-0941</span>
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 italic">ID dihasilkan secara otomatis oleh sistem.</p>
                </div>
              </div>

              {/* Kolom Kanan: Input Fields */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-2">Nama Barang <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Kertas A4 80gr" 
                    className="w-full px-4 py-3 bg-[#F4F7FC] border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#5452F6] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-2">Kategori</label>
                    <div className="relative">
                      <select className="w-full px-4 py-3 bg-[#F4F7FC] border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#5452F6] appearance-none cursor-pointer">
                        <option>Pilih Kategori</option>
                        <option>Kertas & Media</option>
                        <option>Alat Tulis</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-2">Harga Satuan (Rp)</label>
                    <div className="flex items-center bg-[#F4F7FC] px-4 py-3 rounded-xl">
                      <span className="text-sm text-gray-400 font-bold mr-2">Rp</span>
                      <input type="text" placeholder="0" className="bg-transparent w-full text-sm outline-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#F4F7FC]/50 rounded-2xl border border-gray-50">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-xs font-bold text-gray-800">Stok Awal</label>
                    </div>
                    <div className="flex items-center bg-white border border-gray-100 rounded-xl overflow-hidden">
                      <input type="text" placeholder="0" className="flex-1 px-4 py-3 text-sm outline-none" />
                      <div className="bg-gray-100 px-4 py-3 text-[10px] font-bold text-gray-500">UNIT</div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">Jumlah fisik saat ini di gudang.</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-[#D97706]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <label className="text-xs font-bold">Ambang Batas Minimum</label>
                    </div>
                    <div className="flex items-center bg-white border border-gray-100 rounded-xl overflow-hidden">
                      <input type="text" placeholder="5" className="flex-1 px-4 py-3 text-sm outline-none text-[#D97706] font-bold" />
                      <div className="bg-gray-100 px-4 py-3 text-[10px] font-bold text-gray-500">UNIT</div>
                    </div>
                    <p className="text-[10px] text-[#D97706] mt-2 font-medium">Peringatan stok akan muncul jika di bawah angka ini.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Footer Action */}
            <div className="mt-12 pt-8 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Info className="w-4 h-4" />
                <p className="text-[11px] font-medium">Pastikan data yang dimasukkan sudah sesuai dengan manifest fisik gudang.</p>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <button 
                  onClick={() => onNavigate('data-barang')}
                  className="flex-1 md:flex-none px-8 py-3 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Batal
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-[#5452F6] hover:bg-[#4341E3] text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all">
                  <Save className="w-4 h-4" /> Simpan Barang
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow cursor-default">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5 text-[#5452F6]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">Riwayat Perubahan</h4>
                <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">Lacak setiap modifikasi data barang ini untuk audit internal.</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow cursor-default">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <QrCode className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">QR Otomatis</h4>
                <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">Sistem akan otomatis mencetak label QR untuk inventarisasi fisik.</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow cursor-default">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">Validasi Sistem</h4>
                <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">Pengecekan duplikasi nama dan nomor seri secara real-time.</p>
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="mt-12 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">
              © 2026 CV. AMRITA JAYASRI • MANAJEMEN INVENTARIS BERKINERJA TINGGI
            </p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default TambahBarang;