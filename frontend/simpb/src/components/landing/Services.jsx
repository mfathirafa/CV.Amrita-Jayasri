import React from "react";
import { BlurFade } from "./animations/BlurFade";
import { PenTool, Car, Brush, Coffee } from "lucide-react";

export const Services = () => {
  const services = [
    {
      icon: <PenTool size={32} className="text-primary mb-4" />,
      title: "Alat Tulis Kantor",
      desc: "Menyediakan berbagai barang/jasa untuk kebutuhan ATK, fotokopi, dan pengadaan dokumen."
    },
    {
      icon: <Car size={32} className="text-primary mb-4" />,
      title: "Perawatan Kendaraan",
      desc: "Layanan perbaikan dan perawatan mobil, ganti oli, turun mesin, poles bodi, dll."
    },
    {
      icon: <Brush size={32} className="text-primary mb-4" />,
      title: "Peralatan Kebersihan",
      desc: "Menyediakan berbagai kebutuhan barang atau jasa peralatan kebersihan."
    },
    {
      icon: <Coffee size={32} className="text-primary mb-4" />,
      title: "Snacks & Catering",
      desc: "Penyediaan snack dan katering untuk kebutuhan kantor maupun hotel."
    }
  ];

  return (
    <section id="services" className="py-24 px-4 max-w-6xl mx-auto border-t border-border">
      <BlurFade yOffset={20}>
        <h2 className="font-serif text-4xl md:text-5xl mb-4 text-center text-foreground">
          Layanan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 italic">Terbaik</span> Kami
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
          Kami terus berkembang untuk memberikan solusi terbaik dalam berbagai bidang kebutuhan instansi dan perusahaan Anda.
        </p>
      </BlurFade>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <BlurFade key={index} delay={0.1 * index} yOffset={20}>
            <div className="group bg-white dark:bg-zinc-900 border border-border p-6 rounded-2xl hover:shadow-xl hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
              <div className="group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 transform origin-left">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{service.desc}</p>
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
};

