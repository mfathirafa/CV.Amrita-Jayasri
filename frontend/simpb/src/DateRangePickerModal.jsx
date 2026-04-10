import React, { useState, useEffect } from 'react';
import { X, Calendar, ChevronLeft, ChevronRight, ArrowRight, Info } from 'lucide-react';

// === KOMPONEN BARU: MODAL KONFIRMASI INTERNAL ===
const ConfirmFilterModal = ({ isOpen, onClose, onConfirm, startDate, endDate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[20px] w-full max-w-[360px] p-6 shadow-xl animate-in zoom-in-95">
        
        {/* Header Konfirmasi */}
        <h2 className="text-xl font-bold text-[#1E232C]">Konfirmasi Filter ?</h2>
        <p className="text-sm text-gray-500 mt-2">Terapkan filter untuk periode ini ?</p>
        
        {/* Detail Rentang Waktu */}
        <div className="mt-6 mb-8">
          <p className="text-xs font-bold text-gray-500 mb-2">Rentang waktu yang dipilih</p>
          <div className="bg-[#EEF2FF] rounded-xl p-4 flex items-center gap-3 border border-indigo-50">
            <Calendar className="w-5 h-5 text-gray-700" />
            <span className="text-sm font-bold text-gray-800">
              {startDate && endDate ? `${startDate} - ${endDate}` : 'Periode Tidak Valid'}
            </span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-auto">
          <button 
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-bold text-gray-800 hover:text-gray-500 transition-colors"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm}
            className="px-6 py-2.5 bg-[#5452F6] hover:bg-[#4341E3] text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-200 transition-colors"
          >
            Ya, Terapkan
          </button>
        </div>

      </div>
    </div>
  );
};

