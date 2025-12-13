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
  
  // Check if already absened today (simulasi)
  const todayAbsensi = riwayatAbsensiSiswa.find((item) => item.tanggal === today);

  // Redirect jika bukan siswa
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'siswa') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  return (
    <div className="bg-ink-900 min-h-screen text-white">
      <Sidebar role="siswa" />
      
      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6 space-y-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Student Panel</p>
              <h1 className="text-3xl sm:text-4xl font-display">Dashboard Siswa</h1>
            </div>
            <div className="glass-panel flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4">
              <div>
                <p className="text-base sm:text-lg font-semibold">{currentUser?.nama}</p>
                <p className="text-xs sm:text-sm text-white/70">NIS: {currentUser?.nis} • Kelas: {currentUser?.kelas}</p>
              </div>
              <p className="text-xs sm:text-sm text-white/60">Pantau status kehadiran kapan pun.</p>
            </div>
          </div>

          {/* Date & Status Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <Card className="bg-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-semibold mb-1">{getDayName(new Date())}</h3>
                <p className="text-lg sm:text-xl font-bold">{formatDate(new Date())}</p>
              </div>
              <div className="text-4xl sm:text-5xl opacity-80">📅</div>
            </div>
            </Card>

            <Card className={`${
              todayAbsensi 
                ? 'bg-emerald-600' 
                : 'bg-amber-500'
            } text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-semibold mb-1">Status Absensi Hari Ini</h3>
                <p className="text-lg sm:text-xl font-bold">
                  {todayAbsensi ? '✅ Sudah Absen' : '⏳ Belum Absen'}
                </p>
                {todayAbsensi && (
                  <p className="text-xs sm:text-sm opacity-90 mt-1">Waktu: {todayAbsensi.waktu}</p>
                )}
              </div>
              <div className="text-4xl sm:text-5xl opacity-80">
                {todayAbsensi ? '✅' : '📱'}
              </div>
            </div>
            </Card>
          </div>

          {/* CTA Jadwal Pelajaran */}
          {!todayAbsensi && (
            <Card className="mb-5 bg-blue-500/20 border border-blue-500/30">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                    <span className="text-2xl sm:text-3xl">📚</span>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold">Lihat Jadwal Pelajaran</h3>
                    <p className="text-xs sm:text-sm text-white/70">Cek jadwal pelajaran terbaru Anda</p>
                  </div>
                </div>
                <Button onClick={() => navigate('/siswa/jadwal')} variant="primary" size="md">
                  Lihat Jadwal →
                </Button>
              </div>
            </Card>
          )}

          {/* Statistik Kehadiran per Pelajaran (Hari Ini) */}
          <div className="mb-5">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">Statistik Kehadiran per Pelajaran (Hari Ini)</h2>
            <div className="bg-blue-600/15 border border-blue-500/30 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm text-white/70">
                <span>Pelajaran</span>
                <span>Hadir / Total</span>
              </div>
              {mapelHariIni.length === 0 ? (
                <div className="text-xs sm:text-sm text-white/60 py-2">Tidak ada jadwal atau absensi pelajaran hari ini.</div>
              ) : (
                <div className="space-y-3">
                  {mapelHariIni.map((item) => {
                    const total = item.hadir + item.izin + item.sakit + item.alfa;
                    const percent = calculatePercentage(item.hadir, total);
                    return (
                      <div key={item.mapel} className="glass-panel bg-white/5 border-white/10 p-3 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm sm:text-base font-semibold">{item.mapel}</p>
                            <p className="text-xs text-white/60">Hadir {item.hadir} • Izin {item.izin} • Sakit {item.sakit} • Alfa {item.alfa}</p>
                          </div>
                          <span className="text-sm sm:text-base font-bold">{percent}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-emerald-400"
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <h2 className="text-xl sm:text-2xl font-bold">Riwayat Absensi Terbaru</h2>
              <button
                onClick={() => navigate('/siswa/riwayat')}
                className="text-white/70 hover:text-white font-semibold text-xs sm:text-sm"
              >
                Lihat Semua →
              </button>
            </div>

            <div className="space-y-2">
              {currentData.map((item) => (
                <Card key={item.id} className="hover:shadow-glow transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border ${
                        item.status === 'Hadir' 
                          ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-100' 
                          : item.status === 'Izin'
                          ? 'bg-accent-500/20 border-accent-400/40 text-accent-100'
                          : item.status === 'Sakit'
                          ? 'bg-amber-500/20 border-amber-400/30 text-amber-100'
                          : 'bg-rose-500/20 border-rose-400/30 text-rose-100'
                      }`}>
                        <span className="text-lg sm:text-xl">
                          {item.status === 'Hadir' ? '✅' : 
                           item.status === 'Izin' ? '📝' : 
                           item.status === 'Sakit' ? '🤒' : '❌'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-semibold">{formatDate(item.tanggal)}</p>
                        <p className="text-xs sm:text-sm text-white/70">
                          {item.status} {item.waktu !== '-' && `• ${item.waktu}`}
                        </p>
                      </div>
                    </div>
                    {item.verified && (
                      <span className="text-emerald-300 text-xs sm:text-sm font-medium">
                        ✓ Terverifikasi
                      </span>
                    )}
                  </div>
                </Card>
              ))}
              <Pagination
                currentPage={recentPage}
                totalPages={totalPages}
                onPageChange={setRecentPage}
                itemsPerPage={itemsPerPage}
                totalItems={riwayatAbsensiSiswa.length}
                showInfo
                className="pt-2"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SiswaDashboard;
