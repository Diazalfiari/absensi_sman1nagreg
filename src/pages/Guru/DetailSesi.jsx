import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Notification from '../../components/common/Notification';
import VisualIcon from '../../components/common/VisualIcon';
import Footer from '../../components/common/Footer';
import { presensiService } from '../../services/presensiService';
import { formatDateLocal } from '../../utils/helpers';

const STATUS_CONFIG = [
  {
    key: 'Hadir',
    label: 'Hadir',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.74-5.25Z" clipRule="evenodd" />
      </svg>
    ),
    activeClass: 'bg-[#eafaf1] text-emerald-800 border-emerald-400 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-600 shadow-sm',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    key: 'Sakit',
    label: 'Sakit',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v1.5H4.5A2.25 2.25 0 0 0 2.25 9v9.75A2.25 2.25 0 0 0 4.5 21h15a2.25 2.25 0 0 0 2.25-2.25V9A2.25 2.25 0 0 0 19.5 6.75H18v-1.5A1.5 1.5 0 0 0 16.5 3.75h-9Zm1.5 3V5.25h6v1.5h-6Zm3 4.5a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5H9.75a.75.75 0 0 1 0-1.5h1.5V12a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
      </svg>
    ),
    activeClass: 'bg-[#fef9e7] text-amber-800 border-amber-400 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-600 shadow-sm',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    key: 'Izin',
    label: 'Izin',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
      </svg>
    ),
    activeClass: 'bg-[#eff4ff] text-blue-800 border-blue-400 dark:bg-blue-950/50 dark:text-[#aebcff] dark:border-blue-600 shadow-sm',
    iconColor: 'text-blue-600 dark:text-[#9eafff]',
  },
  {
    key: 'Alpa',
    label: 'Alpa',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
      </svg>
    ),
    activeClass: 'bg-[#fef2f2] text-rose-800 border-rose-400 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-600 shadow-sm',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
];

