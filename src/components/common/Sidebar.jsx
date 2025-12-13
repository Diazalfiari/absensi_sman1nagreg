import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../utils/helpers';
import ConfirmDialog from './ConfirmDialog';
import Loading from './Loading';
import logoSmansan from '../../assets/images/logosmansan.png';

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    setIsLoggingOut(true);
    
    // Simulate logout process
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 1000);
  };

  const menuItems = {
    admin: [
      { path: '/admin', label: 'Dashboard', icon: '📊' },
      { path: '/admin/rekapitulasi', label: 'Rekapitulasi', icon: '📈' },
      { path: '/admin/laporan-bulanan', label: 'Laporan Bulanan', icon: '📅' },
      { path: '/admin/tambah-jadwal', label: 'Tambah Jadwal', icon: '🗓️' },
    ],
    guru: [
      { path: '/guru', label: 'Dashboard', icon: '📊' },
      { path: '/guru/Jadwal-mengajar', label: 'Jadwal Mengajar', icon: '📅' },
      { path: '/guru/riwayat', label: 'Riwayat', icon: '📋' },
    ],
    siswa: [
      { path: '/siswa', label: 'Dashboard', icon: '🏠' },
      { path: '/siswa/jadwal', label: 'Jadwal Pelajaran', icon: '📚' },
      { path: '/siswa/riwayat', label: 'Riwayat', icon: '📋' },
    ],
  };

  const items = menuItems[role] || [];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 min-h-screen fixed left-0 top-0 flex-col bg-slate-800 border-r border-slate-700 text-white">
        {/* Logo */}
        <div className="px-6 py-8 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center">
              <img src={logoSmansan} alt="Logo SMAN 1 Nagreg" className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h1 className="font-display text-xl">SMAN 1 Nagreg</h1>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">{role}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-5 flex-1">
          <ul className="space-y-2">
            {items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-4 px-5 py-3 rounded-2xl transition-all border ${
                      isActive
                        ? 'bg-white/10 border-white/30 text-white shadow-glow'
                        : 'border-transparent text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-semibold tracking-tight">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-5 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/20 text-rose-200 hover:bg-rose-500/10 transition-all"
          >
            <span className="text-xl">🚪</span>
            <span className="font-semibold">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Navigation */}
      <div className="lg:hidden sticky top-0 z-40 bg-ink-900/80 backdrop-blur-2xl border-b border-white/10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center">
              <img src={logoSmansan} alt="Logo SMAN 1 Nagreg" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">SMAN 1 Nagreg</p>
              <p className="text-xs text-white/60 capitalize">{role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-white px-3 py-2 border border-white/30 rounded-full hover:bg-white/10"
          >
            Keluar
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-3">
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap border ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white border-white/0'
                    : 'bg-white/5 text-white/70 border-white/10'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
        title="Keluar dari Sistem"
        message="Apakah Anda yakin ingin keluar dari sistem? Anda perlu login kembali untuk mengakses aplikasi."
        confirmText="Ya, Keluar"
        cancelText="Batal"
        type="warning"
      />

      {/* Loading during logout */}
      {isLoggingOut && <Loading fullscreen text="Sedang keluar dari sistem..." />}
    </>
  );
};

export default Sidebar;
