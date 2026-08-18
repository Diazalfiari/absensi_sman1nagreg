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
      <div className="bg-ink-900 min-h-screen text-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Data sesi tidak ditemukan</p>
          <Button onClick={() => navigate('/guru/Jadwal-mengajar')}>
            Kembali ke Jadwal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-[100dvh] text-zinc-50 selection:bg-primary-500/30">
      <Sidebar role="guru" />
      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <button
              onClick={() => navigate('/guru/Jadwal-mengajar')}
              className="text-zinc-400 hover:text-zinc-50 flex items-center gap-2 mb-4 transition-colors text-sm"
            >
              ← Kembali ke Jadwal
            </button>
            <h1 className="text-3xl md:text-4xl font-display tracking-tight text-zinc-50">Detail Sesi</h1>
          </div>

          {/* Schedule Info */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1">Mata Pelajaran</p>
                <p className="text-lg font-medium text-zinc-50">{schedule.mataPelajaran}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1">Kelas</p>
                <p className="text-lg font-medium text-zinc-50">{schedule.kelas}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1">Tanggal</p>
                <p className="text-lg font-medium text-zinc-50">
                  {date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1">Waktu</p>
                <p className="text-lg font-medium text-zinc-50">{schedule.jamMulai} - {schedule.jamSelesai}</p>
              </div>
            </div>
          </div>

          {/* Start Session Button */}
          {!sessionStarted && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-1 text-zinc-50">Mulai Sesi Mengajar</h3>
                  <p className="text-sm text-zinc-400">Klik tombol untuk memulai sesi dan mengaktifkan fitur presensi</p>
                </div>
                <Button size="lg" onClick={handleStartSession}>
                  Mulai Sesi
                </Button>
              </div>
            </div>
          )}

          {sessionStarted && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="font-medium text-emerald-400 text-sm">Sesi sedang berlangsung</p>
              </div>
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <div className="text-center">
                <p className="text-3xl font-semibold text-emerald-400">{stats.hadir}</p>
                <p className="text-sm text-zinc-400 mt-1">Hadir</p>
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <div className="text-center">
                <p className="text-3xl font-semibold text-amber-400">{stats.sakit}</p>
                <p className="text-sm text-zinc-400 mt-1">Sakit</p>
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <div className="text-center">
                <p className="text-3xl font-semibold text-accent-400">{stats.izin}</p>
                <p className="text-sm text-zinc-400 mt-1">Izin</p>
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <div className="text-center">
                <p className="text-3xl font-semibold text-rose-400">{stats.alpa}</p>
                <p className="text-sm text-zinc-400 mt-1">Alpa</p>
              </div>
            </div>
          </div>

          {/* Upload Materi */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-medium mb-4 text-zinc-50">Upload Materi Pembelajaran</h2>
            {uploadError && (
              <div className="p-4 mb-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <p className="text-rose-400 text-sm">{uploadError}</p>
              </div>
            )}
            <div className="space-y-4">
              <div className="border border-dashed border-zinc-700 rounded-xl p-6 text-center hover:border-white/30 transition-colors bg-zinc-950/50">
                <input
                  type="file"
                  id="fileUpload"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                />
                <label htmlFor="fileUpload" className="cursor-pointer block">
                  <p className="text-sm text-zinc-50 mb-1">
                    {selectedFile ? selectedFile.name : 'Klik untuk pilih file materi'}
                  </p>
                  <p className="text-xs text-zinc-500">
                    PDF, DOC, PPT, atau gambar (Max 10MB)
                  </p>
                </label>
              </div>
              
              {selectedFile && uploadedFiles.length < 2 && (
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-zinc-50 text-sm">{selectedFile.name}</p>
                        <p className="text-xs text-zinc-500">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-zinc-500 hover:text-zinc-50 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <Button className="w-full" onClick={handleUploadClick}>
                    Upload Materi
                  </Button>
                </div>
              )}

              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  {uploadedFiles.map((file, idx) => (
                    <div key={file.name + idx} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium text-emerald-400 text-sm">Materi Terupload</p>
                            <p className="text-sm text-zinc-50">{file.name}</p>
                            <p className="text-xs text-zinc-500">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
                            setUploadError('');
                          }}
                          className="text-zinc-500 hover:text-zinc-50 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                  {uploadedFiles.length < 2 && (
                    <p className="text-xs text-zinc-500">Anda dapat mengunggah 1 materi lagi (maks 10MB).</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Attendance Table */}
          <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-6 ${!sessionStarted ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-zinc-50">Daftar Kehadiran Siswa</h2>
              <p className="text-sm text-zinc-400">Total: {attendance.length} siswa</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4 font-medium">No</th>
                    <th className="py-3 px-4 font-medium">Nama Siswa</th>
                    <th className="text-center py-3 px-4 font-medium">Hadir</th>
                    <th className="text-center py-3 px-4 font-medium">Sakit</th>
                    <th className="text-center py-3 px-4 font-medium">Izin</th>
                    <th className="text-center py-3 px-4 font-medium">Alpa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  {attendance.map((siswa, index) => (
                    <tr
                      key={siswa.id}
                      className="hover:bg-zinc-900 transition-colors"
                    >
                      <td className="py-4 px-4">{index + 1}</td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-zinc-50">{siswa.nama}</p>
                          <p className="text-xs text-zinc-500">NIS: {siswa.id}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <label className="inline-flex items-center justify-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={siswa.status === 'Hadir'}
                            onChange={() => handleStatusChange(siswa.id, 'Hadir')}
                            className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 checked:bg-emerald-500 checked:border-emerald-500 cursor-pointer transition-all"
                          />
                        </label>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <label className="inline-flex items-center justify-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={siswa.status === 'Sakit'}
                            onChange={() => handleStatusChange(siswa.id, 'Sakit')}
                            className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 checked:bg-amber-500 checked:border-amber-500 cursor-pointer transition-all"
                          />
                        </label>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <label className="inline-flex items-center justify-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={siswa.status === 'Izin'}
                            onChange={() => handleStatusChange(siswa.id, 'Izin')}
                            className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 checked:bg-accent-500 checked:border-accent-500 cursor-pointer transition-all"
                          />
                        </label>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <label className="inline-flex items-center justify-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={siswa.status === 'alpa'}
                            onChange={() => handleStatusChange(siswa.id, 'alpa')}
                            className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 checked:bg-rose-500 checked:border-rose-500 cursor-pointer transition-all"
                          />
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {sessionStarted && (
              <div className="mt-6 flex justify-end">
                <Button size="md" onClick={handleSaveAttendance}>
                  Simpan Kehadiran
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Notification */}
      <Notification
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        duration={3000}
      />

      {/* Confirmation Dialog - Start Session */}
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

      {/* Confirmation Dialog - Upload File */}
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

      {/* Confirmation Dialog - Save Attendance */}
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
