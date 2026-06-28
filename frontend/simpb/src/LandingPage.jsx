import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Shield, BarChart2, Clock, 
  Database, FileText, CheckCircle, Smartphone, 
  Menu, X, ChevronRight, LayoutGrid, Lock, 
  Activity, ShieldCheck, TrendingUp, MessageCircle
} from 'lucide-react';

import logoAmrita from './assets/Logo Amrita.png';

const LandingPage = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Nomor WhatsApp tujuan
  const whatsappNumber = "6282225191432";
  const whatsappMessage = encodeURIComponent("Halo tim Amrita Jayasri, saya tertarik dengan sistem inventarisnya. Boleh minta informasi lebih lanjut?");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Efek untuk mengubah gaya navbar saat di-scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#5452F6] selection:text-white overflow-x-hidden relative">
      
      {/* ================= NAVBAR ================= */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer">
              <img src={logoAmrita} alt="Logo Amrita" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
              <h1 className="text-[#322A9A] font-bold text-sm md:text-base leading-tight tracking-wide">
                CV. Amrita Jayasri
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#beranda" className="text-sm font-semibold text-[#5452F6] border-b-2 border-[#5452F6] pb-1">Beranda</a>
              <a href="#fitur" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors pb-1 border-b-2 border-transparent hover:border-gray-300">Fitur</a>
              <a href="#keunggulan" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors pb-1 border-b-2 border-transparent hover:border-gray-300">Keunggulan</a>
              <a href="#tentang" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors pb-1 border-b-2 border-transparent hover:border-gray-300">Tentang Kami</a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => onNavigate('login')} 
                className="text-sm font-semibold text-[#5452F6] hover:text-[#4341E3] transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => onNavigate('login')} 
                className="bg-[#5452F6] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#4341E3] transition-all shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                Coba Sekarang
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-gray-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg py-4 px-4 flex flex-col gap-4">
            <a href="#beranda" className="text-sm font-bold text-[#5452F6]" onClick={() => setIsMobileMenuOpen(false)}>Beranda</a>
            <a href="#fitur" className="text-sm font-medium text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>Fitur</a>
            <a href="#keunggulan" className="text-sm font-medium text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>Keunggulan</a>
            <a href="#tentang" className="text-sm font-medium text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>Tentang Kami</a>
            <hr className="border-gray-100" />
            <button onClick={() => onNavigate('login')} className="text-sm font-bold text-gray-600 text-left">Login</button>
            <button onClick={() => onNavigate('login')} className="bg-[#5452F6] text-white px-4 py-2.5 rounded-xl text-sm font-bold w-full text-center">Coba Sekarang</button>
          </div>
        )}
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section id="beranda" className="pt-32 pb-20 md:pt-40 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Hero Text */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E5EDFD] mb-6">
              <ShieldCheck className="w-4 h-4 text-[#5452F6]" />
              <span className="text-[11px] md:text-xs font-semibold text-[#5452F6]">Enterprise Grade Inventory Solution</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-[64px] font-black text-[#1E232C] leading-[1.1] mb-6 tracking-tight">
              Sistem<br className="hidden sm:block" /> Inventaris<br className="hidden sm:block" /> <span className="text-[#5452F6]">Cerdas</span> untuk<br className="hidden sm:block" /> Efisiensi Bisnis<br className="hidden sm:block" /> Anda
            </h1>
            
            <p className="text-gray-500 text-base md:text-lg mb-8 leading-relaxed max-w-md font-medium">
              Kelola stok, pantau transaksi, dan optimalkan pengadaan dalam satu platform terintegrasi. Dirancang khusus untuk kebutuhan operasional CV. Amrita Jayasri.
            </p>
            
            <button 
              onClick={() => onNavigate('login')}
              className="bg-[#5452F6] text-white px-8 py-3.5 rounded-xl text-sm font-medium hover:bg-[#4341E3] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 group w-full sm:w-auto"
            >
              Mulai Sekarang <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Hero Image / Graphic */}
          <div className="relative w-full aspect-square md:aspect-auto md:h-[550px] flex items-center justify-center">
            {/* Dekorasi Glow Latar Belakang */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#E5EDFD] to-white rounded-full scale-75 opacity-80 blur-[80px]"></div>
            
            <div className="relative w-full max-w-[480px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 border border-gray-100 flex flex-col items-center justify-center aspect-square transform hover:-translate-y-2 transition-transform duration-500">
              
              {/* Gambar Logo Besar */}
              <div className="relative w-full h-full p-4 flex items-center justify-center pb-16">
                <img src={logoAmrita} alt="CV Amrita Jayasri Logo" className="w-[85%] h-[85%] object-contain" />
              </div>
              
              {/* Floating Card UI */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-5 border border-white/50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">TOTAL ASSET VALUE</p>
                  <p className="text-2xl font-black text-[#5452F6]">Rp 2.45B</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right flex flex-col items-end">
                    <p className="text-[10px] font-bold text-gray-500 mb-0.5">Active Stock</p>
                    <p className="text-xs font-black text-[#1E232C]">12,480 Units</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#5452F6] flex items-center justify-center text-white shadow-md shadow-indigo-200 shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 relative z-20">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="flex flex-col items-center text-center pt-4 md:pt-0">
            <h3 className="text-3xl font-black text-[#1E232C] mb-2">1.2k+</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">BARANG DIKELOLA</p>
          </div>
          <div className="flex flex-col items-center text-center pt-8 md:pt-0">
            <h3 className="text-3xl font-black text-[#1E232C] mb-2">100%</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">DATA AMAN</p>
          </div>
          <div className="flex flex-col items-center text-center pt-8 md:pt-0">
            <h3 className="text-3xl font-black text-[#5452F6] mb-2">40%</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">EFISIENSI WAKTU</p>
          </div>
        </div>
      </section>

      {/* ================= FITUR UTAMA ================= */}
      <section id="fitur" className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#1E232C] mb-4 tracking-tight">Fitur Utama</h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Solusi manajemen inventaris komprehensif yang dirancang untuk mendedikasikan efisiensi operasional CV. Amrita Jayasri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#F8FAFC] p-6 rounded-[24px] border border-gray-100 hover:shadow-lg hover:border-indigo-100 transition-all group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#5452F6] mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">Manajemen Multi-Gudang</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Pantau pergerakan stok di berbagai lokasi gudang dengan akurasi dan sinkronisasi realtime.</p>
            </div>
            
            <div className="bg-[#F8FAFC] p-6 rounded-[24px] border border-gray-100 hover:shadow-lg hover:border-indigo-100 transition-all group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#5452F6] mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">Analisis Prediktif Stok</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Hindari kehabisan barang dengan notifikasi batas minimum dan analisis kecepatan stok keluar.</p>
            </div>

            <div className="bg-[#F8FAFC] p-6 rounded-[24px] border border-gray-100 hover:shadow-lg hover:border-indigo-100 transition-all group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#5452F6] mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">Audit Log Keamanan</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Lacak setiap perubahan data dengan sistem riwayat modifikasi untuk transparansi audit.</p>
            </div>

            <div className="bg-[#F8FAFC] p-6 rounded-[24px] border border-gray-100 hover:shadow-lg hover:border-indigo-100 transition-all group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#5452F6] mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">Laporan Mudah</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Ekspor data secara instan ke format PDF atau Excel dengan filter data kustom yang kuat.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BENTO GRID / KEUNGGULAN ================= */}
      <section id="keunggulan" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-[#1E232C] mb-4 tracking-tight">Keunggulan Sistem</h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Arsitektur terstruktur untuk sebuah ekosistem performa tinggi dan efisiensi perusahaan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-7 bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10 max-w-md mb-8">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-[#5452F6] mb-6">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Monitoring Real-time</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">Pantau pergerakan stok, barang masuk, dan keluar setiap saat dari mana saja tanpa jeda sinkronisasi. Dashboard reaktif langsung menyajikan angka terbaru.</p>
              <div className="flex gap-3">
                <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold text-gray-600 uppercase tracking-wider">RESPONSIF</span>
                <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold text-gray-600 uppercase tracking-wider">AKURAT</span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-gradient-to-tl from-indigo-50 to-transparent rounded-tl-full opacity-50"></div>
          </div>

          <div className="lg:col-span-5 bg-[#F8FAFC] rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden">
             <div className="relative z-10">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-800 mb-6 shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Laporan Otomatis</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">Hasilkan rekapitulasi pergerakan inventaris dan neraca sisa akhir yang presisi untuk kebutuhan laporan keuangan maupun manajerial mingguan.</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between z-10">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-800">PDF Terunduh: Laporan_Q1</span>
                <span className="text-[10px] text-gray-400 mt-0.5">2.4 MB • 12 Hal</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-[#5452F6]" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-12 bg-[#1E232C] rounded-[32px] p-8 md:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="relative z-10 max-w-lg">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white mb-6 backdrop-blur-sm">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Sistem Integrasi Vendor</h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">Data base seluruh pemasok terpusat. Mudahkan manajemen proses PO (Purchase Order) dan melacak konsistensi pengiriman produk mentah dari relasi distributor utama Anda.</p>
              <button className="bg-white text-[#1E232C] px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all">Lihat Detail</button>
            </div>
            
            <div className="relative z-10 w-full md:w-1/2 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">DAFTAR VENDOR AKTIF</span>
                <span className="text-xs font-bold text-[#5452F6]">STATUS</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20"></div>
                    <div className="w-32 h-2 bg-white/20 rounded-full"></div>
                  </div>
                  <span className="text-[10px] px-2 py-1 bg-green-500/20 text-green-400 rounded-md font-bold">TERVERIFIKASI</span>
                </div>
                <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20"></div>
                    <div className="w-24 h-2 bg-white/20 rounded-full"></div>
                  </div>
                  <span className="text-[10px] px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-md font-bold">PENDING</span>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#5452F6] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
          </div>

        </div>
      </section>

      {/* ================= BIG BANNER CTA ================= */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#5452F6] rounded-[32px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-500/20">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Siap Mengoptimalkan Inventaris Anda?</h2>
            <p className="text-indigo-100 text-sm md:text-base leading-relaxed mb-10 max-w-xl mx-auto">
              Tingkatkan kinerja manajemen stok Anda hari ini. Bersama CV. Amrita Jayasri, hadirkan kemudahan pengelolaan gudang secara profesional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => onNavigate('login')}
                className="bg-white text-[#5452F6] px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-lg"
              >
                Mulai Sekarang
              </button>
              {/* TOMBOL HUBUNGI KAMI MENGARAH KE WHATSAPP */}
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-600/50 text-white border border-indigo-400/30 px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-indigo-600 transition-all backdrop-blur-sm flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <MessageCircle className="w-5 h-5" />
                Hubungi Tim Kami
              </a>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        </div>
      </section>

      {/* ================= MENGAPA MEMILIH KAMI ================= */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#1E232C] mb-4 tracking-tight">Mengapa Memilih Kami?</h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Keunggulan operasional yang menjadikan sistem ini fondasi andalan untuk kebutuhan inventaris Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-indigo-50 rounded-2xl flex items-center justify-center text-[#5452F6] mb-6">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">Akurasi Real-time</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Sinkronisasi data langsung, memastikan laporan dan stok yang ditampilkan adalah yang terbaru di detik tersebut.</p>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-indigo-50 rounded-2xl flex items-center justify-center text-[#5452F6] mb-6">
                <BarChart2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">Skalabilitas Tinggi</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Sistem yang dirancang agar dapat tumbuh bersama bisnis Anda, menampung ribuan transaksi setiap harinya.</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-indigo-50 rounded-2xl flex items-center justify-center text-[#5452F6] mb-6">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">Kemudahan Penggunaan</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Antarmuka antusias, dirancang bersih dan responsif, memudahkan staf mana pun untuk mengoperasikannya.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TENTANG & FOOTER ================= */}
      <section id="tentang" className="pt-20 pb-8 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-[#1E232C] mb-6 tracking-tight">Tentang Amrita Jayasri</h2>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-4">
                Berdedikasi untuk terus membantu manajemen efisiensi bisnis korporat. Inventaris digital yang inovatif dan efisien kami merangkul teknologi guna menciptakan alat produktivitas yang berdampak positif bagi pertumbuhan.
              </p>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                Visi kami adalah menjadikan setiap proses kerja perusahaan lebih mulus, transparan, dan terukur menuju era operasional digital yang cerdas dan terintegrasi.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-[#5452F6]">
                <h4 className="font-bold text-[#1E232C] mb-2">Inovasi Berkelanjutan</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Terus memperbarui sistem dengan teknologi terbaru.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-[#5452F6]">
                <h4 className="font-bold text-[#1E232C] mb-2">Keamanan Data Terjamin</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Memprioritaskan privasi dan keamanan infrastruktur data perusahaan.</p>
              </div>
            </div>
          </div>

          {/* Footer Line */}
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={logoAmrita} alt="Logo" className="w-6 h-6 object-contain" />
              <span className="font-bold text-sm text-gray-800">Amrita Jayasri</span>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">Privasi</a>
              <a href="#" className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">Ketentuan</a>
              <a href="#" className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">Kontak</a>
            </div>

            <p className="text-xs text-gray-400 font-medium">
              © {new Date().getFullYear()} CV. Amrita Jayasri.
            </p>
          </div>
        </div>
      </section>

      {/* ================= FLOATING WHATSAPP BUTTON ================= */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-lg shadow-green-500/30 hover:scale-110 hover:-translate-y-1 transition-all z-50 flex items-center justify-center group"
        aria-label="Chat on WhatsApp"
      >
        <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        <span className="absolute right-full mr-4 bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Hubungi Kami
        </span>
      </a>

    </div>
  );
};

export default LandingPage;