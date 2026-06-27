import React, { useState } from 'react';
import { X, Building2, MapPin, Phone, Info, Loader2, AlertTriangle } from 'lucide-react';
import CancelConfirmModal from './CancelConfirmModal'; 

const TambahKonsumenModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: ''
  });

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(''); 
  };

  // === FUNGSI POST DATA KE API ===
  const handleSubmit = async () => {
    if (!formData.name || !formData.address || !formData.phone) {
      setErrorMessage("Semua kolom wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const token = localStorage.getItem('token');
      const rawApiUrl = import.meta.env.VITE_API_URL || 'https://cvamritajayasri.my.id/api';
      const cleanApiUrl = rawApiUrl.replace(/\/$/, "");
      const baseApi = cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`;

      const payload = {
        nama_konsumen: formData.name,
        alamat: formData.address,
        no_telepon: formData.phone
      };

      const response = await fetch(`${baseApi}/konsumen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const json = await response.json();

      if (response.ok && json.success) {
        if (onSave) onSave(json.data);
        setFormData({ name: '', address: '', phone: '' });
        onClose();
      } else {
        setErrorMessage(json.message || "Gagal menambahkan konsumen ke server.");
      }
    } catch (error) {
      console.error("Error Submitting Konsumen:", error);
      setErrorMessage("Terjadi kesalahan jaringan. Cek koneksi server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestClose = () => {
    if (isSubmitting) return; 
    // Jika ada input yang terisi, tampilkan konfirmasi batal
    if (formData.name || formData.address || formData.phone) {
      setShowCancelConfirm(true); 
    } else {
      onClose();
    }
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirm(false);
    setFormData({ name: '', address: '', phone: '' });
    setErrorMessage('');
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in text-left">
        {/* Container Modal Responsif */}
        <div className="bg-white rounded-[24px] w-full max-w-[480px] max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95 scrollbar-hide">
          
          {/* Tombol Close */}
          <button 
            onClick={handleRequestClose} 
            disabled={isSubmitting}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-gray-600 transition-colors p-1 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-lg md:text-xl font-bold text-gray-800">Tambah Konsumen Baru</h2>
          <p className="text-[10px] md:text-xs text-gray-500 mt-1 mb-6 md:mb-8">Lengkapi informasi pelanggan untuk pencatatan transaksi.</p>

          {/* Alert Error */}
          {errorMessage && (
            <div className="mb-6 flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-[10px] md:text-xs font-bold border border-red-100 animate-in slide-in-from-top-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {errorMessage}
            </div>
          )}

          <div className="space-y-4 md:space-y-5">
            {/* Nama Konsumen */}
            <div>
              <label className="block text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 md:mb-2">
                NAMA KONSUMEN
              </label>
              <div className={`flex items-center bg-[#F4F7FC] px-3 md:px-4 py-2.5 md:py-3 rounded-xl focus-within:bg-white focus-within:ring-1 focus-within:ring-[#5452F6] transition-all border border-transparent focus-within:border-indigo-100 ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
                <Building2 className="w-4 h-4 text-[#5452F6] mr-3 shrink-0" />
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange} 
                  placeholder="Nama resmi perusahaan/pelanggan" 
                  className="bg-transparent w-full text-xs md:text-sm outline-none font-medium text-gray-700" 
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            {/* Alamat */}
            <div>
              <label className="block text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 md:mb-2">
                ALAMAT LENGKAP
              </label>
              <div className={`flex items-center bg-[#F4F7FC] px-3 md:px-4 py-2.5 md:py-3 rounded-xl focus-within:bg-white focus-within:ring-1 focus-within:ring-[#5452F6] transition-all border border-transparent focus-within:border-indigo-100 ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
                <MapPin className="w-4 h-4 text-[#5452F6] mr-3 shrink-0" />
                <input 
                  type="text" name="address" value={formData.address} onChange={handleChange} 
                  placeholder="Jl. Contoh No. 123, Kota, Provinsi" 
                  className="bg-transparent w-full text-xs md:text-sm outline-none font-medium text-gray-700" 
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Nomor Telepon */}
            <div>
              <label className="block text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 md:mb-2">
                NOMOR TELEPON
              </label>
              <div className={`flex items-center bg-[#F4F7FC] px-3 md:px-4 py-2.5 md:py-3 rounded-xl focus-within:bg-white focus-within:ring-1 focus-within:ring-[#5452F6] transition-all border border-transparent focus-within:border-indigo-100 ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
                <Phone className="w-4 h-4 text-[#5452F6] mr-3 shrink-0" />
                <input 
                  type="text" name="phone" value={formData.phone} onChange={handleChange} 
                  placeholder="+62 XXX XXXX XXXX" 
                  className="bg-transparent w-full text-xs md:text-sm outline-none font-medium text-gray-700" 
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Tombol Aksi - Stacked di Mobile, Row di Desktop */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-8 mb-6">
            <button 
              onClick={handleRequestClose} 
              disabled={isSubmitting}
              className="w-full sm:flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs md:text-sm font-bold transition-colors disabled:opacity-50 order-2 sm:order-1"
            >
              Batal
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="w-full sm:flex-1 py-3 bg-[#5452F6] hover:bg-[#4341E3] text-white rounded-xl text-xs md:text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed order-1 sm:order-2"
            >
              {isSubmitting ? (
                <><Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" /> Menyimpan...</>
              ) : (
                'Simpan Data'
              )}
            </button>
          </div>

          {/* Info Box */}
          <div className="flex items-start gap-2 text-[#5452F6] bg-indigo-50/50 p-3 rounded-lg border border-indigo-50">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <p className="text-[9px] md:text-[10px] font-medium leading-relaxed">
              Konsumen yang ditambahkan akan melalui tahap verifikasi internal sebelum dapat digunakan dalam transaksi.
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

export default TambahKonsumenModal;