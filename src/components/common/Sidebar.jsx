import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../utils/helpers';
import ConfirmDialog from './ConfirmDialog';
import Loading from './Loading';
import logoSmansan from '../../assets/images/logosmansan.png';

const menuItems = {
  admin: [
    { path: '/admin', label: 'Dashboard', mark: 'D' },
    { path: '/admin/rekapitulasi', label: 'Rekapitulasi', mark: 'R' },
    { path: '/admin/laporan-bulanan', label: 'Laporan Bulanan', mark: 'L' },
    { path: '/admin/tambah-jadwal', label: 'Tambah Jadwal', mark: 'J' },
    { path: '/admin/manajemen-pengguna', label: 'Manajemen Pengguna', mark: 'P' },
    { path: '/admin/manajemen-kelas', label: 'Manajemen Kelas', mark: 'K' },
  ],
  guru: [
    { path: '/guru', label: 'Dashboard', mark: 'D' },
    { path: '/guru/Jadwal-mengajar', label: 'Jadwal Mengajar', mark: 'J' },
    { path: '/guru/riwayat', label: 'Riwayat', mark: 'R' },
  ],
  siswa: [
    { path: '/siswa', label: 'Dashboard', mark: 'D' },
    { path: '/siswa/jadwal', label: 'Jadwal Pelajaran', mark: 'J' },
    { path: '/siswa/riwayat', label: 'Riwayat', mark: 'R' },
  ],
};

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const items = menuItems[role] || [];

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

  const renderMenu = (mobile = false) => (
    <nav className={mobile ? 'flex gap-2 overflow-x-auto px-4 pb-3 no-scrollbar' : 'flex-1 p-5'}>
      <ul className={mobile ? 'flex gap-2' : 'space-y-2'}>
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                aria-current={isActive ? 'page' : undefined}
                className={mobile
                  ? `flex items-center gap-2 whitespace-nowrap rounded-xl border px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'border-[#c8d4f4] bg-[#eaf0ff] text-[#29438f] dark:border-[#30457f] dark:bg-[#152143] dark:text-[#aebcff]'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100'
                  }`
                  : `flex items-center gap-3 rounded-xl border px-3 py-3 transition-colors ${
                    isActive
                      ? 'border-[#c8d4f4] bg-[#eaf0ff] text-[#29438f] dark:border-[#30457f] dark:bg-[#152143] dark:text-[#aebcff]'
                      : 'border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                  }`}
              >
                <span
                  className={`flex shrink-0 items-center justify-center font-bold ${mobile ? 'h-5 w-5 rounded-md text-[0.65rem]' : 'h-8 w-8 rounded-lg text-xs'} ${
                    isActive
                      ? 'bg-[#29438f] text-white dark:bg-[#9eafff] dark:text-[#172654]'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}
                  aria-hidden="true"
                >
                  {item.mark}
                </span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      <aside className="fixed left-0 top-0 hidden min-h-[100dvh] w-72 flex-col border-r border-zinc-800 bg-zinc-950 text-zinc-50 lg:flex">
        <div className="border-b border-zinc-800 px-6 py-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 p-1.5">
              <img src={logoSmansan} alt="Logo SMAN 1 Nagreg" className="h-full w-full object-contain" />
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold tracking-[-0.02em]">SMAN 1 Nagreg</h1>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-zinc-500">{role} panel</p>
            </div>
          </div>
        </div>

        {renderMenu()}

        <div className="border-t border-zinc-800 p-5">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-zinc-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-xs font-bold text-zinc-500" aria-hidden="true">K</span>
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </aside>

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
