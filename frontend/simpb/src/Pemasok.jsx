import React, { useState, useEffect } from 'react'; 
import { 
  LayoutDashboard, Box, Truck, Users, 
  ArrowDownRight, ArrowUpRight, Activity, 
  BarChart2, Search, Bell, CircleUser, 
  Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Info, 
  ArrowDownLeft, Phone, Loader2, Menu, X // <-- Tambahan icon Menu & X
} from 'lucide-react';

import TambahSupplierModal from './TambahSupplierModal'; 
import EditSupplierModal from './EditSupplierModal'; 
import DeleteConfirmModal from './DeleteConfirmModal';

const Pemasok = ({ onNavigate, onLogout }) => {
  // === STATE UNTUK MENU HP ===
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // === STATE UNTUK KONTROL MODAL ===
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null); 

  // === STATE UNTUK MODAL HAPUS ===
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ id: null, namaPemasok: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  // === STATE UNTUK DATA API ===
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // === FUNGSI AMBIL DATA DARI API RAILWAY (GET) ===
  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const rawApiUrl = import.meta.env.VITE_API_URL || 'http://103.253.213.251/api';
      const cleanApiUrl = rawApiUrl.replace(/\/$/, ""); 
      
      const endpoint = cleanApiUrl.endsWith('/api') 
        ? `${cleanApiUrl}/supplier` 
        : `${cleanApiUrl}/api/supplier`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuppliers(data.data || []);
      } else {
        console.error("Gagal mengambil data:", data);
      }
    } catch (error) {
      console.error("Error Fetching:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const getInitial = (name) => {
    if (!name) return '??';
    const firstWord = name.split(' ')[0].toUpperCase();
    if (['PT', 'CV', 'UD', 'FA'].includes(firstWord)) return firstWord;
    return name.substring(0, 2).toUpperCase(); 
  };

  // === FUNGSI NAVIGASI HP ===
  const handleNavigation = (path) => {
    setIsMobileMenuOpen(false);
    onNavigate(path);
  };

  const handleSaveNewSupplier = (newSupplierData) => {
    fetchSuppliers(); 
    setIsAddModalOpen(false);
  };

  const handleEditClick = (supplier) => {
    setSelectedSupplier(supplier); 
    setIsEditModalOpen(true);      
  };

  const handleSaveEditSupplier = (updatedSupplierData) => {
    fetchSuppliers(); 
    setIsEditModalOpen(false);
  };

  // === FUNGSI UNTUK MENGATUR MODAL HAPUS ===
  const openDeleteModal = (id, namaPemasok) => {
    setItemToDelete({ id, namaPemasok });
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!itemToDelete.id) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const rawApiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const cleanApiUrl = rawApiUrl.replace(/\/$/, ""); 
      
      const endpoint = cleanApiUrl.endsWith('/api') 
        ? `${cleanApiUrl}/supplier/${itemToDelete.id}` 
        : `${cleanApiUrl}/api/supplier/${itemToDelete.id}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSuppliers(prevData => prevData.filter(item => item.id !== itemToDelete.id));
        setIsDeleteModalOpen(false); 
      } else {
        const errorData = await response.json();
        alert(`Gagal menghapus pemasok: ${errorData.message || 'Server error'}`);
      }
    } catch (error) {
      console.error("Error Deleting:", error);
      alert('Terjadi kesalahan jaringan.');
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
            {/* Tombol Tutup Sidebar di HP */}
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
            
            <button onClick={() => handleNavigation('pemasok')} className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0EFFF] text-[#5452F6] rounded-xl font-bold text-sm transition-colors text-left">
              <Truck className="w-5 h-5" /> Pemasok
            </button>

            <button onClick={() => handleNavigation('konsumen')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
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
                <input 
                  type="text" 
                  placeholder="Cari supplier..." 
                  className="w-full pl-11 pr-4 py-2.5 bg-[#F4F7FC] border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-[#5452F6] transition-all" 
                />
              </div>
              
              <button className="relative text-gray-500 hover:text-gray-800 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
              
              <div className="flex items-center gap-2.5 cursor-pointer">
                <CircleUser className="w-7 h-7 md:w-8 md:h-8 text-[#5452F6]" strokeWidth={1.5} />
                <span className="text-sm font-semibold text-[#1E232C] hidden md:block">Administrator</span>
              </div>
            </div>
          </header>

          {/* ================= AREA CONTENT ================= */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-12 w-full">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 md:mb-8">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Direktori Supplier</h1>
                <p className="text-xs md:text-sm text-gray-500 mt-1">Kelola dan pantau jaringan kemitraan strategis Anda.</p>
              </div>
              
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex justify-center items-center gap-2 px-4 md:px-5 py-2.5 bg-[#5452F6] hover:bg-[#4341E3] text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/30 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" /> Tambah Supplier
              </button>
            </div>

            {/* Statistik */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="bg-[#FAEDFF] p-4 md:p-5 rounded-[20px] shadow-sm flex flex-col justify-between h-28 md:h-32">
                <p className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-wider">TOTAL MITRA</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{isLoading ? '...' : suppliers.length}</h3>
                  <span className="text-[9px] md:text-[10px] font-bold text-[#5452F6]">+2 bulan ini</span>
                </div>
              </div>

              <div className="bg-[#EEF2FF] p-4 md:p-5 rounded-[20px] shadow-sm flex flex-col justify-between h-28 md:h-32">
                <p className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-wider">KONTRAK AKTIF</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{isLoading ? '...' : suppliers.length}</h3>
                  <span className="text-[9px] md:text-[10px] font-medium text-gray-500">Terdaftar</span>
                </div>
              </div>

              <div className="bg-[#ECFDF5] p-4 md:p-5 rounded-[20px] shadow-sm flex flex-col justify-between h-28 md:h-32">
                <p className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-wider">RATING KUALITAS</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800">98%</h3>
                  <span className="text-[9px] md:text-[10px] font-bold text-[#D97706]">Puncak reliabilitas</span>
                </div>
              </div>
            </div>

            {/* Tabel Pemasok */}
            <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden relative min-h-[300px]">
              {isLoading ? (
                <div className="absolute inset-0 z-10 bg-white flex flex-col items-center justify-center">
                  <Loader2 className="w-6 h-6 md:w-8 md:h-8 text-[#5452F6] animate-spin mb-4" />
                  <p className="text-xs md:text-sm font-bold text-gray-500">Menarik data dari database...</p>
                </div>
              ) : suppliers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 md:py-20 text-center px-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                    <Truck className="w-6 h-6 md:w-8 md:h-8 text-gray-300" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-gray-800">Belum Ada Supplier</h3>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">Silakan tambah supplier terlebih dahulu.</p>
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="py-3 md:py-4 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">NAMA SUPPLIER</th>
                        <th className="py-3 md:py-4 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">ALAMAT</th>
                        <th className="py-3 md:py-4 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">NOMOR TELEPON</th>
                        <th className="py-3 md:py-4 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {suppliers.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 md:py-4 px-4 md:px-6">
                            <div className="flex items-center gap-3 md:gap-3.5">
                              <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 text-gray-500 font-bold text-xs md:text-sm rounded-full flex items-center justify-center shrink-0 uppercase border border-gray-200 shadow-inner">
                                {getInitial(item.nama_supplier)}
                              </div>
                              <div>
                                <p className="font-bold text-gray-800 text-xs md:text-sm">{item.nama_supplier}</p>
                                <p className="text-[9px] md:text-[10px] text-gray-400 mt-0.5 font-medium uppercase tracking-wider">ID: {item.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 md:py-4 px-4 md:px-6">
                            <p className="text-[11px] md:text-xs text-gray-600 font-medium leading-relaxed max-w-[200px] md:max-w-[280px]">{item.alamat}</p>
                          </td>
                          <td className="py-3 md:py-4 px-4 md:px-6">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center border border-gray-100 shrink-0">
                                <Phone className="w-3 h-3 md:w-4 md:h-4" />
                              </span>
                              <p className="text-xs md:text-sm font-semibold text-gray-700">{item.no_telepon}</p>
                            </div>
                          </td>
                          <td className="py-3 md:py-4 px-4 md:px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5 md:gap-2">
                              <button 
                                onClick={() => handleEditClick(item)}
                                className="p-1.5 md:p-2 text-[#5452F6] hover:bg-indigo-50 rounded-lg transition-colors border border-gray-100 shadow-inner bg-gray-50/50"
                              >
                                <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                              </button>
                              
                              <button 
                                onClick={() => openDeleteModal(item.id, item.nama_supplier)}
                                className="p-1.5 md:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-gray-100 shadow-inner bg-gray-50/50"
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

            <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-3 md:py-4 border-t border-gray-100 bg-white gap-3 rounded-b-[20px] shadow-sm">
              <p className="text-[10px] md:text-xs text-gray-500 font-medium">Menampilkan {suppliers.length} supplier</p>
              <div className="flex items-center gap-1 md:gap-1.5 pagination-pills">
                <button className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 border border-gray-100"><ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                <button className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-[#5452F6] text-white rounded-lg text-xs font-bold">1</button>
                <button className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 border border-gray-100"><ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
              </div>
            </div>

            <div className="mt-6 md:mt-8 bg-[#EEF2FF] border border-gray-200 rounded-xl p-4 md:p-5 flex flex-col sm:flex-row gap-3 md:gap-4 text-[#5452F6]">
              <Info className="w-8 h-8 md:w-10 md:h-10 shrink-0 mt-0.5 mx-auto sm:mx-0" strokeWidth={1.5} />
              <div className="text-center sm:text-left">
                <p className="text-xs md:text-sm font-bold text-gray-800">Audit Trail Aktif</p>
                <p className="text-[10px] md:text-[11px] font-medium leading-relaxed mt-1 text-gray-600">
                  Semua perubahan pada data supplier dicatat untuk kepatuhan. Pastikan "Nomor Telepon" mengikuti format internasional untuk fitur notifikasi SMS otomatis.
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>

      <TambahSupplierModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewSupplier}
      />

      <EditSupplierModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEditSupplier}
        supplierData={selectedSupplier} 
      />

      {/* === RENDER MODAL HAPUS DI SINI === */}
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        itemName={itemToDelete.namaPemasok}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default Pemasok;