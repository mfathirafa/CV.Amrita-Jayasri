import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';

const App = () => {
  // State untuk menyimpan status login (awalnya false / belum login)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Jika sudah login, tampilkan Dashboard
  if (isLoggedIn) {
    return <Dashboard onLogout={() => setIsLoggedIn(false)} />;
  }

  // Jika belum, tampilkan Login
  return <Login onLogin={() => setIsLoggedIn(true)} />;
};

export default App;