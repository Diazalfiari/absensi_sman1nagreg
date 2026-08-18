import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import { getCurrentUser } from '../../utils/helpers';
import Footer from '../../components/common/Footer';

const DetailPelajaran = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();
  const jadwal = location.state?.jadwal;
  const [showAbsensiConfirm, setShowAbsensiConfirm] = useState(false);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'siswa') {
      navigate('/login');
    }
    if (!jadwal) {
      navigate('/siswa/jadwal');
    }
  }, [currentUser, navigate, jadwal]);

  if (!jadwal) return null;

  const handleAbsensiClick = () => {
    setShowAbsensiConfirm(true);
  };

  const handleConfirmAbsensi = () => {
    setShowAbsensiConfirm(false);
    navigate('/siswa/presensi', { 
      state: { 
        jadwal,
        tanggal: location.state?.tanggal 
      } 
    });
  };

  // Mock data untuk detail pelajaran
  const detailPelajaran = {
    materi: [
      { id: 1, judul: 'Slide Presentasi', tipe: 'PDF', ukuran: '2.5 MB', link: '#' },
      { id: 2, judul: 'Modul Pembelajaran', tipe: 'PDF', ukuran: '1.8 MB', link: '#' },
      { id: 3, judul: 'Referensi Tambahan', tipe: 'Link', link: '#' },
    ],
    tugas: [
      { id: 1, judul: 'Tugas Kelompok', deadline: '15 Desember 2025', status: 'Belum Dikerjakan' },
      { id: 2, judul: 'Kuis Online', deadline: '12 Desember 2025', status: 'Tersedia' },
    ],
    video: [
      { id: 1, judul: 'Video Pembelajaran Part 1', durasi: '15:30', thumbnail: '🎥' },
      { id: 2, judul: 'Video Pembelajaran Part 2', durasi: '20:15', thumbnail: '🎥' },
    ]
  };

  return (
    <div className="bg-zinc-950 min-h-[100dvh] text-white selection:bg-primary-500/30">
      <Sidebar role="siswa" />
      
      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-display tracking-tight text-white">{jadwal.mataPelajaran}</h1>
              <p className="text-sm font-medium text-zinc-500">Detail Pelajaran</p>
            </div>
          </div>

          {/* Info Utama */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-medium text-white">{jadwal.mataPelajaran}</h2>
                  <p className="text-sm font-medium text-zinc-400 mt-1">Kelas {jadwal.kelas}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-medium ${
                  jadwal.status === 'Online' 
                    ? 'bg-zinc-950 text-blue-400 border border-blue-400/20' 
                    : 'bg-zinc-950 text-emerald-400 border border-emerald-400/20'
                }`}>
                  {jadwal.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-950 border border-white/5 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Hari & Tanggal</p>
                    <p className="text-sm font-medium text-white mt-0.5">{location.state?.tanggal || 'Senin, 1 Desember 2025'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-950 border border-white/5 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Waktu</p>
                    <p className="text-sm font-medium text-white mt-0.5">{jadwal.waktu}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-950 border border-white/5 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Ruangan</p>
                    <p className="text-sm font-medium text-white mt-0.5">{jadwal.ruang}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-950 border border-white/5 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Topik Sesi</p>
                    <p className="text-sm font-medium text-white mt-0.5">{jadwal.sesi}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Materi Pembelajaran */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-medium text-white">Materi Pembelajaran</h3>
            </div>
            <div className="space-y-3">
              {detailPelajaran.materi.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-950 border border-white/5 rounded-xl hover:border-white/10 transition-colors gap-4">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-900 border border-white/5 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{item.judul}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{item.tipe} {item.ukuran && `• ${item.ukuran}`}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary" className="w-full sm:w-auto shrink-0 text-xs">
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Tugas & Kuis */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-medium text-white">Tugas & Kuis</h3>
            </div>
            <div className="space-y-3">
              {detailPelajaran.tugas.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-950 border border-white/5 rounded-xl hover:border-white/10 transition-colors gap-4">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-900 border border-white/5 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{item.judul}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">Deadline: {item.deadline}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-medium border shrink-0 ${
                    item.status === 'Belum Dikerjakan' 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Video Interaktif */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-medium text-white">Video Interaktif</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {detailPelajaran.video.map((item) => (
                <div key={item.id} className="bg-zinc-950 border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors cursor-pointer">
                  <div className="aspect-video bg-zinc-900 flex items-center justify-center relative group">
                    <svg className="w-12 h-12 text-zinc-700 group-hover:text-primary-500 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="p-4 border-t border-white/5">
                    <p className="font-medium text-white text-sm">{item.judul}</p>
                    <p className="text-xs text-zinc-500 mt-1">Durasi: {item.durasi}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Button Absensi */}
          <div className="bg-primary-600 border border-primary-500 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium text-white">Absensi Kehadiran</h3>
                <p className="text-sm text-primary-100 mt-1">Lakukan presensi untuk mata pelajaran ini</p>
              </div>
              <Button
                onClick={handleAbsensiClick}
                className="bg-white hover:bg-zinc-100 text-primary-600 hover:text-primary-700 border-none px-6"
              >
                Absensi Sekarang
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showAbsensiConfirm}
        type="info"
        title="Konfirmasi Absensi"
        message="Apakah Anda siap untuk melakukan presensi? Pastikan foto selfie dan lokasi Anda sudah aktif."
        confirmText="Ya, Mulai Absensi"
        cancelText="Batal"
        onConfirm={handleConfirmAbsensi}
        onClose={() => setShowAbsensiConfirm(false)}
      />
    </div>
  );
};

export default DetailPelajaran;
