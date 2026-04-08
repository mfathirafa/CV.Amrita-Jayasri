import React from 'react';
import { 
  LayoutDashboard, Box, Truck, Users, 
  ArrowDownRight, ArrowUpRight, Activity, 
  BarChart2, Search, Bell, CircleUser, LogOut,
  Package, AlertTriangle, ShoppingCart, Coins,
  FileText, Zap, ChevronLeft, ChevronRight,
  Filter, Download, PenTool, Printer, Edit2 // Menambahkan Edit2 untuk tombol aksi
} from 'lucide-react';

const MonitoringStok = ({ onLogout, onNavigate }) => {
  // Mock data tabel sesuai screenshot
  const inventarisData = [
    { name: 'Kertas A4 80gr Sinar Dunia', id: 'ATK-KRT-001', category: 'Kertas', current: '8 RIM', min: 20, trend: 'down', status: 'STOK RENDAH', statusColor: 'bg-red-100 text-red-600', icon: FileText, iconColor: 'text-gray-400' },
    { name: 'Pulpen Gel Pilot G2 Hitam', id: 'ATK-PLP-002', category: 'Alat Tulis', current: '144 PCS', min: 50, trend: 'up', status: 'OPTIMAL', statusColor: 'bg-emerald-100 text-emerald-600', icon: PenTool, iconColor: 'text-blue-500' },
    { name: 'Toner HP Laserjet CF283A', id: 'ATK-TNR-005', category: 'Tinta & Toner', current: '4 BOX', min: 3, trend: 'flat', status: 'PESAN SEGERA', statusColor: 'bg-orange-100 text-orange-700', icon: Printer, iconColor: 'text-gray-500' }
  ];

  const renderTrendIcon = (trend) => {
    const bars = [3, 2, 4, 1, 3, 2, 4];
    return (
      <div className="flex gap-0.5 items-end h-5 w-12 px-1">
        {bars.map((height, index) => {
          let color = "bg-gray-200";
          if (trend === 'down' && index > bars.length - 4) color = "bg-red-400";
          if (trend === 'up' && index > bars.length - 4) color = "bg-emerald-400";
          return <div key={index} className={`w-1 rounded-full ${color}`} style={{ height: `${height * 5}px` }}></div>
        })}
      </div>
    );
  };

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
          <button onClick={() => onNavigate('monitoring-stok')} className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0EFFF] text-[#5452F6] rounded-xl font-bold text-sm transition-colors text-left">
            <Activity className="w-5 h-5" /> Monitoring Stok
          </button>
          <button onClick={() => onNavigate('laporan')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
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
          {/* Section Level Stok */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Level Stok</h1>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">RINGKASAN STATUS INVENTARIS REAL-TIME</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total SKU */}
            <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex flex-col h-40 relative">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">+12%</span>
              </div>
              <div className="mt-auto">
                <h3 className="text-3xl font-black text-gray-800 leading-none">1,284</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">TOTAL ITEM SKU</p>
              </div>
            </div>

            {/* STOK RENDAH */}
            <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex flex-col h-40 relative">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-white bg-red-500 px-2.5 py-1 rounded-full shadow-sm shadow-red-200">PERLU TINDAKAN</span>
              </div>
              <div className="mt-auto">
                <h3 className="text-3xl font-black text-gray-800 leading-none">24</h3>
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-2">STOK RENDAH (KRITIS)</p>
              </div>
            </div>

            {/* HABIS */}
            <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex flex-col h-40 relative">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                  <ShoppingCart className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-auto">
                <h3 className="text-3xl font-black text-gray-800 leading-none">03</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">PESAN SEGERA</p>
              </div>
            </div>

            {/* NILAI STOK */}
            <div className="bg-gradient-to-br from-[#5452F6] to-[#7C3AED] p-5 rounded-[24px] shadow-md text-white flex flex-col h-40 relative overflow-hidden">
              <div className="flex justify-between items-start z-10">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Coins className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-auto z-10">
                <h3 className="text-3xl font-black leading-none">Rp 2,4M</h3>
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mt-2">VALUASI INVENTARIS</p>
              </div>
              <Coins className="absolute -right-4 -bottom-4 w-28 h-28 opacity-10" />
            </div>
          </div>

          {/* Table Area */}
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
              <h3 className="text-lg font-bold text-gray-800">Status Inventaris</h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                  <Filter className="w-3.5 h-3.5" /> Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#5452F6] text-white rounded-xl text-xs font-bold hover:bg-[#4341E3] shadow-md shadow-indigo-100 transition-colors">
                  <Download className="w-3.5 h-3.5" /> Ekspor Data
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="py-5 px-6">NAMA BARANG / ID</th>
                    <th className="py-5 px-6">KATEGORI</th>
                    <th className="py-5 px-6 text-center">STOK</th>
                    <th className="py-5 px-6 text-center">MIN.</th>
                    <th className="py-5 px-6">TREN</th>
                    <th className="py-5 px-6 text-center">STATUS</th>
                    <th className="py-5 px-6 text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inventarisData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-all duration-200">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-inner">
                            <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm leading-tight">{item.name}</p>
                            <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-wider">{item.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-[10px] font-bold text-gray-500 uppercase bg-gray-100 px-2 py-1 rounded-md tracking-wider">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center text-sm font-black text-gray-800">{item.current}</td>
                      <td className="py-4 px-6 text-center text-xs font-bold text-gray-300">{item.min}</td>
                      <td className="py-4 px-6">{renderTrendIcon(item.trend)}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest ${item.statusColor}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => onNavigate('edit-barang')}
                          className="p-2 text-[#5452F6] hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="p-6 bg-gray-50/30 border-t border-gray-100 flex justify-between items-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Menampilkan 1-3 dari 1,284 Item</p>
              <div className="flex gap-1.5">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#5452F6] text-white text-xs font-bold shadow-md shadow-indigo-100">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 text-xs font-bold hover:bg-gray-50 transition-colors">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 transition-colors"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MonitoringStok;