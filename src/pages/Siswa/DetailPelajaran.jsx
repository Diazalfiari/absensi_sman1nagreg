import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import ConfirmDialog from '../../components/common/ConfirmDialog';
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
    <div className="bg-ink-900 min-h-screen text-white">
      <Sidebar role="siswa" />
      
      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-white hover:text-blue-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold">{jadwal.mataPelajaran}</h1>
              <p className="text-sm text-white/60">Detail Pelajaran</p>
            </div>
          </div>

          {/* Info Utama */}
          <Card padding="lg" className="bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{jadwal.mataPelajaran}</h2>
                  <p className="text-sm text-white/70 mt-1">Kelas {jadwal.kelas}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  jadwal.status === 'Online' 
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' 
                    : 'bg-green-500/20 text-green-300 border border-green-400/30'
                }`}>
                  {jadwal.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Hari & Tanggal</p>
                    <p className="font-semibold text-white">{location.state?.tanggal || 'Senin, 1 Desember 2025'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Waktu</p>
                    <p className="font-semibold text-white">{jadwal.waktu}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Ruangan</p>
                    <p className="font-semibold text-white">{jadwal.ruang}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Topik Sesi</p>
                    <p className="font-semibold text-white">{jadwal.sesi}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Materi Pembelajaran */}
          <Card padding="lg" className="bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Materi Pembelajaran</h3>
            </div>
            <div className="space-y-3">
              {detailPelajaran.materi.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📄</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{item.judul}</p>
                      <p className="text-xs text-white/60">{item.tipe} {item.ukuran && `• ${item.ukuran}`}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Tugas & Kuis */}
          <Card padding="lg" className="bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Tugas & Kuis</h3>
            </div>
            <div className="space-y-3">
              {detailPelajaran.tugas.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📝</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{item.judul}</p>
                      <p className="text-xs text-white/60">Deadline: {item.deadline}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    item.status === 'Belum Dikerjakan' 
                      ? 'bg-red-500/20 text-red-300 border-red-400/30' 
                      : 'bg-green-500/20 text-green-300 border-green-400/30'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Video Interaktif */}
          <Card padding="lg" className="bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Video Interaktif</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {detailPelajaran.video.map((item) => (
                <div key={item.id} className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all cursor-pointer border border-white/10">
                  <div className="aspect-video bg-blue-500/20 flex items-center justify-center">
                    <span className="text-6xl">{item.thumbnail}</span>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-white">{item.judul}</p>
                    <p className="text-xs text-white/60 mt-1">Durasi: {item.durasi}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Button Absensi */}
          <Card padding="lg" className="bg-emerald-600">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Absensi Kehadiran</h3>
                <p className="text-xs sm:text-sm text-white/80 mt-1">Lakukan presensi untuk mata pelajaran ini</p>
              </div>
              <button 
                onClick={handleAbsensiClick}
                className="px-4 sm:px-8 py-3 sm:py-4 bg-white hover:bg-gray-100 text-emerald-600 rounded-lg font-bold text-sm sm:text-lg transition-colors shadow-lg whitespace-nowrap"
              >
                Absensi Sekarang
              </button>
            </div>
          </Card>
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
