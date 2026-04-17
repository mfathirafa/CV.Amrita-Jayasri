import React from 'react';
import { AlertTriangle, X, Loader2, Trash2 } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={!isDeleting ? onClose : undefined}
      ></div>

      {/* Modal Box */}
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md p-6 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Tombol Close */}
        <button 
          onClick={onClose}
          disabled={isDeleting}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          {/* Icon Peringatan */}
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 ring-8 ring-red-50/50">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2">Hapus Data Barang?</h3>
          
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Apakah Anda yakin ingin menghapus <br/>
            <span className="font-bold text-gray-800">"{itemName}"</span>?<br/>
            Data yang dihapus tidak dapat dikembalikan lagi ke dalam sistem.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full">
            <button 
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batalkan
            </button>
            <button 
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 py-3 px-4 bg-red-500 text-white font-bold text-sm rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Menghapus...</>
              ) : (
                'Ya, Hapus Data'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;