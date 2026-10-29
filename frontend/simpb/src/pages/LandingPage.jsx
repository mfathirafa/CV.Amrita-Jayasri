import React, { useState, useEffect } from 'react';
import { 
  LogIn, Lock, CheckCircle, LayoutDashboard, Package, 
  ArrowDownLeft, ArrowUpRight, Activity, FileText, 
  Check, Menu, X, ArrowRight, Headphones, ChevronRight 
} from 'lucide-react';

import logoAmrita from '../assets/Logo Amrita.png';

const LandingPage = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');

  // Link WhatsApp untuk administrator
  const whatsappLink = "https://wa.me/6282225191432";

  // Mengelola scroll background navbar & deteksi active section secara real-time
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Setup Intersection Observer untuk tracking section yang sedang dilihat
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ['beranda', 'features', 'about'];
    
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  // Fungsi untuk scroll ke target secara halus
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 72;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navLinkClass = (section) => `h-full flex items-center px-1 text-sm font-semibold border-b-2 transition-all duration-300 ${
    activeSection === section 
      ? 'text-[#5452F6] border-[#5452F6]' 
      : 'text-gray-500 border-transparent hover:text-[#5452F6] hover:border-gray-300'
  }`;

  const features = [
    { icon: LayoutDashboard, title: 'Dashboard', desc: 'Lihat ringkasan jumlah barang, total transaksi hari ini, grafik pergerakan stok, dan daftar transaksi terbaru — semuanya di satu halaman utama.', color: 'bg-[#FAEDFF] text-[#A855F7]' },
    { icon: Package, title: 'Data Barang', desc: 'Kelola master data seluruh item ATK: nama, kategori, satuan, stok minimum, harga, dan foto. Setiap item memiliki kode referensi unik (BRG-ATKxxx).', color: 'bg-[#EEF2FF] text-[#5452F6]' },
    { icon: ArrowDownLeft, title: 'Barang Masuk', desc: 'Catat setiap kedatangan stok dari pemasok lengkap dengan jumlah, harga beli, dan tanggal. Stok diperbarui otomatis setelah transaksi disimpan.', color: 'bg-[#ECFDF5] text-[#10B981]' },
    { icon: ArrowUpRight, title: 'Barang Keluar', desc: 'Rekam distribusi barang kepada konsumen beserta harga jual dan tanggal. Seluruh riwayat transaksi tersimpan permanen untuk keperluan audit.', color: 'bg-[#FEF3C7] text-[#F59E0B]' },
    { icon: Activity, title: 'Monitoring Stok', desc: 'Pantau sisa stok seluruh item secara real-time. Sistem memberi notifikasi otomatis ketika stok menyentuh batas minimum yang ditentukan.', color: 'bg-[#FEF2F2] text-[#EF4444]' },
    { icon: FileText, title: 'Laporan', desc: 'Ekspor data transaksi barang masuk, keluar, dan rekapitulasi stok ke format PDF atau Excel. Tersedia filter rentang tanggal yang fleksibel.', color: 'bg-[#EEF2FF] text-[#5452F6]' },
  ];

  const steps = [
    { icon: Lock, label: 'Login', desc: 'Masuk dengan akun terdaftar.', emoji: '🔑' },
    { icon: LayoutDashboard, label: 'Dashboard', desc: 'Tinjau status stok terkini.', emoji: '📊' },
    { icon: Package, label: 'Catat Barang', desc: 'Catat transaksi masuk/keluar.', emoji: '📦' },
    { icon: Activity, label: 'Monitoring', desc: 'Pantau batas minimum stok.', emoji: '📈' },
    { icon: FileText, label: 'Laporan', desc: 'Unduh PDF / Excel berkala.', emoji: '📄' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans antialiased flex flex-col selection:bg-[#5452F6]/20 selection:text-[#5452F6] overflow-x-hidden">
      
      {/* ================= NAVBAR ================= */}
      <nav className={`fixed top-0 left-0 right-0 z-50 h-16 md:h-[72px] transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-gray-100' 
          : 'bg-white border-gray-100/60'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer shrink-0" 
            onClick={() => scrollToSection('beranda')}
          >
            <img 
              alt="Logo CV. Amrita Jayasri" 
              className="h-10 w-10 object-contain hover:rotate-3 transition-transform duration-300" 
              src={logoAmrita} 
            />
            <span className="font-bold text-[#5452F6] text-lg">SIMPB</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 h-full">
            <a className={navLinkClass('beranda')} href="#beranda"
              onClick={(e) => { e.preventDefault(); scrollToSection('beranda'); }}>
              Beranda
            </a>
            <a className={navLinkClass('features')} href="#features"
              onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>
              Fitur
            </a>
            <a className={navLinkClass('about')} href="#about"
              onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
              Tentang
            </a>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a 
              className="hidden lg:inline-flex text-[#5452F6] border border-[#5452F6]/30 font-semibold px-4 py-2 rounded-xl hover:bg-[#F0EFFF] transition-all duration-300 text-sm" 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Hubungi Admin
            </a>
            <button 
              className="bg-[#5452F6] text-white font-semibold px-4 py-2 rounded-xl hover:bg-[#4341E3] transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/30 text-sm"
              onClick={() => onNavigate('login')}
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Masuk ke Sistem</span>
              <span className="sm:hidden">Masuk</span>
            </button>
            <button 
              className="md:hidden text-gray-500 hover:text-gray-800 transition-colors p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg py-4 px-4 flex flex-col gap-3 animate-in slide-in-from-top-2 fade-in">
            {[
              { id: 'beranda', label: 'Beranda' },
              { id: 'features', label: 'Fitur' },
              { id: 'about', label: 'Tentang' },
            ].map(item => (
              <a 
                key={item.id}
                className={`font-semibold py-2 px-3 rounded-xl transition-colors text-sm ${
                  activeSection === item.id ? 'text-[#5452F6] bg-[#F0EFFF]' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`} 
                href={`#${item.id}`}
                onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); scrollToSection(item.id); }}
              >
                {item.label}
              </a>
            ))}
            <hr className="border-gray-100" />
            <a 
              className="text-gray-500 font-semibold hover:text-[#5452F6] transition-colors py-2 px-3 text-sm" 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Hubungi Admin
            </a>
            <button 
              className="bg-[#5452F6] text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-[#4341E3] transition-colors flex items-center justify-center gap-2 cursor-pointer w-full text-center shadow-lg shadow-indigo-500/30 text-sm"
              onClick={() => { setIsMobileMenuOpen(false); onNavigate('login'); }}
            >
              <LogIn className="w-4 h-4" />
              Masuk ke Sistem
            </button>
          </div>
        )}
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-grow pt-16 md:pt-[72px]">
        
        {/* Hero Section */}
        <section id="beranda" className="relative bg-white min-h-[480px] md:min-h-[560px] flex items-center overflow-hidden py-12 md:py-20 border-b border-gray-100">
          <div className="absolute inset-0 z-0">
            <img 
              alt="Warehouse Background" 
              className="w-full h-full object-cover opacity-[0.06]" 
              src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAEui3VcdwNeRbzPJz7u__UAZj69kUt_1uuvkJvxLc0lmF4rid8AwTuoP_lwTxoQmUcKMZH_VwzPhmBnyYKc14ZaIpwCl22oifPaa5W7vZY0_cOkSn7zgoF-PFGWERkkGS1DayOf=w1200-h900-k-no" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 flex flex-col gap-4 text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-800 leading-tight tracking-tight">
                Kelola Persediaan Barang dengan Cepat, Akurat, dan Terintegrasi
              </h1>
              <p className="text-sm md:text-base text-gray-500 max-w-2xl mt-1 leading-relaxed">
                SIMPB membantu staf CV. Amrita Jayasri mencatat barang masuk dan keluar, memantau stok secara real-time, mengelola data pemasok dan pelanggan, serta menghasilkan laporan secara otomatis.
              </p>
              
              {/* Call To Action */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full">
                <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                  <span className="text-[11px] text-gray-400 font-medium">Sudah memiliki akun?</span>
                  <button 
                    className="bg-[#5452F6] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#4341E3] transition-all duration-300 text-center shadow-lg shadow-indigo-500/30 cursor-pointer text-sm flex items-center justify-center gap-2"
                    onClick={() => onNavigate('login')}
                  >
                    Masuk ke Sistem <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                  <span className="text-[11px] text-gray-400 font-medium">Belum memiliki akun?</span>
                  <a 
                    className="border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 hover:border-[#5452F6]/30 transition-all duration-300 text-center bg-white flex items-center justify-center text-sm shadow-sm" 
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Hubungi Administrator
                  </a>
                </div>
              </div>

              <div className="flex items-start sm:items-center gap-2.5 mt-4 text-gray-500 text-xs bg-[#F4F7FC] p-3 rounded-xl border border-gray-100 w-fit">
                <Lock className="w-4 h-4 text-[#5452F6] shrink-0 mt-0.5 sm:mt-0" />
                <span>Akses dibatasi untuk staf yang terdaftar. Jika belum memiliki akun, hubungi administrator.</span>
              </div>
            </div>
            
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative h-[460px] w-full rounded-[20px] overflow-hidden border border-gray-100 shadow-sm">
                <img 
                  alt="Warehouse Staff" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAGQK6rhrGZ86zjWCdR7eeB6O0F898OS5OVke9eF-RVvnc2LHQZBcZBpquWsZ3a_-asbZefPmmyt50Ql793sgX7t_5RI8iCqRNc_LQ5yEyjgzMVHcSsiRIW3Olxcm2rVJ9swPNvN=w800-h1300-k-no" 
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-[16px] border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center text-[#10B981] shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Sistem Aktif</p>
                    <p className="text-gray-400 text-xs font-medium">Terhubung ke database pusat</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="border-b border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex overflow-x-auto sm:grid sm:grid-cols-3 divide-x divide-gray-100 gap-0 snap-x snap-mandatory scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[
              { value: 'Real-time', label: 'Monitoring Pergerakan Stok' },
              { value: 'PDF & Excel', label: 'Format Laporan Tersedia' },
              { value: '24/7', label: 'Akses Sistem Internal Staf' },
            ].map((stat, i) => (
              <div key={i} className="py-3 md:py-0 px-6 flex flex-col items-center sm:items-start text-center sm:text-left min-w-[200px] sm:min-w-0 snap-center shrink-0">
                <span className="text-xl md:text-2xl text-[#5452F6] font-bold">{stat.value}</span>
                <span className="text-gray-400 mt-1 uppercase tracking-wider text-[10px] font-bold">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-8" id="features">
          <div className="text-center mb-10 md:mb-12">
            <p className="text-[10px] md:text-[11px] font-bold text-[#5452F6] uppercase tracking-widest mb-2">Fitur Unggulan</p>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">Apa saja yang bisa dilakukan di SIMPB?</h2>
            <p className="text-xs md:text-sm text-gray-500 max-w-2xl mx-auto mb-4">
              Semua kebutuhan manajemen persediaan barang tersedia dalam satu platform yang mudah digunakan oleh seluruh tim operasional.
            </p>
            <div className="w-12 h-1 bg-[#5452F6] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feat, i) => (
              <div key={i} className="bg-white rounded-[20px] p-5 md:p-6 border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col shadow-sm">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-4 ${feat.color} group-hover:scale-110 transition-transform shrink-0`}>
                  <feat.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-800 mb-2 text-base md:text-lg">{feat.title}</h3>
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Workflow Section */}
        <section className="bg-[#F4F7FC] py-12 md:py-20 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-10 md:mb-12">
              <p className="text-[10px] md:text-[11px] font-bold text-[#5452F6] uppercase tracking-widest mb-2">Cara menggunakan sistem</p>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">Alur Penggunaan Sistem</h2>
              <div className="w-12 h-1 bg-[#5452F6] mx-auto rounded-full"></div>
            </div>
            
            <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 pb-2 sm:pb-0 snap-x snap-mandatory scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {steps.map((step, i) => (
                <div key={i} className={`relative bg-white p-5 md:p-6 rounded-[20px] border text-center flex flex-col items-center hover:-translate-y-1 hover:shadow-md transition-all duration-300 shadow-sm min-w-[200px] sm:min-w-0 snap-center shrink-0 ${
                  i === steps.length - 1 ? 'border-[#5452F6]/20 bg-[#F0EFFF]/30' : 'border-gray-100'
                }`}>
                  <div className={`w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4 z-10 relative shadow-sm ${
                    i === steps.length - 1 ? 'bg-[#5452F6] text-white' : 'bg-[#5452F6] text-white'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <h4 className={`font-bold mb-1.5 text-sm ${
                    i === steps.length - 1 ? 'text-[#5452F6]' : 'text-gray-800'
                  }`}>{step.emoji} {i + 1}. {step.label}</h4>
                  <p className="text-xs text-gray-500">{step.desc}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:flex absolute top-11 -right-[18px] w-8 items-center justify-center z-0">
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-8" id="about">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="rounded-[20px] overflow-hidden border border-gray-100 shadow-sm h-[250px] md:h-[400px] relative">
              <img 
                alt="Warehouse Operations CV Amrita Jayasri" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAGVVUzbPJRv0CGh8x5WcCiKNylI7F8enoEfi05f66l7M5yFW8cEBvnBLlWixoFg1y_gii-3d2VUo1wZHGNZRNUAvkVM4A5uat182oLRGIBOZGyA59YJi1txck4vTTuCUjNjR1yG=w1200-h900-k-no" 
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="mb-1">
                <p className="text-[10px] md:text-[11px] font-bold text-[#5452F6] uppercase tracking-widest mb-2">Profil Perusahaan</p>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Tentang CV. Amrita Jayasri</h2>
                <div className="w-12 h-1 bg-[#5452F6] rounded-full"></div>
              </div>
              <div className="flex flex-col gap-4 text-xs md:text-sm text-gray-500 leading-relaxed">
                <p>
                  CV. Amrita Jayasri adalah perusahaan yang bergerak di bidang perdagangan alat tulis kantor, perlengkapan sekolah, supplies komputer, dan jasa pendukung perkantoran. Berlokasi di Purbalingga, Jawa Tengah, kami melayani kebutuhan instansi, sekolah, dan kantor di seluruh wilayah.
                </p>
                <p>
                  SIMPB dibangun untuk mendukung efisiensi operasional internal — dari pencatatan stok hingga pelaporan transaksi — agar tim dapat bekerja lebih cepat, akurat, dan terstruktur.
                </p>
              </div>
              <ul className="mt-2 space-y-3">
                {[
                  'Distributor terpercaya berskala regional',
                  'Fokus pada efisiensi operasional dan transparansi',
                  'Sistem inventaris terstandarisasi'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-md bg-[#ECFDF5] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="text-[#10B981] w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm text-gray-800 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white w-full border-t border-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto py-10 md:py-12 px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Col 1: System Info & Version */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5 mb-1">
              <img 
                alt="Logo Mini" 
                className="h-7 w-7 object-contain" 
                src={logoAmrita} 
              />
              <span className="font-bold text-gray-800 text-sm">SIMPB - CV. Amrita Jayasri</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Sistem Informasi Manajemen Persediaan Barang internal untuk pencatatan logistik, monitoring sisa stok, dan penyusunan laporan transaksi.
            </p>
            <span className="text-[10px] font-semibold bg-[#F4F7FC] border border-gray-100 text-gray-500 px-2.5 py-1 rounded-full w-fit mt-1">
              Versi Sistem v1.0
            </span>
          </div>

          {/* Col 2: Alamat Perusahaan */}
          <div className="flex flex-col gap-2">
            <h5 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Alamat Perusahaan</h5>
            <p className="text-xs text-gray-500 leading-relaxed">
              Purwokerto, Jawa Tengah, Indonesia.<br />
              Melayani kebutuhan instansi pemerintahan, perkantoran, dan jaringan sekolah regional.
            </p>
          </div>

          {/* Col 3: Layanan Hubungi Admin */}
          <div className="flex flex-col gap-2">
            <h5 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Kontak Administrator</h5>
            <p className="text-xs text-gray-500">
              WhatsApp: <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-[#5452F6] transition-colors font-semibold text-gray-800">+62 822-2519-1432</a>
            </p>
            <p className="text-xs text-gray-500">
              Email: <span className="font-semibold text-gray-800">cv.amritajayasri@gmail.com</span>
            </p>
            <div className="mt-2">
              <a 
                className="border border-gray-200 bg-white px-4 py-2 rounded-xl font-semibold text-gray-700 hover:border-[#5452F6]/30 hover:text-[#5452F6] transition-all duration-300 flex items-center gap-2 text-xs w-fit shadow-sm" 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Headphones className="w-3.5 h-3.5" />
                Hubungi Administrator
              </a>
            </div>
          </div>

        </div>

        {/* Bottom row */}
        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto py-4 px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} CV. Amrita Jayasri. Semua hak dilindungi.
            </p>
            <p className="text-xs text-gray-400">
              Sistem ini hanya untuk staf internal CV. Amrita Jayasri.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;