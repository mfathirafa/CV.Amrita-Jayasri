import React, { useState } from 'react';
import { FileText, Database, Calendar, Info, Download } from 'lucide-react';

const ExportModal = ({ isOpen, onClose, onExport }) => {
  const [selectedRange, setSelectedRange] = useState('semua');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  if (!isOpen) return null;

  const handleDownload = () => {
    if (onExport) {
      onExport({
        format: 'excel',
        range: selectedRange,
        startDate: selectedRange === 'custom' ? customStart : null,
        endDate: selectedRange === 'custom' ? customEnd : null
      });
    }
    onClose();
  };

  // Komponen untuk opsi standar (Semua Data, Bulan Ini)
  const StandardOption = ({ id, title, description, icon: Icon }) => {
    const isSelected = selectedRange === id;
    return (
      <div 
        onClick={() => setSelectedRange(id)}
        className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${
          isSelected 
            ? 'border-[#5452F6] bg-white shadow-sm shadow-indigo-100/50' 
            : 'border-transparent bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 shrink-0 transition-colors ${
          isSelected ? 'bg-indigo-50 text-[#5452F6]' : 'bg-white border border-gray-200 text-gray-500'
        }`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h4 className={`text-sm font-bold ${isSelected ? 'text-[#5452F6]' : 'text-gray-800'}`}>{title}</h4>
          <p className="text-[11px] text-gray-500 mt-0.5">{description}</p>
        </div>
        <div className="ml-4">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            isSelected ? 'border-[#5452F6]' : 'border-gray-300'
          }`}>
            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#5452F6]" />}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] w-full max-w-[400px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* === HEADER (Sesuai Desain Ungu) === */}
        <div className="bg-[#5452F6] p-6 relative overflow-hidden shrink-0">
          <div className="relative z-10 w-[85%]">
            <h2 className="text-xl font-bold text-white mb-2">Ekspor Data ke Excel</h2>
            <p className="text-xs text-white/80 leading-relaxed font-medium">
              Unduh laporan inventaris Anda dalam format file .xlsx untuk pengarsipan dan pengolahan data lanjut.
            </p>
          </div>
          {/* Ikon Dekoratif Background */}
          <FileText className="absolute -right-4 -bottom-4 w-28 h-28 text-white opacity-10 rotate-12 pointer-events-none" />
        </div>

        {/* === BODY === */}
        <div className="p-6 flex-1 overflow-y-auto scrollbar-hide">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Pilih Rentang Data</label>
          
          <div className="space-y-3">
            <StandardOption id="semua" title="Semua Data" description="Seluruh riwayat sejak awal sistem" icon={Database} />
            <StandardOption id="bulan_ini" title="Bulan Ini" description="Laporan transaksi untuk periode berjalan" icon={Calendar} />
            
            {/* Custom Range Option (Bordernya membungkus seluruh isi saat aktif) */}
            <div 
              className={`rounded-2xl border-2 transition-all overflow-hidden ${
                selectedRange === 'custom' 
                  ? 'border-[#5452F6] bg-white shadow-sm shadow-indigo-100/50' 
                  : 'border-transparent bg-gray-50 hover:bg-gray-100 cursor-pointer'
              }`}
            >
              <div 
                onClick={() => setSelectedRange('custom')}
                className="flex items-center p-4 cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 shrink-0 transition-colors ${
                  selectedRange === 'custom' ? 'bg-indigo-50 text-[#5452F6]' : 'bg-white border border-gray-200 text-gray-500'
                }`}>
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-bold ${selectedRange === 'custom' ? 'text-[#5452F6]' : 'text-gray-800'}`}>Custom Range</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Tentukan tanggal mulai dan akhir</p>
                </div>
                <div className="ml-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedRange === 'custom' ? 'border-[#5452F6]' : 'border-gray-300'
                  }`}>
                    {selectedRange === 'custom' && <div className="w-2.5 h-2.5 rounded-full bg-[#5452F6]" />}
                  </div>
                </div>
              </div>
              
              {/* Inputs for Custom Range (Hanya muncul jika dipilih) */}
              {selectedRange === 'custom' && (
                <div className="px-4 pb-4 pt-0 grid grid-cols-2 gap-3 animate-in slide-in-from-top-2">
                  <div>
                    <label className="text-[9px] font-bold text-[#5452F6] uppercase tracking-widest mb-1.5 block">Tanggal Mulai</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5452F6]" />
                      <input 
                        type="date" 
                        value={customStart} 
                        onChange={(e) => setCustomStart(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-indigo-100 rounded-xl text-[11px] font-bold text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#5452F6] focus:border-[#5452F6]" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-[#5452F6] uppercase tracking-widest mb-1.5 block">Tanggal Akhir</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5452F6]" />
                      <input 
                        type="date" 
                        value={customEnd} 
                        onChange={(e) => setCustomEnd(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-indigo-100 rounded-xl text-[11px] font-bold text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#5452F6] focus:border-[#5452F6]" 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Alert Box Orange */}
          <div className="mt-6 p-4 bg-[#FFF6ED] border border-[#FFE8D6] rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-[#E06A26] shrink-0 mt-0.5" />
            <p className="text-[11px] font-medium text-[#D97706] leading-relaxed">
              Proses pengunduhan mungkin memakan waktu beberapa saat tergantung pada volume data yang dipilih.
            </p>
          </div>
        </div>

        {/* === FOOTER === */}
        <div className="p-6 pt-0 flex gap-3 bg-white shrink-0">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-bold transition-colors"
          >
            Batal
          </button>
          <button 
            onClick={handleDownload}
            className="flex-[2] py-3.5 flex items-center justify-center gap-2 bg-[#5452F6] hover:bg-[#4341E3] text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/30"
          >
            <Download className="w-4 h-4" /> Unduh Excel
          </button>
        </div>

      </div>
    </div>
  );
};

export default ExportModal;