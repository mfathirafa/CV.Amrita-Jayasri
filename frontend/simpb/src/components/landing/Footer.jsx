import React from "react";

export const Footer = () => {
  return (
    <footer className="py-8 border-t border-border mt-12 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} CV Amrita Jayasri. All rights reserved.</p>
        <p>Developed by <span className="font-semibold text-emerald-600 dark:text-emerald-400">Akhir Hayat Team</span>.</p>
      </div>
    </footer>
  );
};

