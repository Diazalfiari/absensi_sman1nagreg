import React, { useState, useEffect, useCallback } from 'react';
import { lokasiSekolah } from '../../data/mockData';
import { isInSchoolArea } from '../../utils/helpers';

const LocationCapture = ({ onLocationCapture }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inArea, setInArea] = useState(false);

  const getLocation = useCallback(() => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation tidak didukung oleh browser Anda');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        const locationData = {
          lat: latitude,
          lng: longitude,
          accuracy: Math.round(accuracy),
        };

        const checkInArea = isInSchoolArea(
          latitude,
          longitude,
          lokasiSekolah.lat,
          lokasiSekolah.lng,
          lokasiSekolah.radius
        );

        console.log('Dalam Area?:', checkInArea);
        console.log('===================');

        setLocation(locationData);
        setInArea(checkInArea);
        setLoading(false);

        if (onLocationCapture) {
          onLocationCapture({ ...locationData, inArea: checkInArea });
        }
      },
      (err) => {
        setLoading(false);
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Izin akses lokasi ditolak. Silakan aktifkan izin lokasi di browser Anda.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Informasi lokasi tidak tersedia. Pastikan GPS aktif.');
            break;
          case err.TIMEOUT:
            setError('Permintaan lokasi timeout. Silakan coba lagi.');
            break;
          default:
            setError('Terjadi kesalahan saat mengambil lokasi.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [onLocationCapture]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return (
    <div className="glass-panel p-6">
      <h3 className="text-lg font-semibold mb-4">Informasi Lokasi</h3>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/40 text-rose-200 px-4 py-3 rounded-xl mb-4">
          <p className="text-sm">{error}</p>
          <button
            onClick={getLocation}
            className="mt-2 text-sm font-semibold underline hover:no-underline"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-3 text-accent-200 mb-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent-200"></div>
          <p className="text-sm">Mengambil lokasi...</p>
        </div>
      )}

      {location && !loading && (
        <div className="space-y-3">
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            inArea ? 'bg-emerald-500/20 text-emerald-100' : 'bg-amber-500/20 text-amber-100'
          }`}>
            <span className="text-2xl">{inArea ? '✅' : '⚠️'}</span>
            <div>
              <p className="font-semibold">
                {inArea ? 'Lokasi dalam area sekolah' : 'Lokasi di luar area sekolah'}
              </p>
              <p className="text-xs mt-1">
                {inArea 
                  ? 'Anda berada di area SMAN 1 Nagreg' 
                  : 'Anda tidak berada di area sekolah'
                }
              </p>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 space-y-2 border border-white/10">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Latitude:</span>
              <span className="font-mono font-semibold">
                {location.lat.toFixed(6)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Longitude:</span>
              <span className="font-mono font-semibold">
                {location.lng.toFixed(6)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Akurasi:</span>
              <span className="font-semibold">
                ±{location.accuracy} meter
              </span>
            </div>
          </div>

          <button
            onClick={getLocation}
            className="w-full px-4 py-2 text-sm text-white hover:bg-white/10 rounded-xl transition-colors border border-white/20"
          >
            🔄 Perbarui Lokasi
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationCapture;
