import React, { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard'; 
import DataBarang from './DataBarang'; 
import Pemasok from './Pemasok'; 
import Konsumen from './Konsumen'; 
import BarangMasuk from './BarangMasuk'; 
import BarangKeluar from './BarangKeluar'; 
import MonitoringStok from './MonitoringStok';
import TambahBarang from './TambahBarang';
import Laporan from './Laporan';
import LogoutModal from './LogoutModal'; // <-- IMPORT MODAL LOGOUT DI SINI

const App = () => {
  const [activePage, setActivePage] = useState('login');
  const [user, setUser] = useState(null);
  
  // === STATE UNTUK MENGONTROL MODAL LOGOUT ===
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Efek untuk mengecek sesi saat aplikasi pertama kali dimuat
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setUser(JSON.parse(savedUser));
      setActivePage('dashboard');
    }
  }, []);

  // Handler saat login berhasil
  const handleLogin = (userData) => {
    setUser(userData);
    setActivePage('dashboard');
  };

  // Handler untuk MENAMPILKAN modal logout (bukan langsung logout)
  const handleShowLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  // Handler eksekusi logout SEBENARNYA (dipanggil saat tombol "Ya, Keluar" di-klik)
  const handleConfirmLogout = async () => {
    const token = localStorage.getItem('token');

    try {
      await fetch('https://cvamrita-jayasri-production.up.railway.app/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
    } catch (error) {
      console.error("Logout server error:", error);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsLogoutModalOpen(false); // Tutup modal setelah berhasil
    setActivePage('login');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'dashboard':
        // Ganti handleLogout menjadi handleShowLogoutModal
        return <Dashboard onNavigate={setActivePage} onLogout={handleShowLogoutModal} user={user} />;
      case 'data-barang':
        return <DataBarang onNavigate={setActivePage} onLogout={handleShowLogoutModal} />;
      case 'tambah-barang':
        return <TambahBarang onNavigate={setActivePage} onLogout={handleShowLogoutModal} />;
      case 'pemasok':
        return <Pemasok onNavigate={setActivePage} onLogout={handleShowLogoutModal} />;
      case 'konsumen':
        return <Konsumen onNavigate={setActivePage} onLogout={handleShowLogoutModal} />;
      case 'barang-masuk':
        return <BarangMasuk onNavigate={setActivePage} onLogout={handleShowLogoutModal} />;
      case 'barang-keluar':
        return <BarangKeluar onNavigate={setActivePage} onLogout={handleShowLogoutModal} />;
      case 'monitoring-stok':
        return <MonitoringStok onNavigate={setActivePage} onLogout={handleShowLogoutModal} />;
      case 'laporan':
        return <Laporan onNavigate={setActivePage} onLogout={handleShowLogoutModal} />;
      default:
        return <Dashboard onNavigate={setActivePage} onLogout={handleShowLogoutModal} user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] overflow-hidden relative">
      {/* 1. RENDER HALAMAN AKTIF */}
      {renderPage()}

      {/* 2. RENDER MODAL LOGOUT DI LUAR HALAMAN */}
      {/* Modal ini akan otomatis berada di atas halaman apa saja yang sedang aktif */}
      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        onConfirm={handleConfirmLogout} 
      />
    </div>
  );
};

export default App;