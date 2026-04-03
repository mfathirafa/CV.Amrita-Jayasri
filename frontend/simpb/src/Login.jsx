import React, { useState } from 'react';
import { 
  Archive, 
  Mail, 
  Lock, 
  EyeOff, 
  Eye, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck 
} from 'lucide-react';

// 1. Tambahkan { onLogin } di dalam parameter komponen
const Login = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  // 2. Buat fungsi untuk menangani saat tombol submit diklik
  const handleSubmit = (e) => {
    e.preventDefault();
    // Panggil fungsi onLogin untuk pindah halaman
    if (onLogin) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F4F7FC] p-4 relative overflow-hidden">
      
      {/* Background overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-50/50 to-white/20 pointer-events-none"></div>

      {/* Main Login Card */}
      <div className="bg-white rounded-[20px] shadow-lg w-full max-w-[420px] p-8 z-10">
        
        {/* Header / Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#5452F6] rounded-2xl flex items-center justify-center mb-4 shadow-md">
            <Archive className="text-white w-7 h-7" strokeWidth={2} />
          </div>
          <h1 className="text-[#1E232C] font-bold text-xl mb-1">SIMPB</h1>
          <p className="text-gray-500 text-sm font-medium">CV. AMRITA JAYASRI</p>
        </div>

        {/* 3. Ubah onSubmit memanggil fungsi handleSubmit */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1E232C]">Alamat Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="email" 
                required
                placeholder="Masukkan Email" 
                className="w-full pl-11 pr-4 py-3 bg-[#F2F4F7] border border-transparent rounded-lg text-sm focus:bg-white focus:border-[#5452F6] focus:ring-2 focus:ring-[#5452F6]/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-[#1E232C]">Kata Sandi</label>
              <a href="#" className="text-sm font-bold text-[#5452F6] hover:underline">Lupa Kata Sandi?</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                placeholder="Masukkan Kata Sandi" 
                className="w-full pl-11 pr-11 py-3 bg-[#F2F4F7] border border-transparent rounded-lg text-sm focus:bg-white focus:border-[#5452F6] focus:ring-2 focus:ring-[#5452F6]/20 outline-none transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Error Message Banner (Di-comment dulu agar tidak selalu muncul) */}
          {/* <div className="flex items-center gap-2 bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] px-4 py-3 rounded-lg mt-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-semibold">Email atau Kata sandi tidak valid</span>
          </div> 
          */}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-[#5452F6] hover:bg-[#4341E3] text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-6"
          >
            Masuk ke Dashboard
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>

        {/* Card Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
          <p className="text-sm text-gray-500 font-medium">
            Secure Access Portal • v2.4.0
          </p>
        </div>
      </div>

      {/* Page Footer (Status Indicators) */}
      <div className="absolute bottom-8 flex gap-6 text-xs font-bold text-gray-400 uppercase tracking-wider z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          System Online
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4" />
          SSL Secure
        </div>
      </div>
    </div>
  );
};

// 4. Ubah export menjadi Login
export default Login;