const DetailSesi = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { schedule, date } = location.state || {};

  const dateObj = date
    ? (date instanceof Date ? date : new Date(date))
    : new Date();

  const dateString = date
    ? (typeof date === 'string' && date.length === 10 ? date : formatDateLocal(dateObj))
    : formatDateLocal(new Date());

  const formattedDate = dateObj.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const [loading, setLoading] = useState(true);
  const [sessionStatus, setSessionStatus] = useState('Belum Dimulai'); // 'Belum Dimulai' | 'Sedang Berlangsung' | 'Selesai'
  const [scheduleData, setScheduleData] = useState(schedule || null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendance, setAttendance] = useState([]);

  // Live timer untuk mengevaluasi status jadwal setiap 10 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // State untuk materi pembelajaran & tugas kuis
  const [materi, setMateri] = useState({
    topik: schedule?.mataPelajaran ? `Materi ${schedule.mataPelajaran} - Kelas ${schedule.kelas}` : '',
    deskripsi: '',
  });

  const [tugasKuis, setTugasKuis] = useState({
    tugas: '',
    kuis: '',
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [notification, setNotification] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  const sessionStarted = sessionStatus === 'Sedang Berlangsung' || sessionStatus === 'Selesai';

  const activeSchedule = scheduleData || schedule || {};
  const activeJamMulai = (activeSchedule.jamMulai || activeSchedule.jam_mulai || '07:30').substring(0, 5);
  const activeJamSelesai = (activeSchedule.jamSelesai || activeSchedule.jam_selesai || '09:00').substring(0, 5);

  // ── Evaluasi Tanggal & Waktu Sesi Pembelajaran ──
  const scheduleTiming = useMemo(() => {
    const now = currentTime;
    const todayStr = formatDateLocal(now);
    const nowTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 1. Validasi Tanggal
    if (dateString < todayStr) {
      return {
        status: 'SUDAH_SELESAI',
        label: 'Sesi Sudah Selesai',
        message: 'Jadwal dan waktu telah terlewati. Sesi sudah selesai dan tidak dapat dimulai lagi.',
        canStart: false,
      };
    }

    if (dateString > todayStr) {
      return {
        status: 'BELUM_WAKTUNYA',
        label: 'Sesi Belum Waktunya',
        message: `Sesi belum waktunya dimulai. Jadwal pembelajaran: ${formattedDate} (${activeJamMulai} - ${activeJamSelesai} WIB).`,
        canStart: false,
      };
    }

    // 2. Tanggal adalah Hari Ini (dateString === todayStr), cek rentang jam
    if (nowTimeStr < activeJamMulai) {
      return {
        status: 'BELUM_WAKTUNYA',
        label: 'Sesi Belum Waktunya',
        message: `Sesi belum waktunya. Pembelajaran dijadwalkan mulai pukul ${activeJamMulai} WIB (Waktu sekarang: ${nowTimeStr} WIB).`,
        canStart: false,
      };
    }

    if (nowTimeStr > activeJamSelesai) {
      return {
        status: 'SUDAH_SELESAI',
        label: 'Sesi Sudah Selesai',
        message: `Jadwal dan waktu sesi telah terlewati (berakhir pukul ${activeJamSelesai} WIB). Sesi sudah selesai dan tidak dapat dimulai lagi.`,
        canStart: false,
      };
    }

    // 3. Masih di dalam rentang waktu yang dijadwalkan
    return {
      status: 'BISA_DIMULAI',
      label: 'Sesi Siap Dimulai',
      message: `Jadwal sesi sedang aktif (${activeJamMulai} - ${activeJamSelesai} WIB). Silakan klik Mulai Sesi untuk membuka presensi.`,
      canStart: true,
    };
  }, [dateString, formattedDate, activeJamMulai, activeJamSelesai, currentTime]);

  // ── Load Session & Students from Backend ──
  const loadSessionData = useCallback(async () => {
    if (!schedule?.id) return;

    try {
      setLoading(true);
      const data = await presensiService.getSession(schedule.id, dateString);

      if (data?.schedule) {
        setScheduleData((prev) => ({
          ...prev,
          ...data.schedule,
          jamMulai: data.schedule.jam_mulai ? data.schedule.jam_mulai.substring(0, 5) : (prev?.jamMulai || '07:30'),
          jamSelesai: data.schedule.jam_selesai ? data.schedule.jam_selesai.substring(0, 5) : (prev?.jamSelesai || '09:00'),
          mataPelajaran: data.schedule.nama_mapel || prev?.mataPelajaran || '',
          kelas: data.schedule.nama_kelas || prev?.kelas || '',
          ruang: data.schedule.ruang || prev?.ruang || '',
        }));
      }

      if (data?.session) {
        setSessionStatus(data.session.statusSesi || 'Belum Dimulai');
        setMateri({
          topik: data.session.topikMateri || (schedule.mataPelajaran ? `Materi ${schedule.mataPelajaran} - Kelas ${schedule.kelas}` : ''),
          deskripsi: data.session.deskripsiMateri || '',
        });
        setTugasKuis({
          tugas: data.session.tugasSiswa || '',
          kuis: data.session.kuisEvaluasi || '',
        });
      }

      if (data?.attendance && data.attendance.length > 0) {
        setAttendance(data.attendance);
      }
    } catch (err) {
      console.error('Gagal memuat sesi presensi:', err);
    } finally {
      setLoading(false);
    }
  }, [schedule?.id, dateString, schedule?.mataPelajaran, schedule?.kelas]);

  useEffect(() => {
    loadSessionData();
  }, [loadSessionData]);

  const handleStatusChange = (siswaId, newStatus) => {
    setAttendance((prev) =>
      prev.map((siswa) =>
        siswa.id === siswaId ? { ...siswa, status: newStatus } : siswa
      )
    );
  };

  const handleStartSession = () => {
    if (!scheduleTiming.canStart) {
      setNotification({
        isOpen: true,
        type: 'warning',
        title: scheduleTiming.label,
        message: scheduleTiming.message,
      });
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmStart = async () => {
    if (isStarting) return;
    if (!scheduleTiming.canStart) {
      setShowConfirm(false);
      setNotification({
        isOpen: true,
        type: 'warning',
        title: scheduleTiming.label,
        message: scheduleTiming.message,
      });
      return;
    }
    try {
      setIsStarting(true);
      await presensiService.startSession(schedule.id, dateString);
      setSessionStatus('Sedang Berlangsung');
      setShowConfirm(false);
      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Sesi Dimulai!',
        message: 'Sesi mengajar telah dimulai. Anda dapat mengisi presensi, materi, dan tugas.',
      });
      await loadSessionData();
    } catch (err) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Gagal Memulai Sesi',
        message: err.message || 'Terjadi kesalahan saat memulai sesi mengajar.',
      });
    } finally {
      setIsStarting(false);
    }
  };

  const handleConfirmFinish = async () => {
    if (isFinishing) return;
    try {
      setIsFinishing(true);
      const payload = {
        tanggal: dateString,
        attendance: attendance.map((s) => ({
          studentId: s.id,
          status: s.status || 'Hadir',
          catatan: s.catatan || '',
        })),
        materi,
        tugasKuis,
      };

      await presensiService.finishSession(schedule.id, payload);
      setSessionStatus('Selesai');
      setShowFinishConfirm(false);
      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Sesi Selesai!',
        message: 'Sesi pembelajaran telah berhasil diselesaikan dan dicatat pada sistem.',
      });
      await loadSessionData();
    } catch (err) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Gagal Menyelesaikan Sesi',
        message: err.message || 'Terjadi kesalahan saat menyelesaikan sesi.',
      });
    } finally {
      setIsFinishing(false);
    }
  };

  const handleReopenSession = async () => {
    try {
      await presensiService.startSession(schedule.id, dateString);
      setSessionStatus('Sedang Berlangsung');
      setNotification({
        isOpen: true,
        type: 'info',
        title: 'Sesi Dibuka Kembali',
        message: 'Status sesi telah diubah kembali menjadi Sedang Berlangsung.',
      });
      await loadSessionData();
    } catch (err) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Gagal Mengubah Status Sesi',
        message: err.message || 'Terjadi kesalahan saat membuka kembali sesi.',
      });
    }
  };

  const handleSaveAttendance = () => {
    setShowSaveConfirm(true);
  };

  const handleSaveMateriTugas = async (e) => {
    if (e) e.preventDefault();
    try {
      const payload = {
        tanggal: dateString,
        attendance: attendance.map((s) => ({
          studentId: s.id,
          status: s.status || 'Hadir',
          catatan: s.catatan || '',
        })),
        materi,
        tugasKuis,
      };

      await presensiService.saveSession(schedule.id, payload);
      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Materi & Tugas Tersimpan!',
        message: 'Materi pembelajaran, tugas, dan kuis berhasil disimpan.',
      });
    } catch (err) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Gagal Menyimpan Materi',
        message: err.message || 'Terjadi kesalahan saat menyimpan materi dan tugas.',
      });
    }
  };

  const handleConfirmSave = async () => {
    if (isSaving) return;
    try {
      setIsSaving(true);
      const payload = {
        tanggal: dateString,
        attendance: attendance.map((s) => ({
          studentId: s.id,
          status: s.status || 'Hadir',
          catatan: s.catatan || '',
        })),
        materi,
        tugasKuis,
        statusSesi: sessionStatus,
      };

      await presensiService.saveSession(schedule.id, payload);
      setShowSaveConfirm(false);
      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Presensi berhasil disimpan!',
        message: `Data kehadiran ${attendance.length} siswa, materi, dan tugas/kuis berhasil disimpan.`,
      });
      await loadSessionData();
    } catch (err) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Gagal Menyimpan Data',
        message: err.message || 'Terjadi kesalahan saat menyimpan data presensi ke server.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetAllStatus = (newStatus) => {
    setAttendance((prev) =>
      prev.map((siswa) => ({ ...siswa, status: newStatus }))
    );
  };

  const getStatusCount = () => {
    return {
      hadir: attendance.filter((s) => (s.status || '').toLowerCase() === 'hadir').length,
      sakit: attendance.filter((s) => (s.status || '').toLowerCase() === 'sakit').length,
      izin: attendance.filter((s) => (s.status || '').toLowerCase() === 'izin').length,
      alpa: attendance.filter((s) => (s.status || '').toLowerCase() === 'alpa').length,
    };
  };

  const stats = getStatusCount();

  if (!schedule) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-zinc-950 px-5 text-zinc-50">
        <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf0ff] text-[#29438f] dark:bg-[#1b2a54] dark:text-[#aebcff]" aria-hidden="true">
            <VisualIcon name="calendar" className="h-5 w-5" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold tracking-[-0.04em]">Data sesi tidak ditemukan</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">Buka detail sesi melalui kalender jadwal mengajar.</p>
          <Button onClick={() => navigate('/guru/Jadwal-mengajar')} className="mt-6 w-full !bg-[#e5ba4b] !text-[#172654] hover:!bg-[#f0cb69]">
            Kembali ke Jadwal <span aria-hidden="true">&#8594;</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-zinc-950 text-zinc-50 selection:bg-[#29438f]/30">
      <Sidebar role="guru" />

      <main className="mt-16 flex-1 p-5 sm:p-7 lg:ml-72 lg:mt-0 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <div>
            <button
              type="button"
              onClick={() => navigate('/guru/Jadwal-mengajar')}
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-50"
            >
              <span aria-hidden="true">&#8592;</span>
              Kembali ke Jadwal
            </button>
          </div>

          <section className="grid overflow-hidden rounded-[28px] border border-[#30457f] bg-[#172654] text-white shadow-[0_24px_70px_rgba(23,38,84,0.2)] dark:bg-[#111b3c] lg:grid-cols-[1.3fr_0.7fr]">
            <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#9eafff]/10 blur-3xl" aria-hidden="true" />
              <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-[#aebcff]">Sesi mengajar</p>
              <h1 className="relative mt-5 font-display text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">{schedule.mataPelajaran}</h1>
              <p className="relative mt-3 text-lg font-medium text-[#d8deff]">Kelas {activeSchedule.kelas || schedule?.kelas}</p>
              <div className="relative mt-8 grid gap-5 border-t border-white/10 pt-5 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Tanggal</p>
                  <p className="mt-2 text-sm leading-6 text-[#edf1ff]">{formattedDate}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Waktu &amp; Ruang</p>
                  <p className="mt-2 text-sm leading-6 text-[#edf1ff]">{activeJamMulai} - {activeJamSelesai} WIB • {activeSchedule.ruang || `Kelas ${activeSchedule.kelas || schedule?.kelas}`}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-6 sm:p-8 lg:border-l lg:border-t-0 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Status sesi</p>
                    <p className="mt-3 font-display text-2xl font-semibold tracking-[-0.05em] text-white">
                      {sessionStatus === 'Selesai'
                        ? 'Selesai'
                        : sessionStatus === 'Sedang Berlangsung'
                        ? 'Sedang Berlangsung'
                        : scheduleTiming.status === 'SUDAH_SELESAI'
                        ? 'Sesi Sudah Selesai'
                        : scheduleTiming.status === 'BELUM_WAKTUNYA'
                        ? 'Sesi Belum Waktunya'
                        : 'Belum Dimulai'}
                    </p>
                  </div>
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ${
                      sessionStatus === 'Selesai'
                        ? 'bg-blue-500 text-white'
                        : sessionStatus === 'Sedang Berlangsung'
                        ? 'bg-emerald-400 text-[#172654]'
                        : scheduleTiming.status === 'SUDAH_SELESAI'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : scheduleTiming.status === 'BELUM_WAKTUNYA'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-[#e5ba4b] text-[#172654]'
                    }`}
                    aria-hidden="true"
                  >
                    <VisualIcon
                      name={
                        sessionStatus === 'Selesai'
                          ? 'check'
                          : sessionStatus === 'Sedang Berlangsung'
                          ? 'play'
                          : scheduleTiming.status === 'SUDAH_SELESAI'
                          ? 'x'
                          : scheduleTiming.status === 'BELUM_WAKTUNYA'
                          ? 'clock'
                          : 'calendar'
                      }
                      className="h-4 w-4"
                    />
                  </span>
                </div>

                {sessionStatus === 'Sedang Berlangsung' && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-[#d8deff]">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                    <span>Presensi aktif &amp; pembelajaran berlangsung</span>
                  </div>
                )}
                {sessionStatus === 'Selesai' && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-blue-300">
                    <span className="h-2 w-2 rounded-full bg-blue-400" aria-hidden="true" />
                    <span>Sesi telah diselesaikan &amp; tersimpan</span>
                  </div>
                )}
                {sessionStatus === 'Belum Dimulai' && (
                  <div className="mt-4">
                    {scheduleTiming.status === 'SUDAH_SELESAI' && (
                      <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-200">
                        <p className="font-semibold flex items-center gap-1.5 text-rose-300">
                          <VisualIcon name="x" className="h-3.5 w-3.5 text-rose-400" />
                          Sesi Sudah Selesai
                        </p>
                        <p className="mt-1 text-[11px] leading-relaxed text-rose-300/80">
                          {scheduleTiming.message}
                        </p>
                      </div>
                    )}
                    {scheduleTiming.status === 'BELUM_WAKTUNYA' && (
                      <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-200">
                        <p className="font-semibold flex items-center gap-1.5 text-amber-300">
                          <VisualIcon name="clock" className="h-3.5 w-3.5 text-amber-400" />
                          Sesi Belum Waktunya
                        </p>
                        <p className="mt-1 text-[11px] leading-relaxed text-amber-300/80">
                          {scheduleTiming.message}
                        </p>
                      </div>
                    )}
                    {scheduleTiming.status === 'BISA_DIMULAI' && (
                      <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-200">
                        <p className="font-semibold flex items-center gap-1.5 text-emerald-300">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                          Jadwal Sesi Aktif ({activeJamMulai} - {activeJamSelesai} WIB)
                        </p>
                        <p className="mt-1 text-[11px] leading-relaxed text-emerald-300/80">
                          Saat ini masih di dalam jam pembelajaran. Silakan klik Mulai Sesi untuk membuka presensi.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6 border-t border-white/10 pt-4">
                {sessionStatus === 'Belum Dimulai' && (
                  <div>
                    {scheduleTiming.canStart ? (
                      <Button
                        size="md"
                        onClick={handleStartSession}
                        disabled={isStarting}
                        className="w-full !bg-[#e5ba4b] !text-[#172654] hover:!bg-[#f0cb69] font-medium shadow-md shadow-amber-900/20 flex items-center justify-center gap-2"
                      >
                        <span>Mulai Sesi</span> <span aria-hidden="true">&#8594;</span>
                      </Button>
                    ) : scheduleTiming.status === 'SUDAH_SELESAI' ? (
                      <div className="space-y-1">
                        <button
                          type="button"
                          disabled
                          className="w-full py-2.5 px-4 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-400 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
                        >
                          <VisualIcon name="x" className="h-4 w-4 text-rose-400" />
                          <span>Sesi Sudah Selesai</span>
                        </button>
                        <p className="text-center text-[11px] text-zinc-400">
                          Waktu jadwal telah terlewati. Tidak dapat memulai sesi.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <button
                          type="button"
                          disabled
                          className="w-full py-2.5 px-4 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-400 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
                        >
                          <VisualIcon name="clock" className="h-4 w-4 text-amber-400" />
                          <span>Sesi Belum Waktunya</span>
                        </button>
                        <p className="text-center text-[11px] text-zinc-400">
                          Dapat dimulai pada pukul {activeJamMulai} WIB
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {sessionStatus === 'Sedang Berlangsung' && (
                  <Button
                    size="md"
                    onClick={() => setShowFinishConfirm(true)}
                    disabled={isFinishing}
                    className="w-full !bg-rose-600 hover:!bg-rose-700 !text-white font-medium flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40"
                  >
                    <VisualIcon name="check" className="h-4 w-4" />
                    <span>{isFinishing ? 'Menyelesaikan...' : 'Selesaikan Sesi'}</span>
                  </Button>
                )}

                {sessionStatus === 'Selesai' && (
                  <button
                    type="button"
                    onClick={handleReopenSession}
                    className="w-full py-2.5 px-3 text-xs font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <span>↺</span>
                    <span>Buka Kembali Sesi</span>
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* ── Ringkasan Kehadiran ── */}
          <section aria-label="Ringkasan kehadiran" className="grid grid-cols-2 overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-800/80 shadow-[0_16px_45px_rgba(15,23,42,0.06)] md:grid-cols-4">
            <div className="bg-zinc-900/90 p-5 sm:p-6">
              <p className="text-3xl font-semibold tracking-[-0.05em] text-emerald-400">{stats.hadir}</p>
              <p className="mt-2 text-sm text-zinc-400">Hadir</p>
            </div>
            <div className="bg-zinc-900/90 p-5 sm:p-6">
              <p className="text-3xl font-semibold tracking-[-0.05em] text-amber-400">{stats.sakit}</p>
              <p className="mt-2 text-sm text-zinc-400">Sakit</p>
            </div>
            <div className="bg-zinc-900/90 p-5 sm:p-6">
              <p className="text-3xl font-semibold tracking-[-0.05em] text-[#9eafff]">{stats.izin}</p>
              <p className="mt-2 text-sm text-zinc-400">Izin</p>
            </div>
            <div className="bg-zinc-900/90 p-5 sm:p-6">
              <p className="text-3xl font-semibold tracking-[-0.05em] text-rose-400">{stats.alpa}</p>
              <p className="mt-2 text-sm text-zinc-400">Alpa</p>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
            {/* ── Daftar Kehadiran Siswa ── */}
            <section className={`rounded-3xl border border-zinc-800/80 bg-zinc-900/60 shadow-[0_16px_45px_rgba(15,23,42,0.06)] ${!sessionStarted ? 'opacity-60' : ''}`}>
              <div className="flex flex-col gap-4 border-b border-zinc-800/80 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7">
                <div>
                  <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-zinc-50">Daftar Kehadiran Siswa</h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-zinc-400">
                    {loading ? 'Memuat siswa...' : `${attendance.length} siswa`}
                  </span>
                  {sessionStarted && (
                    <button
                      type="button"
                      onClick={() => handleSetAllStatus('Hadir')}
                      className="rounded-xl border border-emerald-400/30 bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-500/30"
                    >
                      ✓ Semua Hadir
                    </button>
                  )}
                </div>
              </div>

              {!sessionStarted && (
                <div className={`mx-5 mt-5 flex items-start gap-3 rounded-2xl border p-4 text-sm sm:mx-7 ${
                  scheduleTiming.status === 'SUDAH_SELESAI'
                    ? 'border-rose-500/30 bg-rose-950/20 text-rose-200'
                    : scheduleTiming.status === 'BELUM_WAKTUNYA'
                    ? 'border-amber-500/30 bg-amber-950/20 text-amber-200'
                    : 'border-[#5269b5]/40 bg-[#1b2a54] text-[#d8deff]'
                }`}>
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                    scheduleTiming.status === 'SUDAH_SELESAI'
                      ? 'bg-rose-500/20 text-rose-300'
                      : scheduleTiming.status === 'BELUM_WAKTUNYA'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-[#9eafff]/15 text-[#aebcff]'
                  }`} aria-hidden="true">
                    <VisualIcon
                      name={
                        scheduleTiming.status === 'SUDAH_SELESAI'
                          ? 'x'
                          : scheduleTiming.status === 'BELUM_WAKTUNYA'
                          ? 'clock'
                          : 'info'
                      }
                      className="h-3.5 w-3.5"
                    />
                  </span>
                  <div>
                    {scheduleTiming.status === 'SUDAH_SELESAI' ? (
                      <div>
                        <p className="font-semibold text-rose-800">Sesi Sudah Selesai</p>
                        <p className="mt-0.5 text-xs text-rose-700">Jadwal dan waktu pembelajaran telah terlewati. Sesi ini sudah selesai dan tidak dapat dimulai lagi.</p>
                      </div>
                    ) : scheduleTiming.status === 'BELUM_WAKTUNYA' ? (
                      <div>
                        <p className="font-semibold text-amber-800">Sesi Belum Waktunya</p>
                        <p className="mt-0.5 text-xs text-amber-700">Sesi hanya dapat dimulai saat tanggal dan jam pembelajaran yang dijadwalkan ({activeJamMulai} - {activeJamSelesai} WIB).</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold text-[#edf1ff]">Sesi Siap Dimulai</p>
                        <p className="mt-0.5 text-xs text-[#d8deff]/80">Waktu sesi telah tiba. Klik <strong className="text-white">Mulai Sesi</strong> di atas untuk mengaktifkan perubahan status presensi siswa.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAMPILAN MOBILE / HP */}
              <div className={`space-y-4 p-4 md:hidden ${!sessionStarted ? 'pointer-events-none' : ''}`}>
                {attendance.map((siswa) => {
                  const studentId = siswa.nipd || siswa.nisn || siswa.id;
                  const hasMarked = Boolean(siswa.status);

                  return (
                    <div
                      key={siswa.id}
                      className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h4 className="font-display text-base font-bold text-zinc-50">
                            {siswa.nama}
                          </h4>
                          <p className="text-xs font-medium text-zinc-400 font-mono">
                            NIPD: {studentId}
                          </p>
                        </div>

                        {hasMarked && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                            {siswa.status}
                          </span>
                        )}
                      </div>

                      <div className="mt-3.5 grid grid-cols-2 gap-2.5">
                        {STATUS_CONFIG.map((opt) => {
                          const isSelected = (siswa.status || '').toLowerCase() === opt.key.toLowerCase();

                          return (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => handleStatusChange(siswa.id, opt.key)}
                              className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border py-3 px-2 text-center transition-all duration-150 active:scale-[0.98] ${
                                isSelected
                                  ? opt.activeClass
                                  : 'border-zinc-700/70 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800'
                              }`}
                            >
                              <span className={isSelected ? opt.iconColor : 'text-zinc-500'}>
                                {opt.icon}
                              </span>
                              <span className="text-xs font-semibold sm:text-sm">
                                {opt.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* TAMPILAN DESKTOP & TABLET */}
              <div className={`hidden overflow-x-auto p-5 sm:p-7 md:block ${!sessionStarted ? 'pointer-events-none' : ''}`}>
                <table className="w-full text-left text-sm" aria-label="Daftar kehadiran siswa">
                  <thead className="border-b border-zinc-800 text-zinc-400">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em]">No</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em]">Nama Siswa</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em]">Hadir</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em]">Sakit</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em]">Izin</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em]">Alpa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                    {attendance.map((siswa, index) => (
                      <tr key={siswa.id} className="transition-colors hover:bg-[#1b2a54]/40">
                        <td className="px-4 py-4 text-zinc-500">{index + 1}</td>
                        <td className="px-4 py-4">
                          <p className="font-medium text-zinc-50">{siswa.nama}</p>
                          <p className="mt-0.5 text-xs text-zinc-500 font-mono">NIPD: {siswa.nipd || siswa.nisn || siswa.id}</p>
                        </td>
                        {STATUS_CONFIG.map((opt) => {
                          const isSelected = (siswa.status || '').toLowerCase() === opt.key.toLowerCase();
                          return (
                            <td key={opt.key} className="px-4 py-4 text-center">
                              <button
                                type="button"
                                aria-label={`Tandai ${siswa.nama} ${opt.label}`}
                                onClick={() => handleStatusChange(siswa.id, opt.key)}
                                className={`inline-flex items-center justify-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                                  isSelected
                                    ? opt.activeClass
                                    : 'border-zinc-700 bg-zinc-950 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800'
                                }`}
                              >
                                <span className={isSelected ? opt.iconColor : 'text-zinc-400'}>
                                  {React.cloneElement(opt.icon, { className: 'w-4 h-4' })}
                                </span>
                                <span className="hidden lg:inline">{opt.label}</span>
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {sessionStarted && (
                <div className="flex flex-col gap-3 border-t border-zinc-800/80 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                  <p className="text-xs leading-5 text-zinc-500">
                    {sessionStatus === 'Selesai'
                      ? 'Sesi ini telah selesai. Anda tetap dapat memperbarui presensi jika ada koreksi.'
                      : 'Pastikan seluruh siswa memiliki status kehadiran sebelum menyelesaikan sesi.'}
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Button
                      size="md"
                      variant="outline"
                      onClick={handleSaveAttendance}
                      disabled={isSaving}
                      className="w-full sm:w-auto !border-zinc-700 hover:!border-zinc-600 !text-zinc-300"
                    >
                      {sessionStatus === 'Selesai' ? 'Perbarui Presensi' : 'Simpan'}
                    </Button>
                  </div>
                </div>
              )}
            </section>

            {/* ── Sidebar: Form Input Materi Pembelajaran, Tugas, & Kuis ── */}
            <aside className="lg:sticky lg:top-8 lg:self-start">
              <section className="overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/60 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
                <div className="border-b border-white/10 bg-[#111b3c] p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#aebcff]">Pendukung sesi</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-white">Materi &amp; Tugas</h2>
                  <p className="mt-2 text-sm leading-6 text-[#c5cfe0]">
                    Isi topik materi pembelajaran, rangkuman, serta penugasan dan kuis untuk siswa.
                  </p>
                </div>

                <form onSubmit={handleSaveMateriTugas} className="space-y-6 p-5 sm:p-6">
                  {/* 1. Materi Pembelajaran */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1b2a54] text-[#9eafff]">
                        <VisualIcon name="book" className="h-3.5 w-3.5" />
                      </span>
                      <h3 className="text-sm font-semibold text-zinc-200">Materi Pembelajaran</h3>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
                        Topik / Judul Materi
                      </label>
                      <input
                        type="text"
                        value={materi.topik}
                        onChange={(e) => setMateri({ ...materi, topik: e.target.value })}
                        placeholder="Contoh: Turunan Fungsi Trigonometri"
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#9eafff] focus:outline-none focus:ring-2 focus:ring-[#9eafff]/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
                        Rangkuman / Catatan Materi
                      </label>
                      <textarea
                        rows={3}
                        value={materi.deskripsi}
                        onChange={(e) => setMateri({ ...materi, deskripsi: e.target.value })}
                        placeholder="Tuliskan poin-poin materi atau referensi buku yang diajarkan pada sesi ini..."
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#9eafff] focus:outline-none focus:ring-2 focus:ring-[#9eafff]/20 transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* 2. Tugas & Kuis */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1b2a54] text-[#9eafff]">
                        <VisualIcon name="task" className="h-3.5 w-3.5" />
                      </span>
                      <h3 className="text-sm font-semibold text-zinc-200">Tugas &amp; Kuis</h3>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
                        Tugas / Latihan Siswa
                      </label>
                      <textarea
                        rows={2}
                        value={tugasKuis.tugas}
                        onChange={(e) => setTugasKuis({ ...tugasKuis, tugas: e.target.value })}
                        placeholder="Contoh: Kerjakan soal latihan bab 3 halaman 45 nomor 1 s.d 5..."
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#9eafff] focus:outline-none focus:ring-2 focus:ring-[#9eafff]/20 transition-all resize-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
                        Kuis / Evaluasi Harian
                      </label>
                      <textarea
                        rows={2}
                        value={tugasKuis.kuis}
                        onChange={(e) => setTugasKuis({ ...tugasKuis, kuis: e.target.value })}
                        placeholder="Contoh: Kuis 3 butir soal pemahaman konsep di akhir sesi..."
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#9eafff] focus:outline-none focus:ring-2 focus:ring-[#9eafff]/20 transition-all resize-none"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full !bg-[#e5ba4b] !text-[#172654] hover:!bg-[#f0cb69]"
                  >
                    Simpan Materi &amp; Tugas <span aria-hidden="true">&#8594;</span>
                  </Button>
                </form>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <Footer containerClassName="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10" />

      <Notification
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        duration={3000}
      />

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => !isStarting && setShowConfirm(false)}
        onConfirm={handleConfirmStart}
        disabled={isStarting}
        title="Mulai Sesi Mengajar"
        message={`Apakah Anda yakin ingin memulai sesi ${schedule?.mataPelajaran} untuk kelas ${schedule?.kelas}?`}
        confirmText={isStarting ? 'Memulai...' : 'Ya, Mulai Sesi'}
        cancelText="Batal"
        type="info"
      />

      <ConfirmDialog
        isOpen={showSaveConfirm}
        onClose={() => !isSaving && setShowSaveConfirm(false)}
        onConfirm={handleConfirmSave}
        disabled={isSaving}
        title="Simpan Data Kehadiran"
        message={`Apakah Anda yakin ingin menyimpan data kehadiran untuk kelas ${schedule?.kelas}?`}
        confirmText={isSaving ? 'Menyimpan...' : 'Ya, Simpan'}
        cancelText="Batal"
        type="success"
      />

      <ConfirmDialog
        isOpen={showFinishConfirm}
        onClose={() => !isFinishing && setShowFinishConfirm(false)}
        onConfirm={handleConfirmFinish}
        disabled={isFinishing}
        title="Selesaikan Sesi Mengajar"
        message={`Apakah Anda yakin ingin menyelesaikan sesi pembelajaran ${schedule?.mataPelajaran} untuk kelas ${schedule?.kelas}? Catatan kehadiran siswa dan materi pembelajaran akan disimpan sebagai sesi selesai.`}
        confirmText={isFinishing ? 'Menyelesaikan...' : 'Ya, Selesaikan Sesi'}
        cancelText="Batal"
        type="danger"
      />
    </div>
  );
};

export default DetailSesi;
