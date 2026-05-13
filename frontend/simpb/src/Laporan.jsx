import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Box, Truck, Users, 
  ArrowDownRight, ArrowUpRight, ArrowDownLeft, Activity, 
  BarChart2, Search, Bell, CircleUser, 
  Calendar, FileText, Download, FileSpreadsheet, 
  ChevronDown, Filter, Loader2, ArrowUpDown, Menu, X
} from 'lucide-react';

// === IMPORT LIBRARY PDF (CARA PALING STABIL) ===
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// === IMPORT KOMPONEN MODAL ===
import ExportModal from './ExportModal';

const Laporan = ({ onLogout, onNavigate }) => {
  // === STATES ===
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [startDate, setStartDate] = useState('2026-03-01');
  const [endDate, setEndDate] = useState('2026-04-30'); 
  const [activeTab, setActiveTab] = useState('semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('terbaru');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [laporanData, setLaporanData] = useState([]);
  const [ringkasan, setRingkasan] = useState({ total_transaksi: 0, total_jumlah_barang: 0, total_nilai: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // === MODAL EKSPOR STATES ===
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [initialExportFormat, setInitialExportFormat] = useState('excel');

  // === FUNGSI EKSEKUSI EKSPOR DARI MODAL (DIPERBAIKI AGAR TIDAK ERROR "NOT DEFINED") ===
  const handleExecuteExport = (config) => {
    console.log("Memproses Ekspor dengan konfigurasi:", config);
    alert(`Mengekspor data dalam format ${config.format.toUpperCase()} untuk rentang: ${config.range}`);
  };

  // --- FUNGSI FORMATTING ---
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(angka || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
  };

  const displayDateRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;

  // === FUNGSI AMBIL DATA API ===
  const fetchLaporan = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const rawApiUrl = import.meta.env.VITE_API_URL || 'http://103.253.213.251/api';
      const cleanApiUrl = rawApiUrl.replace(/\/$/, ""); 
      const baseApi = cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`;
      
      const headers = { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` };
      const params = `?start_date=${startDate}&end_date=${endDate}`;

      let masukData = [];
      let keluarData = [];

      if (activeTab === 'masuk' || activeTab === 'semua') {
        const resMasuk = await fetch(`${baseApi}/laporan/transaksi-masuk${params}`, { headers });
        const jsonMasuk = await resMasuk.json();
        if (jsonMasuk.success) {
          masukData = jsonMasuk.data.map(item => ({ ...item, _type: 'masuk' }));
        }
      }

      if (activeTab === 'keluar' || activeTab === 'semua') {
        const resKeluar = await fetch(`${baseApi}/laporan/transaksi-keluar${params}`, { headers });
        const jsonKeluar = await resKeluar.json();
        if (jsonKeluar.success) {
          keluarData = jsonKeluar.data.map(item => ({ ...item, _type: 'keluar' }));
        }
      }

      let combinedData = [...masukData, ...keluarData];
      setLaporanData(combinedData);

      const total_transaksi = combinedData.length;
      const total_jumlah_barang = combinedData.reduce((acc, curr) => acc + curr.jumlah, 0);
      const total_nilai = combinedData.reduce((acc, curr) => {
        const harga = curr._type === 'masuk' ? curr.harga_beli : curr.harga_jual;
        return acc + (curr.jumlah * parseFloat(harga || 0));
      }, 0);

      setRingkasan({ total_transaksi, total_jumlah_barang, total_nilai });
    } catch (error) {
      console.error("Error Fetching Laporan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, [startDate, endDate, activeTab]); 

  // === LOGIKA FILTER & SORT LOKAL ===
  const processedData = laporanData
    .filter(item => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      const idPrefix = item._type === 'masuk' ? 'TRX-M-' : 'TRX-K-';
      const fullId = `${idPrefix}${String(item.id).padStart(4, '0')}`.toLowerCase();
      const namaBarang = (item.barang?.nama_barang || '').toLowerCase();
      const entitas = (item.supplier?.nama_supplier || item.nama_instansi || item.konsumen?.nama_konsumen || '').toLowerCase();
      
      return fullId.includes(searchLower) || namaBarang.includes(searchLower) || entitas.includes(searchLower);
    })
    .sort((a, b) => {
      if (sortOrder === 'terbaru') return new Date(b.created_at) - new Date(a.created_at);
      if (sortOrder === 'terlama') return new Date(a.created_at) - new Date(b.created_at);
      
      const totalA = a.jumlah * parseFloat(a._type === 'masuk' ? a.harga_beli : a.harga_jual || 0);
      const totalB = b.jumlah * parseFloat(b._type === 'masuk' ? b.harga_beli : b.harga_jual || 0);
      
      if (sortOrder === 'tertinggi') return totalB - totalA;
      if (sortOrder === 'terendah') return totalA - totalB;
      return 0;
    });

  // === FUNGSI EKSPOR PDF (DIPERBAIKI) ===
  const exportToPDF = () => {
    try {
      if (processedData.length === 0) {
        alert("Tidak ada data transaksi untuk diekspor.");
        return;
      }

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });
      
      // Judul & Info
      doc.setFontSize(16);
      doc.setTextColor(30, 35, 44); 
      doc.text('Laporan Transaksi - CV. Amrita Jayasri', 14, 15);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Periode: ${displayDateRange}`, 14, 22);
      doc.text(`Tipe: ${activeTab.toUpperCase()}`, 14, 28);

      const tableColumn = ["ID Transaksi", "Tanggal & Waktu", "Tipe", "Produk (SKU)", "Jumlah", "Entitas", "Total Nilai"];
      const tableRows = processedData.map(item => {
        const isMasuk = item._type === 'masuk';
        return [
          `#${isMasuk ? 'M' : 'K'}-${String(item.id).padStart(4, '0')}`,
          `${formatDate(isMasuk ? item.tanggal_masuk : item.tanggal_keluar)} \n(${formatTime(item.created_at)})`,
          isMasuk ? 'Masuk' : 'Keluar',
          `${item.barang?.nama_barang || '-'} \n(SKU: ${item.barang?.id_referensi || '-'})`,
          `${isMasuk ? '+' : '-'} ${item.jumlah}`,
          isMasuk ? (item.supplier?.nama_supplier || '-') : (item.nama_instansi || 'Umum'),
          formatRupiah(item.jumlah * parseFloat(isMasuk ? item.harga_beli : item.harga_jual || 0))
        ];
      });

      // === PEMANGGILAN autoTable SEBAGAI FUNGSI, BUKAN PROPERTI ===
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [84, 82, 246] },
        styles: { fontSize: 8, cellPadding: 3, valign: 'middle' },
        columnStyles: { 6: { halign: 'right' } }
      });

      doc.save(`Laporan_${startDate}_to_${endDate}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Gagal membuat PDF: " + error.message);
    }
  };

  const handleNavigation = (path) => {
    setIsMobileMenuOpen(false);
    onNavigate(path);
  };

  const getSortLabel = () => {
    switch (sortOrder) {
      case 'terbaru': return 'Terbaru';
      case 'terlama': return 'Terlama';
      case 'tertinggi': return 'Nilai Tertinggi';
      case 'terendah': return 'Nilai Terendah';
      default: return 'Terbaru';
    }
  };

  return (
    <>
      <div className="flex h-screen bg-[#F4F7FC] font-sans overflow-hidden">
        
        {/* MOBILE OVERLAY */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* SIDEBAR */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-gray-100 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#5452F6] rounded-xl flex items-center justify-center shrink-0">
                <Box className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-[#5452F6] font-bold text-[13px] leading-tight tracking-wide uppercase">CV. AMRITA<br/>JAYASRI</h1>
              </div>
            </div>
            <button className="md:hidden text-gray-400" onClick={() => setIsMobileMenuOpen(false)}><X /></button>
          </div>
          
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
            <button onClick={() => handleNavigation('dashboard')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 rounded-xl text-sm font-medium hover:bg-gray-50"><LayoutDashboard className="w-5 h-5" /> Dashboard</button>
            <button onClick={() => handleNavigation('data-barang')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 rounded-xl text-sm font-medium hover:bg-gray-50"><Box className="w-5 h-5" /> Data Barang</button>
            <button onClick={() => handleNavigation('pemasok')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 rounded-xl text-sm font-medium hover:bg-gray-50"><Truck className="w-5 h-5" /> Pemasok</button>
            <button onClick={() => handleNavigation('konsumen')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 rounded-xl text-sm font-medium hover:bg-gray-50"><Users className="w-5 h-5" /> Konsumen</button>
            <button onClick={() => handleNavigation('barang-masuk')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left"><ArrowDownRight className="w-5 h-5" /> Barang Masuk</button>
            <button onClick={() => handleNavigation('barang-keluar')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left"><ArrowUpRight className="w-5 h-5" /> Barang Keluar</button>
            <button onClick={() => handleNavigation('monitoring-stok')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium text-sm transition-colors text-left"><Activity className="w-5 h-5" /> Monitoring Stok</button>
            <button onClick={() => handleNavigation('laporan')} className="w-full flex items-center gap-3 px-4 py-3 bg-[#F0EFFF] text-[#5452F6] rounded-xl text-sm font-bold"><BarChart2 className="w-5 h-5" /> Laporan</button>
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:text-red-500 font-semibold text-sm transition-colors">
              <ArrowDownLeft className="w-5 h-5" /> Keluar
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <header className="h-16 md:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 shrink-0">
            <div className="flex items-center gap-3">
              <button className="md:hidden text-gray-500" onClick={() => setIsMobileMenuOpen(true)}><Menu /></button>
              <h2 className="font-bold text-[#1E232C] hidden sm:block">Sistem Inventaris - Amrita Jayasri</h2>
              <h2 className="font-bold text-[#1E232C] sm:hidden">Laporan</h2>
            </div>
            
            <div className="flex items-center gap-3 md:gap-6">
              <div className="relative w-48 md:w-72 hidden sm:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Cari transaksi..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 bg-[#F4F7FC] rounded-full text-xs md:text-sm focus:outline-none focus:border-[#5452F6] border border-transparent" 
                />
              </div>
              <div className="flex items-center gap-2.5">
                <CircleUser className="w-8 h-8 text-[#5452F6]" />
                <span className="text-xs font-semibold hidden md:block">Administrator</span>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex-1 flex flex-col justify-center">
                  <h3 className="text-[10px] font-black text-[#5452F6] uppercase tracking-widest mb-1">Inventaris</h3>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Laporan Transaksi</h4>
                  <p className="text-sm text-gray-500">Monitor pergerakan stok masuk dan keluar secara real-time.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setInitialExportFormat('excel'); setIsExportModalOpen(true); }} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"><FileSpreadsheet className="w-4 h-4" /> Excel</button>
                  <button onClick={exportToPDF} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#5452F6] text-white rounded-xl text-xs font-bold hover:bg-[#4341E3] shadow-md transition-all"><Download className="w-4 h-4" /> Unduh PDF</button>
                </div>
              </div>

              <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100 flex flex-col">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-[10px] font-black text-gray-800 uppercase tracking-widest mb-3 block">Rentang Tanggal</label>
                    <div className="flex items-center gap-2">
                      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2.5 bg-[#F4F7FC] border-none rounded-xl text-[11px] font-bold text-gray-600 focus:ring-1 focus:ring-[#5452F6]" />
                      <span className="text-gray-300">-</span>
                      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2.5 bg-[#F4F7FC] border-none rounded-xl text-[11px] font-bold text-gray-600 focus:ring-1 focus:ring-[#5452F6]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-800 uppercase tracking-widest mb-3 block">Tipe Transaksi</label>
                    <div className="relative">
                      <select value={activeTab} onChange={(e) => setActiveTab(e.target.value)} className="w-full pl-4 pr-10 py-2.5 bg-[#F4F7FC] border-none rounded-xl text-[11px] font-bold text-gray-600 appearance-none focus:ring-1 focus:ring-[#5452F6]">
                        <option value="semua">Semua Transaksi</option>
                        <option value="masuk">Barang Masuk</option>
                        <option value="keluar">Barang Keluar</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div className="mt-auto pt-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Data Terhubung ke Database</span>
                </div>
              </div>
            </div>

            {/* TOOLBAR */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex gap-2 bg-white p-1 rounded-[14px] border border-gray-100 shadow-sm overflow-x-auto w-full md:w-auto">
                {['semua', 'masuk', 'keluar'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 text-xs font-bold rounded-xl capitalize transition-all ${activeTab === tab ? 'bg-[#5452F6] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>{tab}</button>
                ))}
              </div>

              <div className="relative w-full md:w-auto">
                <button onClick={() => setIsSortOpen(!isSortOpen)} className="w-full flex items-center justify-between gap-4 px-5 py-2.5 bg-white border border-gray-100 rounded-[14px] text-xs font-bold text-gray-600 shadow-sm">
                  <span>Urutkan: {getSortLabel()}</span>
                  <ArrowUpDown className="w-4 h-4 text-gray-400" />
                </button>
                {isSortOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-1">
                      {['terbaru', 'terlama', 'tertinggi', 'terendah'].map(opt => (
                        <button key={opt} onClick={() => { setSortOrder(opt); setIsSortOpen(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-indigo-50 capitalize ${sortOrder === opt ? 'text-[#5452F6]' : 'text-gray-600'}`}>{opt}</button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden relative min-h-[300px]">
              {isLoading ? (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
                  <Loader2 className="w-8 h-8 text-[#5452F6] animate-spin" />
                </div>
              ) : processedData.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                  <FileText className="w-12 h-12 text-gray-200 mb-4" />
                  <h3 className="font-bold text-gray-800">Data Tidak Ditemukan</h3>
                  <p className="text-xs text-gray-400 mt-1">Coba ubah filter rentang tanggal atau tipe transaksi.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                      <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                        <th className="py-5 px-8">ID Transaksi</th>
                        <th className="py-5 px-6">Waktu</th>
                        <th className="py-5 px-6">Produk</th>
                        <th className="py-5 px-6 text-center">Tipe</th>
                        <th className="py-5 px-6 text-center">Jumlah</th>
                        <th className="py-5 px-8 text-right">Total Nilai</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {processedData.map((item) => {
                        const isMasuk = item._type === 'masuk';
                        return (
                          <tr key={`${item._type}-${item.id}`} className="hover:bg-gray-50/30 transition-colors">
                            <td className="py-5 px-8 font-black text-[#5452F6] text-xs">#{isMasuk ? 'M' : 'K'}-{String(item.id).padStart(4, '0')}</td>
                            <td className="py-5 px-6">
                              <p className="text-xs font-bold text-gray-800">{formatDate(isMasuk ? item.tanggal_masuk : item.tanggal_keluar)}</p>
                              <p className="text-[10px] text-gray-400 font-medium">{formatTime(item.created_at)}</p>
                            </td>
                            <td className="py-5 px-6">
                              <p className="text-xs font-black text-gray-800">{item.barang?.nama_barang || '-'}</p>
                              <p className="text-[10px] text-gray-400 uppercase font-medium">SKU: {item.barang?.id_referensi || '-'}</p>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <span className={`text-[10px] font-black px-3 py-1 rounded-lg inline-flex items-center gap-1 ${isMasuk ? 'bg-indigo-50 text-[#5452F6]' : 'bg-orange-50 text-orange-600'}`}>
                                {isMasuk ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />} {isMasuk ? 'Masuk' : 'Keluar'}
                              </span>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <p className="text-xs font-black text-gray-800">{isMasuk ? '+' : '-'} {item.jumlah}</p>
                              <p className="text-[10px] text-gray-400 font-medium">{isMasuk ? item.supplier?.nama_supplier : (item.nama_instansi || 'Umum')}</p>
                            </td>
                            <td className="py-5 px-8 text-right font-black text-gray-800 text-sm">{formatRupiah(item.jumlah * parseFloat(isMasuk ? item.harga_beli : item.harga_jual || 0))}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        onExport={handleExecuteExport}
        initialFormat={initialExportFormat}
      />
    </>
  );
};

export default Laporan;