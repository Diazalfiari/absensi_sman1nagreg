import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import ClassCard from '../../components/admin/class/ClassCard';
import VisualIcon from '../../components/common/VisualIcon';
import Notification from '../../components/common/Notification';
import KenaikanAngkatanModal from '../../components/admin/class/KenaikanAngkatanModal';
import KelulusanAngkatanModal from '../../components/admin/class/KelulusanAngkatanModal';
import { kelasService } from '../../services/kelasService';

const gradeGroups = [
  { tingkat: 'X', label: 'Kelas X', prefix: 'X-', accent: 'bg-[#eaf0ff] text-[#29438f] dark:bg-[#152143] dark:text-[#aebcff]' },
  { tingkat: 'XI', label: 'Kelas XI', prefix: 'XI-', accent: 'bg-[#f7f1df] text-[#8b681d] dark:bg-[#292615] dark:text-[#f0cb69]' },
  { tingkat: 'XII', label: 'Kelas XII', prefix: 'XII-', accent: 'bg-[#eef5f0] text-[#2d6a43] dark:bg-[#172b20] dark:text-[#9ad1ad]' },
];

const ManajemenKelas = () => {
  const navigate = useNavigate();
  const [classesList, setClassesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // ── State for batch modals ──
  const [batchPromoteTingkat, setBatchPromoteTingkat] = useState(null); // 'X' or 'XI'
  const [isBatchGraduateOpen, setIsBatchGraduateOpen] = useState(false);

  // ── Notification Toast state ──
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const showNotification = (type, title, message) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const data = await kelasService.getAllClasses();
      setClassesList(data || []);
    } catch (err) {
      console.error('Gagal memuat daftar kelas:', err);
      setErrorMessage(err.message || 'Gagal memuat data kelas dari server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleClassClick = (kelas) => {
    navigate(`/admin/manajemen-kelas/${kelas.nama_kelas || kelas.id}`);
  };

  // ── Handler Batch Promote (1 Angkatan X -> XI atau XI -> XII) ──
  const handleConfirmBatchPromote = async (tingkatAsal) => {
    try {
      const res = await kelasService.promoteBatchTingkat(tingkatAsal);
      showNotification(
        'success',
        'Kenaikan 1 Angkatan Berhasil',
        res.message || `Sebanyak ${res.totalSiswa || 0} siswa di seluruh rombel Tingkat ${tingkatAsal} berhasil dinaikkan ke Tingkat ${res.tingkatTujuan}.`
      );
      await fetchClasses();
    } catch (err) {
      showNotification('error', 'Gagal Memproses Kenaikan 1 Angkatan', err.message || 'Terjadi kesalahan saat memproses kenaikan angkatan.');
      throw err;
    }
  };

  // ── Handler Batch Graduate (1 Angkatan Kelas XII) ──
  const handleConfirmBatchGraduate = async () => {
    try {
      const res = await kelasService.graduateBatchTingkat('XII');
      showNotification(
        'success',
        'Kelulusan 1 Angkatan Berhasil',
        res.message || `Sebanyak ${res.totalSiswa || 0} siswa dari seluruh rombel Kelas XII telah dinyatakan Lulus.`
      );
      await fetchClasses();
    } catch (err) {
      showNotification('error', 'Gagal Memproses Kelulusan 1 Angkatan', err.message || 'Terjadi kesalahan saat meluluskan 1 angkatan.');
      throw err;
    }
  };

  const totalStudents = classesList.reduce(
    (total, c) => total + (parseInt(c.total_siswa, 10) || 0),
    0
  );
  const assignedHomerooms = classesList.filter((c) => c.wali_kelas_id || c.nama_wali_kelas).length;
  const unassignedHomerooms = classesList.length - assignedHomerooms;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-zinc-950">
      <Sidebar role="admin" />

      <main className="mt-16 flex-1 p-5 transition-all duration-300 sm:p-7 lg:ml-72 lg:mt-0 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <header className="flex flex-col gap-6 border-b border-zinc-800/80 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#29438f] dark:text-[#9eafff]">
                Administrasi akademik
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-zinc-50 sm:text-5xl">
                Manajemen Kelas
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-500 dark:text-zinc-400 sm:text-base">
                Kelola struktur 36 rombel kelas, mutasi siswa, penetapan wali kelas, serta kenaikan kelas dan kelulusan serentak 1 angkatan.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-[#c8d4f4] bg-[#eaf0ff] px-4 py-3 text-[#29438f] dark:border-[#30457f] dark:bg-[#152143] dark:text-[#aebcff]">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#29438f] text-white dark:bg-[#9eafff] dark:text-[#172654]" aria-hidden="true">
                <VisualIcon name="class" className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">Data Kelas Realtime</p>
                <p className="mt-0.5 text-xs opacity-75">Tahun Ajaran 2025/2026</p>
              </div>
            </div>
          </header>

          {/* ── Summary Stats Banner ── */}
          <section className="grid overflow-hidden rounded-3xl border border-[#30457f] bg-[#172654] text-white shadow-[0_24px_70px_rgba(23,38,84,0.2)] dark:bg-[#111b3c] sm:grid-cols-[1.25fr_1fr]">
            <div className="relative overflow-hidden p-6 sm:p-8">
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#9eafff]/10 blur-3xl" aria-hidden="true" />
              <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-[#aebcff]">Ringkasan Data</p>
              <h3 className="relative mt-4 max-w-md font-display text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                36 Rombel dalam Satu Tampilan
              </h3>
              <p className="relative mt-3 max-w-lg text-sm leading-6 text-[#c5cfe0]">
                Klik pada kartu kelas untuk melihat detail siswa, atau gunakan tombol kenaikan/kelulusan 1 angkatan untuk proses serentak.
              </p>
            </div>
            <div className="grid grid-cols-3 border-t border-white/10 sm:border-l sm:border-t-0">
              <div className="flex flex-col items-center justify-center text-center border-r border-white/10 p-4 sm:p-6">
                <p className="text-2xl font-semibold sm:text-3xl">{loading ? '...' : classesList.length}</p>
                <p className="mt-2 text-xs leading-5 text-[#c5cfe0]">Total Rombel</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center border-r border-white/10 p-4 sm:p-6">
                <p className="text-2xl font-semibold sm:text-3xl">{loading ? '...' : totalStudents}</p>
                <p className="mt-2 text-xs leading-5 text-[#c5cfe0]">Siswa Terdata</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-4 sm:p-6">
                <p className="text-2xl font-semibold sm:text-3xl">{loading ? '...' : assignedHomerooms}</p>
                <p className="mt-2 text-xs leading-5 text-[#c5cfe0]">Wali Terisi</p>
              </div>
            </div>
          </section>

          {/* ── Warning Banner ── */}
          {!loading && unassignedHomerooms > 0 && (
            <section className="flex flex-col gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div>
                <p className="text-sm font-semibold text-zinc-50">Perlu Perhatian</p>
                <p className="mt-1 text-xs text-zinc-500">Terdapat rombel yang belum memiliki wali kelas resmi.</p>
              </div>
              <span className="w-fit rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-sm font-semibold text-amber-700 dark:text-amber-300">
                {unassignedHomerooms} kelas belum ada wali
              </span>
            </section>
          )}

          {errorMessage && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-sm text-rose-400">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* ── Grade Groups (X, XI, XII) ── */}
          <div className="space-y-12">
            {gradeGroups.map((group) => {
              const classesInGroup = classesList
                .filter((c) => (c.nama_kelas || '').startsWith(group.prefix))
                .sort((a, b) => {
                  const numA = parseInt((a.nama_kelas || '').replace(group.prefix, ''), 10) || 0;
                  const numB = parseInt((b.nama_kelas || '').replace(group.prefix, ''), 10) || 0;
                  return numA - numB;
                });

              const groupStudentCount = classesInGroup.reduce(
                (sum, c) => sum + (parseInt(c.total_siswa, 10) || 0),
                0
              );

              const isGrade12 = group.tingkat === 'XII';

              return (
                <section key={group.label} className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${group.accent}`} aria-hidden="true">
                        <VisualIcon name="class" className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-zinc-50">{group.label}</h3>
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {groupStudentCount} Siswa
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {loading ? 'Memuat rombel...' : `${classesInGroup.length} rombel paralel terdaftar`}
                        </p>
                      </div>
                    </div>

                    {/* Button Aksi 1 Angkatan */}
                    {!loading && classesInGroup.length > 0 && (
                      <div>
                        {!isGrade12 ? (
                          <button
                            type="button"
                            onClick={() => setBatchPromoteTingkat(group.tingkat)}
                            disabled={groupStudentCount === 0}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#30457f] bg-[#172654] text-[#aebcff] hover:bg-[#20346e] hover:border-[#4d69b3] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                          >
                            <span>🎓</span> Naikkan 1 Angkatan {group.tingkat} (ke {group.tingkat === 'X' ? 'XI' : 'XII'})
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setIsBatchGraduateOpen(true)}
                            disabled={groupStudentCount === 0}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-500/60 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                          >
                            <span>🏆</span> Kelulusan 1 Angkatan XII (Alumni)
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {loading ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="min-h-[218px] rounded-2xl border border-zinc-800/80 bg-zinc-900 p-5 animate-pulse flex flex-col justify-between">
                          <div>
                            <div className="h-3 bg-zinc-800 rounded w-20 mb-3" />
                            <div className="h-8 bg-zinc-800 rounded w-28" />
                          </div>
                          <div className="grid grid-cols-2 gap-3 my-4">
                            <div className="h-14 bg-zinc-950/60 rounded-xl border border-zinc-800/80" />
                            <div className="h-14 bg-zinc-950/60 rounded-xl border border-zinc-800/80" />
                          </div>
                          <div className="h-4 bg-zinc-800 rounded w-32" />
                        </div>
                      ))}
                    </div>
                  ) : classesInGroup.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {classesInGroup.map((kelas) => (
                        <ClassCard
                          key={kelas.id}
                          kelas={kelas.nama_kelas}
                          waliKelas={kelas.nama_wali_kelas}
                          jumlahSiswa={kelas.total_siswa || 0}
                          onClick={() => handleClassClick(kelas)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-zinc-900/40 border border-zinc-800 rounded-2xl text-zinc-500 text-sm">
                      Belum ada data kelas untuk {group.label}.
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </main>

      <Footer containerClassName="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10" />

      {/* ── Modal Naik Kelas 1 Angkatan (X -> XI atau XI -> XII) ── */}
      {batchPromoteTingkat && (
        <KenaikanAngkatanModal
          isOpen={!!batchPromoteTingkat}
          onClose={() => setBatchPromoteTingkat(null)}
          onConfirm={handleConfirmBatchPromote}
          tingkatAsal={batchPromoteTingkat}
          classes={classesList.filter((c) => (c.nama_kelas || '').startsWith(`${batchPromoteTingkat}-`))}
        />
      )}

      {/* ── Modal Kelulusan 1 Angkatan (XII) ── */}
      {isBatchGraduateOpen && (
        <KelulusanAngkatanModal
          isOpen={isBatchGraduateOpen}
          onClose={() => setIsBatchGraduateOpen(false)}
          onConfirm={handleConfirmBatchGraduate}
          classes={classesList.filter((c) => (c.nama_kelas || '').startsWith('XII-'))}
        />
      )}

      {/* ── Notification Toast (z-[9999]) ── */}
      <Notification
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default ManajemenKelas;
