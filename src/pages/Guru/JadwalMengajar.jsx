import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Button from '../../components/common/Button';
import { getCurrentUser } from '../../utils/helpers';
import Footer from '../../components/common/Footer';

const JadwalMengajar = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'guru') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Mock data jadwal mengajar (tanggal-tanggal mengajar)
  // Format: { tanggal: 'YYYY-MM-DD', mataPelajaran: string, kelas: string, jamMulai: string, jamSelesai: string }
  const jadwalMengajar = [
    { tanggal: '2025-12-01', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '07:30', jamSelesai: '09:00' },
    { tanggal: '2025-12-02', mataPelajaran: 'Fisika', kelas: 'X-2', jamMulai: '09:15', jamSelesai: '10:45' },
    { tanggal: '2025-12-05', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '07:30', jamSelesai: '09:00' },
    { tanggal: '2025-12-08', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '07:30', jamSelesai: '09:00' },
    { tanggal: '2025-12-09', mataPelajaran: 'Fisika', kelas: 'X-2', jamMulai: '09:15', jamSelesai: '10:45' },
    { tanggal: '2025-12-12', mataPelajaran: 'Matematika', kelas: 'XI-3', jamMulai: '10:45', jamSelesai: '12:15' },
    { tanggal: '2025-12-15', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '07:30', jamSelesai: '09:00' },
    { tanggal: '2025-12-16', mataPelajaran: 'Fisika', kelas: 'X-2', jamMulai: '09:15', jamSelesai: '10:45' },
    { tanggal: '2025-12-19', mataPelajaran: 'Matematika', kelas: 'XI-3', jamMulai: '10:45', jamSelesai: '12:15' },
    { tanggal: '2025-12-22', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '07:30', jamSelesai: '09:00' },
    { tanggal: '2025-12-23', mataPelajaran: 'Fisika', kelas: 'X-2', jamMulai: '09:15', jamSelesai: '10:45' },
    { tanggal: '2025-12-26', mataPelajaran: 'Matematika', kelas: 'XI-3', jamMulai: '10:45', jamSelesai: '12:15' },
    { tanggal: '2025-12-29', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '07:30', jamSelesai: '09:00' },
    { tanggal: '2025-12-30', mataPelajaran: 'Fisika', kelas: 'X-2', jamMulai: '09:15', jamSelesai: '10:45' },
    // Agustus 2026
    { tanggal: '2026-08-03', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '08:50', jamSelesai: '10:30' },
    { tanggal: '2026-08-04', mataPelajaran: 'Matematika', kelas: 'XI-1', jamMulai: '07:30', jamSelesai: '09:00' },
    { tanggal: '2026-08-05', mataPelajaran: 'Matematika', kelas: 'XII-1', jamMulai: '09:15', jamSelesai: '10:45' },
    { tanggal: '2026-08-06', mataPelajaran: 'Matematika', kelas: 'XI-1', jamMulai: '10:45', jamSelesai: '12:15' },
    { tanggal: '2026-08-07', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '12:45', jamSelesai: '14:15' },
    { tanggal: '2026-08-10', mataPelajaran: 'Matematika', kelas: 'XII-1', jamMulai: '07:30', jamSelesai: '09:00' },
    { tanggal: '2026-08-11', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '09:15', jamSelesai: '10:45' },
    { tanggal: '2026-08-12', mataPelajaran: 'Matematika', kelas: 'XI-1', jamMulai: '08:50', jamSelesai: '10:30' },
    { tanggal: '2026-08-13', mataPelajaran: 'Matematika', kelas: 'XII-1', jamMulai: '10:45', jamSelesai: '12:15' },
    { tanggal: '2026-08-14', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '12:45', jamSelesai: '14:15' },
    { tanggal: '2026-08-17', mataPelajaran: 'Matematika', kelas: 'XII-1', jamMulai: '07:30', jamSelesai: '09:00' },
    { tanggal: '2026-08-18', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '09:15', jamSelesai: '10:45' },
    { tanggal: '2026-08-19', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '10:45', jamSelesai: '12:15' },
    { tanggal: '2026-08-20', mataPelajaran: 'Matematika', kelas: 'XI-1', jamMulai: '12:45', jamSelesai: '14:15' },
    { tanggal: '2026-08-21', mataPelajaran: 'Matematika', kelas: 'XII-1', jamMulai: '07:30', jamSelesai: '09:00' },
    { tanggal: '2026-08-24', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '08:50', jamSelesai: '10:30' },
    { tanggal: '2026-08-25', mataPelajaran: 'Matematika', kelas: 'XI-1', jamMulai: '07:30', jamSelesai: '09:00' },
    { tanggal: '2026-08-26', mataPelajaran: 'Matematika', kelas: 'XII-1', jamMulai: '09:15', jamSelesai: '10:45' },
    { tanggal: '2026-08-27', mataPelajaran: 'Matematika', kelas: 'XI-1', jamMulai: '10:45', jamSelesai: '12:15' },
    { tanggal: '2026-08-28', mataPelajaran: 'Matematika', kelas: 'X-1', jamMulai: '12:45', jamSelesai: '14:15' },
    { tanggal: '2026-08-31', mataPelajaran: 'Matematika', kelas: 'XII-1', jamMulai: '07:30', jamSelesai: '09:00' },
  ];

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

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
    return jadwalMengajar.some(jadwal => jadwal.tanggal === dateStr);
  };

  const getScheduleForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return jadwalMengajar.filter(jadwal => jadwal.tanggal === dateStr);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedDate(null);
  };

  const handleDateClick = (date) => {
    if (date && hasSchedule(date)) {
      setSelectedDate(date);
    }
  };

  const handleViewDetail = (schedule) => {
    navigate('/guru/detail-sesi', {
      state: {
        schedule: schedule,
        date: selectedDate
      }
    });
  };

  const days = getDaysInMonth(currentMonth);
  const selectedSchedules = selectedDate ? getScheduleForDate(selectedDate) : [];
  const currentMonthSchedules = jadwalMengajar.filter((schedule) => {
    const [year, month] = schedule.tanggal.split('-').map(Number);
    return year === currentMonth.getFullYear() && month === currentMonth.getMonth() + 1;
  });
  const scheduledDaysCount = new Set(currentMonthSchedules.map((schedule) => schedule.tanggal)).size;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-zinc-950 text-zinc-50 selection:bg-[#29438f]/30">
      <Sidebar role="guru" />

      <main className="mt-16 flex-1 p-5 sm:p-7 lg:ml-72 lg:mt-0 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="grid overflow-hidden rounded-[28px] border border-[#30457f] bg-[#172654] text-white shadow-[0_24px_70px_rgba(23,38,84,0.2)] dark:bg-[#111b3c] lg:grid-cols-[1.3fr_0.7fr]">
            <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#9eafff]/10 blur-3xl" aria-hidden="true" />
              <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-[#aebcff]">Aktivitas mengajar</p>
              <h1 className="relative mt-5 max-w-xl font-display text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">Jadwal Mengajar</h1>
              <p className="relative mt-4 max-w-lg text-sm leading-7 text-[#c5cfe0] sm:text-base">
                Kelola ritme kelas Anda dari satu kalender. Pilih tanggal yang memiliki sesi untuk membuka detail presensi.
              </p>
              <div className="relative mt-7 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#9eafff]/30 bg-[#9eafff]/10 px-3 py-1.5 text-xs font-semibold text-[#d8deff]">Guru aktif</span>
                <span className="text-xs text-[#c5cfe0]">NIP {currentUser?.nip || '-'}</span>
              </div>
            </div>

            <div className="border-t border-white/10 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Periode aktif</p>
                  <p className="mt-3 font-display text-2xl font-semibold tracking-[-0.05em] text-white">
                    {monthNames[currentMonth.getMonth()]}
                  </p>
                  <p className="mt-1 text-sm text-[#c5cfe0]">Tahun {currentMonth.getFullYear()}</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e5ba4b] text-sm font-bold text-[#172654]" aria-hidden="true">J</span>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
                <div>
                  <p className="text-2xl font-semibold text-white">{scheduledDaysCount}</p>
                  <p className="mt-1 text-xs text-[#aeb9d0]">Hari terjadwal</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">{currentMonthSchedules.length}</p>
                  <p className="mt-1 text-xs text-[#aeb9d0]">Total sesi</p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.28fr)_minmax(320px,0.72fr)]">
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
                  {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                    <div key={day} className="py-2 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2 sm:gap-3">
                  {days.map((day, index) => {
                    const hasClass = hasSchedule(day);
                    const today = isToday(day);
                    const isSelected = selectedDate && day && selectedDate.toDateString() === day.toDateString();

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleDateClick(day)}
                        disabled={!day}
                        aria-label={day ? `${day.getDate()} ${monthNames[day.getMonth()]} ${day.getFullYear()}${hasClass ? ', ada jadwal mengajar' : ''}` : undefined}
                        className={`relative aspect-square min-h-10 rounded-2xl border text-sm font-semibold transition-all duration-200 sm:min-h-14 sm:text-base
                          ${!day ? 'invisible' : 'border-transparent'}
                          ${!hasClass && day ? 'cursor-default bg-zinc-950/70 text-zinc-600' : ''}
                          ${hasClass ? 'cursor-pointer border-[#30457f]/70 bg-[#1b2a54] text-[#edf1ff] hover:-translate-y-0.5 hover:border-[#6f83d0] hover:bg-[#26396f]' : ''}
                          ${today && !isSelected ? 'ring-2 ring-emerald-500/80 ring-offset-2 ring-offset-zinc-900' : ''}
                          ${isSelected ? 'border-[#f0cb69] bg-[#e5ba4b] text-[#172654] shadow-[0_8px_22px_rgba(229,186,75,0.2)]' : ''}
                        `}
                      >
                        {day ? (
                          <>
                            <span className="relative z-10">{day.getDate()}</span>
                            {hasClass && (
                              <span className={`absolute bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${isSelected ? 'bg-[#172654]' : 'bg-[#e5ba4b]'}`} aria-hidden="true" />
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
                  <span className="h-3 w-3 rounded-full bg-[#29438f] ring-1 ring-[#9eafff]" aria-hidden="true" />
                  <span>Tanggal terpilih</span>
                </div>
              </div>
            </section>

            <aside className="lg:sticky lg:top-8 lg:self-start">
              <div className="overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/60 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
                <div className="border-b border-white/10 bg-[#111b3c] p-6 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#aebcff]">Panel sesi</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-white">Detail Jadwal</h3>
                  <p className="mt-2 text-sm leading-6 text-[#c5cfe0]">Pilih tanggal pada kalender untuk meninjau kelas yang perlu ditangani.</p>
                </div>

                <div className="p-5 sm:p-6">
                  {selectedDate ? (
                    <div className="space-y-5">
                      <div className="rounded-2xl border border-[#5269b5]/40 bg-[#eaf0ff] p-4 text-[#172654] dark:bg-[#1b2a54] dark:text-[#edf1ff]">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-70">Tanggal terpilih</p>
                        <p className="mt-2 text-sm font-semibold leading-6">
                          {selectedDate.toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>

                      {selectedSchedules.length > 0 ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-zinc-50">Sesi mengajar</p>
                            <span className="rounded-full bg-[#e5ba4b]/15 px-2.5 py-1 text-xs font-semibold text-[#e5ba4b]">{selectedSchedules.length} sesi</span>
                          </div>
                          {selectedSchedules.map((schedule, idx) => (
                            <div key={idx} className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 transition-colors hover:border-zinc-700">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9eafff]">Mata pelajaran</p>
                                  <h4 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-zinc-50">{schedule.mataPelajaran}</h4>
                                </div>
                                <span className="shrink-0 rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs font-semibold text-zinc-300">{schedule.kelas}</span>
                              </div>
                              <div className="mt-4 flex items-center gap-2 border-t border-zinc-800 pt-3 text-sm text-zinc-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#e5ba4b]" aria-hidden="true" />
                                <span>{schedule.jamMulai} - {schedule.jamSelesai}</span>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleViewDetail(schedule)}
                                className="mt-4 w-full !bg-[#e5ba4b] !text-[#172654] hover:!bg-[#f0cb69]"
                              >
                                Lihat Detail <span aria-hidden="true">&#8594;</span>
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-zinc-800 px-5 py-10 text-center">
                          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-xs font-bold text-zinc-500" aria-hidden="true">J</span>
                          <p className="mt-4 text-sm font-medium text-zinc-300">Tidak ada jadwal pada tanggal ini</p>
                          <p className="mt-2 text-xs leading-5 text-zinc-500">Pilih tanggal lain yang memiliki penanda sesi.</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="px-4 py-10 text-center">
                      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf0ff] text-sm font-bold text-[#29438f] dark:bg-[#1b2a54] dark:text-[#aebcff]" aria-hidden="true">01</span>
                      <p className="mt-5 font-semibold text-zinc-200">Belum ada tanggal dipilih</p>
                      <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-zinc-500">Gunakan kalender di sebelah kiri untuk membuka sesi mengajar.</p>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer containerClassName="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10" />
    </div>
  );
};

export default JadwalMengajar;
