import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
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

  return (
    <div className="bg-zinc-950 min-h-[100dvh] text-zinc-50 selection:bg-primary-500/30">
      <Sidebar role="siswa" />
      
      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-zinc-400 hover:text-zinc-50 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-display tracking-tight text-zinc-50">{jadwal.mataPelajaran}</h1>
              <p className="text-sm font-medium text-zinc-500">Detail Pelajaran</p>
            </div>
          </div>

          {/* Info Utama */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-medium text-zinc-50">{jadwal.mataPelajaran}</h2>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Hari & Tanggal</p>
                    <p className="text-sm font-medium text-zinc-50 mt-0.5">{location.state?.tanggal || 'Senin, 1 Desember 2025'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Waktu</p>
                    <p className="text-sm font-medium text-zinc-50 mt-0.5">{jadwal.waktu}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Ruangan</p>
                    <p className="text-sm font-medium text-zinc-50 mt-0.5">{jadwal.ruang}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Topik Sesi</p>
                    <p className="text-sm font-medium text-zinc-50 mt-0.5">{jadwal.sesi}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Materi Pembelajaran */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-medium text-zinc-50">Materi Pembelajaran</h3>
            </div>
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
              <p className="text-sm text-zinc-300 leading-relaxed">
                {detailPelajaran.materi}
              </p>
            </div>
          </div>

          {/* Tugas & Kuis */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-medium text-zinc-50">Tugas & Kuis</h3>
            </div>
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
              <p className="text-sm text-zinc-300 leading-relaxed">
                {detailPelajaran.tugas}
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DetailPelajaran;
