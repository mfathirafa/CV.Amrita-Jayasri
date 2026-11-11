import React, { useState, useEffect } from 'react';
import { 
  LogIn, Lock, CheckCircle, LayoutDashboard, Package, 
  ArrowDownLeft, ArrowUpRight, Activity, FileText, 
  Check, Menu, X, ArrowRight, Headphones, ChevronRight,
  Building2, Truck, Coffee, Sparkles, ShieldCheck, 
  MapPin, Phone, Mail, Clock, HelpCircle, ChevronDown, 
  Award, Briefcase
} from 'lucide-react';

import logoAmrita from '../assets/Logo Amrita.png';

const LandingPage = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Link WhatsApp resmi CV. Amrita Jayasri untuk kebutuhan pengadaan & administrator
  const whatsappPengadaan = "https://wa.me/6282225191432?text=Halo%20CV.%20Amrita%20Jayasri,%20saya%20ingin%20konsultasi%20mengenai%20layanan%20pengadaan%20barang/jasa.";
  const whatsappAdmin = "https://wa.me/6282225191432?text=Halo%20Admin%20SIMPB%20CV.%20Amrita%20Jayasri,%20saya%20memerlukan%20bantuan%20akun%20sistem.";

  // Mengelola scroll background navbar & deteksi active section secara real-time
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Setup Intersection Observer untuk tracking section yang sedang dilihat
    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -45% 0px',
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
    const sections = ['beranda', 'layanan', 'keunggulan', 'features', 'about', 'faq'];
    
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

  // 1. Katalog Layanan Pengadaan CV. Amrita Jayasri
  const layananPengadaan = [
    {
      icon: Package,
      title: 'Alat Tulis Kantor (ATK) & Office Supplies',
      desc: 'Pengadaan kertas HVS (A4, F4, Folio), pulpen, binder, map ordner, continuous form, amplop, tinta stempel, serta perlengkapan arsip dan administrasi perkantoran lengkap.',
      color: 'bg-[#EEF2FF] text-[#5452F6]',
      tag: 'Kebutuhan Harian'
    },
    {
      icon: Sparkles,
      title: 'Perlengkapan Kebersihan (Cleaning Equipment)',
      desc: 'Penyediaan sabun sanitasi, disinfektan medis/umum, pembersih lantai, wiper, kain microfiber, sapu, alat pel lantai, hingga tempat sampah standar medis dan umum.',
      color: 'bg-[#ECFDF5] text-[#10B981]',
      tag: 'Sanitasi & RS'
    },
    {
      icon: Coffee,
      title: 'Jasa Katering & Konsumsi Kedinasan',
      desc: 'Layanan katering higienis dan berselera: snack box rapat kedinasan, nasi kotak rapat instansi, coffee break, dan menu prasmanan untuk acara formal.',
      color: 'bg-[#FEF3C7] text-[#F59E0B]',
      tag: 'Acara & Rapat'
    },
    {
      icon: Building2,
      title: 'Supplies Komputer & IT Perkantoran',
      desc: 'Tinta & toner printer original/compatible, pita ribbon, mouse, keyboard, flashdisk, peripheral komputer, dan aksesoris penunjang produktivitas digital kantor.',
      color: 'bg-[#FAEDFF] text-[#A855F7]',
      tag: 'Perangkat Digital'
    },
    {
      icon: Truck,
      title: 'Logistik & Transportasi Operasional',
      desc: 'Dukungan armada distribusi teratur dan tepat waktu ke kantor pemerintahan, sekolah, rumah sakit, dan mitra swasta di seluruh wilayah Banyumas Raya.',
      color: 'bg-[#FEF2F2] text-[#EF4444]',
      tag: 'Pengiriman Cepat'
    },
    {
      icon: Briefcase,
      title: 'Sarana Pertanian & Jasa Terpadu',
      desc: 'Penyediaan bibit, pupuk, alat pertanian, dan pengadaan sarana khusus sesuai kebutuhan program instansi atau dinas terkait.',
      color: 'bg-[#F0FDF4] text-[#16A34A]',
      tag: 'Layanan Khusus'
    }
  ];

  // 2. Keunggulan CV. Amrita Jayasri
  const keunggulanList = [
    {
      icon: ShieldCheck,
      title: 'Legalitas Usaha Resmi & Terpercaya',
      desc: 'CV. Amrita Jayasri memiliki izin operasional resmi, terdaftar, dan siap memenuhi standar dokumen perpajakan (faktur pajak, SPK, BAST) instansi pemerintah maupun swasta.'
    },
    {
      icon: Award,
      title: 'Kemitraan Instansi Ternama',
      desc: 'Berpengalaman menyuplai pengadaan untuk institusi kesehatan terkemuka (seperti RSUD Prof. Dr. Margono Soekarjo), dinas pendidikan, kantor instansi pemerintah, dan lembaga swasta.'
    },
    {
      icon: LayoutDashboard,
      title: 'Transparansi Sistem Digital (SIMPB)',
      desc: 'Didukung sistem manajemen internal terintegrasi untuk memastikan kuantitas stok tercatat real-time, mutu barang terjaga, dan laporan mutasi dapat diakses secara transparan.'
    },
    {
      icon: Truck,
      title: 'Cakupan Wilayah Banyumas & Jateng',
      desc: 'Armada pengiriman siap melayani pengantaran cepat untuk wilayah Purwokerto, Kabupaten Banyumas, Purbalingga, Cilacap, Banjarnegara, hingga Jawa Tengah.'
    }
  ];

  // 3. Fitur SIMPB (Sistem Informasi Manajemen Pengadaan Barang)
  const features = [
    { icon: LayoutDashboard, title: 'Dashboard Eksekutif', desc: 'Ringkasan jumlah barang, nilai inventaris, statistik transaksi, grafik pergerakan stok, dan peringatan stok kritis dalam satu layar utama.', color: 'bg-[#FAEDFF] text-[#A855F7]' },
    { icon: Package, title: 'Master Data Barang', desc: 'Pengelompokan item ATK dan perlengkapan dengan kode referensi unik, foto resolusi tinggi, batas minimum stok, dan harga terstandarisasi.', color: 'bg-[#EEF2FF] text-[#5452F6]' },
    { icon: ArrowDownLeft, title: 'Barang Masuk (Supplier)', desc: 'Pencatatan kedatangan stok dari pemasok lengkap dengan nota, supplier, tanggal, dan otomatisasi kalkulasi penambahan stok.', color: 'bg-[#ECFDF5] text-[#10B981]' },
    { icon: ArrowUpRight, title: 'Barang Keluar (Distribusi)', desc: 'Rekam distribusi barang ke instansi pemesan lengkap dengan validasi stok agar tidak terjadi minus stock saat pengiriman.', color: 'bg-[#FEF3C7] text-[#F59E0B]' },
    { icon: Activity, title: 'Monitoring Stok Real-Time', desc: 'Notifikasi otomatis saat stok mendekati batas minimum sehingga pengadaan ulang (restock) selalu tepat waktu sebelum persediaan habis.', color: 'bg-[#FEF2F2] text-[#EF4444]' },
    { icon: FileText, title: 'Laporan PDF & Excel', desc: 'Ekspor mutasi stok, transaksi masuk, dan barang keluar dalam hitungan detik untuk kebutuhan audit serta rekapitulasi berkala.', color: 'bg-[#EEF2FF] text-[#5452F6]' },
  ];

  // 4. Alur Kerja Pengadaan
  const steps = [
    { icon: Phone, label: 'Konsultasi Kebutuhan', desc: 'Hubungi tim kami via WhatsApp / Email untuk daftar barang yang dibutuhkan.', emoji: '📞' },
    { icon: FileText, label: 'Penawaran Resmi (RFQ)', desc: 'Kami terbitkan surat penawaran harga resmi dengan spesifikasi jelas.', emoji: '📋' },
    { icon: CheckCircle, label: 'Penerbitan PO / Kontrak', desc: 'Instansi menerbitkan Surat Pesanan / SPK sesuai kesepakatan.', emoji: '🤝' },
    { icon: Truck, label: 'Pengiriman & BAST', desc: 'Barang diantar langsung ke lokasi disertai Berita Acara Serah Terima.', emoji: '🚚' },
    { icon: LayoutDashboard, label: 'Pencatatan Digital (SIMPB)', desc: 'Transaksi terekam rapi di sistem untuk kemudahan rekapitulasi.', emoji: '💻' },
  ];

  // 5. FAQ (Frequently Asked Questions) untuk SEO
  const faqList = [
    {
      q: "Apa saja bidang pengadaan yang dilayani oleh CV. Amrita Jayasri?",
      a: "CV. Amrita Jayasri melayani pengadaan terpadu mencakup Alat Tulis Kantor (ATK), perlengkapan & cairan sanitasi kebersihan (cleaning equipment), katering/snack box untuk rapat dinas, supplies komputer & printer, hingga sarana pertanian dan logistik perkantoran."
    },
    {
      q: "Wilayah mana saja yang dijangkau oleh CV. Amrita Jayasri?",
      a: "Kami melayani seluruh wilayah Banyumas Raya (Purwokerto, Banyumas, Purbalingga, Cilacap, Banjarnegara) serta berbagai kota/kabupaten di Jawa Tengah dengan armada logistik pengantaran tepat waktu."
    },
    {
      q: "Apakah CV. Amrita Jayasri menerima pengadaan untuk instansi pemerintah dan sekolah?",
      a: "Ya. Kami berpengalaman melayani pengadaan instansi pemerintah, rumah sakit daerah (seperti RSUD Prof. Dr. Margono Soekarjo), dinas-dinas pemerintahan, sekolah negeri/swasta, perbankan, dan perusahaan swasta dengan kelengkapan faktur pajak dan administrasi resmi."
    },
    {
      q: "Bagaimana cara meminta penawaran harga (RFQ) atau katalog barang?",
      a: "Anda dapat langsung menghubungi tim pengadaan kami melalui WhatsApp di +62 822-2519-1432 atau email ke cv.amritajayasri@gmail.com. Tim kami akan segera mengirimkan surat penawaran harga resmi sesuai daftar kebutuhan Anda."
    },
    {
      q: "Apa itu sistem SIMPB pada website amritajayasri.my.id?",
      a: "SIMPB (Sistem Informasi Manajemen Pengadaan Barang) adalah platform digital internal yang dikembangkan CV. Amrita Jayasri untuk memonitor stok inventaris secara real-time, mencatat pergerakan barang masuk/keluar, dan menghasilkan laporan terstandarisasi demi transparansi operasional."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans antialiased flex flex-col selection:bg-[#5452F6]/20 selection:text-[#5452F6] overflow-x-hidden">
      
      {/* ================= NAVBAR ================= */}
      <header>
        <nav 
          aria-label="Navigasi Utama"
          className={`fixed top-0 left-0 right-0 z-50 h-16 md:h-[72px] transition-all duration-300 border-b ${
            isScrolled 
              ? 'bg-white/95 backdrop-blur-md shadow-sm border-gray-100' 
              : 'bg-white border-gray-100/60'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex justify-between items-center">
            
            {/* Logo & Brand */}
            <div 
              className="flex items-center gap-3 cursor-pointer shrink-0" 
              onClick={() => scrollToSection('beranda')}
              title="CV. Amrita Jayasri Purwokerto"
            >
              <img 
                alt="Logo CV. Amrita Jayasri - Penyedia Pengadaan Barang Purwokerto" 
                className="h-10 w-10 object-contain hover:rotate-3 transition-transform duration-300" 
                src={logoAmrita} 
                width="40"
                height="40"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-[#5452F6] text-base md:text-lg leading-tight tracking-tight">
                  CV. AMRITA JAYASRI
                </span>
                <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">
                  Pengadaan Barang &amp; Jasa
                </span>
              </div>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 h-full">
              <a className={navLinkClass('beranda')} href="#beranda"
                onClick={(e) => { e.preventDefault(); scrollToSection('beranda'); }}>
                Beranda
              </a>
              <a className={navLinkClass('layanan')} href="#layanan"
                onClick={(e) => { e.preventDefault(); scrollToSection('layanan'); }}>
                Layanan Pengadaan
              </a>
              <a className={navLinkClass('keunggulan')} href="#keunggulan"
                onClick={(e) => { e.preventDefault(); scrollToSection('keunggulan'); }}>
                Keunggulan
              </a>
              <a className={navLinkClass('features')} href="#features"
                onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>
                Sistem SIMPB
              </a>
              <a className={navLinkClass('about')} href="#about"
                onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
                Tentang Kami
              </a>
              <a className={navLinkClass('faq')} href="#faq"
                onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>
                FAQ
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <a 
                className="hidden sm:inline-flex text-[#5452F6] border border-[#5452F6]/30 font-semibold px-3.5 py-2 rounded-xl hover:bg-[#F0EFFF] transition-all duration-300 text-xs md:text-sm items-center gap-1.5" 
                href={whatsappPengadaan}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Konsultasi Penawaran</span>
              </a>
              <button 
                className="bg-[#5452F6] text-white font-semibold px-3.5 sm:px-4 py-2 rounded-xl hover:bg-[#4341E3] transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/20 text-xs md:text-sm"
                onClick={() => onNavigate('login')}
                title="Masuk ke Sistem Informasi Manajemen Pengadaan Barang"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Portal SIMPB</span>
                <span className="sm:hidden">Masuk</span>
              </button>
              <button 
                className="lg:hidden text-gray-500 hover:text-gray-800 transition-colors p-1"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Buka Menu Navigasi"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl py-4 px-4 flex flex-col gap-2 animate-in slide-in-from-top-2 fade-in">
              {[
                { id: 'beranda', label: 'Beranda' },
                { id: 'layanan', label: 'Layanan Pengadaan' },
                { id: 'keunggulan', label: 'Keunggulan' },
                { id: 'features', label: 'Sistem SIMPB' },
                { id: 'about', label: 'Tentang Kami' },
                { id: 'faq', label: 'FAQ' },
              ].map(item => (
                <a 
                  key={item.id}
                  className={`font-semibold py-2.5 px-3 rounded-xl transition-colors text-sm ${
                    activeSection === item.id ? 'text-[#5452F6] bg-[#F0EFFF]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`} 
                  href={`#${item.id}`}
                  onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); scrollToSection(item.id); }}
                >
                  {item.label}
                </a>
              ))}
              <hr className="border-gray-100 my-1" />
              <a 
                className="text-gray-700 font-semibold hover:text-[#5452F6] transition-colors py-2 px-3 text-sm flex items-center gap-2" 
                href={whatsappPengadaan}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Phone className="w-4 h-4 text-[#5452F6]" />
                Hubungi Pengadaan (WhatsApp)
              </a>
              <button 
                className="bg-[#5452F6] text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-[#4341E3] transition-colors flex items-center justify-center gap-2 cursor-pointer w-full text-center shadow-lg shadow-indigo-500/20 text-sm mt-1"
                onClick={() => { setIsMobileMenuOpen(false); onNavigate('login'); }}
              >
                <LogIn className="w-4 h-4" />
                Masuk ke Portal SIMPB
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-grow pt-16 md:pt-[72px]">
        
        {/* ================= 1. HERO SECTION ================= */}
        <section id="beranda" className="relative bg-white min-h-[500px] md:min-h-[580px] flex items-center overflow-hidden py-12 md:py-20 border-b border-gray-100">
          <div className="absolute inset-0 z-0">
            <img 
              alt="Pengadaan Barang dan Logistik CV Amrita Jayasri Purwokerto" 
              className="w-full h-full object-cover opacity-[0.05]" 
              src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAEui3VcdwNeRbzPJz7u__UAZj69kUt_1uuvkJvxLc0lmF4rid8AwTuoP_lwTxoQmUcKMZH_VwzPhmBnyYKc14ZaIpwCl22oifPaa5W7vZY0_cOkSn7zgoF-PFGWERkkGS1DayOf=w1200-h900-k-no" 
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 flex flex-col gap-4 text-left">
              
              {/* Badge Wilayah & Status */}
              <div className="inline-flex items-center gap-2 bg-[#EEF2FF] text-[#5452F6] px-3 py-1.5 rounded-full text-xs font-semibold w-fit border border-[#5452F6]/20">
                <MapPin className="w-3.5 h-3.5 text-[#5452F6]" />
                <span>Penyedia Pengadaan Terpadu • Purwokerto, Banyumas, Jawa Tengah</span>
              </div>

              {/* Main Heading H1 (SEO optimized) */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold text-gray-900 leading-tight tracking-tight">
                Solusi Pengadaan Barang &amp; Jasa Terpadu untuk Instansi &amp; Perusahaan
              </h1>

              {/* Subheading */}
              <p className="text-sm md:text-base text-gray-600 max-w-2xl mt-1 leading-relaxed">
                <strong>CV. Amrita Jayasri</strong> melayani pengadaan Alat Tulis Kantor (ATK), perlengkapan kebersihan, katering kedinasan, supplies komputer, dan logistik terpadu di wilayah Purwokerto dan sekitarnya. Dilengkapi sistem digital <strong>SIMPB</strong> untuk monitoring stok dan pelaporan transparan.
              </p>
              
              {/* Call To Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3 w-full">
                <a 
                  className="bg-[#5452F6] text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-[#4341E3] transition-all duration-300 text-center shadow-lg shadow-indigo-500/25 cursor-pointer text-sm flex items-center justify-center gap-2" 
                  href={whatsappPengadaan}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="w-4 h-4" />
                  Minta Penawaran Harga (RFQ)
                </a>
                
                <button 
                  className="border border-gray-200 text-gray-700 font-semibold px-6 py-3.5 rounded-xl hover:bg-gray-50 hover:border-[#5452F6]/30 transition-all duration-300 text-center bg-white flex items-center justify-center text-sm shadow-sm cursor-pointer gap-2" 
                  onClick={() => onNavigate('login')}
                >
                  <LogIn className="w-4 h-4 text-[#5452F6]" />
                  Masuk ke Portal SIMPB
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-2 pt-2 border-t border-gray-100 text-gray-600 text-xs">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>Legalitas &amp; Faktur Pajak</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>Mitra RS &amp; Instansi</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                  <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>Pengiriman Tepat Waktu</span>
                </div>
              </div>

            </div>
            
            {/* Visual Hero Image & Badges */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative h-[460px] w-full rounded-[20px] overflow-hidden border border-gray-100 shadow-md">
                <img 
                  alt="Gudang Operasional Pengadaan CV Amrita Jayasri Purwokerto" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAGQK6rhrGZ86zjWCdR7eeB6O0F898OS5OVke9eF-RVvnc2LHQZBcZBpquWsZ3a_-asbZefPmmyt50Ql793sgX7t_5RI8iCqRNc_LQ5yEyjgzMVHcSsiRIW3Olxcm2rVJ9swPNvN=w800-h1300-k-no" 
                  loading="lazy"
                />
                
                {/* Floating Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-[16px] border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="h-11 w-11 rounded-xl bg-[#ECFDF5] flex items-center justify-center text-[#10B981] shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Mitra Resmi Pengadaan</p>
                    <p className="text-gray-500 text-xs font-medium">Bermitra dengan RSUD Margono &amp; Berbagai Instansi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 2. KEY STATS BAR ================= */}
        <section aria-label="Statistik Layanan" className="border-b border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex overflow-x-auto sm:grid sm:grid-cols-4 divide-x divide-gray-100 gap-0 snap-x snap-mandatory scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[
              { value: '100% Legal', label: 'Izin Usaha Resmi & Faktur Pajak' },
              { value: '500+ Items', label: 'Katalog ATK, Sanitasi & Supplies' },
              { value: 'Real-time', label: 'Tracking Stok Digital via SIMPB' },
              { value: 'Jawa Tengah', label: 'Cakupan Pengantaran Banyumas Raya' },
            ].map((stat, i) => (
              <div key={i} className="py-3 md:py-0 px-6 flex flex-col items-center sm:items-start text-center sm:text-left min-w-[200px] sm:min-w-0 snap-center shrink-0">
                <span className="text-xl md:text-2xl text-[#5452F6] font-extrabold">{stat.value}</span>
                <span className="text-gray-500 mt-1 uppercase tracking-wider text-[10px] font-bold">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 3. KATALOG LAYANAN PENGADAAN (SEO CORE) ================= */}
        <section className="py-14 md:py-24 max-w-7xl mx-auto px-4 md:px-8" id="layanan">
          <div className="text-center mb-10 md:mb-14">
            <span className="text-[11px] font-bold text-[#5452F6] uppercase tracking-widest mb-2 block">
              Katalog Layanan Unggulan
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Layanan Pengadaan Barang &amp; Jasa Terpadu
            </h2>
            <p className="text-xs md:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Kami siap memenuhi kebutuhan pengadaan rutin bulanan maupun kontrak kerja sama instansi pemerintah, BUMN, sekolah, rumah sakit, dan perusahaan swasta di Jawa Tengah.
            </p>
            <div className="w-14 h-1 bg-[#5452F6] mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {layananPengadaan.map((layanan, i) => (
              <div 
                key={i} 
                className="bg-white rounded-[20px] p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${layanan.color} group-hover:scale-110 transition-transform shrink-0`}>
                      <layanan.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-semibold bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full border border-gray-100">
                      {layanan.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2.5 text-base md:text-lg group-hover:text-[#5452F6] transition-colors">
                    {layanan.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                    {layanan.desc}
                  </p>
                </div>
                
                <div className="pt-4 mt-4 border-t border-gray-50 flex items-center justify-between">
                  <a 
                    href={`${whatsappPengadaan}&text=Halo%20CV.%20Amrita%20Jayasri,%20saya%20ingin%20info%20pengadaan%20tentang:%20${encodeURIComponent(layanan.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#5452F6] flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Minta Penawaran <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Banner Konsultasi Pengadaan */}
          <div className="mt-10 bg-gradient-to-r from-[#5452F6] to-[#3B38D4] rounded-[24px] p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-500/20">
            <div className="text-center md:text-left">
              <h3 className="text-lg md:text-xl font-bold mb-1">Butuh Daftar Harga Lengkap atau Penawaran Khusus?</h3>
              <p className="text-indigo-100 text-xs md:text-sm">Kirimkan rincian kebutuhan pengadaan instansi Anda, tim kami akan merespons cepat dengan harga terbaik.</p>
            </div>
            <a 
              href={whatsappPengadaan}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#5452F6] hover:bg-indigo-50 font-bold px-6 py-3 rounded-xl transition-all shadow-md text-xs md:text-sm shrink-0 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Hubungi Tim Penjualan
            </a>
          </div>
        </section>

        {/* ================= 4. KEUNGGULAN & KEMITRAAN ================= */}
        <section className="bg-white py-14 md:py-24 border-y border-gray-100" id="keunggulan">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-5 flex flex-col gap-3">
                <span className="text-[11px] font-bold text-[#5452F6] uppercase tracking-widest block">
                  Nilai &amp; Kepercayaan
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                  Mengapa Memilih CV. Amrita Jayasri?
                </h2>
                <div className="w-12 h-1 bg-[#5452F6] rounded-full my-1"></div>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  Kami mengedepankan integritas, ketepatan waktu pengiriman, keaslian produk, serta sistem administrasi perpajakan yang tertib. Kemitraan jangka panjang dengan instansi seperti <strong>RSUD Prof. Dr. Margono Soekarjo</strong> membuktikan komitmen mutu layanan kami.
                </p>
                <div className="mt-4 p-4 rounded-2xl bg-[#F8F9FA] border border-gray-100">
                  <p className="text-xs font-semibold text-gray-800 mb-1">Mendukung Standar Pengadaan:</p>
                  <div className="flex flex-wrap gap-2 text-[11px] text-gray-600">
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-200">Faktur Pajak PPN/PPH</span>
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-200">Surat Perintah Kerja (SPK)</span>
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-200">Berita Acara (BAST)</span>
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-200">Garansi Mutu Barang</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {keunggulanList.map((item, i) => (
                  <div key={i} className="p-5 rounded-[20px] bg-[#F8F9FA] border border-gray-100/80 hover:bg-white hover:shadow-md transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5452F6] flex items-center justify-center mb-3">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1.5">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ================= 5. SISTEM INFORMASI SIMPB ================= */}
        <section className="py-14 md:py-24 max-w-7xl mx-auto px-4 md:px-8" id="features">
          <div className="text-center mb-10 md:mb-14">
            <span className="text-[11px] font-bold text-[#5452F6] uppercase tracking-widest mb-2 block">
              Inovasi Teknologi
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Sistem Informasi Manajemen Pengadaan Barang (SIMPB)
            </h2>
            <p className="text-xs md:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Seluruh proses pergerakan persediaan barang CV. Amrita Jayasri dikontrol melalui aplikasi digital berbasis cloud guna mencegah selisih stok dan menjaga akurasi pemenuhan pesanan konsumen.
            </p>
            <div className="w-14 h-1 bg-[#5452F6] mx-auto rounded-full mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feat, i) => (
              <div key={i} className="bg-white rounded-[20px] p-5 md:p-6 border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col shadow-sm">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-4 ${feat.color} group-hover:scale-110 transition-transform shrink-0`}>
                  <feat.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 mb-2 text-base md:text-lg">{feat.title}</h3>
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={() => onNavigate('login')}
              className="inline-flex items-center gap-2 bg-[#5452F6] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#4341E3] transition-colors shadow-md text-xs md:text-sm cursor-pointer"
            >
              <LogIn className="w-4 h-4" /> Masuk ke Dashboard SIMPB
            </button>
          </div>
        </section>

        {/* ================= 6. ALUR PENGADAAN & OPERASIONAL ================= */}
        <section className="bg-[#F4F7FC] py-14 md:py-24 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-10 md:mb-12">
              <span className="text-[11px] font-bold text-[#5452F6] uppercase tracking-widest mb-2 block">
                Transparan &amp; Terstruktur
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
                Alur Prosedur Pengadaan Barang
              </h2>
              <div className="w-12 h-1 bg-[#5452F6] mx-auto rounded-full"></div>
            </div>
            
            <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 pb-2 sm:pb-0 snap-x snap-mandatory scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {steps.map((step, i) => (
                <div key={i} className={`relative bg-white p-5 md:p-6 rounded-[20px] border text-center flex flex-col items-center hover:-translate-y-1 hover:shadow-md transition-all duration-300 shadow-sm min-w-[200px] sm:min-w-0 snap-center shrink-0 ${
                  i === steps.length - 1 ? 'border-[#5452F6]/30 bg-[#F0EFFF]/30' : 'border-gray-100'
                }`}>
                  <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4 z-10 relative shadow-sm bg-[#5452F6] text-white">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <h3 className={`font-bold mb-1.5 text-sm ${
                    i === steps.length - 1 ? 'text-[#5452F6]' : 'text-gray-900'
                  }`}>{step.emoji} {i + 1}. {step.label}</h3>
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

        {/* ================= 7. TENTANG PERUSAHAAN (ABOUT US) ================= */}
        <section className="py-14 md:py-24 max-w-7xl mx-auto px-4 md:px-8" id="about">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            
            <div className="rounded-[24px] overflow-hidden border border-gray-100 shadow-sm h-[280px] md:h-[420px] relative">
              <img 
                alt="Operasional CV Amrita Jayasri Purwokerto Jawa Tengah" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAGVVUzbPJRv0CGh8x5WcCiKNylI7F8enoEfi05f66l7M5yFW8cEBvnBLlWixoFg1y_gii-3d2VUo1wZHGNZRNUAvkVM4A5uat182oLRGIBOZGyA59YJi1txck4vTTuCUjNjR1yG=w1200-h900-k-no" 
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <p className="font-bold text-base md:text-lg">CV. Amrita Jayasri</p>
                  <p className="text-xs text-gray-200">Purwokerto &amp; Banyumas, Jawa Tengah</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <span className="text-[11px] font-bold text-[#5452F6] uppercase tracking-widest mb-2 block">
                  Profil Perusahaan
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
                  Tentang CV. Amrita Jayasri
                </h2>
                <div className="w-12 h-1 bg-[#5452F6] rounded-full"></div>
              </div>

              <div className="flex flex-col gap-3 text-xs md:text-sm text-gray-600 leading-relaxed">
                <p>
                  <strong>CV. Amrita Jayasri</strong> adalah perusahaan berbadan hukum yang bergerak di bidang perdagangan umum, penyediaan barang perlengkapan kantor (ATK), perlengkapan sanitasi dan kebersihan gedung, katering acara, peralatan supplies komputer, serta sarana logistik pendukung.
                </p>
                <p>
                  Berpusat di wilayah Purwokerto, Banyumas, kami telah menjadi mitra strategis bagi berbagai instansi pemerintahan dan fasilitas kesehatan, salah satunya kemitraan pemenuhan kebutuhan pengadaan dengan <strong>RSUD Prof. Dr. Margono Soekarjo</strong>.
                </p>
                <p>
                  Untuk memastikan pelayanan optimal, kami mengintegrasikan operasional dengan platform <strong>SIMPB</strong>, menjamin stok selalu tersedia, pesanan terkirim akurat, dan pelaporan keuangan maupun logistik tersusun rapi.
                </p>
              </div>

              <ul className="mt-2 space-y-2.5">
                {[
                  'Distributor dan penyedia terpercaya di Banyumas Raya',
                  'Komitmen transparansi data dan tertib administrasi perpajakan',
                  'Dukungan sistem inventaris berbasis digital',
                  'Layanan responsif konsultasi pengadaan barang & jasa'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-[#ECFDF5] flex items-center justify-center shrink-0">
                      <Check className="text-[#10B981] w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs md:text-sm text-gray-800 font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <a 
                  href={whatsappPengadaan} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#5452F6] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#4341E3] transition-all text-xs md:text-sm shadow-md"
                >
                  <Phone className="w-4 h-4" /> Hubungi Kami via WhatsApp
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* ================= 8. FAQ SECTION (SEO ACCORDION) ================= */}
        <section className="bg-white py-14 md:py-24 border-t border-gray-100" id="faq">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <div className="text-center mb-10 md:mb-12">
              <span className="text-[11px] font-bold text-[#5452F6] uppercase tracking-widest mb-2 block">
                Pertanyaan Umum
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
                Frequently Asked Questions (FAQ)
              </h2>
              <p className="text-xs md:text-sm text-gray-500 max-w-xl mx-auto">
                Pertanyaan seputar layanan pengadaan barang, wilayah jangkauan, dan pemesanan di CV. Amrita Jayasri.
              </p>
              <div className="w-12 h-1 bg-[#5452F6] mx-auto rounded-full mt-3"></div>
            </div>

            <div className="space-y-3">
              {faqList.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div 
                    key={index} 
                    className="border border-gray-200/80 rounded-2xl overflow-hidden transition-all bg-white"
                  >
                    <button
                      className="w-full px-5 py-4 text-left flex justify-between items-center gap-4 hover:bg-gray-50/70 transition-colors cursor-pointer"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                    >
                      <span className="font-bold text-gray-900 text-sm md:text-base flex items-center gap-2.5">
                        <HelpCircle className="w-4 h-4 text-[#5452F6] shrink-0" />
                        {faq.q}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#5452F6]' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Hubungi jika pertanyaan belum terjawab */}
            <div className="mt-8 p-4 bg-[#F0EFFF]/40 border border-[#5452F6]/20 rounded-2xl text-center flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs md:text-sm text-gray-700">Punya pertanyaan atau kebutuhan spesifik lainnya?</span>
              <a 
                href={whatsappPengadaan}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs md:text-sm font-bold text-[#5452F6] hover:underline flex items-center gap-1"
              >
                Tanyakan langsung ke Admin <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white w-full border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Profile */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <img 
                alt="Logo CV. Amrita Jayasri" 
                className="h-8 w-8 object-contain" 
                src={logoAmrita} 
                width="32"
                height="32"
              />
              <span className="font-extrabold text-gray-900 text-base">CV. Amrita Jayasri</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Penyedia layanan pengadaan barang &amp; jasa terpadu, spesialis Alat Tulis Kantor (ATK), alat kebersihan, supplies komputer, katering, dan logistik di Purwokerto, Banyumas, dan Jawa Tengah.
            </p>
            <span className="text-[10px] font-semibold bg-[#F4F7FC] border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full w-fit">
              Terintegrasi SIMPB v1.0
            </span>
          </div>

          {/* Col 2: Kategori Pengadaan */}
          <div className="flex flex-col gap-2.5">
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Kategori Pengadaan</h4>
            <ul className="space-y-1.5 text-xs text-gray-500">
              <li>• Alat Tulis Kantor &amp; Kertas (ATK)</li>
              <li>• Perlengkapan Sanitasi &amp; Kebersihan</li>
              <li>• Supplies Komputer &amp; Toner Printer</li>
              <li>• Katering Rapat &amp; Snack Box</li>
              <li>• Peralatan &amp; Sarana Pertanian</li>
              <li>• Armada Pengiriman Logistik</li>
            </ul>
          </div>

          {/* Col 3: Wilayah & Lokasi */}
          <div className="flex flex-col gap-2.5">
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Wilayah Layanan</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              <strong>Purwokerto, Kabupaten Banyumas, Jawa Tengah</strong><br />
              Melayani pengiriman ke Purbalingga, Cilacap, Banjarnegara, Kebumen, dan kota-kota di wilayah Jawa Tengah.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#5452F6] font-semibold mt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>Jawa Tengah, Indonesia</span>
            </div>
          </div>

          {/* Col 4: Kontak & Hubungi Admin */}
          <div className="flex flex-col gap-2.5">
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Kontak &amp; Dukungan</h4>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#5452F6] shrink-0" />
                <a href={whatsappPengadaan} target="_blank" rel="noopener noreferrer" className="hover:text-[#5452F6] font-medium">
                  +62 822-2519-1432
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#5452F6] shrink-0" />
                <span className="font-medium">cv.amritajayasri@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#5452F6] shrink-0" />
                <span>Senin - Jumat: 08:00 - 17:00</span>
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <a 
                className="border border-gray-200 bg-white px-3.5 py-2 rounded-xl font-semibold text-gray-700 hover:border-[#5452F6]/30 hover:text-[#5452F6] transition-all flex items-center gap-2 text-xs w-fit shadow-sm" 
                href={whatsappAdmin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Headphones className="w-3.5 h-3.5" />
                Bantuan Admin Sistem
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="border-t border-gray-100 bg-[#F8F9FA]">
          <div className="max-w-7xl mx-auto py-4 px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} <strong>CV. Amrita Jayasri</strong> (amritajayasri.my.id). Hak Cipta Dilindungi.
            </p>
            <p className="text-[11px] text-gray-400">
              Sistem Informasi Manajemen Pengadaan Barang (SIMPB)
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
