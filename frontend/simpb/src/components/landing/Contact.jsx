import React from "react";
import { BlurFade } from "./animations/BlurFade";
import { Mail } from "lucide-react";

export const Contact = () => {
  return (
    <section id="contact" className="py-24 px-4 max-w-6xl mx-auto border-t border-border">
      <BlurFade yOffset={20}>
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl mb-4 text-foreground">
            Hubungi <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 italic">Kami</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Punya pertanyaan atau butuh layanan kami? Kunjungi lokasi kami atau kirimkan email.</p>
        </div>
      </BlurFade>

      <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto h-auto md:h-[300px]">
        
        {/* Kolom Email */}
        <BlurFade delay={0.2} yOffset={20} className="flex-1 w-full">
          <a href="mailto:cv.amritajayasri@gmail.com" className="flex flex-col items-center justify-center gap-4 p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-border hover:border-emerald-500 hover:shadow-2xl transition-all group text-center h-full">
            <div className="w-20 h-20 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 shadow-sm">
              <Mail size={36} />
            </div>
            <div>
              <div className="font-bold text-2xl mb-2 font-serif text-foreground">Email</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm md:text-base">cv.amritajayasri@gmail.com</div>
            </div>
          </a>
        </BlurFade>

        {/* Kolom Maps Embed */}
        <BlurFade delay={0.4} yOffset={20} className="flex-1 w-full h-[300px] md:h-full">
          <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-border hover:border-emerald-500 hover:shadow-2xl transition-all group overflow-hidden h-full relative">
            <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-black/90 backdrop-blur-md px-4 py-2 rounded-xl border border-border shadow-md pointer-events-none">
              <div className="font-bold text-lg font-serif text-foreground">Lokasi Kami</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Jl. Martadireja II, Purwokerto</div>
            </div>
            <iframe 
              src="https://maps.google.com/maps?q=CV.%20Amrita%20Jayasri,%20Purwokerto&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="group-hover:scale-105 transition-transform duration-700 grayscale-[0.2] dark:invert-[0.9] dark:hue-rotate-180"
            ></iframe>
          </div>
        </BlurFade>
        
      </div>
    </section>
  );
};

