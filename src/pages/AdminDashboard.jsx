import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import StatCard from '../components/admin/StatCard';
import { rekapitulasiKelas } from '../data/mockData';
import { getCurrentUser, calculatePercentage } from '../utils/helpers';
import Button from '../components/common/Button';
import heroImage from '../assets/images/smansan2.jpg';
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
    <div className="bg-ink-900 min-h-screen text-white">
      <Sidebar role="admin" />

      <main className="px-4 sm:px-6 lg:px-10 pt-28 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-white/50">Admin Panel</p>
              <h1 className="text-4xl font-display">Dashboard Admin</h1>
              <p className="text-white/70">Selamat datang, {currentUser?.nama}</p>
            </div>
            <div className="text-sm text-white/50">Realtime insight & mode responsif</div>
          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-ink-900/70 mb-12">
            <div className="absolute inset-0">
              <img
                src={heroImage}
                alt="SMAN 1 Nagreg"
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-900/90 to-primary-900/60"></div>
            </div>
            <div className="relative z-10 p-8 flex flex-col lg:flex-row gap-8 items-start lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Status Operasional</p>
                <h2 className="text-3xl font-display">Pengawasan Kehadiran Terpusat</h2>
                <p className="text-white/70 mt-2 max-w-xl">
                  Monitor performa harian dan akses rekapitulasi dalam satu panel dengan tampilan futuristik.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 w-full max-w-md">
                <div className="glass-panel bg-white/10 border-white/20 p-4 rounded-2xl">
                  <p className="text-sm text-white/60">Mode Sistem</p>
                  <p className="text-2xl font-semibold">Realtime</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">
            <StatCard title="Total Kehadiran" value={totalStats.total} icon="📊" color="primary" />
            <StatCard title="Hadir" value={totalStats.hadir} icon="✅" color="success" />
            <StatCard title="Izin" value={totalStats.izin} icon="📝" color="info" />
            <StatCard title="Sakit" value={totalStats.sakit} icon="🤒" color="warning" />
            <StatCard title="alpa" value={totalStats.alpa} icon="❌" color="danger" />
          </div>

          <div className="glass-panel p-6 mb-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Persentase Kehadiran</p>
                <h3 className="text-3xl font-semibold">{persentaseKehadiran}%</h3>
                <p className="text-white/60 text-sm">Akumulasi dari seluruh kelas aktif</p>
              </div>
              <div className="flex-1">
                <div className="w-full bg-white/10 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full flex items-center justify-end pr-3 text-xs font-semibold text-white transition-all ${
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

          <div className="rounded-[28px] bg-gradient-to-r from-primary-600/30 to-accent-500/30 border border-white/10 p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-glow">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/80">Rekap Terperinci</p>
              <h3 className="text-2xl font-semibold">Ingin menyelam lebih dalam?</h3>
              <p className="text-white/70 text-sm mt-1">
                Halaman rekap menyediakan filter multi dimensi, rentang tanggal, dan tabel interaktif siap ekspor.
              </p>
            </div>
            <Button size="lg" onClick={() => navigate('/admin/rekapitulasi')}>
              Buka Halaman Rekap
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
