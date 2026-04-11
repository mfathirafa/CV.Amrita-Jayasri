import React, { useState } from 'react';
import { 
  Search, Bell, Plus, Edit2, Trash2, 
  LayoutDashboard, Box, Users, Truck, ArrowDownRight, 
  ArrowUpRight, Activity, BarChart2, ArrowDownLeft, 
  History, Bookmark, Star, ChevronLeft, ChevronRight, CircleUser, Info
} from 'lucide-react';

// === IMPORT MODAL KONSUMEN KITA DI SINI ===
// Sesuaikan path import (../components/modals/...) jika diletakkan di dalam folder terpisah
import TambahKonsumenModal from './TambahKonsumenModal';
import EditKonsumenModal from './EditKonsumenModal';

const Konsumen = ({ onNavigate, onLogout }) => {
  // === STATE UNTUK KONTROL MODAL ===
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedKonsumen, setSelectedKonsumen] = useState(null);

  // Mock data untuk tabel konsumen
  const konsumenData = [
    { id: 'KSM-0012', name: 'PT. Maju Bersama Nusantara', initial: 'PT', address: 'Jl. Industri No. 45, Kawasan Rungkut, Surabaya, Jawa Timur', phone: '(031) 555-1234' },
    { id: 'KSM-0045', name: 'CV. Global Logistik Sejahtera', initial: 'CV', address: 'Komp. Pergudangan Sunrise Block B-12, Jakarta Utara', phone: '(021) 888-9900' },
    { id: 'KSM-0089', name: 'UD. Karya Mandiri Abadi', initial: 'UD', address: 'Jl. Gatot Subroto No. 201, Denpasar, Bali', phone: '(0361) 224-556' },
    { id: 'KSM-0102', name: 'PT. Sinar Jaya Elektronik', initial: 'PT', address: 'Pusat Grosir Senen Jaya, Lt. 3 Blok A, Jakarta Pusat', phone: '(021) 345-6789' }
  ];

  // Handler Modal
  const handleSaveNewKonsumen = (newData) => {
    console.log("Data Konsumen Baru:", newData);
    setIsAddModalOpen(false);
  };

  const handleEditClick = (konsumen) => {
    setSelectedKonsumen(konsumen);
    setIsEditModalOpen(true);
  };

  const handleSaveEditKonsumen = (updatedData) => {
    console.log("Data Konsumen Diperbarui:", updatedData);
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="flex h-screen bg-[#F8F9FA] font-sans">
        
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
                <p className="text-gray-400 font-medium text-[10px] mt-0.5">Sistem Inventaris ATK</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-2 scrollbar-hide">
            <button onClick={() => onNavigate('dashboard')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </button>
            <button onClick={() => onNavigate('data-barang')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
              <Box className="w-5 h-5" /> Data Barang
            </button>
            <button onClick={() => onNavigate('pemasok')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
              <Truck className="w-5 h-5" /> Pemasok
            </button>
            
            {/* MENU KONSUMEN AKTIF */}
            <button onClick={() => onNavigate('konsumen')} className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0EFFF] text-[#5452F6] rounded-xl font-bold text-sm transition-colors text-left">
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
            <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 w-full text-[#64748B] hover:bg-gray-50 hover:text-[#334155] rounded-xl font-semibold text-sm transition-colors">
              <ArrowDownLeft className="w-5 h-5 text-[#829AB1]" strokeWidth={2.5} /> Keluar
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

          {/* ================= PAGE CONTENT ================= */}
          <div className="flex-1 overflow-y-auto p-8 pb-12">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Direktori Konsumen</h1>
                <p className="text-sm text-gray-500 mt-1">Kelola dan pantau jaringan kemitraan strategis Anda.</p>
              </div>
              
              {/* TOMBOL MEMBUKA MODAL TAMBAH */}
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#5452F6] hover:bg-[#4341E3] text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/30"
              >
                <Plus className="w-4 h-4" /> Tambah Konsumen
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#FAEDFF] p-5 rounded-[20px] shadow-sm flex items-start gap-4 h-32">
                <div className="w-10 h-10 rounded-lg bg-white/60 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-[#A855F7]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">30</h3>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">TOTAL MITRA</p>
                  <span className="text-[10px] font-bold text-[#5452F6] bg-[#EBF4FF] px-2.5 py-1 rounded-full mt-2.5 inline-block">+4 bulan ini</span>
                </div>
              </div>

              <div className="bg-[#EEF2FF] p-5 rounded-[20px] shadow-sm flex items-start gap-4 h-32 relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 opacity-20">
                      <History className="w-24 h-24 text-[#5452F6] rotate-[20deg]" />
                  </div>
                <div className="w-10 h-10 rounded-lg bg-white/60 flex items-center justify-center flex-shrink-0 relative z-10">
                  <Bookmark className="w-5 h-5 text-[#5452F6]" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-800">28</h3>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">KONTRAK AKTIF</p>
                  <p className="text-[10px] text-gray-500 mt-2">di 5 wilayah</p>
                </div>
              </div>

              <div className="bg-[#ECFDF5] p-5 rounded-[20px] shadow-sm flex items-start gap-4 h-32 relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 opacity-20">
                      <Star className="w-24 h-24 text-[#10B981] rotate-[-20deg]" />
                  </div>
                <div className="w-10 h-10 rounded-lg bg-white/60 flex items-center justify-center flex-shrink-0 relative z-10">
                  <ArrowUpRight className="w-5 h-5 text-[#10B981]" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-800">98%</h3>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">RATING KUALITAS</p>
                  <p className="text-[10px] text-[#D97706] font-bold mt-2">Puncak reliabilitas</p>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                      <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">NAMA KONSUMEN</th>
                      <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">ALAMAT</th>
                      <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">NOMOR TELEPON</th>
                      <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {konsumenData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 bg-gray-100 text-gray-500 font-bold text-lg rounded-full flex items-center justify-center flex-shrink-0 uppercase border border-gray-200 shadow-inner">
                              {item.initial}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 text-sm truncate max-w-[250px]">{item.name}</p>
                              <p className="text-[11px] text-gray-400 mt-0.5 font-medium uppercase tracking-wider">ID: {item.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-xs text-gray-600 font-medium leading-relaxed max-w-[300px]">{item.address}</p>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center border border-gray-200">
                                ( )
                            </span>
                            <p className="text-sm font-semibold text-gray-700">{item.phone}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            {/* TOMBOL EDIT MEMBUKA MODAL */}
                            <button 
                              onClick={() => handleEditClick(item)}
                              className="p-2.5 text-[#5452F6] hover:bg-indigo-50 rounded-lg transition-colors border border-gray-100 shadow-inner bg-gray-50/50"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-gray-100 shadow-inner bg-gray-50/50">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 bg-white gap-3">
                <p className="text-xs text-gray-500 font-medium">Menampilkan 1 - 4 dari 30 konsumen</p>
                <div className="flex items-center gap-1.5 pagination-pills">
                  <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 border border-gray-100"><ChevronLeft className="w-4 h-4" /></button>
                  <button className="w-8 h-8 flex items-center justify-center bg-[#5452F6] text-white rounded-lg text-xs font-bold">1</button>
                  <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg text-xs font-bold border border-gray-100">2</button>
                  <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg text-xs font-bold border border-gray-100">3</button>
                  <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 border border-gray-100"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            {/* Info Box di Bagian Bawah */}
            <div className="mt-8 bg-[#EEF2FF] border border-gray-200 rounded-xl p-5 flex gap-4 text-[#5452F6]">
              <Info className="w-10 h-10 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="text-xs font-bold text-gray-800">Audit Trail Aktif</p>
                <p className="text-[11px] font-medium leading-relaxed mt-1 text-gray-600">Semua perubahan pada data konsumen dicatat untuk kepatuhan. Pastikan 'Nomor Telepon' mengikuti format internasional untuk fitur notifikasi SMS otomatis.</p>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* === RENDER MODAL DI SINI === */}
      <TambahKonsumenModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleSaveNewKonsumen} 
      />
      
      <EditKonsumenModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onSave={handleSaveEditKonsumen} 
        konsumenData={selectedKonsumen} 
      />
    </>
  );
};

export default Konsumen;