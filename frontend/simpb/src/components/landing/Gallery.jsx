import React, { useState, useEffect } from 'react';
import { BlurFade } from './animations/BlurFade';
import { X } from 'lucide-react';

export const Gallery = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);

  // Mencegah scroll pada body saat lightbox terbuka
  useEffect(() => {
    if (selectedImg) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImg]);

  // Generate array untuk 34 gambar
  const images = Array.from({ length: 34 }, (_, i) => `/images/gallery/${i + 1}.jpeg`);

  return (
    <section id="gallery" className="py-24 px-4 max-w-7xl mx-auto border-t border-border/50 scroll-mt-24">
      <BlurFade yOffset={20}>
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl mb-4 text-foreground">
            Galeri <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 italic">Dokumentasi</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Kumpulan momen dan portofolio layanan profesional yang telah kami berikan kepada klien-klien kami.
          </p>
        </div>
      </BlurFade>

      {/* Masonry Layout Container */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.slice(0, visibleCount).map((src, index) => (
          <BlurFade key={index} delay={0.05 * (index % 10)} yOffset={20}>
            <div 
              className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl border border-border/50 bg-gray-100 dark:bg-zinc-800"
              onClick={() => setSelectedImg(src)}
            >
              <img 
                src={src} 
                alt={`Dokumentasi CV Amrita Jayasri ${index + 1}`} 
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-xl" />
            </div>
          </BlurFade>
        ))}
      </div>

      {/* Show More Button */}
      {visibleCount < images.length && (
        <div className="mt-16 flex justify-center relative z-10">
          <BlurFade delay={0.2} yOffset={10}>
            <button 
              onClick={() => setVisibleCount(images.length)}
              className="group inline-flex items-center gap-2 bg-white/50 dark:bg-black/50 border border-border backdrop-blur-sm text-foreground px-8 py-3.5 rounded-full font-medium hover:bg-emerald-50 hover:border-emerald-200 dark:hover:bg-emerald-900/30 dark:hover:border-emerald-800 transition-all duration-300 hover:scale-105 shadow-sm cursor-pointer"
            >
              Lihat Lebih Banyak
            </button>
          </BlurFade>
        </div>
      )}

      {/* Lightbox / Modal */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImg(null)}
        >
          <button 
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all duration-200 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImg(null);
            }}
            aria-label="Tutup"
          >
            <X size={32} />
          </button>
          
          <img 
            src={selectedImg} 
            alt="Dokumentasi Fullscreen" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </section>
  );
};

