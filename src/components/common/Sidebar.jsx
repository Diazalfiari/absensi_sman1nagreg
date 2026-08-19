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
      { path: '/admin/manajemen-pengguna', label: 'Manajemen Pengguna', icon: '👥' },
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
      <aside className="hidden lg:flex w-72 min-h-[100dvh] fixed left-0 top-0 flex-col bg-zinc-950 border-r border-zinc-800 text-zinc-50">
        {/* Logo */}
        <div className="px-6 py-8 border-b border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center">
              <img src={logoSmansan} alt="Logo SMAN 1 Nagreg" className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h1 className="font-display text-xl font-medium">SMAN 1 Nagreg</h1>
              <p className="text-sm text-zinc-500 capitalize">{role} Panel</p>
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
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors border ${
                      isActive
                        ? 'bg-primary-500/10 border-primary-500/20 text-primary-400'
                        : 'border-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-5 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 transition-colors"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Navigation */}
      <div className="lg:hidden sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src={logoSmansan} alt="Logo SMAN 1 Nagreg" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-50">SMAN 1 Nagreg</p>
              <p className="text-xs text-zinc-500 capitalize">{role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-medium text-zinc-400 px-3 py-1.5 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors"
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap border transition-colors ${
                  isActive
                    ? 'bg-primary-500/10 text-primary-400 border-primary-500/20'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
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
