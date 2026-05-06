import React, { useState } from 'react';
import { 
  Archive, 
  Mail, 
  Lock, 
  EyeOff, 
  Eye, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck,
  Loader2 
} from 'lucide-react';

const Login = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // === BACKEND URL SUDAH DIGANTI KE IP BARU ===
    const API_URL = import.meta.env.VITE_API_URL || 'http://103.253.213.251/api';

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
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F4F7FC] p-4 relative overflow-hidden text-left">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-50/50 to-white/20 pointer-events-none"></div>

      <div className="bg-white rounded-[20px] shadow-lg w-full max-w-[420px] p-8 z-10 border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#5452F6] rounded-2xl flex items-center justify-center mb-4 shadow-md shadow-indigo-200">
            <Archive className="text-white w-7 h-7" strokeWidth={2} />
          </div>
          <h1 className="text-[#1E232C] font-bold text-xl mb-1">SIMPB</h1>
          <p className="text-gray-500 text-sm font-medium tracking-wide">CV. AMRITA JAYASRI</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1E232C] ml-1">Alamat Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukan Alamat Email" 
                className="w-full pl-11 pr-4 py-3 bg-[#F2F4F7] border border-transparent rounded-lg text-sm focus:bg-white focus:border-[#5452F6] focus:ring-2 focus:ring-[#5452F6]/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-[#1E232C] ml-1">Kata Sandi</label>
              <button type="button" className="text-sm font-bold text-[#5452F6] hover:underline">Lupa Kata Sandi?</button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {error && (
            <div className="flex items-center gap-2 bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] px-4 py-3 rounded-lg mt-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider">{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#5452F6] hover:bg-[#4341E3] disabled:bg-gray-400 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 shadow-lg shadow-indigo-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                Masuk ke Dashboard
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
          <p className="text-sm text-gray-500 font-medium">
            Secure Access Portal • v2.4.0
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 flex gap-6 text-xs font-bold text-gray-400 uppercase tracking-wider z-10">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-orange-400 animate-pulse' : 'bg-emerald-500'}`}></div>
          {isLoading ? 'Connecting...' : 'System Online'}
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4" />
          SSL Secure
        </div>
      </div>
    </div>
  );
};

export default Login;