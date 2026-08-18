import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import { getCurrentUser, formatDate, getDayName, getTodayDate, calculatePercentage } from '../../utils/helpers';
import { statistikMapelHarianSiswa, riwayatAbsensiSiswa } from '../../data/mockData';
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
  const mapelHariIni = statistikMapelHarianSiswa[today] || [];
  
  const todayAbsensi = riwayatAbsensiSiswa.find((item) => item.tanggal === today);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'siswa') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  return (
    <div className="bg-zinc-950 min-h-[100dvh] text-white selection:bg-primary-500/30">
      <Sidebar role="siswa" />
      
      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6 space-y-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-display tracking-tight">Dashboard Siswa</h1>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5">
              <div>
                <p className="text-base sm:text-lg font-medium">{currentUser?.nama}</p>
                <p className="text-sm text-zinc-400 mt-1">NIS: {currentUser?.nis} • Kelas: {currentUser?.kelas}</p>
              </div>
              <p className="text-sm text-zinc-500">Pantau status kehadiran secara langsung.</p>
            </div>
          </div>

          {/* Date & Status Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <Card className="bg-primary-500/10 border-primary-500/20 text-white flex flex-col justify-center">
              <div>
                <p className="text-xs font-medium text-primary-400 mb-1">{getDayName(new Date())}</p>
                <h3 className="text-2xl font-semibold tracking-tight">{formatDate(new Date())}</h3>
              </div>
            </Card>

            <Card className={`${
              todayAbsensi 
                ? 'bg-emerald-500/10 border-emerald-500/20' 
                : 'bg-amber-500/10 border-amber-500/20'
            } text-white flex flex-col justify-center`}>
              <div>
                <p className={`text-xs font-medium mb-1 ${todayAbsensi ? 'text-emerald-400' : 'text-amber-400'}`}>
                  Status Kehadiran
                </p>
                <h3 className="text-2xl font-semibold tracking-tight">
                  {todayAbsensi ? 'Sudah Presensi' : 'Belum Presensi'}
                </h3>
                {todayAbsensi && (
                  <p className="text-sm text-zinc-300 mt-1">Waktu: {todayAbsensi.waktu}</p>
                )}
              </div>
            </Card>
          </div>

          {/* CTA Jadwal Pelajaran */}
          {!todayAbsensi && (
            <Card className="mb-8 bg-zinc-900 border border-white/10" padding="lg">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">Lihat Jadwal Pelajaran</h3>
                  <p className="text-sm text-zinc-400">Pastikan Anda tidak tertinggal materi dan segera lakukan presensi di kelas.</p>
                </div>
                <Button onClick={() => navigate('/siswa/jadwal')} variant="primary" size="md">
                  Lihat Jadwal
                </Button>
              </div>
            </Card>
          )}

          {/* Statistik Kehadiran per Pelajaran */}
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4 text-white">Statistik Kehadiran per Pelajaran</h2>
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-medium text-zinc-400 uppercase tracking-wider">
                <span>Pelajaran</span>
                <span>Persentase</span>
              </div>
              {mapelHariIni.length === 0 ? (
                <div className="text-sm text-zinc-500 py-2">Tidak ada jadwal pelajaran hari ini.</div>
              ) : (
                <div className="space-y-4">
                  {mapelHariIni.map((item) => {
                    const total = item.hadir + item.izin + item.sakit + item.alpa;
                    const percent = calculatePercentage(item.hadir, total);
                    return (
                      <div key={item.mapel}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-base font-medium text-white">{item.mapel}</p>
                            <p className="text-xs text-zinc-400 mt-0.5">Hadir {item.hadir} • Izin {item.izin} • Sakit {item.sakit} • Alpa {item.alpa}</p>
                          </div>
                          <span className="text-base font-semibold text-white">{percent}%</span>
                        </div>
                        <div className="w-full bg-zinc-950 border border-white/5 rounded-full h-2">
                          <div
                            className="h-full rounded-full bg-primary-500 transition-all"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Riwayat Absensi Terbaru */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <h2 className="text-xl font-medium text-white">Riwayat Absensi Terbaru</h2>
              <button
                onClick={() => navigate('/siswa/riwayat')}
                className="text-zinc-400 hover:text-white font-medium text-sm transition-colors"
              >
                Lihat Semua &rarr;
              </button>
            </div>

            <div className="space-y-2">
              {currentData.map((item) => (
                <div key={item.id} className="bg-zinc-900 border border-white/5 rounded-xl p-4 flex items-center justify-between transition-colors hover:border-white/10">
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
                      <p className="text-sm font-medium text-white">{formatDate(item.tanggal)}</p>
                      {item.waktu !== '-' && (
                        <p className="text-xs text-zinc-400 mt-0.5">Waktu: {item.waktu}</p>
                      )}
                    </div>
                  </div>
                  {item.verified && (
                    <span className="text-emerald-400/80 text-xs font-medium">
                      ✓ Terverifikasi
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
