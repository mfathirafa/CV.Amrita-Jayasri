import React from 'react';
import { CheckCircle2, FileText } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-[420px] p-8 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Ikon Sukses */}
        <div className="w-24 h-24 bg-indigo-50/50 rounded-full flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-[#5452F6] rounded-full flex items-center justify-center shadow-lg shadow-indigo-200">
            <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Teks Judul & Deskripsi */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">Barang Berhasil Disimpan</h2>
        <p className="text-[13px] text-gray-500 mb-8 leading-relaxed px-4">
          Data peralatan kantor telah diperbarui dalam<br/>sistem inventaris secara real-time.
        </p>

        {/* Kotak Ringkasan Nama Barang */}
        <div className="w-full bg-[#F4F7FC] rounded-2xl p-4 flex items-center gap-4 mb-8 text-left border border-gray-50">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
            <FileText className="w-5 h-5 text-[#5452F6]" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">NAMA BARANG</p>
            <p className="text-sm font-bold text-gray-800 truncate">{itemName || 'Kertas HVS A4 80gr'}</p>
          </div>
        </div>

        {/* Tombol Selesai */}
        <button 
          onClick={onClose}
          className="w-full py-3.5 bg-[#5452F6] hover:bg-[#4341E3] text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all"
        >
          Selesai
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;