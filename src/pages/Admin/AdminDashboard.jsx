import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import StatCard from '../../components/admin/StatCard';
import { rekapitulasiKelas } from '../../data/mockData';
import { getCurrentUser, calculatePercentage } from '../../utils/helpers';
import Button from '../../components/common/Button';
import Footer from '../../components/common/Footer';
const AdminDashboard = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const totalStats = rekapitulasiKelas.reduce(
    (acc, item) => ({
      total: acc.total + item.total,
      hadir: acc.hadir + item.hadir,
      izin: acc.izin + item.izin,
      sakit: acc.sakit + item.sakit,
      alfa: acc.alfa + item.alfa,
    }),
    { total: 0, hadir: 0, izin: 0, sakit: 0, alfa: 0 }
  );

  const persentaseKehadiran = calculatePercentage(totalStats.hadir, totalStats.total);

  return (
    <div className="bg-ink-900 min-h-screen text-white">
      <Sidebar role="admin" />

      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-white/50">Admin Panel</p>
              <h1 className="text-4xl font-display">Dashboard Admin</h1>
              <p className="text-white/70">Selamat datang, {currentUser?.nama}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-white/50">Data Hari Ini</p>
              <p className="text-sm text-white/70">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-ink-900/70 mb-8">
            <div className="absolute inset-0">
              <img
                src={`${process.env.PUBLIC_URL}/images/smansan.jpg`}
                alt="SMAN 1 Nagreg"
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-900/90 to-primary-900/60"></div>
            </div>
            <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row gap-6 items-start lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Status Operasional</p>
                <h2 className="text-2xl sm:text-3xl font-display">Pengawasan Kehadiran Terpusat</h2>
                <p className="text-sm sm:text-base text-white/70 mt-2 max-w-xl">
                  Monitor performa harian dan akses rekapitulasi dalam satu panel.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 w-full max-w-md">
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-xs sm:text-sm font-medium text-white/70">📊 Statistik Kehadiran Hari Ini</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
              <StatCard title="Total Kehadiran" value={totalStats.total} icon="📊" color="primary" />
              <StatCard title="Hadir" value={totalStats.hadir} icon="✅" color="success" />
              <StatCard title="Izin" value={totalStats.izin} icon="📝" color="info" />
              <StatCard title="Sakit" value={totalStats.sakit} icon="🤒" color="warning" />
              <StatCard title="Alfa" value={totalStats.alfa} icon="❌" color="danger" />
            </div>
          </div>

          <div className="glass-panel p-5 sm:p-6 mb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Persentase Kehadiran Hari Ini</p>
                <h3 className="text-2xl sm:text-3xl font-semibold">{persentaseKehadiran}%</h3>
                <p className="text-white/60 text-xs sm:text-sm">Akumulasi dari seluruh kelas aktif • {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <div className="flex-1">
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full flex items-center justify-end pr-2 text-xs font-semibold text-white transition-all ${
                      persentaseKehadiran >= 80
                        ? 'bg-emerald-500'
                        : persentaseKehadiran >= 60
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${persentaseKehadiran}%` }}
                  >
                    {persentaseKehadiran}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary-600/30 to-accent-500/30 border border-white/10 p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4 shadow-glow mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/80">Rekap Terperinci</p>
              <h3 className="text-lg sm:text-xl font-semibold">Ingin menyelam lebih dalam?</h3>
              <p className="text-white/70 text-xs mt-1">
                Halaman rekap menyediakan filter multi dimensi, rentang tanggal, dan tabel interaktif siap ekspor.
              </p>
            </div>
            <Button size="md" onClick={() => navigate('/admin/rekapitulasi')}>
              Buka Halaman Rekap
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-accent-600/30 to-primary-500/30 border border-white/10 p-4 sm:p-5 flex flex-col items-start justify-between gap-3 sm:gap-4 shadow-glow">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/80">Laporan Bulanan</p>
                <h3 className="text-lg sm:text-xl font-semibold">Laporan Absensi Detail per Bulan</h3>
                <p className="text-white/70 text-xs mt-1">
                  Lihat laporan lengkap kehadiran siswa setiap hari dalam satu bulan dengan detail jenis kelamin dan persentase kehadiran.
                </p>
              </div>
              <Button size="md" onClick={() => navigate('/admin/laporan-bulanan')}>
                Buka Laporan Bulanan
              </Button>
            </div>

            <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-violet-600/30 to-fuchsia-500/30 border border-white/10 p-4 sm:p-5 flex flex-col items-start justify-between gap-3 sm:gap-4 shadow-glow">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/80">Manajemen Jadwal</p>
                <h3 className="text-lg sm:text-xl font-semibold">Tambah Jadwal Pelajaran</h3>
                <p className="text-white/70 text-xs mt-1">
                  Buat jadwal pelajaran baru dengan multiple date selection untuk beberapa tanggal sekaligus.
                </p>
              </div>
              <Button size="md" onClick={() => navigate('/admin/tambah-jadwal')}>
                Tambah Jadwal
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
