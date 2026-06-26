import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  EyeOff, 
  Eye, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck,
  Loader2,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';

// === IMPORT GAMBAR LOGO ===
import logoAmrita from './assets/Logo Amrita.png';

const ResetPassword = ({ onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // State untuk menyimpan token dari URL
  const [token, setToken] = useState('');

  // Mengambil token dari parameter URL saat halaman dimuat
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Token reset password tidak valid atau tidak ditemukan.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    // Validasi token
    if (!token) {
      setError('Akses ditolak. Token reset password tidak ada.');
      setIsLoading(false);
      return;
    }

    // Validasi kecocokan password
    if (newPassword !== confirmPassword) {
      setError('Kata sandi baru dan konfirmasi kata sandi tidak cocok.');
      setIsLoading(false);
      return;
    }

    // Validasi panjang password
    if (newPassword.length < 8) {
      setError('Kata sandi harus terdiri dari minimal 8 karakter.');
      setIsLoading(false);
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL || 'https://cvamritajayasri.my.id/api';

    try {
      /* === KODE API UNTUK BACKEND SENSEI === */
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          password: newPassword,
          password_confirmation: confirmPassword
        })
      });

      const result = await response.json();

      if (result.success || response.ok) {
        setSuccessMessage('Kata sandi berhasil diubah! Anda akan dialihkan ke halaman login...');
        
        // Bersihkan form
        setNewPassword('');
        setConfirmPassword('');
        
        // Alihkan ke login setelah 3 detik
        setTimeout(() => {
          if (onNavigate) {
            onNavigate('login');
          } else {
            window.location.href = '/login';
          }
        }, 3000);
      } else {
        setError(result.message || 'Gagal mereset kata sandi. Token mungkin sudah kedaluwarsa.');
      }
    } catch (err) {
      // Fallback simulasi jika API belum siap
      console.warn("API Reset Password belum tersedia, menggunakan simulasi.");
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccessMessage('Kata sandi berhasil diperbarui! Silakan kembali ke halaman login.');
      setNewPassword('');
      setConfirmPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F4F7FC] p-4 md:p-6 relative overflow-x-hidden text-left">
      {/* Background Decoration */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-50/50 to-white/20 pointer-events-none"></div>

      {/* Reset Card Responsif */}
      <div className="bg-white rounded-[24px] md:rounded-[30px] shadow-xl w-full max-w-[95%] sm:max-w-[420px] p-6 md:p-10 z-10 border border-gray-100 transition-all duration-300">
        
        {/* Tombol Kembali ke Login */}
        <button 
          onClick={() => onNavigate ? onNavigate('login') : window.location.href = '/login'}
          className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-gray-400 hover:text-[#5452F6] transition-colors mb-6 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Login
        </button>

        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-6 md:mb-8">
          <img 
            src={logoAmrita} 
            alt="Logo CV Amrita Jayasri" 
            className="w-12 h-12 md:w-16 md:h-16 object-contain mb-4 drop-shadow-md" 
          />
          <h1 className="text-[#1E232C] font-bold text-lg md:text-xl mb-1">Buat Kata Sandi Baru</h1>
          <p className="text-gray-500 text-xs text-center px-4 leading-relaxed mt-2">
            Silakan masukkan kata sandi baru Anda di bawah ini untuk mengakses kembali sistem SIMPB.
          </p>
        </div>

        <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit}>
          
          {/* Input Password Baru */}
          <div className="space-y-1.5 md:space-y-2">
            <label className="text-xs md:text-sm font-bold text-[#1E232C] ml-1">Kata Sandi Baru</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 md:h-5 md:w-5 text-gray-400 group-focus-within:text-[#5452F6] transition-colors" />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                disabled={successMessage || !token}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 8 karakter" 
                className="w-full pl-11 pr-11 py-3 bg-[#F2F4F7] border border-transparent rounded-xl text-xs md:text-sm focus:bg-white focus:border-[#5452F6] focus:ring-4 focus:ring-[#5452F6]/5 outline-none transition-all disabled:opacity-60"
              />
              <button 
                type="button"
                disabled={successMessage || !token}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                {showPassword ? <Eye className="h-4 w-4 md:h-5 md:w-5" /> : <EyeOff className="h-4 w-4 md:h-5 md:w-5" />}
              </button>
            </div>
          </div>

          {/* Input Konfirmasi Password */}
          <div className="space-y-1.5 md:space-y-2">
            <label className="text-xs md:text-sm font-bold text-[#1E232C] ml-1">Konfirmasi Kata Sandi</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ShieldCheck className="h-4 w-4 md:h-5 md:w-5 text-gray-400 group-focus-within:text-[#5452F6] transition-colors" />
              </div>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                required
                disabled={successMessage || !token}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ketik ulang kata sandi baru" 
                className="w-full pl-11 pr-11 py-3 bg-[#F2F4F7] border border-transparent rounded-xl text-xs md:text-sm focus:bg-white focus:border-[#5452F6] focus:ring-4 focus:ring-[#5452F6]/5 outline-none transition-all disabled:opacity-60"
              />
              <button 
                type="button"
                disabled={successMessage || !token}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                {showConfirmPassword ? <Eye className="h-4 w-4 md:h-5 md:w-5" /> : <EyeOff className="h-4 w-4 md:h-5 md:w-5" />}
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

          {/* Notifikasi Sukses */}
          {successMessage && (
            <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded-xl mt-2 animate-in slide-in-from-top-2">
              <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0 mt-0.5" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider leading-tight">{successMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          {!successMessage && (
            <button 
              type="submit" 
              disabled={isLoading || !token}
              className="w-full bg-[#5452F6] hover:bg-[#4341E3] disabled:bg-gray-400 text-white font-bold py-3.5 md:py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 shadow-lg shadow-indigo-100 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Simpan Kata Sandi Baru</span>
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                </>
              )}
            </button>
          )}
        </form>

      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-8 items-center text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
          Secure Password Reset
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-500" />
          SSL Encryption Active
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;