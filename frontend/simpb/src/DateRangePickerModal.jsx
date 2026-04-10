import React, { useState } from 'react';
import { X, Calendar, ChevronLeft, ChevronRight, ArrowRight, Info } from 'lucide-react';

const DateRangePickerModal = ({ isOpen, onClose }) => {
  const [activeFilter, setActiveFilter] = useState('Minggu Ini');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[850px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="px-8 py-6 flex justify-between items-start border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-[#1E232C]">Pilih Rentang Waktu</h2>
            <p className="text-sm text-gray-500 mt-1">Tentukan periode data yang ingin ditampilkan pada laporan.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Modal */}
        <div className="flex flex-col md:flex-row h-[460px]">
          
          {/* Sidebar Pilihan Cepat */}
          <div className="w-full md:w-[240px] border-r border-gray-100 p-6 flex flex-col gap-2 bg-[#FAFBFC]">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Cepat</p>
            
            {['Hari Ini', 'Minggu Ini', 'Bulan Ini', 'Tahun Ini'].map((item) => (
              <button 
                key={item}
                onClick={() => setActiveFilter(item)}
                className={`text-left px-4 py-3 rounded-xl text-sm transition-all flex justify-between items-center ${
                  activeFilter === item 
                  ? 'font-bold text-[#5452F6] bg-white shadow-sm border border-gray-100' 
                  : 'font-semibold text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item}
                {activeFilter === item && <span className="w-1.5 h-1.5 rounded-full bg-[#5452F6]"></span>}
              </button>
            ))}
            
            <div className="h-px bg-gray-200 my-4 mx-2"></div>
            
            <button 
              onClick={() => setActiveFilter('Custom')}
              className={`text-left px-4 py-3 rounded-xl text-sm flex items-center gap-3 transition-all ${
                activeFilter === 'Custom'
                ? 'font-bold text-[#5452F6] bg-white shadow-sm border border-gray-100' 
                : 'font-semibold text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar className={`w-4 h-4 ${activeFilter === 'Custom' ? 'text-[#5452F6]' : 'text-gray-400'}`} /> Custom
            </button>
          </div>

          {/* Area Kalender */}
          <div className="flex-1 p-8 flex flex-col justify-between bg-white">
            <div className="flex gap-10">
              
              {/* Kalender Kiri (Oktober 2023) */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <button className="text-gray-400 hover:text-[#5452F6] transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                  <h3 className="text-sm font-bold text-gray-800">Oktober 2023</h3>
                  <div className="w-5"></div> {/* Spacer */}
                </div>
                <div className="grid grid-cols-7 gap-y-4 text-center">
                  {['MG', 'SN', 'SL', 'RB', 'KM', 'JM', 'SB'].map(day => (
                    <div key={day} className="text-[11px] font-bold text-[#A0AEC0] uppercase">{day}</div>
                  ))}
                  {/* Baris 1 */}
                  <div className="text-sm font-bold text-gray-300">26</div>
                  <div className="text-sm font-bold text-gray-300">27</div>
                  <div className="text-sm font-bold text-gray-300">28</div>
                  <div className="text-sm font-bold text-gray-300">29</div>
                  <div className="text-sm font-bold text-gray-300">30</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">1</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">2</div>
                  {/* Baris 2 */}
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">3</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">4</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">5</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">6</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">7</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">8</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">9</div>
                  {/* Baris 3 */}
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">10</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">11</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">12</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">13</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">14</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">15</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">16</div>
                  {/* Baris 4 */}
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">17</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">18</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">19</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">20</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">21</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">22</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">23</div>
                  {/* Baris 5 */}
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">24</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">25</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">26</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">27</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">28</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">29</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">30</div>
                </div>
              </div>

              {/* Kalender Kanan (November 2023) */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <div className="w-5"></div> {/* Spacer */}
                  <h3 className="text-sm font-bold text-gray-800">November 2023</h3>
                  <button className="text-gray-400 hover:text-[#5452F6] transition-colors"><ChevronRight className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-7 gap-y-4 text-center">
                  {['MG', 'SN', 'SL', 'RB', 'KM', 'JM', 'SB'].map(day => (
                    <div key={day} className="text-[11px] font-bold text-[#A0AEC0] uppercase">{day}</div>
                  ))}
                  {/* Baris 1 Nov */}
                  <div className="text-sm font-bold text-gray-300">30</div>
                  <div className="text-sm font-bold text-gray-300">31</div>
                  
                  {/* TANGGAL YANG DIPILIH DENGAN BACKGROUND MENYAMBUNG */}
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 left-1/2 bg-[#EEF2FF]"></div>
                    <div className="relative w-9 h-9 mx-auto bg-[#5452F6] text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md shadow-indigo-200 cursor-pointer hover:scale-105 transition-transform">1</div>
                  </div>
                  <div className="text-sm font-bold text-gray-800 bg-[#EEF2FF] py-2 cursor-pointer">2</div>
                  <div className="text-sm font-bold text-gray-800 bg-[#EEF2FF] py-2 cursor-pointer">3</div>
                  <div className="text-sm font-bold text-gray-800 bg-[#EEF2FF] py-2 cursor-pointer">4</div>
                  <div className="text-sm font-bold text-gray-800 bg-[#EEF2FF] py-2 cursor-pointer">5</div>
                  
                  {/* Baris 2 Nov */}
                  <div className="text-sm font-bold text-gray-800 bg-[#EEF2FF] py-2 cursor-pointer">6</div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 right-1/2 bg-[#EEF2FF]"></div>
                    <div className="relative w-9 h-9 mx-auto bg-[#5452F6] text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md shadow-indigo-200 cursor-pointer hover:scale-105 transition-transform">7</div>
                  </div>
                  
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">8</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">9</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">10</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">11</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">12</div>
                  {/* Baris 3 Nov */}
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">13</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">14</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">15</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">16</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">17</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">18</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">19</div>
                  {/* Baris 4 Nov */}
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">20</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">21</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">22</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">23</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">24</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">25</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">26</div>
                  {/* Baris 5 Nov */}
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">27</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">28</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">29</div>
                  <div className="text-sm font-bold text-gray-700 py-1 cursor-pointer hover:bg-gray-100 rounded-lg">30</div>
                </div>
              </div>
            </div>

            {/* Input Mulai & Selesai */}
            <div className="flex items-center gap-6 mt-8 pt-6 border-t border-gray-100">
              <div className="flex-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Mulai</label>
                <div className="bg-[#F4F7FC] border border-transparent rounded-xl px-4 py-3.5 text-sm font-bold text-gray-700">
                  1 November 2025
                </div>
              </div>
              <div className="mt-6 text-gray-300">
                <ArrowRight className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Selesai</label>
                <div className="bg-[#F4F7FC] border border-transparent rounded-xl px-4 py-3.5 text-sm font-bold text-gray-700">
                  7 November 2025
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-8 py-5 flex items-center justify-between border-t border-gray-100 bg-white">
          <div className="flex items-center gap-2 text-gray-500">
            <Info className="w-5 h-5" />
            <span className="text-sm font-medium">Mempengaruhi semua visualisasi di Dashboard.</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={onClose}
              className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-[#5452F6] hover:bg-[#4341E3] shadow-md shadow-indigo-500/20 transition-all"
            >
              Terapkan Filter
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DateRangePickerModal;