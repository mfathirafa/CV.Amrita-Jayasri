import React from "react";
import { BlurFade } from "./animations/BlurFade";
import { InfiniteMarquee } from "./animations/InfiniteMarquee";

export const Clients = () => {
  const clients = [
    "/images/clients/Logo_RSUD_Margono-removebg-preview.png",
    "/images/clients/BNI.png",
    "/images/clients/Logo BPJS.png",
    "/images/clients/Logo_Unsoed.png",
    "/images/clients/Logo_UMP.png",
    "/images/clients/Logo_RSUD Cilacap.png",
    "/images/clients/Logo Dewanata Cilacap.jpg",
    "/images/clients/logo esdm.png"
  ];

  return (
    <section id="clients" className="py-24 border-y border-border bg-gray-50/50 dark:bg-zinc-900/30 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <BlurFade yOffset={20}>
          <h2 className="font-serif text-3xl md:text-4xl mb-12 text-center text-foreground">Klien Kepercayaan Kami</h2>
        </BlurFade>
        
        <BlurFade delay={0.2}>
          <InfiniteMarquee speed={30}>
            {clients.map((src, idx) => (
              <div key={idx} className="flex items-center justify-center w-32 md:w-48 h-24 bg-white dark:bg-zinc-800 rounded-xl border border-border shadow-sm mx-4 p-4 hover:scale-105 transition-transform cursor-pointer">
                <img 
                  src={src} 
                  alt={`Client ${idx + 1}`} 
                  className="max-h-full max-w-full object-contain hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </InfiniteMarquee>
        </BlurFade>
      </div>
    </section>
  );
};

