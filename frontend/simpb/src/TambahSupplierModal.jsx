import React, { useState } from 'react';
import { X, Building2, MapPin, Phone, Info, Loader2 } from 'lucide-react'; 
import CancelConfirmModal from './CancelConfirmModal';

const TambahSupplierModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: ''
  });

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.address || !formData.phone) {
      alert("Harap lengkapi semua kolom yang wajib diisi!");
      return;
    }

    setIsLoading(true);

    const payload = {
      nama_supplier: formData.name,
      alamat: formData.address,
      no_telepon: formData.phone
    };

    try {
      const token = localStorage.getItem('token');
      const rawApiUrl = import.meta.env.VITE_API_URL || 'https://cvamritajayasri.my.id/api';
      const cleanApiUrl = rawApiUrl.replace(/\/$/, ""); 
      const endpoint = cleanApiUrl.endsWith('/api') ? `${cleanApiUrl}/supplier` : `${cleanApiUrl}/api/supplier`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormData({ name: '', address: '', phone: '' });
        if (onSave) onSave(data.data); 
        onClose();
      } else {
        alert("Gagal menambahkan: " + (data.message || "Periksa kembali data Anda."));
      }
    } catch (error) {
      console.error("Error Saving:", error);
      alert("Terjadi kesalahan jaringan saat menyimpan data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestClose = () => {
    if (formData.name !== '' || formData.address !== '' || formData.phone !== '') {
      setShowCancelConfirm(true);
    } else {
      onClose();
    }
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirm(false); 
    setFormData({ name: '', address: '', phone: '' }); 
    onClose(); 
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
        {/* Modal Container Responsif */}
        <div className="bg-white rounded-[24px] w-full max-w-[480px] max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95 scrollbar-hide text-left">
          
          <button 
            onClick={handleRequestClose} 
            disabled={isLoading}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-gray-600 transition-colors p-1 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-lg md:text-xl font-bold text-gray-800">Tambah Supplier Baru</h2>
          <p className="text-[10px] md:text-xs text-gray-500 mt-1 mb-6 md:mb-8">Lengkapi informasi vendor untuk pendaftaran aset.</p>

          <div className="space-y-4 md:space-y-5">
            {/* Input Nama */}
            <div>
              <label className="block text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 md:mb-2">
                NAMA SUPPLIER
              </label>
              <div className="flex items-center bg-[#F4F7FC] px-3 md:px-4 py-2.5 md:py-3 rounded-xl focus-within:bg-white focus-within:ring-1 focus-within:ring-[#5452F6] transition-all border border-transparent focus-within:border-indigo-100">
                <Building2 className="w-4 h-4 text-[#5452F6] mr-3 shrink-0" />
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  disabled={isLoading}
                  placeholder="Nama resmi perusahaan" 
                  className="bg-transparent w-full text-xs md:text-sm outline-none font-medium text-gray-700 disabled:opacity-50" 
                />
              </div>
            </div>
            
            {/* Input Alamat */}
            <div>
              <label className="block text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 md:mb-2">
                ALAMAT LENGKAP
              </label>
              <div className="flex items-center bg-[#F4F7FC] px-3 md:px-4 py-2.5 md:py-3 rounded-xl focus-within:bg-white focus-within:ring-1 focus-within:ring-[#5452F6] transition-all border border-transparent focus-within:border-indigo-100">
                <MapPin className="w-4 h-4 text-[#5452F6] mr-3 shrink-0" />
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  disabled={isLoading}
                  placeholder="Jl. Contoh No. 123, Kota..." 
                  className="bg-transparent w-full text-xs md:text-sm outline-none font-medium text-gray-700 disabled:opacity-50" 
                />
              </div>
            </div>

            {/* Input Telepon */}
            <div>
              <label className="block text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 md:mb-2">
                NOMOR TELEPON
              </label>
              <div className="flex items-center bg-[#F4F7FC] px-3 md:px-4 py-2.5 md:py-3 rounded-xl focus-within:bg-white focus-within:ring-1 focus-within:ring-[#5452F6] transition-all border border-transparent focus-within:border-indigo-100">
                <Phone className="w-4 h-4 text-[#5452F6] mr-3 shrink-0" />
                <input 
                  type="text" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  disabled={isLoading}
                  placeholder="+62 XXX XXXX XXXX" 
                  className="bg-transparent w-full text-xs md:text-sm outline-none font-medium text-gray-700 disabled:opacity-50" 
                />
              </div>
            </div>
          </div>

          {/* Tombol Aksi Responsif */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-8 mb-6">
            <button 
              onClick={handleRequestClose} 
              disabled={isLoading}
              className="w-full sm:flex-1 py-2.5 md:py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs md:text-sm font-bold transition-colors disabled:opacity-50 order-2 sm:order-1"
            >
              Batal
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="w-full sm:flex-1 py-2.5 md:py-3 bg-[#5452F6] hover:bg-[#4341E3] text-white rounded-xl text-xs md:text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 order-1 sm:order-2"
            >
              {isLoading ? (
                <><Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" /> Menyimpan...</>
              ) : (
                'Simpan Perubahan'
              )}
            </button>
          </div>

          {/* Info Box */}
          <div className="flex items-start gap-2 text-[#5452F6] bg-indigo-50/50 p-3 rounded-lg border border-indigo-50">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <p className="text-[9px] md:text-[10px] font-medium leading-relaxed">
              Supplier yang ditambahkan akan melalui tahap verifikasi internal sebelum dapat digunakan dalam transaksi procurement.
            </p>
          </div>

        </div>
      </div>

      <CancelConfirmModal 
        isOpen={showCancelConfirm}
        onResume={() => setShowCancelConfirm(false)} 
        onConfirmCancel={handleConfirmCancel} 
      />
    </>
  );
};

export default TambahSupplierModal;