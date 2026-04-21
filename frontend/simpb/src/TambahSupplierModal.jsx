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

  // === FUNGSI SUBMIT KE API BACKEND ===
  const handleSubmit = async () => {
    // 1. Validasi sederhana
    if (!formData.name || !formData.address || !formData.phone) {
      alert("Harap lengkapi semua kolom yang wajib diisi!");
      return;
    }

    setIsLoading(true);

    // 2. Siapkan data sesuai format database/API
    const payload = {
      nama_supplier: formData.name,
      alamat: formData.address,
      no_telepon: formData.phone
    };

    try {
      const token = localStorage.getItem('token');
      const rawApiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const cleanApiUrl = rawApiUrl.replace(/\/$/, ""); 
      const endpoint = cleanApiUrl.endsWith('/api') ? `${cleanApiUrl}/supplier` : `${cleanApiUrl}/api/supplier`;

      // 3. Tembak API POST
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
        // === POP-UP ALERT DIHILANGKAN DI SINI ===
        // alert("Supplier berhasil ditambahkan!"); 
        
        // Reset form setelah sukses
        setFormData({ name: '', address: '', phone: '' });
        
        // Kirim data kembali ke komponen parent (Pemasok.jsx) dan tutup modal
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white rounded-[24px] w-full max-w-[480px] p-8 shadow-2xl relative animate-in zoom-in-95">
          
          <button 
            onClick={handleRequestClose} 
            disabled={isLoading}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-1 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-xl font-bold text-gray-800">Tambah Supplier Baru</h2>
          <p className="text-xs text-gray-500 mt-1 mb-8">Lengkapi informasi vendor untuk pendaftaran aset.</p>

          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                NAMA SUPPLIER
              </label>
              <div className="flex items-center bg-[#F4F7FC] px-4 py-3 rounded-xl focus-within:bg-white focus-within:ring-1 focus-within:ring-[#5452F6] transition-all">
                <Building2 className="w-4 h-4 text-[#5452F6] mr-3 shrink-0" />
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  disabled={isLoading}
                  placeholder="Masukkan nama resmi perusahaan" 
                  className="bg-transparent w-full text-sm outline-none font-medium text-gray-700 disabled:opacity-50" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                ALAMAT LENGKAP
              </label>
              <div className="flex items-center bg-[#F4F7FC] px-4 py-3 rounded-xl focus-within:bg-white focus-within:ring-1 focus-within:ring-[#5452F6] transition-all">
                <MapPin className="w-4 h-4 text-[#5452F6] mr-3 shrink-0" />
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  disabled={isLoading}
                  placeholder="Jl. Contoh No. 123, Kota, Provinsi" 
                  className="bg-transparent w-full text-sm outline-none font-medium text-gray-700 disabled:opacity-50" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                NOMOR TELEPON
              </label>
              <div className="flex items-center bg-[#F4F7FC] px-4 py-3 rounded-xl focus-within:bg-white focus-within:ring-1 focus-within:ring-[#5452F6] transition-all">
                <Phone className="w-4 h-4 text-[#5452F6] mr-3 shrink-0" />
                <input 
                  type="text" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  disabled={isLoading}
                  placeholder="+62 XXX XXXX XXXX" 
                  className="bg-transparent w-full text-sm outline-none font-medium text-gray-700 disabled:opacity-50" 
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8 mb-6">
            <button 
              onClick={handleRequestClose} 
              disabled={isLoading}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="flex-1 py-3 bg-[#5452F6] hover:bg-[#4341E3] text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
              ) : (
                'Simpan Perubahan'
              )}
            </button>
          </div>

          <div className="flex items-start gap-2 text-[#5452F6] bg-indigo-50/50 p-3 rounded-lg border border-indigo-50">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="text-[10px] font-medium leading-relaxed">
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