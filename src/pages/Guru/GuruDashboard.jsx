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

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'guru') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  return (
    <div className="bg-zinc-950 min-h-[100dvh] text-white selection:bg-primary-500/30">
      <Sidebar role="guru" />
      
      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl font-display tracking-tight">Dashboard Guru</h1>
            <p className="text-zinc-400 mt-1">Selamat datang, {currentUser?.nama}</p>
          </div>

          {/* Info Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="bg-primary-500/10 border-primary-500/20 text-white">
              <div className="flex flex-col">
                <p className="text-xs font-medium text-primary-400 mb-1">Tanggal Hari Ini</p>
                <h3 className="text-2xl font-semibold tracking-tight">{getDayName(today)}</h3>
                <p className="text-sm text-zinc-300 mt-1">{formatDate(today)}</p>
              </div>
            </Card>

            <Card className="bg-emerald-500/10 border-emerald-500/20 text-white">
              <div className="flex flex-col">
                <p className="text-xs font-medium text-emerald-400 mb-1">Nomor Induk Pegawai (NIP)</p>
                <h3 className="text-2xl font-semibold tracking-tight">{currentUser?.nip || '-'}</h3>
                <p className="text-sm text-zinc-300 mt-1">Identitas Aktif</p>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card padding="lg" className="flex flex-col gap-5 justify-between">
              <div>
                <h3 className="text-xl font-medium text-white mb-2">Kelola Jadwal & Sesi</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Lihat jadwal mengajar, mulai sesi, upload materi pembelajaran, dan input kehadiran siswa harian.
                </p>
              </div>
              <Button onClick={() => navigate('/guru/Jadwal-mengajar')} size="md" className="self-start">
                Buka Jadwal
              </Button>
            </Card>
            
            <Card padding="lg" className="flex flex-col gap-5 justify-between">
              <div>
                <h3 className="text-xl font-medium text-white mb-2">Riwayat Absensi</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Lihat catatan kehadiran siswa, rekap presensi per kelas, dan data pembelajaran dari sesi sebelumnya.
                </p>
              </div>
              <Button variant="secondary" onClick={() => navigate('/guru/riwayat')} size="md" className="self-start">
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
