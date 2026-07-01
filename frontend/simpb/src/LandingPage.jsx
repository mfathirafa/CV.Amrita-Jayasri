import React, { useState, useEffect } from 'react';
import { 
  LogIn, Lock, CheckCircle, LayoutDashboard, Package, 
  ArrowDownLeft, ArrowUpRight, Activity, FileText, 
  Check, Menu, X, ArrowRight, Headphones 
} from 'lucide-react';

import logoAmrita from './assets/Logo Amrita.png';

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
      rootMargin: '-30% 0px -50% 0px', // Membaca section aktif saat berada di area tengah layar
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
      const offset = 64; // Tinggi navbar (h-16 = 64px)
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

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md antialiased flex flex-col selection:bg-primary-container selection:text-on-primary overflow-x-hidden">
      
      {/* ================= NAVBAR ================= */}
      <nav className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-surface/90 backdrop-blur-md shadow-sm border-outline-variant' 
          : 'bg-surface border-outline-variant/60'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer shrink-0" 
            onClick={() => scrollToSection('beranda')}
          >
            <img 
              alt="Logo CV. Amrita Jayasri" 
              className="h-10 w-10 object-contain rounded-DEFAULT hover:rotate-3 transition-transform duration-300" 
              src={logoAmrita} 
            />
            <span className="font-headline-lg text-headline-lg font-bold text-primary">SIMPB</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 h-full">
            <a 
              className={`h-full flex items-center px-1 font-label-bold border-b-2 transition-all duration-300 ${
                activeSection === 'beranda' 
                  ? 'text-primary border-primary' 
                  : 'text-secondary border-transparent hover:text-primary hover:border-outline-variant'
              }`} 
              href="#beranda"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('beranda');
              }}
            >
              Beranda
            </a>
            <a 
              className={`h-full flex items-center px-1 font-label-bold border-b-2 transition-all duration-300 ${
                activeSection === 'features' 
                  ? 'text-primary border-primary' 
                  : 'text-secondary border-transparent hover:text-primary hover:border-outline-variant'
              }`} 
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('features');
              }}
            >
              Fitur
            </a>
            <a 
              className={`h-full flex items-center px-1 font-label-bold border-b-2 transition-all duration-300 ${
                activeSection === 'about' 
                  ? 'text-primary border-primary' 
                  : 'text-secondary border-transparent hover:text-primary hover:border-outline-variant'
              }`} 
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('about');
              }}
            >
              Tentang
            </a>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a 
              className="hidden lg:inline-flex text-primary border border-primary font-label-bold text-label-bold px-4 py-2 rounded-lg hover:bg-surface-container-low hover:scale-105 transition-all duration-300 text-sm" 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Hubungi Administrator
            </a>
            <button 
              className="bg-primary-container text-on-primary font-label-bold text-label-bold px-4 py-2 rounded-lg hover:bg-primary hover:scale-105 transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm text-sm"
              onClick={() => onNavigate('login')}
            >
              <LogIn className="w-4 h-4" />
              Masuk ke Sistem
            </button>
            <button 
              className="md:hidden text-secondary hover:text-primary transition-colors p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-surface border-b border-outline-variant shadow-lg py-4 px-4 flex flex-col gap-4">
            <a 
              className={`font-label-bold py-1 transition-colors ${
                activeSection === 'beranda' ? 'text-primary' : 'text-secondary hover:text-primary'
              }`} 
              href="#beranda" 
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                scrollToSection('beranda');
              }}
            >
              Beranda
            </a>
            <a 
              className={`font-label-bold py-1 transition-colors ${
                activeSection === 'features' ? 'text-primary' : 'text-secondary hover:text-primary'
              }`} 
              href="#features" 
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                scrollToSection('features');
              }}
            >
              Fitur
            </a>
            <a 
              className={`font-label-bold py-1 transition-colors ${
                activeSection === 'about' ? 'text-primary' : 'text-secondary hover:text-primary'
              }`} 
              href="#about" 
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                scrollToSection('about');
              }}
            >
              Tentang
            </a>
            <hr className="border-outline-variant/60" />
            <a 
              className="text-secondary font-label-bold hover:text-primary transition-colors py-1" 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Hubungi Administrator
            </a>
            <button 
              className="bg-primary-container text-on-primary font-label-bold text-label-bold px-4 py-2.5 rounded-lg hover:bg-primary transition-colors flex items-center justify-center gap-2 cursor-pointer w-full text-center"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('login');
              }}
            >
              <LogIn className="w-4 h-4" />
              Masuk ke Sistem
            </button>
          </div>
        )}
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-grow pt-16">
        
        {/* Hero Section */}
        <section id="beranda" className="relative bg-surface-container-highest min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden py-12 md:py-20">
          <div className="absolute inset-0 z-0">
            <img 
              alt="Warehouse Background" 
              className="w-full h-full object-cover opacity-10 mix-blend-multiply" 
              src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAEui3VcdwNeRbzPJz7u__UAZj69kUt_1uuvkJvxLc0lmF4rid8AwTuoP_lwTxoQmUcKMZH_VwzPhmBnyYKc14ZaIpwCl22oifPaa5W7vZY0_cOkSn7zgoF-PFGWERkkGS1DayOf=w1200-h900-k-no" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/95 to-transparent"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 flex flex-col gap-4 text-left">
              <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-on-surface leading-tight tracking-tight">
                Kelola Persediaan Barang dengan Cepat, Akurat, dan Terintegrasi
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-2 leading-relaxed">
                SIMPB membantu staf CV. Amrita Jayasri mencatat barang masuk dan keluar, memantau stok secara real-time, mengelola data pemasok dan pelanggan, serta menghasilkan laporan secara otomatis.
              </p>
              
              {/* Call To Action & W-Full Buttons for Mobile */}
              <div className="flex flex-col sm:flex-row gap-6 pt-4 w-full">
                <div className="flex flex-col gap-1.5 flex-1 w-full sm:max-w-[240px]">
                  <span className="text-xs text-secondary font-medium">Sudah memiliki akun?</span>
                  <button 
                    className="bg-primary-container text-on-primary font-label-bold text-label-bold px-6 py-3 rounded-lg hover:bg-primary hover:scale-105 transition-all duration-300 text-center shadow-sm cursor-pointer w-full"
                    onClick={() => onNavigate('login')}
                  >
                    Masuk ke Sistem
                  </button>
                </div>
                <div className="flex flex-col gap-1.5 flex-1 w-full sm:max-w-[240px]">
                  <span className="text-xs text-secondary font-medium">Belum memiliki akun?</span>
                  <a 
                    className="border border-primary-container text-primary-container font-label-bold text-label-bold px-6 py-3 rounded-lg hover:bg-surface-container-low hover:scale-105 transition-all duration-300 text-center bg-surface flex items-center justify-center w-full" 
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Hubungi Administrator
                  </a>
                </div>
              </div>

              <div className="flex items-start sm:items-center gap-2 mt-6 text-secondary text-body-sm font-body-sm bg-surface/50 p-3 rounded-lg border border-outline-variant/50 w-fit">
                <Lock className="w-[18px] h-[18px] text-primary-container shrink-0 mt-0.5 sm:mt-0" />
                <span>Akses dibatasi untuk staf yang terdaftar. Jika belum memiliki akun, hubungi administrator.</span>
              </div>
            </div>
            
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative h-[480px] w-full rounded-xl overflow-hidden border-4 border-surface shadow-md">
                <img 
                  alt="Warehouse Staff" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAGQK6rhrGZ86zjWCdR7eeB6O0F898OS5OVke9eF-RVvnc2LHQZBcZBpquWsZ3a_-asbZefPmmyt50Ql793sgX7t_5RI8iCqRNc_LQ5yEyjgzMVHcSsiRIW3Olxcm2rVJ9swPNvN=w800-h1300-k-no" 
                />
                <div className="absolute bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-sm p-4 rounded-lg border border-outline-variant shadow-sm flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-success-green/20 flex items-center justify-center text-success-green shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-label-bold text-label-bold text-on-surface text-sm">Sistem Aktif</p>
                    <p className="font-body-sm text-body-sm text-secondary text-xs">Terhubung ke database pusat</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="border-y border-outline-variant bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-outline-variant">
            <div className="py-4 md:py-0 md:px-6 flex flex-col items-center md:items-start text-center md:text-left">
              <span className="font-headline-xl text-headline-xl text-primary-container font-bold">Real-time</span>
              <span className="font-label-bold text-label-bold text-secondary mt-1 uppercase tracking-wider text-xs">Monitoring Pergerakan Stok</span>
            </div>
            <div className="py-4 md:py-0 md:px-6 flex flex-col items-center md:items-start text-center md:text-left">
              <span className="font-headline-xl text-headline-xl text-primary-container font-bold">PDF &amp; Excel</span>
              <span className="font-label-bold text-label-bold text-secondary mt-1 uppercase tracking-wider text-xs">Format Laporan Tersedia</span>
            </div>
            <div className="py-4 md:py-0 md:px-6 flex flex-col items-center md:items-start text-center md:text-left">
              <span className="font-headline-xl text-headline-xl text-primary-container font-bold">24/7</span>
              <span className="font-label-bold text-label-bold text-secondary mt-1 uppercase tracking-wider text-xs">Akses Sistem Internal Staf</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-8" id="features">
          <div className="text-center mb-12">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Apa saja yang bisa dilakukan di SIMPB?</h2>
            <p className="font-body-md text-secondary max-w-2xl mx-auto mb-4">
              Semua kebutuhan manajemen persediaan barang tersedia dalam satu platform yang mudah digunakan oleh seluruh tim operasional.
            </p>
            <div className="w-16 h-1 bg-primary-container mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-surface rounded-xl p-6 border border-outline-variant hover:border-primary-container hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col">
              <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center text-primary-container mb-4 group-hover:bg-primary-container group-hover:text-on-primary transition-colors shrink-0">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="font-label-bold text-label-bold text-on-surface mb-2 text-lg">Dashboard</h3>
                <p className="font-body-sm text-body-sm text-secondary leading-relaxed">
                  Lihat ringkasan jumlah barang, total transaksi hari ini, grafik pergerakan stok, dan daftar transaksi terbaru — semuanya di satu halaman utama.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-surface rounded-xl p-6 border border-outline-variant hover:border-primary-container hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col">
              <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center text-primary-container mb-4 group-hover:bg-primary-container group-hover:text-on-primary transition-colors shrink-0">
                <Package className="w-6 h-6" />
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="font-label-bold text-label-bold text-on-surface mb-2 text-lg">Data Barang</h3>
                <p className="font-body-sm text-body-sm text-secondary leading-relaxed">
                  Kelola master data seluruh item ATK: nama, kategori, satuan, stok minimum, harga, dan foto. Setiap item memiliki kode referensi unik (BRG-ATKxxx).
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-surface rounded-xl p-6 border border-outline-variant hover:border-primary-container hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col">
              <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center text-success-green mb-4 group-hover:bg-success-green group-hover:text-white transition-colors shrink-0">
                <ArrowDownLeft className="w-6 h-6" />
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="font-label-bold text-label-bold text-on-surface mb-2 text-lg">Barang Masuk</h3>
                <p className="font-body-sm text-body-sm text-secondary leading-relaxed">
                  Catat setiap kedatangan stok dari pemasok lengkap dengan jumlah, harga beli, dan tanggal. Stok diperbarui otomatis setelah transaksi disimpan.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-surface rounded-xl p-6 border border-outline-variant hover:border-primary-container hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col">
              <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center text-warning-orange mb-4 group-hover:bg-warning-orange group-hover:text-white transition-colors shrink-0">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="font-label-bold text-label-bold text-on-surface mb-2 text-lg">Barang Keluar</h3>
                <p className="font-body-sm text-body-sm text-secondary leading-relaxed">
                  Rekam distribusi barang kepada konsumen beserta harga jual dan tanggal. Seluruh riwayat transaksi tersimpan permanen untuk keperluan audit.
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-surface rounded-xl p-6 border border-outline-variant hover:border-primary-container hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col">
              <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center text-primary-container mb-4 group-hover:bg-primary-container group-hover:text-on-primary transition-colors shrink-0">
                <Activity className="w-6 h-6" />
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="font-label-bold text-label-bold text-on-surface mb-2 text-lg">Monitoring Stok</h3>
                <p className="font-body-sm text-body-sm text-secondary leading-relaxed">
                  Pantau sisa stok seluruh item secara real-time. Sistem memberi notifikasi otomatis ketika stok menyentuh batas minimum yang ditentukan.
                </p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="bg-surface rounded-xl p-6 border border-outline-variant hover:border-primary-container hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col">
              <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center text-primary-container mb-4 group-hover:bg-primary-container group-hover:text-on-primary transition-colors shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="font-label-bold text-label-bold text-on-surface mb-2 text-lg">Laporan</h3>
                <p className="font-body-sm text-body-sm text-secondary leading-relaxed">
                  Ekspor data transaksi barang masuk, keluar, dan rekapitulasi stok ke format PDF atau Excel. Tersedia filter rentang tanggal yang fleksibel.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Workflow Section */}
        <section className="bg-surface-container-low py-12 md:py-20 border-y border-outline-variant/60">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <span className="text-primary-container font-label-bold text-xs uppercase tracking-widest block mb-1">Cara menggunakan sistem</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Alur Penggunaan Sistem</h2>
              <div className="w-16 h-1 bg-primary-container mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              
              {/* Step 1 */}
              <div className="relative bg-surface p-6 rounded-xl border border-outline-variant text-center flex flex-col items-center hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-bold mb-4 z-10 relative shadow-sm">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="font-label-bold text-label-bold text-on-surface mb-2">🔑 1. Login</h4>
                <p className="font-body-sm text-body-sm text-secondary">Masuk dengan akun terdaftar.</p>
                <div className="hidden lg:block absolute top-12 -right-4 w-8 h-[2px] bg-outline-variant z-0"></div>
              </div>

              {/* Step 2 */}
              <div className="relative bg-surface p-6 rounded-xl border border-outline-variant text-center flex flex-col items-center hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-bold mb-4 z-10 relative shadow-sm">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <h4 className="font-label-bold text-label-bold text-on-surface mb-2">📊 2. Dashboard</h4>
                <p className="font-body-sm text-body-sm text-secondary">Tinjau status stok terkini.</p>
                <div className="hidden lg:block absolute top-12 -right-4 w-8 h-[2px] bg-outline-variant z-0"></div>
              </div>

              {/* Step 3 */}
              <div className="relative bg-surface p-6 rounded-xl border border-outline-variant text-center flex flex-col items-center hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-bold mb-4 z-10 relative shadow-sm">
                  <Package className="w-5 h-5" />
                </div>
                <h4 className="font-label-bold text-label-bold text-on-surface mb-2">📦 3. Catat Barang</h4>
                <p className="font-body-sm text-body-sm text-secondary">Catat transaksi masuk/keluar.</p>
                <div className="hidden lg:block absolute top-12 -right-4 w-8 h-[2px] bg-outline-variant z-0"></div>
              </div>

              {/* Step 4 */}
              <div className="relative bg-surface p-6 rounded-xl border border-outline-variant text-center flex flex-col items-center hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-bold mb-4 z-10 relative shadow-sm">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="font-label-bold text-label-bold text-on-surface mb-2">📈 4. Monitoring</h4>
                <p className="font-body-sm text-body-sm text-secondary">Pantau batas minimum stok.</p>
                <div className="hidden lg:block absolute top-12 -right-4 w-8 h-[2px] bg-outline-variant z-0"></div>
              </div>

              {/* Step 5 */}
              <div className="relative bg-surface p-6 rounded-xl border border-primary-container/30 text-center flex flex-col items-center bg-primary-container/5 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-bold mb-4 z-10 relative shadow-sm">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-label-bold text-label-bold text-primary mb-2">📄 5. Laporan</h4>
                <p className="font-body-sm text-body-sm text-secondary">Unduh PDF / Excel berkala.</p>
              </div>

            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-8" id="about">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="rounded-xl overflow-hidden border border-outline-variant shadow-sm h-[250px] md:h-[400px] relative">
              <img 
                alt="Warehouse Operations CV Amrita Jayasri" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAGVVUzbPJRv0CGh8x5WcCiKNylI7F8enoEfi05f66l7M5yFW8cEBvnBLlWixoFg1y_gii-3d2VUo1wZHGNZRNUAvkVM4A5uat182oLRGIBOZGyA59YJi1txck4vTTuCUjNjR1yG=w1200-h900-k-no" 
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="mb-2">
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Tentang CV. Amrita Jayasri</h2>
                <div className="w-16 h-1 bg-primary-container rounded-full"></div>
              </div>
              <div className="flex flex-col gap-4 font-body-md text-body-md text-secondary leading-relaxed">
                <p>
                  CV. Amrita Jayasri adalah perusahaan yang bergerak di bidang perdagangan alat tulis kantor, perlengkapan sekolah, supplies komputer, dan jasa pendukung perkantoran. Berlokasi di Purbalingga, Jawa Tengah, kami melayani kebutuhan instansi, sekolah, dan kantor di seluruh wilayah.
                </p>
                <p>
                  SIMPB dibangun untuk mendukung efisiensi operasional internal — dari pencatatan stok hingga pelaporan transaksi — agar tim dapat bekerja lebih cepat, akurat, dan terstruktur.
                </p>
              </div>
              <ul className="mt-2 space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="text-primary-container mt-0.5 w-5 h-5 shrink-0" />
                  <span className="font-body-md text-body-md text-on-surface">Distributor terpercaya berskala regional</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-primary-container mt-0.5 w-5 h-5 shrink-0" />
                  <span className="font-body-md text-body-md text-on-surface">Fokus pada efisiensi operasional dan transparansi</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-primary-container mt-0.5 w-5 h-5 shrink-0" />
                  <span className="font-body-md text-body-md text-on-surface">Sistem inventaris terstandarisasi</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
        
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-surface-container-low w-full border-t border-outline-variant mt-auto">
        <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Col 1: System Info & Version */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <img 
                alt="Logo Mini" 
                className="h-6 w-6 object-contain rounded-DEFAULT hover:rotate-3 transition-transform duration-300" 
                src={logoAmrita} 
              />
              <span className="font-label-bold text-label-bold text-on-surface">SIMPB - CV. Amrita Jayasri</span>
            </div>
            <p className="font-body-sm text-body-sm text-secondary text-xs leading-relaxed">
              Sistem Informasi Manajemen Persediaan Barang internal untuk pencatatan logistik, monitoring sisa stok, dan penyusunan laporan transaksi.
            </p>
            <span className="text-[10px] font-mono-data bg-surface border border-outline-variant/60 text-secondary px-2.5 py-0.5 rounded-full w-fit mt-1">
              Versi Sistem v1.0
            </span>
          </div>

          {/* Col 2: Alamat Perusahaan */}
          <div className="flex flex-col gap-2">
            <h5 className="font-label-bold text-label-bold text-on-surface text-sm uppercase tracking-wider">Alamat Perusahaan</h5>
            <p className="font-body-sm text-body-sm text-secondary text-xs leading-relaxed">
              Purwokerto, Jawa Tengah, Indonesia.<br />
              Melayani kebutuhan instansi pemerintahan, perkantoran, dan jaringan sekolah regional.
            </p>
          </div>

          {/* Col 3: Layanan Hubungi Admin */}
          <div className="flex flex-col gap-2">
            <h5 className="font-label-bold text-label-bold text-on-surface text-sm uppercase tracking-wider">Kontak Administrator</h5>
            <p className="font-body-sm text-body-sm text-secondary text-xs">
              WhatsApp: <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium text-on-surface">+62 822-2519-1432</a>
            </p>
            <p className="font-body-sm text-body-sm text-secondary text-xs">
              Email: <span className="font-medium text-on-surface">cv.amritajayasri@gmail.com</span>
            </p>
            <div className="mt-2">
              <a 
                className="border border-outline-variant bg-surface px-4 py-2 rounded-lg font-label-bold text-label-bold text-on-surface hover:border-primary-container hover:text-primary-container transition-all hover:scale-105 duration-300 flex items-center gap-2 text-xs w-fit shadow-sm" 
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
        <div className="border-t border-outline-variant/60 bg-surface-container-low/50">
          <div className="max-w-7xl mx-auto py-4 px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
            <p className="font-body-sm text-body-sm text-secondary text-xs">
              &copy; {new Date().getFullYear()} CV. Amrita Jayasri. Semua hak dilindungi.
            </p>
            <p className="font-body-sm text-body-sm text-secondary text-xs">
              Sistem ini hanya untuk staf internal CV. Amrita Jayasri.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;