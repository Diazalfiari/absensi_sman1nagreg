import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import VisualIcon from '../../components/common/VisualIcon';
import { getCurrentUser } from '../../utils/helpers';
import { jadwalPelajaranSiswa } from '../../data/mockData';
import Footer from '../../components/common/Footer';

const JadwalPelajaran = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'siswa') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const hasSchedule = (date) => {
    if (!date) return false;
    const dateStr = date.toISOString().split('T')[0];
    return jadwalPelajaranSiswa[dateStr] !== undefined;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const days = getDaysInMonth(currentMonth);
  const dateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
  const selectedSchedule = jadwalPelajaranSiswa[dateStr] || [];
  const currentMonthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
  const monthScheduleCount = Object.keys(jadwalPelajaranSiswa).filter((date) => date.startsWith(currentMonthKey)).length;
  const selectedDateLabel = selectedDate
    ? selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <div className="flex min-h-[100dvh] flex-col bg-zinc-950 text-zinc-50 selection:bg-[#29438f]/30">
      <Sidebar role="siswa" />

      <main className="mt-16 flex-1 p-5 sm:p-7 lg:ml-72 lg:mt-0 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="grid overflow-hidden rounded-[28px] border border-[#30457f] bg-[#172654] text-white shadow-[0_24px_70px_rgba(23,38,84,0.2)] dark:bg-[#111b3c] lg:grid-cols-[1.3fr_0.7fr]">
            <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#9eafff]/10 blur-3xl" aria-hidden="true" />
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="relative inline-flex items-center gap-2 text-sm font-medium text-[#c5cfe0] transition-colors hover:text-white"
              >
                <span aria-hidden="true">&#8592;</span>
                Kembali
              </button>
              <p className="relative mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#aebcff]">Agenda belajar</p>
              <h1 className="relative mt-5 max-w-xl font-display text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">Jadwal Pelajaran</h1>
              <p className="relative mt-4 max-w-lg text-sm leading-7 text-[#c5cfe0] sm:text-base">
                Atur ritme belajar Anda dari kalender kelas yang selalu siap dibuka.
              </p>
              <div className="relative mt-8 grid max-w-md grid-cols-2 gap-3 border-t border-white/10 pt-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Kelas</p>
                  <p className="mt-2 text-sm font-medium text-[#edf1ff]">{currentUser?.kelas || '-'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Sesi bulan ini</p>
                  <p className="mt-2 text-sm font-medium text-[#edf1ff]">{monthScheduleCount} pelajaran</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Periode aktif</p>
                  <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em] text-white">{monthNames[currentMonth.getMonth()]}</p>
                  <p className="mt-2 text-sm text-[#c5cfe0]">Tahun {currentMonth.getFullYear()}</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e5ba4b] text-[#172654]" aria-hidden="true">
                  <VisualIcon name="calendar" className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-10 border-t border-white/10 pt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Tanggal dipilih</p>
                <p className="mt-2 text-sm leading-6 text-[#edf1ff]">{selectedDateLabel}</p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
            <section className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-[0_16px_45px_rgba(15,23,42,0.06)] sm:p-7">
              <div className="flex flex-col gap-5 border-b border-zinc-800/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9eafff]">Kalender bulanan</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-zinc-50 sm:text-3xl">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h2>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    aria-label="Bulan sebelumnya"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950 text-zinc-300 transition-colors hover:border-[#5269b5] hover:bg-[#1b2a54] hover:text-white"
                  >
                    <span className="text-xl leading-none" aria-hidden="true">&#8592;</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    aria-label="Bulan berikutnya"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950 text-zinc-300 transition-colors hover:border-[#5269b5] hover:bg-[#1b2a54] hover:text-white"
                  >
                    <span className="text-xl leading-none" aria-hidden="true">&#8594;</span>
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-3 grid grid-cols-7 gap-2">
                  {dayNames.map((day) => (
                    <div key={day} className="py-2 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2 sm:gap-3">
                  {days.map((day, index) => {
                    const hasJadwal = hasSchedule(day);
                    const today = isToday(day);
                    const selected = isSelected(day);

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleDateClick(day)}
                        disabled={!day}
                        aria-label={day ? `${day.getDate()} ${monthNames[day.getMonth()]} ${day.getFullYear()}${hasJadwal ? ', ada jadwal pelajaran' : ''}` : undefined}
                        className={`relative aspect-square min-h-10 rounded-2xl border text-sm font-semibold transition-all duration-200 sm:min-h-14 sm:text-base
                          ${!day ? 'invisible' : 'border-transparent'}
                          ${day && !selected ? 'cursor-pointer bg-zinc-950/70 text-zinc-500 hover:border-[#5269b5] hover:bg-[#1b2a54] hover:text-zinc-50' : ''}
                          ${hasJadwal && !selected ? 'border-[#30457f]/70 bg-[#1b2a54] text-[#edf1ff]' : ''}
                          ${today && !selected ? 'ring-2 ring-emerald-500/80 ring-offset-2 ring-offset-zinc-900' : ''}
                          ${selected ? 'border-[#f0cb69] bg-[#e5ba4b] text-[#172654] shadow-[0_8px_22px_rgba(229,186,75,0.2)]' : ''}
                        `}
                      >
                        {day ? (
                          <>
                            <span className="relative z-10">{day.getDate()}</span>
                            {hasJadwal && (
                              <span className={`absolute bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${selected ? 'bg-[#172654]' : 'bg-[#e5ba4b]'}`} aria-hidden="true" />
                            )}
                          </>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 border-t border-zinc-800/80 pt-5 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full border-2 border-emerald-500" aria-hidden="true" />
                  <span>Hari ini</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#e5ba4b]" aria-hidden="true" />
                  <span>Ada jadwal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#e5ba4b] ring-1 ring-[#f0cb69]" aria-hidden="true" />
                  <span>Tanggal dipilih</span>
                </div>
              </div>
            </section>

            <aside className="lg:sticky lg:top-8 lg:self-start">
              <section className="overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/60 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
                <div className="border-b border-white/10 bg-[#111b3c] p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#aebcff]">Agenda terpilih</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-white">Jadwal Kelas</h2>
                  <p className="mt-2 text-sm leading-6 text-[#c5cfe0]">{selectedDateLabel}</p>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  {selectedSchedule.length > 0 ? (
                    selectedSchedule.map((jadwal) => (
                      <article key={jadwal.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 transition-colors hover:border-zinc-700">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9eafff]">Mata pelajaran</p>
                            <h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-zinc-50">{jadwal.mataPelajaran}</h3>
                          </div>
                          <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${jadwal.status === 'Online' ? 'border-[#5269b5]/40 bg-[#1b2a54] text-[#b9c5ff]' : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'}`}>
                            {jadwal.status}
                          </span>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-zinc-800 pt-4">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Kelas</p>
                            <p className="mt-1 text-sm font-medium text-zinc-200">{jadwal.kelas}</p>
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Waktu</p>
                            <p className="mt-1 text-sm font-medium text-zinc-200">{jadwal.waktu}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Ruangan</p>
                            <p className="mt-1 text-sm font-medium text-zinc-200">{jadwal.ruang}</p>
                          </div>
                        </div>

                        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Topik sesi</p>
                          <p className="mt-1 text-sm leading-5 text-zinc-300">{jadwal.sesi}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => navigate('/siswa/detail-pelajaran', {
                            state: {
                              jadwal,
                              tanggal: selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                            }
                          })}
                          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#e5ba4b] px-4 py-3 text-sm font-semibold text-[#172654] transition-all duration-200 hover:bg-[#f0cb69] active:translate-y-[1px]"
                        >
                          Lihat Detail <span aria-hidden="true">&#8594;</span>
                        </button>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-zinc-800 px-5 py-10 text-center">
                      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-500" aria-hidden="true">
                        <VisualIcon name="calendar" className="h-4 w-4" />
                      </span>
                      <p className="mt-4 font-medium text-zinc-300">Tidak ada jadwal untuk tanggal ini</p>
                      <p className="mt-2 text-sm leading-6 text-zinc-500">Pilih tanggal lain yang memiliki penanda jadwal.</p>
                    </div>
                  )}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <Footer containerClassName="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10" />
    </div>
  );
};

export default JadwalPelajaran;
