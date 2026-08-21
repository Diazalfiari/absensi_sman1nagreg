import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { rekapitulasiKelas } from '../../data/mockData';
import { getCurrentUser, calculatePercentage } from '../../utils/helpers';
import Button from '../../components/common/Button';
import VisualIcon from '../../components/common/VisualIcon';
import Footer from '../../components/common/Footer';

const metricAccent = {
  blue: {
    bar: 'bg-[#29438f] dark:bg-[#9eafff]',
    icon: 'bg-[#eaf0ff] text-[#29438f] dark:bg-[#1c2c5e] dark:text-[#aebcff]',
  },
  green: {
    bar: 'bg-emerald-600 dark:bg-emerald-400',
    icon: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  },
  amber: {
    bar: 'bg-amber-600 dark:bg-amber-400',
    icon: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  },
  rose: {
    bar: 'bg-rose-600 dark:bg-rose-400',
    icon: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
  },
};

const MetricCard = ({ title, value, note, icon, accent }) => (
  <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-700 dark:bg-zinc-900">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-medium text-zinc-500">{title}</p>
        <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-zinc-50">{value}</p>
        <p className="mt-2 text-xs leading-5 text-zinc-500">{note}</p>
      </div>
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${metricAccent[accent].icon}`} aria-hidden="true">
        <VisualIcon name={icon} className="h-4 w-4" />
      </span>
    </div>
    <div className={`mt-5 h-1 w-12 rounded-full ${metricAccent[accent].bar}`} aria-hidden="true" />
  </article>
);

const ClassRow = ({ item, attention = false }) => (
  <div className="flex items-center justify-between gap-4 border-b border-zinc-800/70 py-4 last:border-b-0">
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-zinc-50">Kelas {item.kelas}</p>
      <p className="mt-1 text-xs text-zinc-500">{item.hadir} hadir dari {item.total} catatan</p>
    </div>
    <div className="flex shrink-0 items-center gap-3">
      <div className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-zinc-800 sm:block" aria-hidden="true">
        <div
          className={`h-full rounded-full ${attention ? 'bg-amber-500' : 'bg-[#29438f] dark:bg-[#9eafff]'}`}
          style={{ width: `${item.percentage}%` }}
        />
      </div>
      <span className={`min-w-[3.5rem] text-right text-sm font-semibold ${attention ? 'text-amber-600 dark:text-amber-300' : 'text-[#29438f] dark:text-[#aebcff]'}`}>
        {item.percentage}%
      </span>
    </div>
  </div>
);

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
  const classPerformance = rekapitulasiKelas
    .map((item) => ({
      ...item,
      percentage: Number(calculatePercentage(item.hadir, item.total)),
    }))
    .sort((a, b) => b.percentage - a.percentage);
  const leadingClasses = classPerformance.slice(0, 4);
  const attentionClasses = [...classPerformance].sort((a, b) => a.percentage - b.percentage).slice(0, 4);
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const metrics = [
    { title: 'Total kehadiran', value: totalStats.total, note: 'Seluruh catatan kelas', icon: 'report', accent: 'blue' },
    { title: 'Hadir', value: totalStats.hadir, note: 'Status kehadiran hadir', icon: 'task', accent: 'green' },
    { title: 'Izin', value: totalStats.izin, note: 'Catatan izin', icon: 'message', accent: 'blue' },
    { title: 'Sakit', value: totalStats.sakit, note: 'Catatan sakit', icon: 'info', accent: 'amber' },
    { title: 'Alpa', value: totalStats.alpa, note: 'Perlu ditinjau', icon: 'question', accent: 'rose' },
  ];

  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-zinc-50 selection:bg-[#29438f]/20">
      <Sidebar role="admin" />

      <main className="px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:ml-72 lg:px-10 lg:pt-10">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#29438f] dark:text-[#9eafff]">Pusat kontrol sekolah</p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-zinc-50 sm:text-5xl">Dashboard Admin</h1>
              <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">Selamat datang, {currentUser?.nama}</p>
            </div>
            <div className="w-fit rounded-xl border border-zinc-800/80 bg-zinc-900 px-4 py-3 sm:text-right">
              <p className="text-sm font-medium text-zinc-50">{today}</p>
              <p className="mt-1 text-xs text-zinc-500">Ringkasan data presensi</p>
            </div>
          </header>

          <section className="relative mb-8 overflow-hidden rounded-3xl border border-[#b9c8f2] bg-[#eaf0ff] p-6 text-[#172654] dark:border-[#26386e] dark:bg-[#152143] dark:text-[#eef2ff] sm:p-8">
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-[#29438f]/10 blur-3xl dark:bg-[#9eafff]/10" />
            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#29438f] dark:text-[#aebcff]">Ikhtisar kehadiran</p>
                <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">
                  Semua data sekolah, satu tampilan yang mudah dibaca.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[#52628e] dark:text-[#b4bfdf]">
                  Pantau rekap kelas, lihat performa kehadiran, dan lanjutkan pekerjaan administratif dari satu panel.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[#c8d4f4] bg-white/60 p-4 dark:border-[#30457f] dark:bg-[#101a35]/60">
                  <p className="text-2xl font-semibold tracking-tight">{rekapitulasiKelas.length}</p>
                  <p className="mt-1 text-xs leading-5 text-[#52628e] dark:text-[#b4bfdf]">Kelas terpantau</p>
                </div>
                <div className="rounded-2xl border border-[#c8d4f4] bg-white/60 p-4 dark:border-[#30457f] dark:bg-[#101a35]/60">
                  <p className="text-2xl font-semibold tracking-tight">{persentaseKehadiran}%</p>
                  <p className="mt-1 text-xs leading-5 text-[#52628e] dark:text-[#b4bfdf]">Kehadiran keseluruhan</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-50">Ringkasan kehadiran</h2>
                <p className="mt-1 text-sm text-zinc-500">Akumulasi dari seluruh kelas aktif</p>
              </div>
              <span className="hidden text-xs font-medium uppercase tracking-[0.16em] text-zinc-500 sm:block">Data terpusat</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {metrics.map((metric) => <MetricCard key={metric.title} {...metric} />)}
            </div>
          </section>

          <section className="mb-8 rounded-2xl border border-zinc-800/80 bg-zinc-900 p-6 sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Kinerja keseluruhan</p>
                <p className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-zinc-50">{persentaseKehadiran}%</p>
                <p className="mt-2 text-sm text-zinc-500">Persentase kehadiran dari seluruh catatan.</p>
              </div>
              <div className="w-full max-w-2xl md:pb-2">
                <div className="h-3 w-full overflow-hidden rounded-full border border-zinc-800 bg-zinc-950" aria-label={`Persentase kehadiran ${persentaseKehadiran}%`} role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Number(persentaseKehadiran)}>
                  <div
                    className={`h-full rounded-full transition-all ${
                      persentaseKehadiran >= 80 ? 'bg-emerald-500' : persentaseKehadiran >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${persentaseKehadiran}%` }}
                  />
                </div>
                <div className="mt-3 flex justify-between gap-4 text-xs text-zinc-500">
                  <span>{totalStats.hadir} hadir</span>
                  <span>{totalStats.total} total catatan</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900 p-6">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#29438f] dark:text-[#9eafff]">Performa kelas</p>
                  <h2 className="mt-3 text-xl font-semibold text-zinc-50">Kehadiran tertinggi</h2>
                </div>
                <span className="text-xs text-zinc-500">4 kelas</span>
              </div>
              <div className="mt-3">
                {leadingClasses.map((item) => <ClassRow key={item.id} item={item} />)}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900 p-6">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">Perlu perhatian</p>
                  <h2 className="mt-3 text-xl font-semibold text-zinc-50">Kehadiran terendah</h2>
                </div>
                <span className="text-xs text-zinc-500">4 kelas</span>
              </div>
              <div className="mt-3">
                {attentionClasses.map((item) => <ClassRow key={item.id} item={item} attention />)}
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-[#30457f] bg-[#152143] p-6 text-[#eef2ff] lg:col-span-3">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#aebcff]">Rekap terperinci</p>
                  <h2 className="mt-3 text-xl font-semibold">Lanjutkan dari ringkasan ke data lengkap.</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#b4bfdf]">
                    Gunakan filter multi dimensi, rentang tanggal, dan tabel interaktif untuk meninjau presensi lebih dalam.
                  </p>
                </div>
                <Button size="md" onClick={() => navigate('/admin/rekapitulasi')} className="shrink-0 !bg-[#e5ba4b] !text-[#172654] hover:!bg-[#f0cb69]">
                  Buka rekap
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-zinc-800/80 bg-zinc-900 p-6 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-700">
              <div>
                <h3 className="text-lg font-semibold text-zinc-50">Laporan bulanan</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">Lihat laporan lengkap kehadiran siswa dan persentasenya.</p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => navigate('/admin/laporan-bulanan')} className="w-full !border-zinc-700 !bg-zinc-800 !text-zinc-50 hover:!bg-zinc-700">
                Buka laporan
              </Button>
            </div>

            <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-zinc-800/80 bg-zinc-900 p-6 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-700">
              <div>
                <h3 className="text-lg font-semibold text-zinc-50">Manajemen jadwal</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">Buat jadwal pelajaran untuk satu atau beberapa tanggal.</p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => navigate('/admin/tambah-jadwal')} className="w-full !border-zinc-700 !bg-zinc-800 !text-zinc-50 hover:!bg-zinc-700">
                Tambah jadwal
              </Button>
            </div>

            <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-zinc-800/80 bg-zinc-900 p-6 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-700">
              <div>
                <h3 className="text-lg font-semibold text-zinc-50">Data sekolah</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">Kelola pengguna dan kelas dari menu administrasi.</p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => navigate('/admin/manajemen-pengguna')} className="w-full !border-zinc-700 !bg-zinc-800 !text-zinc-50 hover:!bg-zinc-700">
                Kelola pengguna
              </Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
