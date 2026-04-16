import React, { useState } from 'react';
import { X, Building2, MapPin, Phone, Info } from 'lucide-react';
import CancelConfirmModal from './CancelConfirmModal'; // Pastikan file ini ada

const TambahKonsumenModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: ''
  });

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (onSave) onSave(formData);
    setFormData({ name: '', address: '', phone: '' });
    onClose();
  };

  const handleRequestClose = () => {
    setShowCancelConfirm(true); // Selalu munculkan konfirmasi batal
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
          
          <button onClick={handleRequestClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-xl font-bold text-gray-800">Tambah Konsumen Baru</h2>
          <p className="text-xs text-gray-500 mt-1 mb-8">Lengkapi informasi pelanggan untuk pencatatan transaksi.</p>

          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                NAMA KONSUMEN
              </label>
              <div className="flex items-center bg-[#F4F7FC] px-4 py-3 rounded-xl focus-within:bg-white focus-within:ring-1 focus-within:ring-[#5452F6] transition-all">
                <Building2 className="w-4 h-4 text-[#5452F6] mr-3 shrink-0" />
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange} 
                  placeholder="Masukkan nama resmi perusahaan/pelanggan" 
                  className="bg-transparent w-full text-sm outline-none font-medium text-gray-700" 
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
                  type="text" name="address" value={formData.address} onChange={handleChange} 
                  placeholder="Jl. Contoh No. 123, Kota, Provinsi" 
                  className="bg-transparent w-full text-sm outline-none font-medium text-gray-700" 
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
                  type="text" name="phone" value={formData.phone} onChange={handleChange} 
                  placeholder="+62 XXX XXXX XXXX" 
                  className="bg-transparent w-full text-sm outline-none font-medium text-gray-700" 
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8 mb-6">
            <button onClick={handleRequestClose} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-bold transition-colors">
              Batal
            </button>
            <button onClick={handleSubmit} className="flex-1 py-3 bg-[#5452F6] hover:bg-[#4341E3] text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all">
              Simpan Perubahan
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