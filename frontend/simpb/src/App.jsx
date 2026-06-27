import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage'; // <-- 1. IMPORT LANDING PAGE
import Login from './Login';
import Dashboard from './Dashboard'; 
import DataBarang from './DataBarang'; 
import Pemasok from './Pemasok'; 
import Konsumen from './Konsumen'; 
import BarangMasuk from './BarangMasuk'; 
import BarangKeluar from './BarangKeluar'; 
import MonitoringStok from './MonitoringStok';
import TambahBarang from './TambahBarang';
import EditBarang from './EditBarang'; 
import Laporan from './Laporan';
import LogoutModal from './LogoutModal'; 

const App = () => {
  // === 2. UBAH DEFAULT STATE MENJADI 'landing' ===
  const [activePage, setActivePage] = useState('landing'); 
  const [user, setUser] = useState(null);
  
  // === STATE BARU UNTUK MENYIMPAN ID BARANG YANG AKAN DIEDIT ===
  const [selectedItemId, setSelectedItemId] = useState(null);
  
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    // Jika sudah ada token, langsung masuk ke dashboard
    if (savedToken && savedUser) {
      setUser(JSON.parse(savedUser));
      setActivePage('dashboard');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setActivePage('dashboard');
  };

  const handleShowLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    const token = localStorage.getItem('token');

    try {
      await fetch('https://cvamritajayasri.my.id/api/logout', {
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
    setIsLogoutModalOpen(false); 
    
    // Setelah logout, kita kembalikan user ke Landing Page
    setActivePage('landing'); 
  };

  // === FUNGSI NAVIGASI ===
  // Fungsi ini bisa menangkap nama halaman DAN id barang (opsional)
  const handleNavigate = (page, id = null) => {
    setActivePage(page);
    setSelectedItemId(id); // Simpan ID jika ada yang dikirim
  };

  const renderPage = () => {
    switch (activePage) {
      // === 3. TAMBAHKAN CASE UNTUK LANDING PAGE ===
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
        
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} onLogout={handleShowLogoutModal} user={user} />;
      case 'data-barang':
        return <DataBarang onNavigate={handleNavigate} onLogout={handleShowLogoutModal} />;
      case 'tambah-barang':
        return <TambahBarang onNavigate={handleNavigate} onLogout={handleShowLogoutModal} />;
      case 'edit-barang':
        return (
          <EditBarang 
            onNavigate={handleNavigate} 
            onLogout={handleShowLogoutModal} 
            itemId={selectedItemId} // Kirimkan ID yang disimpan ke komponen Edit
          />
        );
      case 'pemasok':
        return <Pemasok onNavigate={handleNavigate} onLogout={handleShowLogoutModal} />;
      case 'konsumen':
        return <Konsumen onNavigate={handleNavigate} onLogout={handleShowLogoutModal} />;
      case 'barang-masuk':
        return <BarangMasuk onNavigate={handleNavigate} onLogout={handleShowLogoutModal} />;
      case 'barang-keluar':
        return <BarangKeluar onNavigate={handleNavigate} onLogout={handleShowLogoutModal} />;
      case 'monitoring-stok':
        return <MonitoringStok onNavigate={handleNavigate} onLogout={handleShowLogoutModal} />;
      case 'laporan':
        return <Laporan onNavigate={handleNavigate} onLogout={handleShowLogoutModal} />;
      default:
        // Default dikembalikan ke Landing Page jika halaman tidak ditemukan
        return <LandingPage onNavigate={handleNavigate} />; 
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] overflow-hidden relative">
      {/* 1. RENDER HALAMAN AKTIF */}
      {renderPage()}

      {/* 2. RENDER MODAL LOGOUT DI LUAR HALAMAN */}
      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        onConfirm={handleConfirmLogout} 
      />
    </div>
  );
};

export default App;