import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { getCurrentUser, formatDate, getDayName } from '../../utils/helpers';
import Footer from '../../components/common/Footer';

const GuruDashboard = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const today = new Date();

  // Redirect jika bukan guru
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'guru') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  return (
    <div className="bg-ink-900 min-h-screen text-white">
      <Sidebar role="guru" />
      
      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Guru Panel</p>
              <h1 className="text-4xl font-display">Dashboard Guru</h1>
              <p className="text-white/70">Selamat datang, {currentUser?.nama}</p>
            </div>
          </div>

          {/* Info Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Tanggal Hari Ini</h3>
                <p className="text-2xl font-bold">{getDayName(today)}</p>
                <p className="text-sm opacity-90 mt-1">{formatDate(today)}</p>
              </div>
              <div className="text-6xl opacity-80">📅</div>
            </div>
            </Card>

            <Card className="bg-emerald-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">NIP</h3>
                <p className="text-xl font-bold">{currentUser?.nip || '-'}</p>
              </div>
              <div className="text-6xl opacity-80">👨‍🏫</div>
            </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-panel p-6 text-white flex flex-col gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Jadwal Mengajar</p>
                <h3 className="text-2xl font-semibold">📅 Kelola Jadwal & Sesi</h3>
                <p className="text-white/70 text-sm">
                  Lihat jadwal mengajar, mulai sesi, upload materi pembelajaran, dan input kehadiran siswa.
                </p>
              </div>
              <Button onClick={() => navigate('/guru/Jadwal-mengajar')}>
                Buka Jadwal
              </Button>
            </Card>
            <Card className="glass-panel p-6 text-white flex flex-col gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Riwayat</p>
                <h3 className="text-2xl font-semibold">📋 Riwayat Absensi</h3>
                <p className="text-white/70 text-sm">
                  Lihat catatan kehadiran siswa, rekap absensi per kelas, dan data pembelajaran sebelumnya.
                </p>
              </div>
              <Button variant="secondary" onClick={() => navigate('/guru/riwayat')}>
                Lihat Riwayat
              </Button>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GuruDashboard;
