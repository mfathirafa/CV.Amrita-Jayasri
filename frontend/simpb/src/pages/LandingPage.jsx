import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { About } from '../components/landing/About';
import { Services } from '../components/landing/Services';
import { Gallery } from '../components/landing/Gallery';
import { Clients } from '../components/landing/Clients';
import { Contact } from '../components/landing/Contact';
import { Footer } from '../components/landing/Footer';
import { FloatingWA } from '../components/landing/FloatingWA';

const LandingPage = ({ onNavigate }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, [darkMode]);

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-600">
      {/* Grid backdrop & noise */}
      <div className="grid-bg" aria-hidden="true"></div>
      <div className="noise" aria-hidden="true"></div>

      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} onNavigate={onNavigate} />
      <main>
        <Hero />
        <About />
        <Services />
        <Gallery />
        <Clients />
        <Contact />
      </main>
      <Footer />
      <FloatingWA />
    </div>
  );
};

export default LandingPage;
