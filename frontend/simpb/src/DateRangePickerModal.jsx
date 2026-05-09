import React, { useState, useEffect } from 'react';
import { X, Calendar, ChevronLeft, ChevronRight, ArrowRight, Info, Check } from 'lucide-react';

// === KOMPONEN MODAL KONFIRMASI (RESPONSIF) ===
const ConfirmFilterModal = ({ isOpen, onClose, onConfirm, startDate, endDate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-[24px] w-full max-w-[360px] p-6 md:p-8 shadow-2xl animate-in zoom-in-95 text-left">
        <h2 className="text-xl font-bold text-[#1E232C]">Konfirmasi Filter?</h2>
        <p className="text-xs md:text-sm text-gray-500 mt-2">Terapkan filter untuk periode ini?</p>
        
        <div className="mt-6 mb-8">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Rentang waktu dipilih</p>
          <div className="bg-[#EEF2FF] rounded-2xl p-4 flex flex-col gap-2 border border-indigo-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <Calendar className="w-4 h-4 text-[#5452F6]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#5452F6] uppercase">Periode</span>
                <span className="text-xs font-bold text-gray-800 leading-tight">
                  {startDate} <br className="sm:hidden" /> — {endDate}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
            Batal
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-[#5452F6] hover:bg-[#4341E3] text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95">
            Ya, Terapkan
          </button>
        </div>
      </div>
    </div>
  );
};

// === KOMPONEN UTAMA KALENDER (RESPONSIF) ===
const DateRangePickerModal = ({ isOpen, onClose, onApply }) => {
  const [activeFilter, setActiveFilter] = useState('Minggu Ini');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [baseDate, setBaseDate] = useState(new Date());
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

    if (filter === 'Minggu Ini') {
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
    } else if (date < startDate) {
      setStartDate(date);
      setEndDate(null);
    } else {
      setEndDate(date);
    }
  };

  const handlePrevMonth = () => setBaseDate(new Date(baseDate.getFullYear(), baseDate.getMonth() - 1, 1));
  const handleNextMonth = () => setBaseDate(new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 1));

  const formatDisplayDate = (date) => {
    if (!date) return '-';
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const renderCalendarMonth = (year, month) => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const days = [];

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, isCurrentMonth: false, date: new Date(year, month - 1, daysInPrevMonth - i) });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) });
    }
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(year, month + 1, i) });
    }

    return (
      <div className="grid grid-cols-7 gap-y-1 text-center mt-2">
        {['M', 'S', 'S', 'R', 'K', 'J', 'S'].map(day => (
          <div key={day} className="text-[10px] font-bold text-[#A0AEC0] py-2">{day}</div>
        ))}
        {days.map((item, idx) => {
          const time = item.date.getTime();
          const startTime = startDate ? startDate.getTime() : null;
          const endTime = endDate ? endDate.getTime() : null;
          const isStart = startTime === time;
          const isEnd = endTime === time;
          const isInRange = startTime && endTime && time > startTime && time < endTime;

          return (
            <div key={idx} className="relative py-1 flex justify-center items-center h-9 sm:h-10" onClick={() => handleDateClick(item.date)}>
              {isInRange && <div className="absolute inset-0 bg-[#EEF2FF]"></div>}
              {isStart && endTime && <div className="absolute inset-y-0 right-0 left-1/2 bg-[#EEF2FF]"></div>}
              {isEnd && startTime && <div className="absolute inset-y-0 left-0 right-1/2 bg-[#EEF2FF]"></div>}

              <div className={`relative w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-[11px] md:text-xs font-bold rounded-full cursor-pointer transition-all ${
                isStart || isEnd ? 'bg-[#5452F6] text-white shadow-lg z-10 scale-110' : isInRange ? 'text-[#5452F6]' : item.isCurrentMonth ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300'
              }`}>
                {item.day}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (!isOpen) return null;

  const leftMonth = baseDate;
  const rightMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 1);

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in transition-all">
        <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[720px] max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
          
          {/* HEADER */}
          <div className="px-5 md:px-6 py-4 md:py-5 flex justify-between items-start border-b border-gray-100 text-left">
            <div>
              <h2 className="text-base md:text-lg font-bold text-[#1E232C]">Rentang Waktu</h2>
              <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">Tentukan periode data laporan.</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row overflow-y-auto scrollbar-hide">
            {/* SIDEBAR CEPAT - Horizontal di HP, Vertikal di Desktop */}
            <div className="w-full md:w-[180px] border-b md:border-b-0 md:border-r border-gray-100 p-3 md:p-4 flex flex-row md:flex-col gap-2 bg-[#FAFBFC] overflow-x-auto scrollbar-hide shrink-0">
              <p className="hidden md:block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">Cepat</p>
              
              {['Hari Ini', 'Minggu Ini', 'Bulan Ini', 'Tahun Ini'].map((item) => (
                <button 
                  key={item}
                  onClick={() => handleQuickFilter(item)}
                  className={`whitespace-nowrap px-4 md:px-3 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs transition-all flex items-center justify-between border ${
                    activeFilter === item ? 'font-bold text-[#5452F6] bg-white border-indigo-100 shadow-sm' : 'font-medium text-gray-500 border-transparent hover:bg-gray-100'
                  }`}
                >
                  {item}
                  {activeFilter === item && <Check className="w-3 h-3 ml-2 hidden md:block" />}
                </button>
              ))}
              <button 
                onClick={() => setActiveFilter('Custom')}
                className={`whitespace-nowrap px-4 md:px-3 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs flex items-center gap-2 border transition-all ${
                  activeFilter === 'Custom' ? 'font-bold text-[#5452F6] bg-white border-indigo-100 shadow-sm' : 'font-medium text-gray-500 border-transparent hover:bg-gray-100'
                }`}
              >
                <Calendar className="w-3 h-3" /> Custom
              </button>
            </div>

            {/* AREA KALENDER */}
            <div className="flex-1 p-4 md:p-6 flex flex-col justify-between bg-white text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Kalender 1 (Selalu Muncul) */}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2 px-2">
                    <button onClick={handlePrevMonth} className="text-gray-400 hover:text-[#5452F6] p-1"><ChevronLeft className="w-4 h-4" /></button>
                    <h3 className="text-[11px] md:text-xs font-bold text-gray-800">{monthNames[leftMonth.getMonth()]} {leftMonth.getFullYear()}</h3>
                    <div className="w-6 md:hidden"></div> {/* Spacer di HP */}
                  </div>
                  {renderCalendarMonth(leftMonth.getFullYear(), leftMonth.getMonth())}
                </div>

                {/* Kalender 2 (Hanya muncul di Layar Lebar) */}
                <div className="flex-1 hidden md:block">
                  <div className="flex justify-between items-center mb-2 px-2">
                    <div className="w-4"></div>
                    <h3 className="text-xs font-bold text-gray-800">{monthNames[rightMonth.getMonth()]} {rightMonth.getFullYear()}</h3>
                    <button onClick={handleNextMonth} className="text-gray-400 hover:text-[#5452F6] p-1"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                  {renderCalendarMonth(rightMonth.getFullYear(), rightMonth.getMonth())}
                </div>
              </div>

              {/* Input Mulai & Selesai - Stack di HP */}
              <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-3 mt-6 pt-5 border-t border-gray-100">
                <div className="w-full sm:flex-1">
                  <label className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Mulai</label>
                  <div className="bg-[#F4F7FC] rounded-lg px-3 py-2 text-[11px] md:text-xs font-bold text-gray-800 border border-transparent">
                    {formatDisplayDate(startDate)}
                  </div>
                </div>
                <div className="hidden sm:block mt-5 text-gray-300">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <div className="w-full sm:flex-1">
                  <label className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Selesai</label>
                  <div className="bg-[#F4F7FC] rounded-lg px-3 py-2 text-[11px] md:text-xs font-bold text-gray-800 border border-transparent">
                    {formatDisplayDate(endDate || startDate)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="px-5 md:px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-white">
            <div className="hidden sm:flex items-center gap-2 text-gray-400">
              <Info className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium">Data visual akan terupdate otomatis.</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button onClick={onClose} className="flex-1 sm:flex-none px-6 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
                Batal
              </button>
              <button 
                onClick={() => setShowConfirmModal(true)}
                disabled={!startDate}
                className="flex-[2] sm:flex-none px-6 py-2.5 bg-[#5452F6] hover:bg-[#4341E3] text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all active:scale-95"
              >
                Terapkan Filter
              </button>
            </div>
          </div>

        </div>
      </div>

      <ConfirmFilterModal 
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false);
          onApply({ start: startDate, end: endDate || startDate, label: activeFilter });
          onClose();
        }}
        startDate={formatDisplayDate(startDate)}
        endDate={formatDisplayDate(endDate || startDate)}
      />
    </>
  );
};

export default DateRangePickerModal;