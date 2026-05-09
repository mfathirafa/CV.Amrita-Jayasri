import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Box, Truck, Users, 
  ArrowDownRight, ArrowUpRight, ArrowDownLeft, Activity, 
  BarChart2, Search, Bell, CircleUser, 
  ChevronDown, Camera, Lock, Info, Save,
  RotateCcw, QrCode, ShieldCheck,
  AlertTriangle, AlertCircle, Loader2, X,
  Menu // <-- Tambah icon Menu
} from 'lucide-react';

import SuccessModal from './SuccessModal';

const EditBarang = ({ onNavigate, onLogout, itemId }) => {
  // === STATE UNTUK MENU HP ===
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 1. STATE UNTUK FORM INPUT
  const [namaBarang, setNamaBarang] = useState('');
  const [kategori, setKategori] = useState('');
  const [satuan, setSatuan] = useState(''); 
  const [harga, setHarga] = useState('');
  const [stok, setStok] = useState('');
  const [ambangBatas, setAmbangBatas] = useState('');
  const [idReferensi, setIdReferensi] = useState('MEMUAT...');
  
  // STATE UNTUK FILE FOTO & PREVIEW
  const [foto, setFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);

  // STATE UNTUK LOADING & ERROR
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); 
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedItemName, setSavedItemName] = useState('');

  // 2. FUNGSI UNTUK MENARIK DATA BARANG
  useEffect(() => {
    const fetchBarangDetail = async () => {
      if (!itemId) {
        setErrorMessage('ID Barang tidak valid.');
        setIsFetchingData(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const rawApiUrl = import.meta.env.VITE_API_URL || 'http://103.253.213.251/api';
        const cleanApiUrl = rawApiUrl.replace(/\/$/, ""); 
        
        const endpoint = cleanApiUrl.endsWith('/api') 
          ? `${cleanApiUrl}/barang/${itemId}` 
          : `${cleanApiUrl}/api/barang/${itemId}`;

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const json = await response.json();

        if (response.ok || json.success) {
          const item = json.data;
          setNamaBarang(item.nama_barang || '');
          setKategori(item.kategori || '');
          setSatuan(item.satuan || '');
          setHarga(item.harga || '');
          setStok(item.stok || '');
          setAmbangBatas(item.stok_minimum || '');
          setIdReferensi(item.id_referensi || `BRG-${item.id}`);
          
          if (item.foto_url) {
            setPreviewFoto(item.foto_url);
          }
        } else {
          setErrorMessage(json.message || 'Gagal memuat data barang.');
        }
      } catch (error) {
        console.error("Error Fetching Detail:", error);
        setErrorMessage('Koneksi ke server gagal saat memuat data.');
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchBarangDetail();
  }, [itemId]);

  // === FUNGSI NAVIGASI HP ===
  const handleNavigation = (path) => {
    setIsMobileMenuOpen(false);
    onNavigate(path);
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage('Ukuran foto maksimal 2MB!');
        document.getElementById('input-foto').value = '';
        return;
      }
      setErrorMessage(''); 
      setFoto(file);
      setPreviewFoto(URL.createObjectURL(file)); 
    }
  };

  const handleRemoveFoto = (e) => {
    e.stopPropagation(); 
    setFoto(null);
    setPreviewFoto(null);
    document.getElementById('input-foto').value = ''; 
  };

  const handleSimpan = async () => {
    if (!namaBarang || !kategori || !satuan || !harga || !stok || !ambangBatas) {
      setErrorMessage('Semua kolom berlabel bintang merah (*) wajib diisi!');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('token');
      const rawApiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const cleanApiUrl = rawApiUrl.replace(/\/$/, ""); 
      
      const endpoint = cleanApiUrl.endsWith('/api') 
        ? `${cleanApiUrl}/barang/${itemId}` 
        : `${cleanApiUrl}/api/barang/${itemId}`;

      const formData = new FormData();
      formData.append('nama_barang', namaBarang);
      formData.append('kategori', kategori);
      formData.append('harga', harga); 
      formData.append('stok', stok); 
      formData.append('stok_minimum', ambangBatas); 
      formData.append('satuan', satuan);
      formData.append('_method', 'PUT'); 

      if (foto) {
        formData.append('foto', foto);
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok || data.success === true) {
        setSavedItemName(namaBarang);
        setShowSuccessModal(true);
      } else {
        const errorMsg = data.errors 
          ? Object.values(data.errors)[0][0] 
          : (data.message || 'Gagal memperbarui barang.');
        setErrorMessage(errorMsg);
      }
    } catch (error) {
      console.error("Error Updating:", error);
      setErrorMessage('Koneksi ke server gagal. Pastikan backend berjalan.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    onNavigate('data-barang'); 
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
                <p className="text-gray-400 font-medium text-[10px] mt-0.5">Sistem Inventaris ATK</p>
              </div>
            </div>
            <button className="md:hidden text-gray-400" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex-1 px-4 space-y-1.5 mt-2 overflow-y-auto scrollbar-hide">
            <button onClick={() => handleNavigation('dashboard')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </button>
            <button onClick={() => handleNavigation('data-barang')} className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0EFFF] text-[#5452F6] rounded-xl font-bold text-sm transition-colors text-left">
              <Box className="w-5 h-5" /> Data Barang
            </button>
            <button onClick={() => handleNavigation('pemasok')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left">
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
              <button className="md:hidden text-gray-500 p-1" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="font-bold text-[#1E232C] text-sm md:text-base hidden sm:block">SIMPB - CV. Amrita Jayasri</h2>
              <h2 className="font-bold text-[#1E232C] text-sm sm:hidden">Edit Barang</h2>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative w-48 lg:w-72 hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Cari..." className="w-full pl-11 pr-4 py-2.5 bg-[#F4F7FC] border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-[#5452F6] transition-all" />
              </div>
              
              <button className="relative text-gray-500">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
              <div className="flex items-center gap-2.5 cursor-pointer">
                <CircleUser className="w-7 h-7 md:w-8 md:h-8 text-[#5452F6]" strokeWidth={1.5} />
                <span className="text-sm font-semibold text-[#1E232C] hidden lg:block">Admin</span>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-12 w-full text-left">
            
            {/* Breadcrumbs & Title */}
            <div className="mb-6 md:mb-8">
              <p className="text-[10px] md:text-xs font-medium text-gray-400 mb-1 md:mb-2">
                Data Barang <span className="mx-1 md:mx-2">›</span> <span className="text-gray-800 font-bold">Edit Barang</span>
              </p>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Edit Informasi Barang</h1>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Perbarui informasi barang di sistem inventaris.</p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-3 md:p-4 rounded-xl flex items-center gap-3 bg-red-50 text-red-600 border border-red-100">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                <span className="text-xs md:text-sm font-bold">{errorMessage}</span>
              </div>
            )}

            <div className="bg-white rounded-[20px] md:rounded-[24px] shadow-sm border border-gray-100 p-5 md:p-8 mb-8 relative">
              
              {isFetchingData && (
                <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-[20px] md:rounded-[24px]">
                  <Loader2 className="w-8 h-8 text-[#5452F6] animate-spin mb-4" />
                  <p className="text-sm font-bold text-gray-500">Memuat detail barang...</p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                
                {/* Kolom Kiri: Foto & ID */}
                <div className="lg:col-span-4 flex flex-col items-center">
                  <div 
                    onClick={() => document.getElementById('input-foto').click()}
                    className="w-full max-w-[280px] lg:max-w-none aspect-square bg-[#F4F7FC] rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group mb-6 relative overflow-hidden"
                  >
                    {previewFoto ? (
                      <>
                        <img src={previewFoto} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          onClick={handleRemoveFoto}
                          className="absolute top-2 right-2 md:top-3 md:right-3 bg-red-500 text-white p-1.5 md:p-2 rounded-full hover:bg-red-600 shadow-md"
                        >
                          <X className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={3} />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-3">
                          <Camera className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                        </div>
                        <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider text-center px-4">
                          Unggah Foto<br/>
                          <span className="text-[8px] md:text-[9px] font-medium opacity-70">(Maks 2MB)</span>
                        </p>
                      </>
                    )}
                    <input id="input-foto" type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
                  </div>

                  <div className="w-full max-w-[280px] lg:max-w-none">
                    <label className="block text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 md:mb-2">ID REFERENSI</label>
                    <div className="flex items-center justify-between bg-[#E9ECF5] px-4 py-2.5 md:py-3 rounded-xl border border-gray-100">
                      <span className="text-xs md:text-sm font-bold text-gray-700">{idReferensi}</span>
                      <Lock className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan: Input Fields */}
                <div className="lg:col-span-8 space-y-4 md:space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5 md:mb-2">Nama Barang <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={namaBarang}
                      onChange={(e) => setNamaBarang(e.target.value)}
                      disabled={isSaving}
                      placeholder="Nama barang..." 
                      className="w-full px-4 py-2.5 md:py-3 bg-[#F4F7FC] border-transparent rounded-xl text-xs md:text-sm focus:bg-white focus:border-[#5452F6] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5 md:mb-2">Kategori <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select 
                          value={kategori}
                          onChange={(e) => setKategori(e.target.value)}
                          className="w-full px-4 py-2.5 md:py-3 bg-[#F4F7FC] border-transparent rounded-xl text-xs md:text-sm appearance-none cursor-pointer"
                        >
                          <option value="" disabled>Pilih Kategori</option>
                          <option value="Kertas & Media">Kertas & Media</option>
                          <option value="Alat Tulis">Alat Tulis</option>
                          <option value="Tinta & Toner">Tinta & Toner</option>
                          <option value="Arsip & Penyimpanan">Arsip & Penyimpanan</option>
                          <option value="Aksesoris Meja">Aksesoris Meja</option>
                          <option value="Buku & Jurnal">Buku & Jurnal</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5 md:mb-2">Satuan <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select 
                          value={satuan}
                          onChange={(e) => setSatuan(e.target.value)}
                          className="w-full px-4 py-2.5 md:py-3 bg-[#F4F7FC] border-transparent rounded-xl text-xs md:text-sm appearance-none cursor-pointer"
                        >
                          <option value="" disabled>Pilih Satuan</option>
                          <option value="Rim">Rim</option>
                          <option value="Box">Box</option>
                          <option value="Pcs">Pcs</option>
                          <option value="Pack">Pack</option>
                          <option value="Lusin">Lusin</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5 md:mb-2">Harga <span className="text-red-500">*</span></label>
                      <div className="flex items-center bg-[#F4F7FC] px-4 py-2.5 md:py-3 rounded-xl focus-within:bg-white focus-within:ring-1 focus-within:ring-[#5452F6]">
                        <span className="text-xs md:text-sm text-gray-400 font-bold mr-2">Rp</span>
                        <input type="number" value={harga} onChange={(e) => setHarga(e.target.value)} className="bg-transparent w-full text-xs md:text-sm outline-none" placeholder="0" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6 bg-[#F4F7FC]/50 rounded-2xl border border-gray-50">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5 md:mb-2">Stok Saat Ini <span className="text-red-500">*</span></label>
                      <div className="flex items-center bg-white border border-gray-100 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-[#5452F6]">
                        <input type="number" value={stok} onChange={(e) => setStok(e.target.value)} className="flex-1 px-4 py-2.5 md:py-3 text-xs md:text-sm outline-none" placeholder="0" />
                        <div className="bg-gray-100 px-3 md:px-4 py-2.5 md:py-3 text-[9px] md:text-[10px] font-bold text-gray-500 uppercase">{satuan || 'UNIT'}</div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 md:mb-2 text-[#D97706]">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <label className="text-xs font-bold">Ambang Minimum <span className="text-red-500">*</span></label>
                      </div>
                      <div className="flex items-center bg-white border border-gray-100 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-[#D97706]">
                        <input type="number" value={ambangBatas} onChange={(e) => setAmbangBatas(e.target.value)} className="flex-1 px-4 py-2.5 md:py-3 text-xs md:text-sm outline-none text-[#D97706] font-bold" placeholder="0" />
                        <div className="bg-orange-50 px-3 md:px-4 py-2.5 md:py-3 text-[9px] md:text-[10px] font-bold text-orange-600 border-l border-orange-100 uppercase">{satuan || 'UNIT'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Info className="w-3.5 h-3.5" />
                  <p className="text-[10px] md:text-[11px] font-medium">Data akan tercatat dalam riwayat log sistem.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => onNavigate('data-barang')}
                    disabled={isSaving}
                    className="flex-1 sm:flex-none px-6 md:px-8 py-2.5 md:py-3 text-xs md:text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleSimpan}
                    disabled={isSaving || isFetchingData}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 md:px-8 py-2.5 md:py-3 bg-[#5452F6] hover:bg-[#4341E3] text-white rounded-xl text-xs md:text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all disabled:bg-indigo-300"
                  >
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" /> : <Save className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                    {isSaving ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 md:mt-12 text-center px-4">
              <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">
                © 2026 CV. AMRITA JAYASRI • MANAJEMEN INVENTARIS BERKINERJA TINGGI
              </p>
            </div>
          </div>
        </main>
      </div>

      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={handleCloseModal} 
        itemName={savedItemName}
      />
    </>
  );
};

export default EditBarang;