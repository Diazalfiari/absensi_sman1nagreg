import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import VisualIcon from '../../components/common/VisualIcon';
import { getCurrentUser } from '../../utils/helpers';
import Footer from '../../components/common/Footer';

const DetailPelajaran = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();
  const jadwal = location.state?.jadwal;

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'siswa') {
      navigate('/login');
    }
    if (!jadwal) {
      navigate('/siswa/jadwal');
    }
  }, [currentUser, navigate, jadwal]);

  if (!jadwal) return null;

  // Mock data untuk detail pelajaran
  const detailPelajaran = {
    materi: "Hari ini kita akan membahas tentang Pengenalan React JS, mulai dari struktur dasar, komponen, state, dan props. Pastikan kalian memahami konsep Virtual DOM karena itu yang membuat React sangat cepat. Jangan lupa untuk membaca dokumentasi resmi jika ada yang belum jelas.",
    tugas: "Buatlah sebuah komponen React sederhana yang merender sebuah tombol. Ketika tombol diklik, warnanya harus berubah. Silakan kumpulkan link repositori GitHub kalian paling lambat tanggal 15 Desember 2025."
  };

  const tanggal = location.state?.tanggal || 'Senin, 1 Desember 2025';
  const isOnline = jadwal.status === 'Online';

  return (
    <div className="flex min-h-[100dvh] flex-col bg-zinc-950 text-zinc-50 selection:bg-[#29438f]/30">
      <Sidebar role="siswa" />

      <main className="mt-16 flex-1 p-5 sm:p-7 lg:ml-72 lg:mt-0 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="grid overflow-hidden rounded-[28px] border border-[#30457f] bg-[#172654] text-white shadow-[0_24px_70px_rgba(23,38,84,0.2)] dark:bg-[#111b3c] lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#9eafff]/10 blur-3xl" aria-hidden="true" />
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="relative inline-flex items-center gap-2 text-sm font-medium text-[#c5cfe0] transition-colors hover:text-white"
              >
                <span aria-hidden="true">&#8592;</span>
                Kembali ke Jadwal
              </button>
              <p className="relative mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#aebcff]">Detail pelajaran</p>
              <h1 className="relative mt-5 max-w-xl font-display text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">{jadwal.mataPelajaran}</h1>
              <p className="relative mt-3 text-lg font-medium text-[#d8deff]">Kelas {jadwal.kelas}</p>
              <div className="relative mt-7 flex flex-wrap items-center gap-3">
                <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${isOnline ? 'border-[#5269b5]/50 bg-[#1b2a54] text-[#b9c5ff]' : 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'}`}>
                  {jadwal.status}
                </span>
                <span className="text-xs text-[#c5cfe0]">{jadwal.ruang}</span>
              </div>
            </div>

            <div className="border-t border-white/10 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Ringkasan sesi</p>
                  <p className="mt-3 font-display text-2xl font-semibold tracking-[-0.05em] text-white">{jadwal.waktu}</p>
                  <p className="mt-2 text-sm text-[#c5cfe0]">{tanggal}</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e5ba4b] text-[#172654]" aria-hidden="true">
                  <VisualIcon name="book" className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-9 border-t border-white/10 pt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Topik sesi</p>
                <p className="mt-2 text-sm leading-6 text-[#edf1ff]">{jadwal.sesi}</p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <section className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-[0_16px_45px_rgba(15,23,42,0.06)] sm:p-7">
              <div className="flex items-end justify-between gap-4 border-b border-zinc-800/80 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9eafff]">Bahan belajar</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-zinc-50">Materi Pembelajaran</h2>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1b2a54] text-[#aebcff]" aria-hidden="true">
                  <VisualIcon name="book" className="h-4 w-4" />
                </span>
              </div>
              <article className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 sm:p-6">
                <p className="text-base leading-8 text-zinc-300">{detailPelajaran.materi}</p>
              </article>
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#5269b5]/30 bg-[#1b2a54]/60 p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#9eafff]/15 text-[#aebcff]" aria-hidden="true">
                  <VisualIcon name="info" className="h-3.5 w-3.5" />
                </span>
                <p className="text-sm leading-6 text-[#c5cfe0]">Baca materi ini sebelum sesi dimulai agar diskusi di kelas lebih mudah diikuti.</p>
              </div>
            </section>

            <section className="rounded-3xl border border-[#30457f] bg-[#eaf0ff] p-5 text-[#172654] shadow-[0_16px_45px_rgba(41,67,143,0.08)] dark:bg-[#152143] dark:text-[#eef2ff] sm:p-7">
              <div className="flex items-end justify-between gap-4 border-b border-[#c8d4f4] pb-5 dark:border-[#30457f]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#52628e] dark:text-[#aebcff]">Tindak lanjut</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em]">Tugas & Kuis</h2>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#29438f] text-white dark:bg-[#9eafff] dark:text-[#172654]" aria-hidden="true">
                  <VisualIcon name="task" className="h-4 w-4" />
                </span>
              </div>
              <article className="mt-6 rounded-2xl border border-[#c8d4f4] bg-white/60 p-5 dark:border-[#30457f] dark:bg-[#111b3c]/70 sm:p-6">
                <p className="text-base leading-8 text-[#52628e] dark:text-[#d8deff]">{detailPelajaran.tugas}</p>
              </article>
              <div className="mt-5 rounded-2xl border border-[#c8d4f4] bg-white/40 p-4 dark:border-[#30457f] dark:bg-[#1b2a54]/60">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#52628e] dark:text-[#aebcff]">Catatan pengumpulan</p>
                <p className="mt-2 text-sm leading-6 text-[#52628e] dark:text-[#c5cfe0]">Periksa kembali instruksi dan tenggat sebelum mengumpulkan tugas.</p>
              </div>
            </section>
          </div>

          <section className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9eafff]">Konteks kelas</p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-zinc-50">Siapkan sesi belajar Anda</h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/siswa/jadwal')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-50"
              >
                Lihat Kalender <span aria-hidden="true">&#8594;</span>
              </button>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1b2a54] text-[#aebcff]" aria-hidden="true">
                  <VisualIcon name="book" className="h-4 w-4" />
                </span>
                <p className="mt-5 font-semibold text-zinc-50">Baca materi</p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">Pahami konsep utama sebelum pelajaran berlangsung.</p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1b2a54] text-[#aebcff]" aria-hidden="true">
                  <VisualIcon name="message" className="h-4 w-4" />
                </span>
                <p className="mt-5 font-semibold text-zinc-50">Catat pertanyaan</p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">Tandai bagian yang ingin Anda diskusikan di kelas.</p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e5ba4b] text-[#172654]" aria-hidden="true">
                  <VisualIcon name="task" className="h-4 w-4" />
                </span>
                <p className="mt-5 font-semibold text-zinc-50">Kerjakan tugas</p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">Ikuti instruksi tugas dan perhatikan tenggat pengumpulan.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer containerClassName="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10" />
    </div>
  );
};

export default DetailPelajaran;
