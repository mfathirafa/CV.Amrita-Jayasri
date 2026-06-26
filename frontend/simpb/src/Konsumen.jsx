import React, { useState, useEffect } from 'react'; 
import { 
  LayoutDashboard, Box, Truck, Users, 
  ArrowDownRight, ArrowUpRight, Activity, 
  BarChart2, Search, Bell, CircleUser, 
  Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Info, 
  ArrowDownLeft, Phone, Loader2, Menu, X, Bookmark, Star 
} from 'lucide-react';

import TambahKonsumenModal from './TambahKonsumenModal';
import EditKonsumenModal from './EditKonsumenModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import logoAmrita from './assets/Logo Amrita.png';

const Konsumen = ({ onNavigate, onLogout }) => {
  // === STATE UNTUK MENU HP ===
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // === STATE UNTUK KONTROL MODAL ===
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedKonsumen, setSelectedKonsumen] = useState(null);

  // === STATE UNTUK MODAL HAPUS ===
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ id: null, namaKonsumen: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  // === STATE UNTUK DATA API ===
  const [konsumens, setKonsumens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // === FUNGSI AMBIL DATA DARI API (GET) ===
  const fetchKonsumens = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const rawApiUrl = import.meta.env.VITE_API_URL || 'https://cvamritajayasri.my.id/api';
      const cleanApiUrl = rawApiUrl.replace(/\/$/, ""); 
      
      const endpoint = cleanApiUrl.endsWith('/api') 
        ? `${cleanApiUrl}/konsumen` 
        : `${cleanApiUrl}/api/konsumen`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setKonsumens(data.data || []);
      } else {
        console.error("Gagal mengambil data konsumen:", data);
      }
    } catch (error) {
      console.error("Error Fetching Konsumen:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKonsumens();
  }, []);

  // === FUNGSI HELPER UNTUK INISIAL OTOMATIS ===
  const getInitial = (name) => {
    if (!name) return '??';
    const firstWord = name.split(' ')[0].toUpperCase();
    if (['PT', 'CV', 'UD', 'RSUD', 'SMAN', 'DINAS', 'KANTOR'].includes(firstWord)) {
        return firstWord.substring(0, 4); 
    }
    return name.substring(0, 2).toUpperCase(); 
  };

  // === FUNGSI NAVIGASI HP ===
  const handleNavigation = (path) => {
    setIsMobileMenuOpen(false);
    onNavigate(path);
  };

  // === HANDLER MODAL TAMBAH & EDIT ===
  const handleSaveNewKonsumen = (newData) => {
    fetchKonsumens(); 
    setIsAddModalOpen(false);
  };

  const handleEditClick = (konsumen) => {
    setSelectedKonsumen(konsumen);
    setIsEditModalOpen(true);
  };

  const handleSaveEditKonsumen = (updatedData) => {
    fetchKonsumens(); 
    setIsEditModalOpen(false);
  };

  // === HANDLER MODAL HAPUS ===
  const openDeleteModal = (id, namaKonsumen) => {
    setItemToDelete({ id, namaKonsumen });
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!itemToDelete.id) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const rawApiUrl = import.meta.env.VITE_API_URL || 'https://cvamritajayasri.my.id/api';
      const cleanApiUrl = rawApiUrl.replace(/\/$/, ""); 
      
      const endpoint = cleanApiUrl.endsWith('/api') 
        ? `${cleanApiUrl}/konsumen/${itemToDelete.id}` 
        : `${cleanApiUrl}/api/konsumen/${itemToDelete.id}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchKonsumens();
        setIsDeleteModalOpen(false);
      } else {
        const errorData = await response.json();
        alert(`Gagal menghapus konsumen: ${errorData.message || 'Server error'}`);
      }
    } catch (error) {
      console.error("Error Deleting:", error);
      alert('Terjadi kesalahan jaringan saat menghapus.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
        
        {/* ================= MOBILE OVERLAY ================= */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* ================= SIDEBAR RESPONSIF ================= */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-gray-100 flex flex-col shrink-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* LOGO DIPASANG DI SINI */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden bg-gray-50">
                <img src={logoAmrita} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-[#5452F6] font-bold text-[13px] leading-tight tracking-wide">
                  CV. AMRITA<br/>JAYASRI
                </h1>
                <p className="text-gray-400 font-medium text-[10px] mt-0.5">Sistem Inventaris ATK</p>
              </div>
            </div>
            <button className="md:hidden text-gray-400 hover:text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-2 scrollbar-hide">
            <button onClick={() => handleNavigation('dashboard')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </button>
            <button onClick={() => handleNavigation('data-barang')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
              <Box className="w-5 h-5" /> Data Barang
            </button>
            <button onClick={() => handleNavigation('pemasok')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
              <Truck className="w-5 h-5" /> Pemasok
            </button>
            
            <button onClick={() => handleNavigation('konsumen')} className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0EFFF] text-[#5452F6] rounded-xl font-bold text-sm transition-colors text-left">
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
            <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 w-full text-[#64748B] hover:bg-gray-50 hover:text-[#334155] rounded-xl font-semibold text-sm transition-colors">
              <ArrowDownLeft className="w-5 h-5 text-[#829AB1]" strokeWidth={2.5} /> Keluar
            </button>
          </div>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-1 flex flex-col overflow-hidden relative w-full">
          
          {/* === HEADER RESPONSIF === */}
          <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0 shrink-0">
            <div className="flex items-center gap-3">
              <button className="md:hidden text-gray-500 hover:text-gray-800 p-1" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="font-bold text-[#1E232C] text-sm md:text-base hidden sm:block">SIMPB - CV. Amrita Jayasri</h2>
              <h2 className="font-bold text-[#1E232C] text-sm sm:hidden">SIMPB</h2>
            </div>
            
            <div className="flex items-center gap-4 md:gap-6">
              <div className="relative w-72 hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Cari konsumen..." className="w-full pl-11 pr-4 py-2.5 bg-[#F4F7FC] border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-[#5452F6] focus:ring-1 focus:ring-[#5452F6] transition-all" />
              </div>
              
              <button className="relative text-gray-500 hover:text-gray-800 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
              
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(prev => !prev)}
                  className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                >
                  <CircleUser className="w-7 h-7 md:w-8 md:h-8 text-[#5452F6]" strokeWidth={1.5} />
                  <span className="text-sm font-semibold text-[#1E232C] hidden md:block">Administrator</span>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-1 animate-in fade-in zoom-in-95">
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
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 md:mb-8">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Direktori Konsumen</h1>
                <p className="text-xs md:text-sm text-gray-500 mt-1">Kelola dan pantau jaringan kemitraan strategis Anda.</p>
              </div>
              
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 bg-[#5452F6] hover:bg-[#4341E3] text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/30 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" /> Tambah Konsumen
              </button>
            </div>

            {/* Statistik */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="bg-[#FAEDFF] p-4 md:p-5 rounded-[20px] shadow-sm flex items-start gap-4 h-28 md:h-32">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/60 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 md:w-5 md:h-5 text-[#A855F7]" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800">{isLoading ? '...' : konsumens.length}</h3>
                  <p className="text-[9px] md:text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">TOTAL KONSUMEN</p>
                </div>
              </div>

              <div className="bg-[#EEF2FF] p-4 md:p-5 rounded-[20px] shadow-sm flex items-start gap-4 h-28 md:h-32 relative overflow-hidden">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/60 flex items-center justify-center flex-shrink-0 relative z-10">
                  <Bookmark className="w-4 h-4 md:w-5 md:h-5 text-[#5452F6]" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800">{isLoading ? '...' : konsumens.length}</h3>
                  <p className="text-[9px] md:text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">KONTRAK AKTIF</p>
                </div>
              </div>

              <div className="bg-[#ECFDF5] p-4 md:p-5 rounded-[20px] shadow-sm flex items-start gap-4 h-28 md:h-32 relative overflow-hidden">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/60 flex items-center justify-center flex-shrink-0 relative z-10">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-[#10B981]" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800">98%</h3>
                  <p className="text-[9px] md:text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">RATING KUALITAS</p>
                </div>
              </div>
            </div>

            {/* Tabel Konsumen */}
            <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden relative min-h-[300px]">
              {isLoading ? (
                <div className="absolute inset-0 z-10 bg-white/80 flex flex-col items-center justify-center">
                  <Loader2 className="w-6 h-6 md:w-8 md:h-8 text-[#5452F6] animate-spin mb-4" />
                  <p className="text-xs md:text-sm font-bold text-gray-500">Menarik data dari database...</p>
                </div>
              ) : konsumens.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 md:py-20 text-center px-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                    <Users className="w-6 h-6 md:w-8 md:h-8 text-gray-300" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-gray-800">Belum Ada Konsumen</h3>
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse min-w-[700px] md:min-w-[900px]">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-100">
                        <th className="py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">NAMA KONSUMEN</th>
                        <th className="py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">ALAMAT</th>
                        <th className="py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">NOMOR TELEPON</th>
                        <th className="py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider text-right">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {konsumens.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 md:py-4 px-4 md:px-6">
                            <div className="flex items-center gap-3 md:gap-3.5">
                              <div className="w-8 h-8 md:w-11 md:h-11 bg-purple-50 text-purple-600 font-bold text-xs md:text-sm rounded-full flex items-center justify-center shrink-0 uppercase border border-purple-100 shadow-sm">
                                {getInitial(item.nama_konsumen)}
                              </div>
                              <div>
                                <p className="font-bold text-gray-800 text-xs md:text-sm truncate max-w-[150px] md:max-w-[250px]">{item.nama_konsumen}</p>
                                <p className="text-[9px] md:text-[11px] text-gray-400 mt-0.5 font-medium uppercase tracking-wider">ID: KSM-{String(item.id).padStart(4, '0')}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 md:py-4 px-4 md:px-6">
                            <p className="text-[11px] md:text-xs text-gray-600 font-medium leading-relaxed max-w-[200px] md:max-w-[300px]">{item.alamat}</p>
                          </td>
                          <td className="py-3 md:py-4 px-4 md:px-6">
                            <div className="flex items-center gap-2 md:gap-2.5">
                              <span className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center border border-gray-100 shrink-0">
                                  <Phone className="w-3 h-3 md:w-3.5 md:h-3.5" />
                              </span>
                              <p className="text-xs md:text-sm font-semibold text-gray-700">{item.no_telepon}</p>
                            </div>
                          </td>
                          <td className="py-3 md:py-4 px-4 md:px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5 md:gap-2.5">
                              <button 
                                onClick={() => handleEditClick(item)}
                                className="p-1.5 md:p-2.5 text-[#5452F6] hover:bg-indigo-50 rounded-lg transition-colors border border-gray-100 shadow-inner bg-gray-50/50"
                              >
                                <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                              </button>
                              
                              <button 
                                onClick={() => openDeleteModal(item.id, item.nama_konsumen)}
                                className="p-1.5 md:p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-gray-100 shadow-inner bg-gray-50/50"
                              >
                                <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            <div className="mt-6 md:mt-8 bg-[#EEF2FF] border border-gray-200 rounded-xl p-4 md:p-5 flex flex-col sm:flex-row gap-3 md:gap-4 text-[#5452F6]">
              <Info className="w-8 h-8 md:w-10 md:h-10 shrink-0 mx-auto sm:mx-0 mt-0.5" strokeWidth={1.5} />
              <div className="text-center sm:text-left">
                <p className="text-xs md:text-sm font-bold text-gray-800">Audit Trail Aktif</p>
                <p className="text-[10px] md:text-[11px] font-medium leading-relaxed mt-1 text-gray-600">Semua perubahan pada data konsumen dicatat untuk kepatuhan.</p>
              </div>
            </div>

          </div>
        </main>
      </div>

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

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        itemName={itemToDelete.namaKonsumen}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default Konsumen;