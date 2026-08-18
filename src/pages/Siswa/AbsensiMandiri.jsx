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
    <div className="bg-zinc-950 min-h-[100dvh] text-white selection:bg-primary-500/30">
      <Sidebar role="siswa" />
      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-display tracking-tight text-white">Absensi Mandiri</h1>
              <p className="text-zinc-400 mt-1">Ambil foto selfie dan pastikan lokasi aktif sebelum mengirim.</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="text-zinc-400 hover:text-white text-sm transition-colors"
            >
              ← Kembali
            </button>
          </div>

          {/* Warning untuk perangkat non-mobile */}
          {!isMobileDevice && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-rose-300 mb-2">Perhatian! Gunakan Perangkat HP</h3>
                  <p className="text-zinc-300 text-sm mb-2">
                    Absensi mandiri memerlukan verifikasi lokasi yang akurat menggunakan GPS. 
                    Laptop/PC tidak memiliki GPS atau akurasi lokasi yang kurang memadai.
                  </p>
                  <p className="text-zinc-300 text-sm font-medium">
                    Silakan gunakan HP/smartphone Anda untuk melakukan absensi.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info Absensi - Only show if coming from DetailPelajaran */}
          {jadwalInfo && (
            <div className="bg-primary-500/10 border border-primary-500/20 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-medium text-white mb-2">Absensi untuk Mata Pelajaran</h3>
                  <div className="space-y-1.5">
                    <p className="text-white text-sm font-medium">{jadwalInfo.mataPelajaran} - Kelas {jadwalInfo.kelas}</p>
                    {tanggalInfo && (
                      <p className="text-sm text-zinc-400">Tanggal: {tanggalInfo}</p>
                    )}
                    <p className="text-sm text-zinc-400">Waktu: {jadwalInfo.waktu}</p>
                    <p className="text-sm text-zinc-400">Ruang: {jadwalInfo.ruang}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Camera Section */}
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-white">1. Ambil Foto Selfie</h2>
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Wajah harus terlihat jelas</span>
              </div>
              <CameraCapture onPhotoCapture={handlePhotoCapture} />
            </div>

            {/* Location Section */}
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-white">2. Verifikasi Lokasi</h2>
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Aktifkan GPS pada perangkat</span>
              </div>
              <LocationCapture onLocationCapture={handleLocationCapture} />
            </div>

            {/* Submit Button */}
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
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
                <p className="text-center text-sm text-rose-400 mt-4 font-medium">
                  Absensi hanya dapat dilakukan melalui HP/smartphone
                </p>
              )}
              
              {isMobileDevice && (!photo || !locationData) && (
                <p className="text-center text-sm text-zinc-500 mt-4">
                  Pastikan foto dan lokasi sudah tersedia sebelum mengirim
                </p>
              )}
            </div>
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
