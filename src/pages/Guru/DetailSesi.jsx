import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Notification from '../../components/common/Notification';
import { dataSiswa } from '../../data/mockData';
import Footer from '../../components/common/Footer';

const DetailSesi = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { schedule, date } = location.state || {};

  // Mock data siswa untuk kelas terpilih
  const siswaList = dataSiswa[schedule?.kelas] || [];

  const [attendance, setAttendance] = useState(
    siswaList.map((siswa) => ({
      ...siswa,
      status: 'Hadir', // Default status
    }))
  );

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showUploadConfirm, setShowUploadConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [notification, setNotification] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  const handleStatusChange = (siswaId, newStatus) => {
    setAttendance(
      attendance.map((siswa) =>
        siswa.id === siswaId ? { ...siswa, status: newStatus } : siswa
      )
    );
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      setUploadError('Ukuran file melebihi 10MB. Pilih file yang lebih kecil.');
      setSelectedFile(null);
      e.target.value = '';
      return;
    }

    setUploadError('');
    setSelectedFile(file);
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      if (uploadedFiles.length >= 2) {
        setUploadError('Maksimal 2 materi per sesi. Hapus salah satu untuk mengunggah lagi.');
        return;
      }
      setShowUploadConfirm(true);
    }
  };

  const handleConfirmUpload = () => {
    setUploadedFiles((prev) => [...prev, selectedFile]);
    setShowUploadConfirm(false);
    setUploadError('');
    setNotification({
      isOpen: true,
      type: 'success',
      title: 'Upload Berhasil!',
      message: `File "${selectedFile.name}" berhasil diunggah.`
    });
    setSelectedFile(null);
  };

  const handleStartSession = () => {
    setShowConfirm(true);
  };

  const handleConfirmStart = () => {
    setSessionStarted(true);
    setShowConfirm(false);
    setNotification({
      isOpen: true,
      type: 'success',
      title: 'Sesi Dimulai!',
      message: 'Sesi mengajar telah dimulai. Anda dapat mengisi presensi dan upload materi.'
    });
  };

  const handleSaveAttendance = () => {
    setShowSaveConfirm(true);
  };

  const handleConfirmSave = () => {
    const attendanceData = {
      schedule,
      date: date?.toISOString().split('T')[0],
      attendance: attendance.map(s => ({
        id: s.id,
        nama: s.nama,
        status: s.status
      }))
    };

    console.log('Data Kehadiran Tersimpan:', attendanceData);
    setShowSaveConfirm(false);
    setNotification({
      isOpen: true,
      type: 'success',
      title: 'Data Tersimpan!',
      message: 'Data kehadiran siswa berhasil disimpan.'
    });
  };

  const getStatusCount = () => {
    return {
      hadir: attendance.filter(s => s.status === 'Hadir').length,
      sakit: attendance.filter(s => s.status === 'Sakit').length,
      izin: attendance.filter(s => s.status === 'Izin').length,
      alpa: attendance.filter(s => s.status === 'alpa').length,
    };
  };

  const stats = getStatusCount();

  if (!schedule || !date) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-zinc-950 px-5 text-zinc-50">
        <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf0ff] text-sm font-bold text-[#29438f] dark:bg-[#1b2a54] dark:text-[#aebcff]" aria-hidden="true">S</span>
          <h1 className="mt-5 font-display text-2xl font-semibold tracking-[-0.04em]">Data sesi tidak ditemukan</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">Buka detail sesi melalui kalender jadwal mengajar.</p>
          <Button onClick={() => navigate('/guru/Jadwal-mengajar')} className="mt-6 w-full !bg-[#e5ba4b] !text-[#172654] hover:!bg-[#f0cb69]">
            Kembali ke Jadwal <span aria-hidden="true">&#8594;</span>
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

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
              <p className="relative mt-3 text-lg font-medium text-[#d8deff]">Kelas {schedule.kelas}</p>
              <div className="relative mt-8 grid gap-5 border-t border-white/10 pt-5 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Tanggal</p>
                  <p className="mt-2 text-sm leading-6 text-[#edf1ff]">{formattedDate}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Waktu</p>
                  <p className="mt-2 text-sm leading-6 text-[#edf1ff]">{schedule.jamMulai} - {schedule.jamSelesai}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Status sesi</p>
                  <p className="mt-3 font-display text-2xl font-semibold tracking-[-0.05em] text-white">
                    {sessionStarted ? 'Sedang berlangsung' : 'Belum dimulai'}
                  </p>
                </div>
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold ${sessionStarted ? 'bg-emerald-400 text-[#172654]' : 'bg-[#e5ba4b] text-[#172654]'}`} aria-hidden="true">
                  {sessionStarted ? 'ON' : 'S'}
                </span>
              </div>
              {sessionStarted ? (
                <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-5 text-sm text-[#d8deff]">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
                  Presensi aktif dan siap diisi
                </div>
              ) : (
                <div className="mt-8 border-t border-white/10 pt-5">
                  <p className="text-sm leading-6 text-[#c5cfe0]">Mulai sesi untuk mengaktifkan pengisian presensi siswa.</p>
                  <Button size="md" onClick={handleStartSession} className="mt-5 w-full !bg-[#e5ba4b] !text-[#172654] hover:!bg-[#f0cb69]">
                    Mulai Sesi <span aria-hidden="true">&#8594;</span>
                  </Button>
                </div>
              )}
            </div>
          </section>

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

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
            <section className={`rounded-3xl border border-zinc-800/80 bg-zinc-900/60 shadow-[0_16px_45px_rgba(15,23,42,0.06)] ${!sessionStarted ? 'opacity-60' : ''}`}>
              <div className="flex flex-col gap-4 border-b border-zinc-800/80 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9eafff]">Ruang kerja utama</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-zinc-50">Daftar Kehadiran Siswa</h2>
                </div>
                <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-zinc-400">{attendance.length} siswa</span>
              </div>

              {!sessionStarted && (
                <div className="mx-5 mt-5 flex items-start gap-3 rounded-2xl border border-[#5269b5]/40 bg-[#1b2a54] p-4 text-sm text-[#d8deff] sm:mx-7">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#9eafff]/15 text-xs font-bold text-[#aebcff]" aria-hidden="true">i</span>
                  <p>Mulai sesi terlebih dahulu untuk mengubah status kehadiran siswa.</p>
                </div>
              )}

              <div className={`overflow-x-auto p-5 sm:p-7 ${!sessionStarted ? 'pointer-events-none' : ''}`}>
                <table className="w-full min-w-[720px] text-left text-sm" aria-label="Daftar kehadiran siswa">
                  <thead className="border-b border-zinc-800 text-zinc-500">
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
                          <p className="mt-1 text-xs text-zinc-500">NIS: {siswa.id}</p>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <label className="inline-flex cursor-pointer items-center justify-center">
                            <input
                              type="checkbox"
                              aria-label={`Tandai ${siswa.nama} hadir`}
                              checked={siswa.status === 'Hadir'}
                              onChange={() => handleStatusChange(siswa.id, 'Hadir')}
                              className="h-5 w-5 cursor-pointer rounded border-zinc-700 bg-zinc-950 text-emerald-500 accent-emerald-500 transition-all"
                            />
                          </label>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <label className="inline-flex cursor-pointer items-center justify-center">
                            <input
                              type="checkbox"
                              aria-label={`Tandai ${siswa.nama} sakit`}
                              checked={siswa.status === 'Sakit'}
                              onChange={() => handleStatusChange(siswa.id, 'Sakit')}
                              className="h-5 w-5 cursor-pointer rounded border-zinc-700 bg-zinc-950 text-amber-500 accent-amber-500 transition-all"
                            />
                          </label>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <label className="inline-flex cursor-pointer items-center justify-center">
                            <input
                              type="checkbox"
                              aria-label={`Tandai ${siswa.nama} izin`}
                              checked={siswa.status === 'Izin'}
                              onChange={() => handleStatusChange(siswa.id, 'Izin')}
                              className="h-5 w-5 cursor-pointer rounded border-zinc-700 bg-zinc-950 text-[#9eafff] accent-[#9eafff] transition-all"
                            />
                          </label>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <label className="inline-flex cursor-pointer items-center justify-center">
                            <input
                              type="checkbox"
                              aria-label={`Tandai ${siswa.nama} alpa`}
                              checked={siswa.status === 'alpa'}
                              onChange={() => handleStatusChange(siswa.id, 'alpa')}
                              className="h-5 w-5 cursor-pointer rounded border-zinc-700 bg-zinc-950 text-rose-500 accent-rose-500 transition-all"
                            />
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {sessionStarted && (
                <div className="flex flex-col gap-3 border-t border-zinc-800/80 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                  <p className="text-xs leading-5 text-zinc-500">Pastikan setiap siswa memiliki satu status sebelum menyimpan.</p>
                  <Button size="md" onClick={handleSaveAttendance} className="w-full !bg-[#e5ba4b] !text-[#172654] hover:!bg-[#f0cb69] sm:w-auto">
                    Simpan Kehadiran <span aria-hidden="true">&#8594;</span>
                  </Button>
                </div>
              )}
            </section>

            <aside className="lg:sticky lg:top-8 lg:self-start">
              <section className="overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/60 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
                <div className="border-b border-white/10 bg-[#111b3c] p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#aebcff]">Pendukung sesi</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-white">Materi Pembelajaran</h2>
                  <p className="mt-2 text-sm leading-6 text-[#c5cfe0]">Tambahkan maksimal dua materi untuk mendampingi sesi ini.</p>
                </div>

                <div className="space-y-5 p-5 sm:p-6">
                  {uploadError && (
                    <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4" role="alert">
                      <p className="text-sm leading-5 text-rose-300">{uploadError}</p>
                    </div>
                  )}

                  <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/60 p-5 text-center transition-colors hover:border-[#6f83d0]">
                    <input
                      type="file"
                      id="fileUpload"
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                    />
                    <label htmlFor="fileUpload" className="block cursor-pointer">
                      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#1b2a54] text-sm font-bold text-[#aebcff]" aria-hidden="true">+</span>
                      <p className="mt-4 text-sm font-medium text-zinc-50">{selectedFile ? selectedFile.name : 'Pilih file materi'}</p>
                      <p className="mt-2 text-xs leading-5 text-zinc-500">PDF, DOC, PPT, atau gambar. Maksimal 10MB.</p>
                    </label>
                  </div>

                  {selectedFile && uploadedFiles.length < 2 && (
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-zinc-50">{selectedFile.name}</p>
                          <p className="mt-1 text-xs text-zinc-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <button
                          type="button"
                          aria-label="Hapus file terpilih"
                          onClick={() => setSelectedFile(null)}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-50"
                        >
                          <span aria-hidden="true">&#10005;</span>
                        </button>
                      </div>
                      <Button className="mt-4 w-full !bg-[#e5ba4b] !text-[#172654] hover:!bg-[#f0cb69]" onClick={handleUploadClick}>
                        Upload Materi <span aria-hidden="true">&#8594;</span>
                      </Button>
                    </div>
                  )}

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Materi tersimpan</p>
                      {uploadedFiles.map((file, idx) => (
                        <div key={file.name + idx} className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-emerald-400">Materi {idx + 1}</p>
                              <p className="mt-1 truncate text-sm font-medium text-zinc-50">{file.name}</p>
                              <p className="mt-1 text-xs text-zinc-500">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                            <button
                              type="button"
                              aria-label={`Hapus ${file.name}`}
                              onClick={() => {
                                setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
                                setUploadError('');
                              }}
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-50"
                            >
                              <span aria-hidden="true">&#10005;</span>
                            </button>
                          </div>
                        </div>
                      ))}
                      {uploadedFiles.length < 2 && (
                        <p className="text-xs leading-5 text-zinc-500">Anda dapat mengunggah 1 materi lagi.</p>
                      )}
                    </div>
                  )}
                </div>
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
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmStart}
        title="Mulai Sesi Mengajar"
        message={`Apakah Anda yakin ingin memulai sesi ${schedule?.mataPelajaran} untuk kelas ${schedule?.kelas}?`}
        confirmText="Ya, Mulai Sesi"
        cancelText="Batal"
        type="info"
      />

      <ConfirmDialog
        isOpen={showUploadConfirm}
        onClose={() => setShowUploadConfirm(false)}
        onConfirm={handleConfirmUpload}
        title="Upload Materi Pembelajaran"
        message={`Apakah Anda yakin ingin mengupload file "${selectedFile?.name}"?`}
        confirmText="Ya, Upload"
        cancelText="Batal"
        type="info"
      />

      <ConfirmDialog
        isOpen={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        onConfirm={handleConfirmSave}
        title="Simpan Data Kehadiran"
        message={`Apakah Anda yakin ingin menyimpan data kehadiran untuk kelas ${schedule?.kelas}?`}
        confirmText="Ya, Simpan"
        cancelText="Batal"
        type="success"
      />
    </div>
  );
};

export default DetailSesi;
