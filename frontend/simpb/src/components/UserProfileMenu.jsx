import React, { useState, useRef, useEffect } from 'react';
import { CircleUser, Shield, Eye } from 'lucide-react';
import { getCurrentUser } from '../utils/utils';

const UserProfileMenu = ({ user, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef(null);

  const currentUser = user || getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';
  const roleName = isAdmin ? 'Administrator' : 'Pengunjung';
  const displayName = currentUser?.name || (isAdmin ? 'Administrator' : 'Pengunjung (Tamu)');
  const displayEmail = currentUser?.email || (isAdmin ? 'admin@amrita.com' : 'pengunjung@amrita.com');

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsProfileOpen(prev => !prev)}
        className="flex items-center gap-2.5 hover:opacity-85 transition-opacity"
        title={`${displayName} (${roleName})`}
      >
        <div className="relative">
          <CircleUser className="w-7 h-7 md:w-8 md:h-8 text-[#5452F6]" strokeWidth={1.5} />
          {isAdmin ? (
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"
              title="Akses Penuh (Admin)"
            />
          ) : (
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-500 border-2 border-white rounded-full"
              title="Akses Baca (Viewer)"
            />
          )}
        </div>
        <div className="hidden md:flex flex-col text-left">
          <span className="text-sm font-semibold text-[#1E232C] leading-none mb-0.5 max-w-[130px] truncate">
            {displayName}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isAdmin ? 'text-[#5452F6]' : 'text-amber-600'}`}>
            {roleName}
          </span>
        </div>
      </button>

      {isProfileOpen && (
        <div className="absolute right-0 top-full mt-2.5 w-52 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-1.5 animate-in fade-in zoom-in-95">
          <div className="px-4 py-2.5 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-800 truncate">{displayName}</p>
            <div className="flex items-center gap-1 mt-1">
              {isAdmin ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-[#5452F6]">
                  <Shield className="w-2.5 h-2.5" /> Full Access
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700">
                  <Eye className="w-2.5 h-2.5" /> Read-Only
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-400 truncate mt-1">{displayEmail}</p>
          </div>
          <button
            onClick={() => {
              setIsProfileOpen(false);
              if (onLogout) onLogout();
            }}
            className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
          >
            Keluar
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;
