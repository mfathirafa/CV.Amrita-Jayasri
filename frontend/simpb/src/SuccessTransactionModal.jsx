import React from 'react';
import { Check, FileText } from 'lucide-react';

const SuccessTransactionModal = ({ isOpen, onClose, onNavigate, transactionData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[24px] w-full max-w-[400px] p-8 shadow-2xl relative animate-in zoom-in-95 flex flex-col items-center text-center">

        {/* Icon Sukses */}
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-5">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-md shadow-emerald-500/30">
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          </div>
        </div>

        {/* Teks Konfirmasi */}
        <h2 className="text-xl font-bold text-gray-800 mb-2">Transaksi Berhasil Disimpan!</h2>
        <p className="text-xs text-gray-500 mb-6">Stok telah diperbarui secara real-time.</p>

        {/* Detail Transaksi Box */}
        <div className="w-full bg-[#F4F7FC] rounded-xl p-4 text-left mb-8 border border-gray-100">
          <div className="flex justify-between items-center mb-3 border-b border-gray-200 pb-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID TRANSAKSI</span>
            <span className="text-xs font-black text-[#5452F6]">{transactionData?.id || '#TRX-99021'}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">BARANG</span>
            <span className="text-xs font-bold text-gray-800 text-right max-w-[150px] truncate">{transactionData?.barang || 'Pilih Barang...'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">JUMLAH</span>
            <span className="text-xs font-bold text-gray-800">{transactionData?.jumlah || '0'} Unit</span>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="w-full flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-bold transition-colors"
          >
            Kembali
          </button>
          <button
            onClick={() => {
              onClose();
              onNavigate('laporan');
            }}
            className="flex-1 py-3 bg-[#5452F6] hover:bg-[#4341E3] text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" /> Lihat Laporan
          </button>
        </div>

      </div>
    </div>
  );
};

export default SuccessTransactionModal;