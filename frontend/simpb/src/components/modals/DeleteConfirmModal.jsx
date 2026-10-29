import React from 'react';
import { AlertTriangle, X, Loader2, Trash2 } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop dengan Blur */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={!isDeleting ? onClose : undefined}
      ></div>

      {/* Modal Box Responsif */}
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[400px] max-h-[90vh] overflow-y-auto p-6 md:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200 scrollbar-hide">

        <div className="flex flex-col items-center text-center mt-2 md:mt-4">
          {/* Icon Peringatan dengan Efek Ring */}
          <div className="w-14 h-14 md:w-16 md:h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 ring-8 ring-red-50/50">
            <Trash2 className="w-7 h-7 md:w-8 md:h-8 text-red-500" />
          </div>

          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Hapus Data?</h3>
          
          <p className="text-xs md:text-sm text-gray-500 mb-6 md:mb-8 leading-relaxed px-1">
            Apakah Anda yakin ingin menghapus <br className="hidden md:block"/>
            <span className="font-bold text-gray-800 break-words">"{itemName}"</span>?<br/>
            Data yang dihapus tidak dapat dikembalikan lagi ke dalam sistem.
          </p>

          {/* Action Buttons - Stacked on Mobile, Row on Desktop */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <button 
              onClick={onClose}
              disabled={isDeleting}
              className="w-full sm:flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-700 font-bold text-xs md:text-sm rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 order-2 sm:order-1"
            >
              Batalkan
            </button>
            <button 
              onClick={onConfirm}
              disabled={isDeleting}
              className="w-full sm:flex-1 py-3 px-4 bg-red-500 text-white font-bold text-xs md:text-sm rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 disabled:opacity-70 order-1 sm:order-2"
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