import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CameraCapture from '../../components/siswa/CameraCapture';
import LocationCapture from '../../components/siswa/LocationCapture';
import Button from '../../components/common/Button';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Notification from '../../components/common/Notification';
import Loading from '../../components/common/Loading';
import { getCurrentUser } from '../../utils/helpers';
import Footer from '../../components/common/Footer';

const AbsensiMandiri = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();
  const jadwalInfo = location.state?.jadwal;
  const tanggalInfo = location.state?.tanggal;
  const [photo, setPhoto] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [notification, setNotification] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  const [isMobileDevice, setIsMobileDevice] = useState(true);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'siswa') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Deteksi perangkat mobile
  useEffect(() => {
    const checkMobileDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      
      // Perangkat dianggap mobile jika memenuhi kriteria
      setIsMobileDevice(isMobile || (hasTouch && isSmallScreen));
    };

    checkMobileDevice();
    window.addEventListener('resize', checkMobileDevice);
    
    return () => window.removeEventListener('resize', checkMobileDevice);
  }, []);

  const handlePhotoCapture = (photoData) => {
    setPhoto(photoData);
  };

  const handleLocationCapture = (locationData) => {
    setLocationData(locationData);
  };

  const handleSubmit = () => {
    if (!isMobileDevice) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Perangkat Tidak Didukung',
        message: 'Absensi hanya dapat dilakukan menggunakan perangkat HP/smartphone. Laptop tidak memiliki GPS yang akurat.'
      });
      return;
    }

    if (!photo) {
      setNotification({
        isOpen: true,
        type: 'warning',
        title: 'Foto Belum Diambil',
        message: 'Silakan ambil foto terlebih dahulu'
      });
      return;
    }

    if (!locationData) {
      setNotification({
        isOpen: true,
        type: 'warning',
        title: 'Lokasi Belum Aktif',
        message: 'Silakan aktifkan lokasi terlebih dahulu'
      });
      return;
    }

    // Validasi lokasi harus dalam area sekolah
    if (!locationData.inArea) {
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Lokasi Tidak Valid',
        message: 'Anda berada di luar area sekolah. Absensi hanya dapat dilakukan dari dalam area SMAN 1 Nagreg.'
      });
      return;
    }

    setShowSubmitConfirm(true);
  };

  const handleConfirmSubmit = () => {
    setShowSubmitConfirm(false);
    setSubmitting(true);

    // Simulasi pengiriman data
    setTimeout(() => {
      setSubmitting(false);
      
      // Absensi berhasil karena sudah melewati validasi lokasi
      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Absensi Berhasil!',
        message: 'Kehadiran Anda telah tercatat. Terima kasih.'
      });

      // Navigate after notification duration
      setTimeout(() => {
        navigate('/siswa');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="bg-ink-900 min-h-screen text-white">
      <Sidebar role="siswa" />
      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Student Panel</p>
              <h1 className="text-4xl font-display">Absensi Mandiri</h1>
              <p className="text-white/70">Ambil foto selfie dan pastikan lokasi aktif sebelum mengirim.</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="text-white/70 hover:text-white text-sm"
            >
              ← Kembali
            </button>
          </div>

          {/* Warning untuk perangkat non-mobile */}
          {!isMobileDevice && (
            <Card padding="lg" className="bg-red-600/20 border border-red-500/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Perhatian! Gunakan Perangkat HP</h3>
                  <p className="text-white/90 mb-2">
                    Absensi mandiri memerlukan verifikasi lokasi yang akurat menggunakan GPS. 
                    Laptop/PC tidak memiliki GPS atau akurasi lokasi yang kurang memadai.
                  </p>
                  <p className="text-white font-semibold">
                    📱 Silakan gunakan HP/smartphone Anda untuk melakukan absensi.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Info Absensi - Only show if coming from DetailPelajaran */}
          {jadwalInfo && (
            <Card padding="lg" className="bg-blue-600/20 border border-blue-500/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📚</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">Absensi untuk Mata Pelajaran</h3>
                  <div className="space-y-1">
                    <p className="text-white/90 font-semibold">{jadwalInfo.mataPelajaran} - Kelas {jadwalInfo.kelas}</p>
                    {tanggalInfo && (
                      <p className="text-sm text-white/70">📅 {tanggalInfo}</p>
                    )}
                    <p className="text-sm text-white/70">🕐 {jadwalInfo.waktu}</p>
                    <p className="text-sm text-white/70">📍 {jadwalInfo.ruang}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

        {/* Camera Section */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">1. Ambil Foto Selfie</h2>
            <span className="text-sm text-white/60">Wajah harus terlihat jelas</span>
          </div>
          <CameraCapture onPhotoCapture={handlePhotoCapture} />
        </div>

        {/* Location Section */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">2. Verifikasi Lokasi</h2>
            <span className="text-sm text-white/60">Aktifkan GPS pada perangkat</span>
          </div>
          <LocationCapture onLocationCapture={handleLocationCapture} />
        </div>

        {/* Submit Button */}
        <div className="glass-panel p-6">
          <Button
            onClick={handleSubmit}
            variant="success"
            size="lg"
            fullWidth
            disabled={submitting || !photo || !locationData || !isMobileDevice}
          >
            {submitting ? 'Mengirim Absensi...' : 'Kirim Absensi'}
          </Button>
          
          {!isMobileDevice && (
            <p className="text-center text-sm text-red-400 mt-3 font-semibold">
              ⚠️ Absensi hanya dapat dilakukan melalui HP/smartphone
            </p>
          )}
          
          {isMobileDevice && (!photo || !locationData) && (
            <p className="text-center text-sm text-white/60 mt-3">
              Pastikan foto dan lokasi sudah tersedia sebelum mengirim
            </p>
          )}
        </div>
        </div>
      </main>

      <Footer />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showSubmitConfirm}
        type="success"
        title="Konfirmasi Absensi"
        message="Apakah Anda yakin ingin mengirim presensi? Pastikan foto dan lokasi sudah benar."
        confirmText="Ya, Kirim Absensi"
        cancelText="Batal"
        onConfirm={handleConfirmSubmit}
        onClose={() => setShowSubmitConfirm(false)}
      />

      {/* Notification */}
      <Notification
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        duration={3000}
        position="top-center"
      />

      {/* Loading */}
      {submitting && <Loading fullscreen text="Mengirim presensi..." />}
    </div>
  );
};

export default AbsensiMandiri;
