import React from 'react';
import { 
  LayoutDashboard, Box, Truck, Users, 
  ArrowDownRight, ArrowUpRight, Activity, 
  BarChart2, Search, Bell, CircleUser, CornerDownLeft,
  Calendar, FileText, Download, FileSpreadsheet, 
  FileCheck, ChevronLeft, ChevronRight, Filter,
  Coins // <-- IMPORT COINS LANGSUNG DARI SINI
} from 'lucide-react';

const Laporan = ({ onLogout, onNavigate }) => {
  // Data log transaksi berdasarkan image_ad155e.png
  const logTransaksi = [
    { id: '#TRX-98231', tgl: '24 Okt 2023', waktu: '14:20 WIB', produk: 'Kertas A4 80gr Sinar Dunia', sku: 'SKU: CW-50-PRO', tipe: 'Masuk', jumlah: '+ 250 Unit', lokasi: 'Gudang A-12', nilai: 'Rp 12.500.000' },
    { id: '#TRX-98230', tgl: '24 Okt 2023', waktu: '11:05 WIB', produk: 'Pulpen Gel Pilot G2 Hitam', sku: 'SKU: UA-GEN-02', tipe: 'Keluar', jumlah: '- 45 Unit', lokasi: 'Klien: PT Berjaya', nilai: 'Rp 3.150.000' },
    { id: '#TRX-98199', tgl: '23 Okt 2023', waktu: '09:15 WIB', produk: 'Toner HP Laserjet CF283A', sku: 'SKU: ICH-IND-99', tipe: 'Masuk', jumlah: '+ 12 Unit', lokasi: 'Gudang B-01', nilai: 'Rp 24.000.000' },
    { id: '#TRX-98188', tgl: '22 Okt 2023', waktu: '16:45 WIB', produk: 'Map Folder Snelhecter', sku: 'SKU: LED-V4-MX', tipe: 'Keluar', jumlah: '- 5 Unit', lokasi: 'Display Showroom', nilai: 'Rp 45.000.000' },
  ];

  return (
    <div className="flex h-screen bg-[#F4F7FC] font-sans overflow-hidden">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-[260px] bg-white border-r border-gray-100 flex flex-col z-20 shrink-0">
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
          <button onClick={() => onNavigate('monitoring-stok')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
            <Activity className="w-5 h-5" /> Monitoring Stok
          </button>
          <button onClick={() => onNavigate('laporan')} className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0EFFF] text-[#5452F6] rounded-xl font-bold text-sm transition-colors text-left">
            <BarChart2 className="w-5 h-5" /> Laporan
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-xl font-semibold text-sm transition-colors">
            <CornerDownLeft className="w-5 h-5 rotate-90" /> Keluar
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-10 sticky top-0 shrink-0">
          <div className="flex items-center">
            <h2 className="font-bold text-[#1E232C] text-base">SIMPB - CV. Amrita Jayasri</h2>
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
          
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#EEF2FF] p-6 rounded-[24px] border border-indigo-50 flex items-start gap-5">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#5452F6] shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[10px] font-black text-[#5452F6] uppercase tracking-[0.2em] mb-1">Inventaris Perusahaan</h3>
                <h4 className="text-base font-bold text-gray-800 mb-2">Laporan Transaksi</h4>
                <p className="text-xs text-gray-500 leading-relaxed max-w-sm">Hasilkan log komprehensif dari pergerakan stok masuk dan keluar.</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/60 rounded-lg flex items-center justify-center text-[#5452F6] border border-white">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-800 uppercase">Ekspor Seluruh Sistem</p>
                    <p className="text-[9px] text-gray-500">Laporan terakhir dibuat 2 jam yang lalu</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Rentang Tanggal</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input type="text" placeholder="mm/dd/yyyy" className="w-full pl-9 pr-3 py-2 bg-[#F4F7FC] border border-transparent rounded-lg text-xs focus:outline-none focus:bg-white focus:border-[#5452F6]" />
                    </div>
                    <span className="text-gray-400 text-[10px] font-bold">s/d</span>
                    <div className="relative flex-1">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input type="text" placeholder="mm/dd/yyyy" className="w-full pl-9 pr-3 py-2 bg-[#F4F7FC] border border-transparent rounded-lg text-xs focus:outline-none focus:bg-white focus:border-[#5452F6]" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Tipe Transaksi</label>
                  <select className="w-full px-4 py-2 bg-[#F4F7FC] border border-transparent rounded-lg text-xs font-bold text-gray-600 appearance-none focus:outline-none focus:bg-white focus:border-[#5452F6]">
                    <option>Semua Transaksi</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#5452F6] rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Sinkronisasi data langsung aktif</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg text-[10px] font-bold text-gray-600 transition-colors">
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Ekspor Excel
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#5452F6] text-white rounded-lg text-[10px] font-bold hover:bg-[#4341E3] transition-all shadow-md shadow-indigo-100">
                    <Download className="w-3.5 h-3.5" /> Unduh PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Log Transaksi Terperinci</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Menampilkan 1-12 dari 1.248 entri</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] border-b border-gray-100">
                    <th className="py-6 px-8">ID Transaksi</th>
                    <th className="py-6 px-6">Tanggal & Waktu</th>
                    <th className="py-6 px-6">Produk</th>
                    <th className="py-6 px-6 text-center">Tipe</th>
                    <th className="py-6 px-6 text-center">Jumlah</th>
                    <th className="py-6 px-8 text-right">Total Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logTransaksi.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-5 px-8">
                        <span className="text-[11px] font-black text-[#5452F6] hover:underline cursor-pointer">{item.id}</span>
                      </td>
                      <td className="py-5 px-6">
                        <p className="text-xs font-bold text-gray-800">{item.tgl}</p>
                        <p className="text-[9px] text-gray-400 mt-1 font-bold">{item.waktu}</p>
                      </td>
                      <td className="py-5 px-6">
                        <p className="text-xs font-black text-gray-800">{item.produk}</p>
                        <p className="text-[9px] text-gray-400 mt-1 font-bold uppercase tracking-wider">{item.sku}</p>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest ${item.tipe === 'Masuk' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                          {item.tipe === 'Masuk' ? <ArrowDownRight className="w-3 h-3 inline mr-1" /> : <ArrowUpRight className="w-3 h-3 inline mr-1" />}
                          {item.tipe}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <p className={`text-xs font-black ${item.tipe === 'Masuk' ? 'text-gray-800' : 'text-gray-800'}`}>{item.jumlah}</p>
                        <p className="text-[9px] text-gray-400 mt-1 font-bold">{item.lokasi}</p>
                      </td>
                      <td className="py-5 px-8 text-right">
                        <p className="text-xs font-black text-gray-800">{item.nilai.split('.')[0]}</p>
                        <p className="text-[10px] font-black text-gray-800">.{item.nilai.split('.')[1]}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-gray-50/30 border-t border-gray-100 flex justify-between items-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Menampilkan 1 sampai 10 dari 1.248 transaksi</p>
              <div className="flex items-center gap-1.5">
                <button className="text-[10px] font-black text-gray-400 uppercase hover:text-gray-600 mr-2">Sebelumnya</button>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#5452F6] text-white text-[10px] font-black">1</button>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 text-[10px] font-black hover:bg-gray-50">2</button>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 text-[10px] font-black hover:bg-gray-50">3</button>
                <span className="text-gray-400 text-[10px] px-1 font-black">...</span>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 text-[10px] font-black hover:bg-gray-50">125</button>
                <button className="text-[10px] font-black text-gray-400 uppercase hover:text-gray-600 ml-2">Berikutnya</button>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex flex-col h-32 relative">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-[#5452F6] mb-3">
                <Box className="w-4 h-4" />
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Total Volume</p>
              <div className="mt-auto">
                <h3 className="text-2xl font-black text-gray-800 leading-none mb-1">14.282</h3>
                <p className="text-[9px] font-bold text-emerald-600 uppercase">+8.2% dari periode lalu</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex flex-col h-32 relative">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-[#5452F6] mb-3">
                <Coins className="w-4 h-4" />
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Nilai Bersih</p>
              <div className="mt-auto">
                <h3 className="text-2xl font-black text-gray-800 leading-none mb-1">Rp 1,4 M</h3>
                <p className="text-[9px] font-bold text-emerald-600 uppercase">+12.4% dari periode lalu</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex flex-col h-32 relative">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-[#5452F6] mb-3">
                <ArrowDownRight className="w-4 h-4" />
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Rasio Masuk</p>
              <div className="mt-auto">
                <div className="flex justify-between items-end mb-2">
                  <h3 className="text-2xl font-black text-gray-800 leading-none">62%</h3>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-[62%] h-full bg-[#5452F6] rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex flex-col h-32 relative">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-[#5452F6] mb-3">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Rasio Keluar</p>
              <div className="mt-auto">
                <div className="flex justify-between items-end mb-2">
                  <h3 className="text-2xl font-black text-gray-800 leading-none">38%</h3>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-[38%] h-full bg-orange-700 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Teks Sesuai Screenshot */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 pt-8 gap-4">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              © 2023 CV. AMRITA JAYASRI - SISTEM MANAJEMEN INVENTARIS PERUSAHAAN
            </p>
            <div className="flex gap-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">
              <a href="#" className="hover:text-gray-600 transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Ketentuan Layanan</a>
              <span className="text-gray-500">v2.4.0 - Enterprise</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Laporan;