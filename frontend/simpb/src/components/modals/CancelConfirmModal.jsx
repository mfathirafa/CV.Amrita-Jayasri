import React from 'react';
import { AlertTriangle } from 'lucide-react';

const CancelConfirmModal = ({ isOpen, onResume, onConfirmCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
      {/* Box Modal Responsif */}
      <div className="bg-white rounded-[24px] w-full max-w-[360px] p-6 md:p-8 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 overflow-hidden">
        
        {/* Ikon Peringatan - Ukuran menyesuaikan */}
        <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-4 md:mb-5">
          <AlertTriangle className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
        </div>
        
        {/* Teks Konfirmasi */}
        <h3 className="text-base md:text-lg font-bold text-gray-800 mb-2">Batalkan Perubahan?</h3>
        <p className="text-[10px] md:text-xs text-gray-500 mb-6 md:mb-8 leading-relaxed px-1 md:px-2">
          Apakah Anda yakin ingin membatalkan? Data yang telah Anda masukkan tidak akan disimpan di sistem.
        </p>
        
        {/* Tombol Aksi - Layout Kolom agar mudah di-tap di HP */}
        <div className="w-full flex flex-col gap-3">
          <button 
            onClick={onResume} 
            className="w-full py-3 bg-[#5452F6] hover:bg-[#4341E3] text-white rounded-xl text-xs md:text-sm font-bold shadow-lg shadow-indigo-500/30 active:scale-[0.98] transition-all"
          >
            Kembali Mengedit
          </button>
          <button 
            onClick={onConfirmCancel} 
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs md:text-sm font-bold active:scale-[0.98] transition-all"
          >
            Ya, Batalkan
          </button>
        </div>

      </div>
    </div>
  );
};

export default CancelConfirmModal;