// === KOMPONEN UTAMA KALENDER ===
const DateRangePickerModal = ({ isOpen, onClose, onApply }) => {
  const [activeFilter, setActiveFilter] = useState('Minggu Ini');
  
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  const [baseDate, setBaseDate] = useState(new Date());

  // === STATE BARU UNTUK KONTROL MODAL KONFIRMASI ===
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  useEffect(() => {
    if (isOpen && !startDate) {
      handleQuickFilter('Minggu Ini');
    }
  }, [isOpen]);

  const handleQuickFilter = (filter) => {
    setActiveFilter(filter);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let start = new Date(now);
    let end = new Date(now);

    if (filter === 'Hari Ini') {
      // Start & End adalah hari ini
    } else if (filter === 'Minggu Ini') {
      const day = now.getDay();
      start.setDate(now.getDate() - day);
      end.setDate(start.getDate() + 6);
    } else if (filter === 'Bulan Ini') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (filter === 'Tahun Ini') {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31);
    }

    setStartDate(start);
    setEndDate(end);
    setBaseDate(start); 
  };

  const handleDateClick = (date) => {
    setActiveFilter('Custom');
    
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } 
    else if (date < startDate) {
      setStartDate(date);
      setEndDate(null);
    } 
    else {
      setEndDate(date);
    }
  };

  const handlePrevMonth = () => setBaseDate(new Date(baseDate.getFullYear(), baseDate.getMonth() - 1, 1));
  const handleNextMonth = () => setBaseDate(new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 1));

  const formatDisplayDate = (date) => {
    if (!date) return '-';
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const renderCalendarMonth = (year, month) => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Hari dari bulan sebelumnya
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({ 
        day: daysInPrevMonth - i, 
        isCurrentMonth: false, 
        date: new Date(year, month - 1, daysInPrevMonth - i) 
      });
    }

    // Hari di bulan saat ini
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ 
        day: i, 
        isCurrentMonth: true, 
        date: new Date(year, month, i) 
      });
    }

    // Hari dari bulan berikutnya
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ 
        day: i, 
        isCurrentMonth: false, 
        date: new Date(year, month + 1, i) 
      });
    }

    return (
      <div className="grid grid-cols-7 gap-y-2 text-center mt-2">
        {['MG', 'SN', 'SL', 'RB', 'KM', 'JM', 'SB'].map(day => (
          <div key={day} className="text-[10px] font-bold text-[#A0AEC0] uppercase mb-1">{day}</div>
        ))}
        
        {days.map((item, idx) => {
          const time = item.date.getTime();
          const startTime = startDate ? startDate.getTime() : null;
          const endTime = endDate ? endDate.getTime() : null;

          const isStart = startTime === time;
          const isEnd = endTime === time;
          const isInRange = startTime && endTime && time > startTime && time < endTime;

          let textColor = 'text-gray-800';
          if (!item.isCurrentMonth) textColor = 'text-gray-300';
          if (isStart || isEnd) textColor = 'text-white';

          return (
            <div key={idx} className="relative py-0.5 flex justify-center items-center h-8" onClick={() => handleDateClick(item.date)}>
              {isInRange && <div className="absolute inset-0 bg-[#EEF2FF]"></div>}
              {isStart && endTime && startTime !== endTime && <div className="absolute inset-y-0 right-0 left-1/2 bg-[#EEF2FF]"></div>}
              {isEnd && startTime !== endTime && <div className="absolute inset-y-0 left-0 right-1/2 bg-[#EEF2FF]"></div>}

              <div className={`relative w-8 h-8 flex items-center justify-center text-xs font-bold rounded-full cursor-pointer transition-all ${
                isStart || isEnd
                  ? 'bg-[#5452F6] shadow-md shadow-indigo-200 z-10'
                  : isInRange
                  ? 'bg-transparent'
                  : 'hover:bg-gray-100'
              } ${textColor}`}>
                {item.day}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // === FUNGSI BARU UNTUK MEMICU MODAL ===
  const handleTriggerConfirm = () => {
    setShowConfirmModal(true);
  };

  // === FUNGSI FINAL UNTUK MENERAPKAN FILTER SETELAH DIKONFIRMASI ===
  const handleFinalApply = () => {
    setShowConfirmModal(false); // Tutup modal konfirmasi
    if (onApply) {
      const finalEnd = endDate || startDate; 
      onApply({ start: startDate, end: finalEnd, label: activeFilter });
    }
    onClose(); // Tutup modal utama kalender
  };

  if (!isOpen) return null;

  const leftMonth = baseDate;
  const rightMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 1);

  return (
    <>
      {/* OVERLAY KALENDER UTAMA */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-all">
        {/* MAX-WIDTH DIKECILKAN JADI 720px */}
        <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[720px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
          
          {/* === HEADER === */}
          <div className="px-6 py-5 flex justify-between items-start border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-[#1E232C]">Pilih Rentang Waktu</h2>
              <p className="text-xs text-gray-500 mt-1">Tentukan periode data yang ingin ditampilkan pada laporan.</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-xl">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* === BODY === */}
          <div className="flex flex-col md:flex-row min-h-[380px]">
            
            {/* SIDEBAR CEPAT (Dikecilkan jadi 180px) */}
            <div className="w-full md:w-[180px] border-r border-gray-100 p-4 flex flex-col gap-1.5 bg-[#FAFBFC]">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">Cepat</p>
              
              {['Hari Ini', 'Minggu Ini', 'Bulan Ini', 'Tahun Ini'].map((item) => (
                <button 
                  key={item}
                  onClick={() => handleQuickFilter(item)}
                  className={`text-left px-3 py-2.5 rounded-xl text-xs transition-all flex justify-between items-center ${
                    activeFilter === item 
                    ? 'font-bold text-[#5452F6] bg-white shadow-sm border border-gray-100' 
                    : 'font-medium text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item}
                  {activeFilter === item && <span className="w-1.5 h-1.5 rounded-full bg-[#5452F6]"></span>}
                </button>
              ))}
              
              <div className="h-px bg-gray-200 my-2 mx-2"></div>
              
              <button 
                onClick={() => setActiveFilter('Custom')}
                className={`text-left px-3 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all ${
                  activeFilter === 'Custom'
                  ? 'font-bold text-[#5452F6] bg-white shadow-sm border border-gray-100' 
                  : 'font-medium text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Calendar className={`w-3.5 h-3.5 ${activeFilter === 'Custom' ? 'text-[#5452F6]' : 'text-gray-400'}`} /> Custom
              </button>
            </div>

            {/* AREA KALENDER & INPUT */}
            <div className="flex-1 p-6 flex flex-col justify-between bg-white">
              
              {/* Kalender Header & Grid */}
              <div className="flex gap-8"> {/* Gap antar kalender dikecilkan */}
                
                {/* Kalender Kiri */}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <button onClick={handlePrevMonth} className="text-gray-400 hover:text-[#5452F6] transition-colors p-1"><ChevronLeft className="w-4 h-4" /></button>
                    <h3 className="text-xs font-bold text-gray-800">{monthNames[leftMonth.getMonth()]} {leftMonth.getFullYear()}</h3>
                    <div className="w-4"></div>
                  </div>
                  {renderCalendarMonth(leftMonth.getFullYear(), leftMonth.getMonth())}
                </div>

                {/* Kalender Kanan */}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div className="w-4"></div>
                    <h3 className="text-xs font-bold text-gray-800">{monthNames[rightMonth.getMonth()]} {rightMonth.getFullYear()}</h3>
                    <button onClick={handleNextMonth} className="text-gray-400 hover:text-[#5452F6] transition-colors p-1"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                  {renderCalendarMonth(rightMonth.getFullYear(), rightMonth.getMonth())}
                </div>
              </div>

              {/* Area Input "Mulai" & "Selesai" (Padding dikecilkan) */}
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Mulai</label>
                  <div className="bg-[#F4F7FC] rounded-lg px-3 py-2 text-xs font-bold text-gray-800 w-full min-h-[36px] flex items-center">
                    {formatDisplayDate(startDate)}
                  </div>
                </div>
                <div className="mt-5 text-gray-300 px-1">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Selesai</label>
                  <div className="bg-[#F4F7FC] rounded-lg px-3 py-2 text-xs font-bold text-gray-800 w-full min-h-[36px] flex items-center">
                    {formatDisplayDate(endDate)}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* === FOOTER === */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-white">
            <div className="flex items-center gap-2 text-gray-500 hidden sm:flex">
              <Info className="w-4 h-4" />
              <span className="text-xs font-medium">Mempengaruhi semua visualisasi.</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button 
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              
              {/* TOMBOL INI SEKARANG MEMANGGIL handleTriggerConfirm */}
              <button 
                onClick={handleTriggerConfirm}
                disabled={!startDate}
                className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-[#5452F6] hover:bg-[#4341E3] shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:shadow-none"
              >
                Terapkan Filter
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* === KOMPONEN MODAL KONFIRMASI (Ditumpuk di atas jika showConfirmModal true) === */}
      <ConfirmFilterModal 
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleFinalApply}
        startDate={formatDisplayDate(startDate)}
        endDate={formatDisplayDate(endDate || startDate)}
      />
    </>
  );
};

export default DateRangePickerModal;