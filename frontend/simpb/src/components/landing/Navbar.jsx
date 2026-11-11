import React, { useState, useEffect } from "react";
import { Moon, Sun, Menu, X, LogIn } from "lucide-react";

export const Navbar = ({ 
  darkMode, 
  setDarkMode,
  onNavigate 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Achievement', href: '#achievements' },
    { name: 'Services', href: '#services' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Clients', href: '#clients' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'py-3 bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-border shadow-sm' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
        <a href="#home" className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          CV Amrita Jayasri
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6 font-medium text-sm text-gray-600 dark:text-gray-300">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} className="hover:text-primary transition-colors">{link.name}</a>
              </li>
            ))}
          </ul>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle Dark Mode"
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-foreground cursor-pointer"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {onNavigate && (
              <button
                onClick={() => onNavigate('login')}
                className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-xl text-sm font-medium hover:scale-105 transition-all shadow-sm cursor-pointer"
              >
                <LogIn size={16} />
                <span>Masuk Sistem</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-2">
          {onNavigate && (
            <button
              onClick={() => onNavigate('login')}
              className="inline-flex items-center gap-1.5 bg-foreground text-background px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
            >
              <LogIn size={14} />
              <span>Masuk</span>
            </button>
          )}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle Dark Mode"
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-foreground cursor-pointer"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            aria-label="Toggle Menu"
            className="p-2 text-foreground cursor-pointer"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-black border-b border-border py-4 px-4 flex flex-col gap-3 shadow-lg">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsOpen(false)}
              className="text-base font-medium p-2 text-foreground hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
            >
              {link.name}
            </a>
          ))}
          {onNavigate && (
            <button
              onClick={() => {
                setIsOpen(false);
                onNavigate('login');
              }}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-foreground text-background py-2.5 rounded-xl text-sm font-medium cursor-pointer"
            >
              <LogIn size={16} />
              <span>Masuk ke Sistem</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

