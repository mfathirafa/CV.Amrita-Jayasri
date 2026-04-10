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

const App = () => {
  const [activePage, setActivePage] = useState('login');
  const [user, setUser] = useState(null);

  // Efek untuk mengecek sesi saat aplikasi pertama kali dimuat
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setUser(JSON.parse(savedUser));
      setActivePage('dashboard');
    }
  }, []);

  // Handler saat login berhasil (menerima data user dari Login.jsx)
  const handleLogin = (userData) => {
    setUser(userData);
    setActivePage('dashboard');
  };

  const handleLogout = async () => {
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
    setActivePage('login');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'dashboard':
        return <Dashboard onNavigate={setActivePage} onLogout={handleLogout} user={user} />;
      case 'data-barang':
        return <DataBarang onNavigate={setActivePage} onLogout={handleLogout} />;
      case 'tambah-barang':
        return <TambahBarang onNavigate={setActivePage} onLogout={handleLogout} />;
      case 'pemasok':
        return <Pemasok onNavigate={setActivePage} onLogout={handleLogout} />;
      case 'konsumen':
        return <Konsumen onNavigate={setActivePage} onLogout={handleLogout} />;
      case 'barang-masuk':
        return <BarangMasuk onNavigate={setActivePage} onLogout={handleLogout} />;
      case 'barang-keluar':
        return <BarangKeluar onNavigate={setActivePage} onLogout={handleLogout} />;
      case 'monitoring-stok':
        return <MonitoringStok onNavigate={setActivePage} onLogout={handleLogout} />;
      case 'laporan':
        return <Laporan onNavigate={setActivePage} onLogout={handleLogout} />;
      default:
        return <Dashboard onNavigate={setActivePage} onLogout={handleLogout} user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] overflow-hidden">
      {renderPage()}
    </div>
  );
};

export default App;