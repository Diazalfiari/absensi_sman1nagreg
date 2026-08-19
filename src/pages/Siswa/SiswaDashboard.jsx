import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import { getCurrentUser, formatDate, getDayName, getTodayDate } from '../../utils/helpers';
import { riwayatAbsensiSiswa, jadwalPelajaranSiswa } from '../../data/mockData';
import Footer from '../../components/common/Footer';

const SiswaDashboard = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const today = getTodayDate();
  const [recentPage, setRecentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(riwayatAbsensiSiswa.length / itemsPerPage);
  const startIndex = (recentPage - 1) * itemsPerPage;
  const currentData = riwayatAbsensiSiswa.slice(startIndex, startIndex + itemsPerPage);
  const todayAbsensi = riwayatAbsensiSiswa.find((item) => item.tanggal === today);
  const todaysSubjects = jadwalPelajaranSiswa[today] || [];

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'siswa') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  return (
    <div className="bg-zinc-950 min-h-[100dvh] text-zinc-50 selection:bg-primary-500/30">
      <Sidebar role="siswa" />
      
      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6 space-y-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-display tracking-tight">Dashboard Siswa</h1>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5">
              <div>
                <p className="text-base sm:text-lg font-medium">{currentUser?.nama}</p>
                <p className="text-sm text-zinc-400 mt-1">NIS: {currentUser?.nis} • Kelas: {currentUser?.kelas}</p>
              </div>
              <p className="text-sm text-zinc-500">Pantau status kehadiran secara langsung.</p>
            </div>
          </div>

          {/* Date & Status Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <Card className="bg-primary-500/10 border-primary-500/20 text-zinc-50 flex flex-col justify-center">
              <div>
                <p className="text-xs font-medium text-primary-400 mb-1">{getDayName(new Date())}</p>
                <h3 className="text-2xl font-semibold tracking-tight">{formatDate(new Date())}</h3>
              </div>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 text-zinc-50 flex flex-col justify-center p-5">
              <div>
                <p className="text-xs font-medium mb-4 text-zinc-400">
                  Status Kehadiran Hari Ini
                </p>
                {todaysSubjects.length > 0 ? (
                  <div className="space-y-3">
                    {todaysSubjects.map((subject, index) => (
                      <div key={index} className="flex items-center justify-between pb-3 border-b border-zinc-800/50 last:border-0 last:pb-0">
                        <div>
                          <span className="text-sm font-medium text-zinc-200 block">{subject.mataPelajaran}</span>
                          <span className="text-xs text-zinc-500">{subject.waktu}</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                          todayAbsensi 
                            ? todayAbsensi.status === 'Hadir' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : todayAbsensi.status === 'Sakit' 
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                              : todayAbsensi.status === 'Izin'
                              ? 'bg-accent-500/10 text-accent-400 border-accent-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}>
                          {todayAbsensi ? todayAbsensi.status : 'Belum Presensi'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-zinc-300">
                      Tidak ada jadwal hari ini
                    </h3>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* CTA Jadwal Pelajaran */}
          {!todayAbsensi && (
            <Card className="mb-8 bg-zinc-900 border border-zinc-800" padding="lg">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium text-zinc-50 mb-1">Lihat Jadwal Pelajaran</h3>
                  <p className="text-sm text-zinc-400">Pastikan Anda tidak tertinggal materi dan hadir di kelas tepat waktu.</p>
                </div>
                <Button onClick={() => navigate('/siswa/jadwal')} variant="primary" size="md">
                  Lihat Jadwal
                </Button>
              </div>
            </Card>
          )}



          {/* Riwayat Absensi Terbaru */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <h2 className="text-xl font-medium text-zinc-50">Riwayat Absensi Terbaru</h2>
              <button
                onClick={() => navigate('/siswa/riwayat')}
                className="text-zinc-400 hover:text-zinc-50 font-medium text-sm transition-colors"
              >
                Lihat Semua &rarr;
              </button>
            </div>

            <div className="space-y-2">
              {currentData.map((item) => (
                <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between transition-colors hover:border-zinc-800">
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                      item.status === 'Hadir' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : item.status === 'Izin'
                        ? 'bg-accent-500/10 border-accent-500/20 text-accent-400'
                        : item.status === 'Sakit'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}>
                      {item.status}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-50">{formatDate(item.tanggal)}</p>

                    </div>
                  </div>
                  {item.mapel ? (
                    <span className="text-zinc-400 text-xs font-medium px-2 py-1 bg-zinc-800 rounded-md border border-zinc-700">
                      {item.mapel}
                    </span>
                  ) : (
                    <span className="text-zinc-400 text-xs font-medium px-2 py-1 bg-zinc-800 rounded-md border border-zinc-700">
                      Matematika
                    </span>
                  )}
                </div>
              ))}
              <div className="pt-4">
                <Pagination
                  currentPage={recentPage}
                  totalPages={totalPages}
                  onPageChange={setRecentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={riwayatAbsensiSiswa.length}
                  showInfo
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SiswaDashboard;
