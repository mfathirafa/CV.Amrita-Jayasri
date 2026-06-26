import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  EyeOff, 
  Eye, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck,
  Loader2
} from 'lucide-react';

import logoAmrita from './assets/Logo Amrita.png';

// === DITAMBAHKAN PROP onNavigate DISINI ===
const Login = ({ onLogin, onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const API_URL = import.meta.env.VITE_API_URL || 'https://cvamritajayasri.my.id/api';

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        
        if (onLogin) {
          onLogin(result.data.user);
        }
      } else {
        setError(result.message || 'Email atau Kata sandi salah');
      }
    } catch (err) {
      setError('Gagal terhubung ke server. Periksa koneksi internet Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F4F7FC] p-4 md:p-6 relative overflow-x-hidden text-left">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-50/50 to-white/20 pointer-events-none"></div>

      <div className="bg-white rounded-[24px] md:rounded-[30px] shadow-xl w-full max-w-[95%] sm:max-w-[420px] p-6 md:p-10 z-10 border border-gray-100 transition-all duration-300">
        
        <div className="flex flex-col items-center mb-6 md:mb-10">
          <img 
            src={logoAmrita} 
            alt="Logo CV Amrita Jayasri" 
            className="w-14 h-14 md:w-20 md:h-20 object-contain mb-4 transform transition-transform hover:scale-105 drop-shadow-md" 
          />
          <h1 className="text-[#1E232C] font-bold text-xl md:text-2xl mb-1">SIMPB</h1>
          <p className="text-gray-400 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">CV. AMRITA JAYASRI</p>
        </div>

        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="space-y-1.5 md:space-y-2">
            <label className="text-xs md:text-sm font-bold text-[#1E232C] ml-1">Alamat Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 md:h-5 md:w-5 text-gray-400 group-focus-within:text-[#5452F6] transition-colors" />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukan Alamat Email" 
                className="w-full pl-11 pr-4 py-3 bg-[#F2F4F7] border border-transparent rounded-xl text-xs md:text-sm focus:bg-white focus:border-[#5452F6] focus:ring-4 focus:ring-[#5452F6]/5 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5 md:space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs md:text-sm font-bold text-[#1E232C]">Kata Sandi</label>
              
              {/* === TOMBOL LUPA PASSWORD LANGSUNG PINDAH PAGE === */}
              <button 
                type="button" 
                onClick={() => onNavigate && onNavigate('reset-password')}
                className="text-[10px] md:text-xs font-extrabold text-[#5452F6] hover:text-[#3B39D1] transition-colors disabled:opacity-50"
              >
                Lupa Password?
              </button>

            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 md:h-5 md:w-5 text-gray-400 group-focus-within:text-[#5452F6] transition-colors" />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan Kata Sandi" 
                className="w-full pl-11 pr-11 py-3 bg-[#F2F4F7] border border-transparent rounded-xl text-xs md:text-sm focus:bg-white focus:border-[#5452F6] focus:ring-4 focus:ring-[#5452F6]/5 outline-none transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <Eye className="h-4 w-4 md:h-5 md:w-5" /> : <EyeOff className="h-4 w-4 md:h-5 md:w-5" />}
              </button>
            </div>
          </div>

          {/* Notifikasi Error */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mt-2 animate-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0 mt-0.5" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider leading-tight">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#5452F6] hover:bg-[#4341E3] disabled:bg-gray-400 text-white font-bold py-3.5 md:py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-indigo-100 active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-50 flex justify-center">
          <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest">
            Secure Access Portal • v2.4.0
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-8 items-center text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest z-10">
        <div className="flex items-center gap-2.5">
          <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-orange-400 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'}`}></div>
          {isLoading ? 'Connecting...' : 'System Online'}
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-500" />
          SSL Encryption Active
        </div>
      </div>
    </div>
  );
};

export default Login;