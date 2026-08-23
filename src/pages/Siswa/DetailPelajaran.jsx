import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import VisualIcon from '../../components/common/VisualIcon';
import { getCurrentUser, formatDateLocal } from '../../utils/helpers';
import Footer from '../../components/common/Footer';
import { presensiService } from '../../services/presensiService';

const DetailPelajaran = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { jadwal, tanggal, dateStr, date } = location.state || {};

  const [sessionData, setSessionData] = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentUser, setStudentUser] = useState(null);
  const jadwalId = jadwal?.id;
  const finalDateStr = dateStr || (date ? formatDateLocal(date) : formatDateLocal(new Date()));

  // ── 1. Auth Guard ──
  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'siswa') {
      navigate('/login');
    } else {
      setStudentUser(user);
    }
  }, [navigate]);

  // ── 2. Fetch Session Data ──
  useEffect(() => {
    if (!jadwalId) {
      navigate('/siswa/jadwal');
      return;
    }

    let isMounted = true;

    const fetchSession = async () => {
      try {
        setLoading(true);
        const data = await presensiService.getSession(jadwalId, finalDateStr);
        if (isMounted) {
          setSessionData(data?.session || null);
          setAttendanceList(data?.attendance || []);
        }
      } catch (err) {
        console.error('Gagal memuat detail sesi materi:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSession();

    return () => {
      isMounted = false;
    };
  }, [jadwalId, finalDateStr, navigate]);

  if (!jadwal) return null;

  const isOnline = jadwal.status === 'Online';

  // ── Cari Status Kehadiran Siswa yang Sedang Login ──
  const myAttendance = attendanceList.find(
    (a) =>
      (studentUser?.id && (a.userId === studentUser.id || a.id === studentUser.id)) ||
      (studentUser?.nipd && a.nipd === studentUser.nipd) ||
      (studentUser?.nisn && a.nisn === studentUser.nisn) ||
      (studentUser?.nama && a.nama?.toLowerCase().trim() === studentUser.nama?.toLowerCase().trim())
  );

  const myStatus = myAttendance
    ? myAttendance.status
    : (sessionData?.statusSesi === 'Belum Dimulai' ? 'Belum Presensi' : 'Hadir');
  const myCatatan = myAttendance?.catatan;

  const topikMateri =
    sessionData?.topikMateri ||
    sessionData?.topik_materi ||
    (jadwal.mataPelajaran ? `Materi ${jadwal.mataPelajaran} - Kelas ${jadwal.kelas}` : 'Topik Belum Diisi Guru');

  const deskripsiMateri =
    sessionData?.deskripsiMateri ||
    sessionData?.deskripsi_materi ||
    'Guru pengampu belum menambahkan rangkuman atau catatan khusus untuk sesi pembelajaran ini.';

  const tugasSiswa = sessionData?.tugasSiswa || sessionData?.tugas_siswa || 'Tidak ada penugasan tertulis untuk sesi ini.';
  const kuisEvaluasi = sessionData?.kuisEvaluasi || sessionData?.kuis_evaluasi || 'Tidak ada kuis evaluasi pada sesi ini.';

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
                <span className="rounded-full border border-[#9eafff]/30 bg-[#9eafff]/10 px-3 py-1.5 text-xs font-semibold text-[#d8deff]">
                  {jadwal.guru || 'Guru Pengampu'}
                </span>
                <span className="text-xs text-[#c5cfe0]">
                  {jadwal.jam} • {jadwal.ruang || `Kelas ${jadwal.kelas}`}
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-between border-t border-white/10 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Status sesi</p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isOnline
                      ? 'border border-[#5269b5]/40 bg-[#1b2a54] text-[#b9c5ff]'
                      : 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                  }`}
                >
                  {isOnline ? 'Online via Meet' : 'Tatap Muka di Kelas'}
                </span>
              </div>
              <div className="mt-8 border-t border-white/10 pt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Jadwal sesi</p>
                <p className="mt-2 text-sm leading-6 text-[#edf1ff]">{tanggal || 'Hari ini'}</p>
              </div>
            </div>
          </section>

          {/* ── Banner Status Kehadiran Siswa ── */}
          <section className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/90 p-5 sm:p-6 backdrop-blur-xl shadow-lg">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-xl ${
                  myStatus === 'Hadir'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : myStatus === 'Sakit'
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                    : myStatus === 'Izin'
                    ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                    : myStatus === 'Alpa'
                    ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                    : 'border-zinc-700 bg-zinc-800 text-zinc-400'
                }`}>
                  {myStatus === 'Hadir' && '✅'}
                  {myStatus === 'Sakit' && '🤒'}
                  {myStatus === 'Izin' && '📩'}
                  {myStatus === 'Alpa' && '❌'}
                  {myStatus === 'Belum Presensi' && '⏳'}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">Status Kehadiran Anda</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${
                      myStatus === 'Hadir'
                        ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                        : myStatus === 'Sakit'
                        ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                        : myStatus === 'Izin'
                        ? 'border-blue-500/40 bg-blue-500/15 text-blue-300'
                        : myStatus === 'Alpa'
                        ? 'border-rose-500/40 bg-rose-500/15 text-rose-300'
                        : 'border-zinc-700 bg-zinc-800 text-zinc-300'
                    }`}>
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {loading ? 'Memeriksa presensi...' : myStatus}
                    </span>
                    {studentUser?.nama && (
                      <span className="text-xs text-zinc-400">
                        {studentUser.nama} {studentUser.nipd ? `(${studentUser.nipd})` : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {myCatatan && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-xs text-zinc-300 sm:max-w-xs">
                  <span className="font-semibold text-amber-400">Catatan Guru: </span>
                  {myCatatan}
                </div>
              )}
            </div>
          </section>

          {/* ── Content Grid: Materi & Tugas ── */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Materi Pembelajaran */}
            <article className="overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/60 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
              <div className="border-b border-zinc-800/80 bg-[#111b3c] p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1b2a54] text-[#9eafff]">
                    <VisualIcon name="book" className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#aebcff]">Bahan ajar</p>
                    <h2 className="mt-1 font-display text-2xl font-semibold tracking-[-0.04em] text-white">Materi Pembelajaran</h2>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6 sm:p-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">Topik / Bahasan</p>
                  <h3 className="mt-2 font-display text-xl font-bold tracking-[-0.03em] text-zinc-50">
                    {loading ? 'Memuat topik materi...' : topikMateri}
                  </h3>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9eafff]">Catatan &amp; Rangkuman Guru</p>
                  <p className="mt-3 text-sm leading-7 text-zinc-300 whitespace-pre-line">
                    {loading ? 'Memuat rangkuman materi dari guru...' : deskripsiMateri}
                  </p>
                </div>
              </div>
            </article>

            {/* Tugas & Kuis */}
            <article className="overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/60 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
              <div className="border-b border-zinc-800/80 bg-[#111b3c] p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1b2a54] text-[#9eafff]">
                    <VisualIcon name="task" className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#aebcff]">Evaluasi siswa</p>
                    <h2 className="mt-1 font-display text-2xl font-semibold tracking-[-0.04em] text-white">Tugas &amp; Kuis</h2>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-6 sm:p-7">
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold">
                      📝
                    </span>
                    <h3 className="text-sm font-semibold text-amber-300">Penugasan / Latihan</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-200 whitespace-pre-line">
                    {loading ? 'Memuat tugas...' : tugasSiswa}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#5269b5]/40 bg-[#1b2a54]/60 p-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#9eafff]/20 text-[#aebcff] text-xs font-bold">
                      ⏱️
                    </span>
                    <h3 className="text-sm font-semibold text-[#aebcff]">Kuis Evaluasi Sesi</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-200 whitespace-pre-line">
                    {loading ? 'Memuat kuis...' : kuisEvaluasi}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>

      <Footer containerClassName="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10" />
    </div>
  );
};

export default DetailPelajaran;
