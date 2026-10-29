import React, { useState, useEffect } from 'react';
import { Bell, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

const NotificationBell = ({ onNavigate }) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [stokKritisList, setStokKritisList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifikasi = async () => {
      try {
        const token = localStorage.getItem('token');
        const rawApiUrl = import.meta.env.VITE_API_URL || 'https://cvamritajayasri.my.id/api';
        const cleanApiUrl = rawApiUrl.replace(/\/$/, "");
        const baseApi = cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`;

        // Fetch barang to check for critical stock
        const response = await fetch(`${baseApi}/barang?per_page=1000&page=1`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (response.ok || data.success) {
          let allData = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : (data.data?.data || []));
          const kritis = allData.filter(item => item.stok <= item.stok_minimum);
          setStokKritisList(kritis);
        }
      } catch (error) {
        console.error("Error fetching notifikasi:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifikasi();
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsNotifOpen(!isNotifOpen);
        }}
        className="relative text-gray-500 hover:text-gray-800 transition-colors p-1"
      >
        <Bell className="w-5 h-5" />
        {stokKritisList.length > 0 && (
          <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {/* DROPDOWN NOTIFIKASI */}
      {isNotifOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)}></div>
          <div className="absolute right-0 top-full mt-3 w-72 md:w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-1 animate-in fade-in zoom-in-95">
            <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center">
              <p className="text-sm font-bold text-gray-800">Notifikasi</p>
              {stokKritisList.length > 0 && (
                <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                  {stokKritisList.length} Peringatan
                </span>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto relative z-50">
              {isLoading ? (
                <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-[#5452F6]" /></div>
              ) : stokKritisList.length === 0 ? (
                <div className="px-4 py-8 text-center flex flex-col items-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                  <p className="text-xs text-gray-500 font-medium">Semua stok dalam kondisi aman.</p>
                </div>
              ) : (
                stokKritisList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => { setIsNotifOpen(false); if (onNavigate) onNavigate('monitoring-stok'); }}
                    className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 bg-red-50 rounded-lg shrink-0 group-hover:bg-red-100 transition-colors">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      </div>
                      <div>
                        <p className="text-[11px] md:text-xs font-bold text-gray-800 mb-1 leading-tight">{item.nama_barang}</p>
                        <p className="text-[10px] text-gray-500">Stok tersisa: <span className="font-bold text-red-600">{item.stok} {item.satuan}</span> (Min: {item.stok_minimum})</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {stokKritisList.length > 0 && (
              <div className="px-4 py-2.5 border-t border-gray-50 text-center relative z-50">
                <button
                  onClick={() => { setIsNotifOpen(false); if (onNavigate) onNavigate('monitoring-stok'); }}
                  className="text-[11px] font-bold text-[#5452F6] hover:text-[#4341E3] transition-colors"
                >
                  Lihat Semua Pemantauan
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
