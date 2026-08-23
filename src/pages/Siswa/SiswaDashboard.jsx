import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Button from '../../components/common/Button';
import VisualIcon from '../../components/common/VisualIcon';
import { getCurrentUser, formatDate, getDayName, getTodayDate } from '../../utils/helpers';
import Footer from '../../components/common/Footer';
import { dashboardService } from '../../services/dashboardService';

const SiswaDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = getTodayDate();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'siswa') {
      navigate('/login');
      return;
    }
    setCurrentUser(user);

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getSiswaDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error('Gagal mengambil data dashboard siswa:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const getStatusStyles = (status) => {
    if (status === 'Hadir') return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
    if (status === 'Sakit') return 'border-amber-500/30 bg-amber-500/10 text-amber-400';
    if (status === 'Izin') return 'border-[#5269b5]/40 bg-[#1b2a54] text-[#b9c5ff]';
    if (status === 'Alpa') return 'border-rose-500/30 bg-rose-500/10 text-rose-400';
    return 'border-zinc-700 bg-zinc-950 text-zinc-400';
  };

  const todaysSubjects = dashboardData?.jadwalHariIni || [];
  const recentHistory = dashboardData?.riwayatTerbaru || [];
  const recordedTodayCount = todaysSubjects.filter(
    (s) => s.status_presensi && s.status_presensi !== 'Belum Presensi'
  ).length;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-zinc-950 text-zinc-50 selection:bg-[#29438f]/30">
      <Sidebar role="siswa" />

      <main className="mt-16 flex-1 p-5 sm:p-7 lg:ml-72 lg:mt-0 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* ── Hero Welcome Banner ── */}
          <section className="grid overflow-hidden rounded-[28px] border border-[#30457f] bg-[#172654] text-white shadow-[0_24px_70px_rgba(23,38,84,0.2)] dark:bg-[#111b3c] lg:grid-cols-[1.3fr_0.7fr]">
            <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#9eafff]/10 blur-3xl" aria-hidden="true" />
              <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-[#aebcff]">Ruang belajar siswa</p>
              <p className="relative mt-6 text-sm text-[#c5cfe0]">Selamat datang, {currentUser?.nama || 'Siswa'}.</p>
              <h1 className="relative mt-3 max-w-xl font-display text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">
                Tetap terhubung dengan kehadiranmu.
              </h1>
              <p className="relative mt-5 max-w-lg text-sm leading-7 text-[#c5cfe0] sm:text-base">
                Pantau jadwal, status presensi per mata pelajaran, dan riwayat kehadiran secara real-time.
              </p>
              <div className="relative mt-8 grid max-w-md grid-cols-2 gap-3 border-t border-white/10 pt-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#aebcff]">NIPD / NISN</p>
                  <p className="mt-2 text-sm font-medium text-[#edf1ff]">{currentUser?.nipd || currentUser?.nisn || currentUser?.nis || '-'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Kelas</p>
                  <p className="mt-2 text-sm font-medium text-[#edf1ff]">{dashboardData?.kelas || currentUser?.kelas || '-'}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Hari ini</p>
                  <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em] text-white">{getDayName(new Date())}</p>
                  <p className="mt-2 text-sm text-[#c5cfe0]">{formatDate(new Date())}</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e5ba4b] text-[#172654]" aria-hidden="true">
                  <VisualIcon name="calendar" className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-5">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    recordedTodayCount > 0 ? 'bg-emerald-400' : 'bg-[#e5ba4b]'
                  }`}
                  aria-hidden="true"
                />
                <p className="text-sm text-[#d8deff]">
                  {loading
                    ? 'Memeriksa agenda...'
                    : recordedTodayCount > 0
                    ? `${recordedTodayCount} dari ${todaysSubjects.length} pelajaran telah tercatat presensi`
                    : 'Belum ada presensi yang tercatat hari ini'}
                </p>
              </div>
            </div>
          </section>

          {/* ── Grid: Agenda Hari Ini & Aksi ── */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
            {/* Agenda Hari Ini */}
            <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-[0_16px_45px_rgba(15,23,42,0.06)] sm:p-7">
              <div className="flex flex-col gap-2 border-b border-zinc-800/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9eafff]">Agenda hari ini</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-zinc-50">Status Kehadiran</h2>
                </div>
                <span className="text-xs text-zinc-400">{todaysSubjects.length} mata pelajaran terjadwal</span>
              </div>

              <div className="mt-5">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-20 rounded-2xl bg-zinc-950/40 border border-zinc-800 animate-pulse" />
                    ))}
                  </div>
                ) : todaysSubjects.length > 0 ? (
                  <div className="space-y-3">
                    {todaysSubjects.map((subject, index) => {
                      const mapelName = subject.nama_mapel || subject.mataPelajaran || 'Mata Pelajaran';
                      const timeRange = subject.waktu || (subject.jam_mulai ? `${subject.jam_mulai.substring(0, 5)} - ${subject.jam_selesai ? subject.jam_selesai.substring(0, 5) : ''}` : '-');
                      const statusPresensi = subject.status_presensi || 'Belum Presensi';
                      const guruName = subject.nama_guru || subject.guru;

                      return (
                        <div
                          key={subject.id || index}
                          className="flex flex-col gap-3.5 rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-4 transition-all hover:border-zinc-700 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-start gap-3.5">
                            <span
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#30457f] bg-[#1b2a54] text-[#aebcff]"
                              aria-hidden="true"
                            >
                              <VisualIcon name="book" className="h-5 w-5" />
                            </span>
                            <div>
                              <p className="font-semibold text-zinc-50 text-base">{mapelName}</p>
                              <p className="mt-1 text-xs text-zinc-400">
                                🕒 {timeRange} {subject.ruang ? `• 📍 ${subject.ruang}` : ''} {guruName ? `• 👨‍🏫 ${guruName}` : ''}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-center">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyles(
                                statusPresensi
                              )}`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              {statusPresensi}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                navigate('/siswa/detail-pelajaran', {
                                  state: {
                                    jadwal: {
                                      id: subject.id,
                                      mataPelajaran: mapelName,
                                      kelas: dashboardData?.kelas || currentUser?.kelas,
                                      guru: guruName,
                                      jam: timeRange,
                                      ruang: subject.ruang,
                                      status: subject.status || 'Offline',
                                    },
                                    tanggal: formatDate(new Date()),
                                    dateStr: today,
                                  },
                                })
                              }
                              className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                            >
                              Detail &#8594;
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-zinc-800 px-5 py-10 text-center">
                    <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-500" aria-hidden="true">
                      <VisualIcon name="calendar" className="h-4 w-4" />
                    </span>
                    <p className="mt-4 font-medium text-zinc-300">Tidak ada jadwal pelajaran hari ini</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">Anda dapat melihat kalender akademik di menu Jadwal Pelajaran.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Aksi Berikutnya & Ringkasan Kehadiran */}
            <aside className="space-y-6">
              <div className="rounded-3xl border border-[#30457f] bg-[#eaf0ff] p-5 text-[#172654] shadow-[0_16px_45px_rgba(41,67,143,0.08)] dark:bg-[#152143] dark:text-[#eef2ff] sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#52628e] dark:text-[#aebcff]">Aksi belajar</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em]">Kalender &amp; Materi</h2>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#29438f] text-white dark:bg-[#9eafff] dark:text-[#172654]" aria-hidden="true">
                    <VisualIcon name="calendar" className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-[#52628e] dark:text-[#b4bfdf]">
                  Buka jadwal pelajaran lengkap untuk melihat agenda belajar harian, catatan materi, dan tugas guru.
                </p>
                <Button onClick={() => navigate('/siswa/jadwal')} size="md" className="mt-7 w-full !bg-[#e5ba4b] !text-[#172654] hover:!bg-[#f0cb69]">
                  Buka Jadwal Pelajaran <span aria-hidden="true">&#8594;</span>
                </Button>
              </div>

              {/* Ringkasan Presensi Semester */}
              {dashboardData?.summary && (
                <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">Ringkasan Kehadiran</p>
                  <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5">
                      <p className="text-lg font-bold text-emerald-400">{dashboardData.summary.hadir || 0}</p>
                      <p className="text-[10px] text-zinc-400 uppercase mt-0.5">Hadir</p>
                    </div>
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-2.5">
                      <p className="text-lg font-bold text-amber-400">{dashboardData.summary.sakit || 0}</p>
                      <p className="text-[10px] text-zinc-400 uppercase mt-0.5">Sakit</p>
                    </div>
                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2.5">
                      <p className="text-lg font-bold text-blue-400">{dashboardData.summary.izin || 0}</p>
                      <p className="text-[10px] text-zinc-400 uppercase mt-0.5">Izin</p>
                    </div>
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-2.5">
                      <p className="text-lg font-bold text-rose-400">{dashboardData.summary.alpa || 0}</p>
                      <p className="text-[10px] text-zinc-400 uppercase mt-0.5">Alpa</p>
                    </div>
                  </div>
                </div>
              )}
            </aside>
          </section>

          {/* ── Riwayat Absensi Terbaru ── */}
          <section>
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9eafff]">Catatan kehadiran</p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-zinc-50">Riwayat Absensi Terbaru</h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/siswa/riwayat')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-50"
              >
                Lihat Semua Riwayat <span aria-hidden="true">&#8594;</span>
              </button>
            </div>

            <div className="overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/60 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
              {recentHistory.length > 0 ? (
                <div className="divide-y divide-zinc-800/80">
                  {recentHistory.map((item) => (
                    <div key={item.id} className="flex flex-col gap-4 p-4 transition-colors hover:bg-[#1b2a54]/30 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                      <div className="flex items-center gap-4">
                        <span className={`min-w-[80px] rounded-lg border px-3 py-1.5 text-center text-xs font-semibold ${getStatusStyles(item.status)}`}>
                          {item.status}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-zinc-50">{formatDate(item.tanggal)}</p>
                          <p className="mt-1 text-xs text-zinc-400">
                            {item.nama_mapel} {item.nama_guru ? `• ${item.nama_guru}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {item.catatan && (
                          <span className="text-xs italic text-amber-300/80">
                            Catatan: {item.catatan}
                          </span>
                        )}
                        <span className="w-fit rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-zinc-400">
                          {item.nama_mapel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-zinc-500 text-sm">
                  Belum ada catatan riwayat kehadiran dari guru.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer containerClassName="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10" />
    </div>
  );
};

export default SiswaDashboard;
