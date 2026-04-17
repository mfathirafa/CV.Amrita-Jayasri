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
    if (errorMessage) setErrorMessage(''); // Hilangkan error saat user mulai ngetik lagi
  };

  // === FUNGSI POST DATA KE API ===
  const handleSubmit = async () => {
    // 1. Validasi sederhana
    if (!formData.name || !formData.address || !formData.phone) {
      setErrorMessage("Semua kolom wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const token = localStorage.getItem('token');
      const rawApiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const cleanApiUrl = rawApiUrl.replace(/\/$/, "");
      const baseApi = cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`;

      // 2. Mapping data sesuai permintaan Backend
      const payload = {
        nama_konsumen: formData.name,
        alamat: formData.address,
        no_telepon: formData.phone
      };

      // 3. Eksekusi fetch POST
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

      // 4. Handle respons dari server
      if (response.ok && json.success) {
        if (onSave) onSave(json.data); // Panggil onSave untuk refresh tabel di Konsumen.jsx
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
    if (isSubmitting) return; // Jangan bisa ditutup kalau lagi loading
    setShowCancelConfirm(true); 
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirm(false);
    setFormData({ name: '', address: '', phone: '' });
    setErrorMessage('');
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white rounded-[24px] w-full max-w-[480px] p-8 shadow-2xl relative animate-in zoom-in-95">
          
          <button 
            onClick={handleRequestClose} 
            disabled={isSubmitting}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-1 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-xl font-bold text-gray-800">Tambah Konsumen Baru</h2>
          <p className="text-xs text-gray-500 mt-1 mb-6">Lengkapi informasi pelanggan untuk pencatatan transaksi.</p>

          {/* Alert Error */}
          {errorMessage && (
            <div className="mb-6 flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 animate-in slide-in-from-top-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {errorMessage}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                NAMA KONSUMEN
              </label>
              <div className={`flex items-center bg-[#F4F7FC] px-4 py-3 rounded-xl focus-within:bg-white focus-within:ring-1 focus-within:ring-[#5452F6] transition-all ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
                <Building2 className="w-4 h-4 text-[#5452F6] mr-3 shrink-0" />
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange} 
                  placeholder="Masukkan nama resmi perusahaan/pelanggan" 
                  className="bg-transparent w-full text-sm outline-none font-medium text-gray-700" 
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                ALAMAT LENGKAP
              </label>
              <div className={`flex items-center bg-[#F4F7FC] px-4 py-3 rounded-xl focus-within:bg-white focus-within:ring-1 focus-within:ring-[#5452F6] transition-all ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
                <MapPin className="w-4 h-4 text-[#5452F6] mr-3 shrink-0" />
                <input 
                  type="text" name="address" value={formData.address} onChange={handleChange} 
                  placeholder="Jl. Contoh No. 123, Kota, Provinsi" 
                  className="bg-transparent w-full text-sm outline-none font-medium text-gray-700" 
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                NOMOR TELEPON
              </label>
              <div className={`flex items-center bg-[#F4F7FC] px-4 py-3 rounded-xl focus-within:bg-white focus-within:ring-1 focus-within:ring-[#5452F6] transition-all ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
                <Phone className="w-4 h-4 text-[#5452F6] mr-3 shrink-0" />
                <input 
                  type="text" name="phone" value={formData.phone} onChange={handleChange} 
                  placeholder="+62 XXX XXXX XXXX" 
                  className="bg-transparent w-full text-sm outline-none font-medium text-gray-700" 
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8 mb-6">
            <button 
              onClick={handleRequestClose} 
              disabled={isSubmitting}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="flex-1 py-3 bg-[#5452F6] hover:bg-[#4341E3] text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
                </>
              ) : (
                'Simpan Perubahan'
              )}
            </button>
          </div>

          <div className="flex items-start gap-2 text-[#5452F6] bg-indigo-50/50 p-3 rounded-lg border border-indigo-50">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="text-[10px] font-medium leading-relaxed">
              Konsumen yang ditambahkan akan melalui tahap verifikasi internal sebelum dapat digunakan dalam transaksi.
            </p>
          </div>

        </div>
      </div>

      <CancelConfirmModal isOpen={showCancelConfirm} onResume={() => setShowCancelConfirm(false)} onConfirmCancel={handleConfirmCancel} />
    </>
  );
};

export default TambahKonsumenModal;