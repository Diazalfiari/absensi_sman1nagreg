import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Button from '../../components/common/Button';
import { getCurrentUser, formatDate, getDayName } from '../../utils/helpers';
import Footer from '../../components/common/Footer';

const GuruDashboard = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const today = new Date();

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'guru') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-zinc-950 text-zinc-50 selection:bg-[#29438f]/30">
      <Sidebar role="guru" />

      <main className="mt-16 flex-1 p-5 transition-all duration-300 sm:p-7 lg:ml-72 lg:mt-0 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="grid overflow-hidden rounded-3xl border border-[#30457f] bg-[#172654] text-white shadow-[0_24px_70px_rgba(23,38,84,0.2)] dark:bg-[#111b3c] lg:grid-cols-[1.3fr_0.7fr]">
            <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#9eafff]/10 blur-3xl" aria-hidden="true" />
              <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-[#aebcff]">Ruang kerja guru</p>
              <p className="relative mt-6 text-sm text-[#c5cfe0]">Selamat datang, {currentUser?.nama || 'Guru'}.</p>
              <h1 className="relative mt-3 max-w-xl font-display text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">
                Siap mengelola sesi belajar hari ini?
              </h1>
              <p className="relative mt-5 max-w-lg text-sm leading-7 text-[#c5cfe0] sm:text-base">
                Buka jadwal untuk memulai presensi, atau tinjau kembali catatan mengajar yang sudah tersimpan.
              </p>
              <div className="relative mt-8 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#9eafff]/30 bg-[#9eafff]/10 px-3 py-1.5 text-xs font-semibold text-[#d8deff]">Guru aktif</span>
                <span className="text-xs text-[#c5cfe0]">NIP {currentUser?.nip || '-'}</span>
              </div>
            </div>

            <div className="flex flex-col justify-between border-t border-white/10 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Hari ini</p>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5ba4b] text-sm font-bold text-[#172654]" aria-hidden="true">H</span>
              </div>
              <div className="mt-12 lg:mt-0">
                <p className="font-display text-3xl font-semibold tracking-[-0.05em] text-white">{getDayName(today)}</p>
                <p className="mt-3 text-sm leading-6 text-[#c5cfe0]">{formatDate(today)}</p>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#29438f] dark:text-[#9eafff]">Akses cepat</p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-zinc-50">Pilih pekerjaan berikutnya</h2>
              </div>
              <p className="text-xs text-zinc-500">Dua jalur utama untuk aktivitas mengajar</p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <article className="group flex min-h-[250px] flex-col justify-between rounded-3xl border border-[#c8d4f4] bg-[#eaf0ff] p-6 text-[#172654] shadow-[0_16px_45px_rgba(41,67,143,0.08)] transition-all duration-200 hover:-translate-y-1 hover:border-[#29438f] dark:border-[#30457f] dark:bg-[#152143] dark:text-[#eef2ff]">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#29438f] text-xs font-bold text-white dark:bg-[#9eafff] dark:text-[#172654]" aria-hidden="true">J</span>
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#52628e] dark:text-[#b4bfdf]">Prioritas</span>
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-semibold tracking-[-0.04em]">Jadwal Mengajar</h3>
                  <p className="mt-3 max-w-md text-sm leading-6 text-[#52628e] dark:text-[#b4bfdf]">
                    Lihat kalender, pilih sesi, dan mulai input kehadiran siswa untuk kelas yang Anda ajar.
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/guru/Jadwal-mengajar')}
                  size="md"
                  className="mt-6 self-start !bg-[#e5ba4b] !text-[#172654] hover:!bg-[#f0cb69]"
                >
                  Buka Jadwal <span aria-hidden="true">&#8594;</span>
                </Button>
              </article>

              <article className="group flex min-h-[250px] flex-col justify-between rounded-3xl border border-zinc-800/80 bg-zinc-900/60 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-1 hover:border-zinc-700">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-xs font-bold text-zinc-500" aria-hidden="true">R</span>
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Arsip</span>
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-semibold tracking-[-0.04em] text-zinc-50">Riwayat Absensi</h3>
                  <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                    Tinjau catatan kehadiran siswa dan sesi pembelajaran yang pernah Anda jalankan.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate('/guru/riwayat')}
                  size="md"
                  className="mt-6 self-start border-zinc-700 text-zinc-200 hover:bg-zinc-800"
                >
                  Lihat Riwayat <span aria-hidden="true">&#8594;</span>
                </Button>
              </article>
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 p-6 sm:p-7">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#29438f] dark:text-[#9eafff]">Alur kerja</p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-zinc-50">Dari jadwal ke rekap</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">Gunakan alur singkat ini untuk menjaga pencatatan presensi tetap konsisten.</p>
            </div>
            <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="border-t border-zinc-800 pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">01</p>
                <p className="mt-3 font-semibold text-zinc-50">Pilih jadwal</p>
                <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">Temukan tanggal dan kelas yang akan Anda ajar.</p>
              </div>
              <div className="border-t border-zinc-800 pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">02</p>
                <p className="mt-3 font-semibold text-zinc-50">Mulai sesi</p>
                <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">Buka detail sesi dan catat kehadiran siswa.</p>
              </div>
              <div className="border-t border-zinc-800 pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">03</p>
                <p className="mt-3 font-semibold text-zinc-50">Tinjau riwayat</p>
                <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">Pastikan catatan sesi tersimpan dan mudah ditemukan.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer containerClassName="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10" />
    </div>
  );
};

export default GuruDashboard;
