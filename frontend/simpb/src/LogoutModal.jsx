import React from 'react';
import { LogOut, X } from 'lucide-react';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      {/* Animasi masuk sederhana */}
      <div className="bg-white rounded-[24px] shadow-xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in duration-200">
        
        {/* Tombol Close (X) di pojok */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
            <LogOut className="w-8 h-8 ml-1" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Konfirmasi Keluar</h3>
          <p className="text-sm text-gray-500 mb-6">
            Apakah Anda yakin ingin keluar dari Sistem Inventaris Amrita? Anda harus login kembali untuk masuk.
          </p>
          
          <div className="flex items-center w-full gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-bold transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold shadow-md shadow-red-200 transition-colors"
            >
              Ya, Keluar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LogoutModal;