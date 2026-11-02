import React from "react";
import { BlurFade } from "./animations/BlurFade";
import { CheckCircle2 } from "lucide-react";

export const About = () => {
  const history = [
    { year: "2019", text: "Perusahaan didirikan." },
    { year: "2022", text: "Menjadi penyedia barang/jasa di RSUD Margono Soekardjo (ATK & Cleaning Equipment), Dinas Kehutanan, BNI, BPJS, dll." },
    { year: "2023", text: "Meraih Peringkat 1 Blangkon Award 2023 Kategori Penyedia Barang/Jasa untuk Badan Usaha dengan Omset Tertinggi." },
    { year: "2024", text: "Meraih Peringkat 1 Blangkon Jateng Award 2024 Kategori Penyedia Barang/Jasa." },
  ];

  return (
    <section id="about" className="py-24 px-4 max-w-6xl mx-auto border-t border-border flex flex-col gap-20">
      
      {/* Bagian Tentang Kami */}
      <div className="max-w-4xl mx-auto">
        <BlurFade yOffset={20}>
          <h2 className="font-serif text-4xl md:text-5xl mb-10 text-center text-foreground">
            Tentang <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 italic">Kami</span>
          </h2>
        </BlurFade>
        
        <BlurFade delay={0.2} yOffset={20}>
          <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 bg-white dark:bg-zinc-900 border border-border p-8 md:p-12 rounded-3xl shadow-sm">
            <p className="text-center">
              <strong className="text-foreground font-semibold">CV. Amrita Jayasri</strong> didirikan pada tanggal 4 Februari 2019. Berlokasi di Jl. Martadireja II Gg. Sitihinggil III, Perum Puri Mersi Baru Blok B No. 5, Purwokerto.
            </p>
            <p className="text-center">
              Awalnya kami berfokus pada alat tulis kantor dan fotokopi. Sejak Oktober 2021, kami berekspansi menyediakan beragam barang dan jasa, termasuk peralatan kebersihan, makanan, perawatan kendaraan dinas, AC, furnitur, hingga obat-obatan pertanian.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 mt-8 pt-8 border-t border-border">
              {[
                "NIB: 9120307342912",
                "cv.amritajayasri@gmail.com",
                "+62-82225-191432"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-800 px-4 py-2 rounded-full border border-border">
                  <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </BlurFade>
      </div>
      
      {/* Bagian Perjalanan & Pencapaian */}
      <BlurFade delay={0.4} yOffset={20}>
        <div id="achievements" className="bg-gray-50 dark:bg-zinc-900/50 rounded-[2.5rem] p-8 md:p-16 border border-border relative overflow-hidden max-w-5xl mx-auto scroll-mt-24">
          <h3 className="font-serif text-4xl mb-16 text-center relative z-10 text-foreground">
            Perjalanan & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 italic">Pencapaian</span>
          </h3>
          
          {/* Timeline */}
          <div className="relative z-10 py-4">
            {/* Garis Vertikal */}
            <div className="absolute left-[1.25rem] md:left-1/2 top-0 bottom-0 w-1 bg-emerald-200 dark:bg-emerald-900/40 md:-translate-x-1/2 rounded-full"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-y-8 md:gap-y-12">
              {history.map((item, index) => (
                <div key={index} className="contents group">
                  
                  {/* MOBILE VIEW */}
                  <div className="md:hidden flex items-start relative z-10 w-full">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-50 dark:border-zinc-900 bg-emerald-100 dark:bg-emerald-900/80 shrink-0 mr-6">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full group-hover:scale-125 transition-transform"></div>
                    </div>
                    <div className="flex-1 p-6 rounded-2xl border border-border bg-white dark:bg-zinc-800 shadow-sm hover:border-emerald-500/50 hover:-translate-y-1 transition-all">
                      <time className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400 mb-2 block">{item.year}</time>
                      <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.text}</div>
                    </div>
                  </div>

                  {/* DESKTOP VIEW */}
                  {/* Kolom Kiri */}
                  <div className="hidden md:flex justify-end items-center pr-8 relative z-10">
                    {index % 2 === 0 && (
                      <div className="w-full max-w-md p-6 rounded-2xl border border-border bg-white dark:bg-zinc-800 shadow-sm hover:border-emerald-500/50 hover:-translate-y-1 transition-all text-right">
                        <time className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400 mb-2 block">{item.year}</time>
                        <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.text}</div>
                      </div>
                    )}
                  </div>

                  {/* Titik Tengah */}
                  <div className="hidden md:flex justify-center items-center relative z-10">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-[4px] border-gray-50 dark:border-zinc-900 bg-emerald-100 dark:bg-emerald-900/80 shrink-0 shadow-sm">
                      <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full group-hover:scale-150 transition-transform"></div>
                    </div>
                  </div>

                  {/* Kolom Kanan */}
                  <div className="hidden md:flex justify-start items-center pl-8 relative z-10">
                    {index % 2 !== 0 && (
                      <div className="w-full max-w-md p-6 rounded-2xl border border-border bg-white dark:bg-zinc-800 shadow-sm hover:border-emerald-500/50 hover:-translate-y-1 transition-all text-left">
                        <time className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400 mb-2 block">{item.year}</time>
                        <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.text}</div>
                      </div>
                    )}
                  </div>
                  
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 pt-16 border-t border-border/50 relative z-10">
            <h4 className="font-serif text-2xl mb-8 text-center text-foreground">Sertifikat Penghargaan</h4>
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <a href="/images/Piagam Penghargaan.jpg" target="_blank" rel="noreferrer" className="block relative group rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-emerald-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium backdrop-blur-sm z-10">Lihat Sertifikat</div>
                <img src="/images/Piagam Penghargaan.jpg" alt="Piagam Penghargaan 2023" className="w-full h-auto border border-border shadow-sm group-hover:scale-105 transition-transform duration-500" />
              </a>
              <a href="/images/Piagam Penghargaan-2.jpg" target="_blank" rel="noreferrer" className="block relative group rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-emerald-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium backdrop-blur-sm z-10">Lihat Sertifikat</div>
                <img src="/images/Piagam Penghargaan-2.jpg" alt="Piagam Penghargaan 2024" className="w-full h-auto border border-border shadow-sm group-hover:scale-105 transition-transform duration-500" />
              </a>
            </div>
          </div>
        </div>
      </BlurFade>
    </section>
  );
};

