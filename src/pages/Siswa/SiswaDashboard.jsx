import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import VisualIcon from '../../components/common/VisualIcon';
import { getCurrentUser, formatDate, getDayName, getTodayDate } from '../../utils/helpers';
import { riwayatAbsensiSiswa, jadwalPelajaranSiswa } from '../../data/mockData';
import Footer from '../../components/common/Footer';

const SiswaDashboard = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const today = getTodayDate();
  const [recentPage, setRecentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(riwayatAbsensiSiswa.length / itemsPerPage);
  const startIndex = (recentPage - 1) * itemsPerPage;
  const currentData = riwayatAbsensiSiswa.slice(startIndex, startIndex + itemsPerPage);
  const todayAbsensi = riwayatAbsensiSiswa.find((item) => item.tanggal === today);
  const todaysSubjects = jadwalPelajaranSiswa[today] || [];

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'siswa') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const getStatusStyles = (status) => {
    if (status === 'Hadir') return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400';
    if (status === 'Sakit') return 'border-amber-500/20 bg-amber-500/10 text-amber-400';
    if (status === 'Izin') return 'border-[#5269b5]/40 bg-[#1b2a54] text-[#b9c5ff]';
    return 'border-rose-500/20 bg-rose-500/10 text-rose-400';
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-zinc-950 text-zinc-50 selection:bg-[#29438f]/30">
      <Sidebar role="siswa" />

      <main className="mt-16 flex-1 p-5 sm:p-7 lg:ml-72 lg:mt-0 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="grid overflow-hidden rounded-[28px] border border-[#30457f] bg-[#172654] text-white shadow-[0_24px_70px_rgba(23,38,84,0.2)] dark:bg-[#111b3c] lg:grid-cols-[1.3fr_0.7fr]">
            <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#9eafff]/10 blur-3xl" aria-hidden="true" />
              <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-[#aebcff]">Ruang belajar siswa</p>
              <p className="relative mt-6 text-sm text-[#c5cfe0]">Selamat datang, {currentUser?.nama || 'Siswa'}.</p>
              <h1 className="relative mt-3 max-w-xl font-display text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">
                Tetap terhubung dengan kehadiranmu.
              </h1>
              <p className="relative mt-5 max-w-lg text-sm leading-7 text-[#c5cfe0] sm:text-base">
                Pantau jadwal, status presensi, dan riwayat kehadiran dari satu tempat.
              </p>
              <div className="relative mt-8 grid max-w-md grid-cols-2 gap-3 border-t border-white/10 pt-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#aebcff]">NIS</p>
                  <p className="mt-2 text-sm font-medium text-[#edf1ff]">{currentUser?.nis || '-'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Kelas</p>
                  <p className="mt-2 text-sm font-medium text-[#edf1ff]">{currentUser?.kelas || '-'}</p>
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
                <span className={`h-2 w-2 rounded-full ${todayAbsensi ? 'bg-emerald-400' : 'bg-[#e5ba4b]'}`} aria-hidden="true" />
                <p className="text-sm text-[#d8deff]">{todayAbsensi ? 'Presensi hari ini tercatat' : 'Presensi hari ini belum tercatat'}</p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
            <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-[0_16px_45px_rgba(15,23,42,0.06)] sm:p-7">
              <div className="flex flex-col gap-2 border-b border-zinc-800/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9eafff]">Agenda hari ini</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-zinc-50">Status Kehadiran</h2>
                </div>
                <span className="text-xs text-zinc-500">{todaysSubjects.length} pelajaran</span>
              </div>

              <div className="mt-5">
                {todaysSubjects.length > 0 ? (
                  <div className="space-y-1">
                    {todaysSubjects.map((subject, index) => (
                      <div key={index} className="flex flex-col gap-3 rounded-2xl px-3 py-4 transition-colors hover:bg-[#1b2a54]/40 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#30457f] bg-[#1b2a54] text-[#aebcff]" aria-hidden="true">
                            <VisualIcon name="book" className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="font-medium text-zinc-50">{subject.mataPelajaran}</p>
                            <p className="mt-1 text-xs text-zinc-500">{subject.waktu}</p>
                          </div>
                        </div>
                        <span className={`w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${todayAbsensi ? getStatusStyles(todayAbsensi.status) : 'border-zinc-700 bg-zinc-950 text-zinc-400'}`}>
                          {todayAbsensi ? todayAbsensi.status : 'Belum Presensi'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-zinc-800 px-5 py-10 text-center">
                    <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-500" aria-hidden="true">
                      <VisualIcon name="calendar" className="h-4 w-4" />
                    </span>
                    <p className="mt-4 font-medium text-zinc-300">Tidak ada jadwal hari ini</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">Nikmati waktu luang atau tinjau jadwal berikutnya.</p>
                  </div>
                )}
              </div>
            </div>

            <aside className="rounded-3xl border border-[#30457f] bg-[#eaf0ff] p-5 text-[#172654] shadow-[0_16px_45px_rgba(41,67,143,0.08)] dark:bg-[#152143] dark:text-[#eef2ff] sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#52628e] dark:text-[#aebcff]">Aksi berikutnya</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em]">{todayAbsensi ? 'Presensi sudah tercatat' : 'Siap masuk kelas?'}</h2>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#29438f] text-white dark:bg-[#9eafff] dark:text-[#172654]" aria-hidden="true">
                  <VisualIcon name="calendar" className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#52628e] dark:text-[#b4bfdf]">
                {todayAbsensi ? 'Anda dapat meninjau kembali agenda dan riwayat presensi kapan saja.' : 'Buka jadwal untuk memastikan kelas dan waktu belajar Anda hari ini.'}
              </p>
              {!todayAbsensi && (
                <Button onClick={() => navigate('/siswa/jadwal')} size="md" className="mt-7 w-full !bg-[#e5ba4b] !text-[#172654] hover:!bg-[#f0cb69]">
                  Buka Jadwal <span aria-hidden="true">&#8594;</span>
                </Button>
              )}
            </aside>
          </section>

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
                Lihat Semua <span aria-hidden="true">&#8594;</span>
              </button>
            </div>

            <div className="overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/60 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
              <div className="divide-y divide-zinc-800/80">
                {currentData.map((item) => (
                  <div key={item.id} className="flex flex-col gap-4 p-4 transition-colors hover:bg-[#1b2a54]/30 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="flex items-center gap-4">
                      <span className={`min-w-[76px] rounded-lg border px-3 py-1.5 text-center text-xs font-semibold ${getStatusStyles(item.status)}`}>
                        {item.status}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-zinc-50">{formatDate(item.tanggal)}</p>
                        {item.waktu && item.waktu !== '-' && <p className="mt-1 text-xs text-zinc-500">Tercatat pukul {item.waktu}</p>}
                      </div>
                    </div>
                    <span className="w-fit rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-zinc-400">
                      {item.mapel || 'Matematika'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-zinc-800/80 p-4 sm:p-5">
                <Pagination
                  currentPage={recentPage}
                  totalPages={totalPages}
                  onPageChange={setRecentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={riwayatAbsensiSiswa.length}
                  showInfo
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-7">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9eafff]">Navigasi belajar</p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-zinc-50">Temukan informasi yang Anda perlukan</h2>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() => navigate('/siswa/jadwal')}
                className="group rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#5269b5] hover:bg-[#1b2a54]/40"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf0ff] text-[#29438f] dark:bg-[#1b2a54] dark:text-[#aebcff]" aria-hidden="true">
                  <VisualIcon name="calendar" className="h-4 w-4" />
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold tracking-[-0.03em] text-zinc-50">Jadwal Pelajaran</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">Lihat agenda kelas berdasarkan kalender dan buka detail pelajaran.</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#aebcff]">Buka Jadwal <span aria-hidden="true">&#8594;</span></span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/siswa/riwayat')}
                className="group rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#5269b5] hover:bg-[#1b2a54]/40"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-zinc-400" aria-hidden="true">
                  <VisualIcon name="history" className="h-4 w-4" />
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold tracking-[-0.03em] text-zinc-50">Riwayat Absensi</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">Tinjau catatan kehadiran yang sudah tersimpan secara lengkap.</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-zinc-300">Lihat Riwayat <span aria-hidden="true">&#8594;</span></span>
              </button>
            </div>
          </section>
        </div>
      </main>

      <Footer containerClassName="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10" />
    </div>
  );
};

export default SiswaDashboard;
