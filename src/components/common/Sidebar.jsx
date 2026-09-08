import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../utils/helpers';
import { authService } from '../../services/authService';
import ConfirmDialog from './ConfirmDialog';
import Loading from './Loading';
import VisualIcon from './VisualIcon';
import logoSmansan from '../../assets/images/logosmansan.png';
import { useSidebar } from '../../contexts/SidebarContext';

const menuItems = {
  admin: [
    { path: '/admin', label: 'Dashboard', icon: 'dashboard' },
    { path: '/admin/rekapitulasi', label: 'Rekapitulasi', icon: 'report' },
    { path: '/admin/laporan-bulanan', label: 'Laporan Bulanan', icon: 'report' },
    { path: '/admin/tambah-jadwal', label: 'Tambah Jadwal', icon: 'calendar' },
    { path: '/admin/manajemen-pengguna', label: 'Manajemen Pengguna', icon: 'users' },
    { path: '/admin/manajemen-kelas', label: 'Manajemen Kelas', icon: 'class' },
    { path: '/admin/manajemen-mapel', label: 'Manajemen Mapel', icon: 'book' },
    { path: '/admin/log-aktivitas', label: 'Log Aktivitas', icon: 'history' },
  ],
  guru: [
    { path: '/guru', label: 'Dashboard', icon: 'dashboard' },
    { path: '/guru/Jadwal-mengajar', label: 'Jadwal Mengajar', icon: 'calendar' },
    { path: '/guru/riwayat', label: 'Riwayat', icon: 'history' },
  ],
  siswa: [
    { path: '/siswa', label: 'Dashboard', icon: 'dashboard' },
    { path: '/siswa/jadwal', label: 'Jadwal Pelajaran', icon: 'calendar' },
    { path: '/siswa/riwayat', label: 'Riwayat', icon: 'history' },
  ],
};

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const items = menuItems[role] || [];

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    setIsLoggingOut(true);

    // Logout process
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout backend error:', error);
      logout();
      navigate('/login');
    }
  };

  const renderMenu = (mobile = false) => (
    <nav className={mobile ? 'flex overflow-x-auto px-2 py-2 no-scrollbar' : 'flex-1 p-3 overflow-y-auto no-scrollbar'}>
      <ul className={mobile ? 'flex gap-1 w-full' : 'space-y-1.5'}>
        {items.map((item) => {
          const isActive = location.pathname === item.path;

          if (mobile) {
            return (
              <li key={item.path} className="flex-1 min-w-[4.5rem]">
                <Link
                  to={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-xl px-1 py-2 transition-colors ${
                    isActive
                      ? 'text-[#aebcff]'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <span
                    className={`flex shrink-0 items-center justify-center font-bold h-8 w-8 rounded-full transition-colors ${
                      isActive
                        ? 'bg-[#29438f] text-white dark:bg-[#9eafff] dark:text-[#172654]'
                        : 'bg-transparent text-inherit'
                    }`}
                    aria-hidden="true"
                  >
                    <VisualIcon name={item.icon} className="h-5 w-5" />
                  </span>
                  <span className={`font-medium text-[0.6rem] text-center leading-tight truncate w-full ${isActive ? 'text-[#c8d4f4] dark:text-[#aebcff]' : ''}`}>{item.label}</span>
                </Link>
              </li>
            );
          }

          // DESKTOP MENU ITEM
          return (
            <li key={item.path} className="relative group">
              <Link
                to={item.path}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center rounded-xl border transition-all duration-200 ${
                  isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
                } ${
                  isActive
                    ? 'border-[#c8d4f4] bg-[#eaf0ff] text-[#29438f] dark:border-[#30457f] dark:bg-[#152143] dark:text-[#aebcff] shadow-sm font-semibold'
                    : 'border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                }`}
              >
                <span
                  className={`flex shrink-0 items-center justify-center font-bold h-8 w-8 rounded-lg text-xs transition-colors ${
                    isActive
                      ? 'bg-[#29438f] text-white dark:bg-[#9eafff] dark:text-[#172654]'
                      : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-zinc-200'
                  }`}
                  aria-hidden="true"
                >
                  <VisualIcon name={item.icon} className="h-4 w-4" />
                </span>

                {!isCollapsed && (
                  <span className="font-medium text-sm truncate">{item.label}</span>
                )}
              </Link>

              {/* Floating Tooltip saat Sidebar Diciutkan / Collapsed */}
              {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3.5 hidden group-hover:flex items-center z-50 pointer-events-none animate-fadeIn">
                  <div className="bg-zinc-900 text-zinc-100 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl border border-zinc-700 whitespace-nowrap">
                    {item.label}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      {/* 1. DESKTOP SIDEBAR (>= lg) */}
      <aside
        className={`fixed left-0 top-0 hidden min-h-[100dvh] flex-col border-r border-zinc-800 bg-zinc-950 text-zinc-50 lg:flex z-40 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Floating Border Toggle Button */}
        <button
          type="button"
          onClick={toggleSidebar}
          title={isCollapsed ? 'Tampilkan / Perluas Sidebar' : 'Sembunyikan / Perkecil Sidebar'}
          className="absolute -right-3.5 top-7 z-50 flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-300 shadow-lg hover:bg-[#1b2a54] hover:text-white hover:border-[#6f83d0] transition-all duration-200"
        >
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Sidebar Header */}
        <div className={`border-b border-zinc-800 py-5 transition-all duration-300 ${isCollapsed ? 'px-3 text-center' : 'px-5'}`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 p-1.5">
              <img src={logoSmansan} alt="Logo SMAN 1 Nagreg" className="h-full w-full object-contain" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h1 className="font-display text-base font-bold tracking-tight text-zinc-100 truncate">
                  SMAN 1 Nagreg
                </h1>
                <p className="text-[10px] uppercase font-semibold tracking-wider text-[#9eafff] truncate">
                  {role} panel
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu List */}
        {renderMenu()}

        {/* Sidebar Footer / Logout */}
        <div className={`border-t border-zinc-800 p-3 ${isCollapsed ? 'text-center' : ''}`}>
          <div className="relative group">
            <button
              onClick={handleLogout}
              className={`flex w-full items-center rounded-xl text-zinc-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400 ${
                isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
              }`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-500 group-hover:bg-rose-500/20 group-hover:text-rose-400 transition-colors" aria-hidden="true">
                <VisualIcon name="logout" className="h-4 w-4" />
              </span>
              {!isCollapsed && <span className="font-medium text-sm">Keluar</span>}
            </button>

            {/* Tooltip Logout saat collapsed */}
            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3.5 hidden group-hover:flex items-center z-50 pointer-events-none animate-fadeIn">
                <div className="bg-rose-950 text-rose-200 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl border border-rose-800 whitespace-nowrap">
                  Keluar dari Sistem
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* 2. MOBILE TOP HEADER (< lg) */}
      <div className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 p-1">
              <img src={logoSmansan} alt="Logo SMAN 1 Nagreg" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-50">SMAN 1 Nagreg</p>
              <p className="mt-0.5 text-[0.65rem] uppercase tracking-[0.14em] text-zinc-500">{role} panel</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-50"
          >
            Keluar
          </button>
        </div>
      </div>

      {/* 3. MOBILE BOTTOM NAVBAR (< lg) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] lg:hidden">
        {renderMenu(true)}
      </div>

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

      {isLoggingOut && <Loading fullscreen text="Sedang keluar dari sistem..." />}
    </>
  );
};

export default Sidebar;
