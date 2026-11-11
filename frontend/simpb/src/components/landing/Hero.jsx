import React from "react";
import { BlurFade } from "./animations/BlurFade";
import { ArrowRight, Download, MapPin } from "lucide-react";

export const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex flex-col justify-center pt-24 px-4 max-w-6xl mx-auto relative">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center justify-between">
        <div className="flex-1 w-full lg:pr-8">
          <BlurFade delay={0.2} yOffset={10}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-white/50 dark:bg-black/50 backdrop-blur-sm mb-8 text-sm font-medium text-gray-700 dark:text-gray-300">
              <MapPin size={16} className="text-emerald-500" />
              Established 2019 · Purwokerto
            </div>
          </BlurFade>

          <BlurFade delay={0.4} yOffset={20}>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-[5.5rem] mb-6 max-w-4xl leading-[1.1] tracking-tight text-foreground">
              <span className="block md:whitespace-nowrap">Layanan Terpadu</span>
              <span className="block md:whitespace-nowrap">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 italic pr-2">
                  Profesional
                </span> & Terpercaya.
              </span>
            </h1>
          </BlurFade>

          <BlurFade delay={0.6} yOffset={20}>
            <p className="font-sans text-lg md:text-xl max-w-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
              Dari penyedia alat tulis kantor hingga layanan pembersihan, makanan, kendaraan dinas, dan pertanian. Hadir untuk memenuhi berbagai kebutuhan bisnis Anda.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a href="#services" className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform shadow-lg shadow-black/10">
                Lihat Layanan
                <ArrowRight size={18} />
              </a>
              <a href="/file/Company Profile CV. Amrita Jayasri.pdf" download className="inline-flex items-center justify-center gap-2 bg-white/50 dark:bg-black/50 border border-border px-6 py-3 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-foreground">
                <Download size={18} />
                Download Company Profile (.pdf)
              </a>
            </div>
          </BlurFade>
        </div>
        
        <div className="w-full lg:w-auto flex justify-center lg:justify-end mt-8 lg:mt-0 shrink-0">
          <div className="relative w-56 md:w-64 lg:w-[280px] lg:mr-8">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 blur-3xl rounded-full scale-110"></div>
            <img src="/images/logo-no-bg.png" alt="CV Amrita Jayasri Logo" className="w-full h-auto object-contain relative z-10 drop-shadow-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

