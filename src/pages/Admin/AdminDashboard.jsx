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
      alpa: acc.alpa + item.alpa,
    }),
    { total: 0, hadir: 0, izin: 0, sakit: 0, alpa: 0 }
  );

  const persentaseKehadiran = calculatePercentage(totalStats.hadir, totalStats.total);

  return (
    <div className="bg-zinc-950 min-h-[100dvh] text-zinc-50 selection:bg-primary-500/30">
      <Sidebar role="admin" />

      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-display tracking-tight">Dashboard Admin</h1>
              <p className="text-zinc-400 mt-1">Selamat datang, {currentUser?.nama}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-zinc-50">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="text-xs text-zinc-500 mt-1">Data Hari Ini</p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8 mb-8 flex flex-col lg:flex-row gap-6 items-start lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-display tracking-tight text-zinc-50">Pengawasan Kehadiran Terpusat</h2>
              <p className="text-sm text-zinc-400 mt-2 max-w-xl leading-relaxed">
                Monitor performa harian dan akses rekapitulasi secara *real-time* dalam satu panel.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <h3 className="text-sm font-medium text-zinc-300">Statistik Kehadiran Hari Ini</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard title="Total Kehadiran" value={totalStats.total} icon="👥" color="primary" />
              <StatCard title="Hadir" value={totalStats.hadir} icon="✓" color="success" />
              <StatCard title="Izin" value={totalStats.izin} icon="📝" color="info" />
              <StatCard title="Sakit" value={totalStats.sakit} icon="🤒" color="warning" />
              <StatCard title="Alpa" value={totalStats.alpa} icon="✕" color="danger" />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-400 mb-1">Persentase Kehadiran</p>
                <h3 className="text-3xl font-semibold tracking-tight text-zinc-50">{persentaseKehadiran}%</h3>
                <p className="text-zinc-500 text-xs mt-1">Akumulasi dari seluruh kelas aktif</p>
              </div>
              <div className="flex-1 w-full max-w-xl">
                <div className="w-full bg-zinc-950 border border-zinc-800 rounded-full h-3">
                  <div
                    className={`h-full rounded-full transition-all ${
                      persentaseKehadiran >= 80 ? 'bg-emerald-500' : persentaseKehadiran >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${persentaseKehadiran}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-3 rounded-2xl bg-primary-500/10 border border-primary-500/20 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium text-zinc-50">Rekap Terperinci</h3>
                <p className="text-zinc-400 text-sm mt-1">
                  Halaman rekap menyediakan filter multi dimensi, rentang tanggal, dan tabel interaktif siap ekspor.
                </p>
              </div>
              <Button size="md" onClick={() => navigate('/admin/rekapitulasi')} className="shrink-0">
                Buka Halaman Rekap
              </Button>
            </div>

            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 flex flex-col items-start justify-between gap-4 transition-colors hover:border-zinc-700">
              <div>
                <h3 className="text-lg font-medium text-zinc-50">Laporan Bulanan</h3>
                <p className="text-zinc-400 text-sm mt-1">
                  Lihat laporan lengkap kehadiran siswa setiap hari dalam satu bulan dengan detail persentase.
                </p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => navigate('/admin/laporan-bulanan')} className="w-full">
                Buka Laporan
              </Button>
            </div>

            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 flex flex-col items-start justify-between gap-4 transition-colors hover:border-zinc-700">
              <div>
                <h3 className="text-lg font-medium text-zinc-50">Manajemen Jadwal</h3>
                <p className="text-zinc-400 text-sm mt-1">
                  Buat jadwal pelajaran baru dengan multiple date selection untuk beberapa tanggal sekaligus.
                </p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => navigate('/admin/tambah-jadwal')} className="w-full">
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
