/**
 * src/utils/attendanceReport.js
 * Logic untuk generate mock data presensi berdasarkan jadwal.
 */
import { dataSiswa, mockJadwal } from '../data/mockData';
import { getDaysInMonth, getDayName } from './reportHelpers';

export const generatePresensiData = (bulan, tahun, kelas, mataPelajaran) => {
  const siswaList = dataSiswa[kelas] || [];
  const daysInMonth = getDaysInMonth(bulan, tahun);
  
  // Helper functions
  const generateRandomStatus = () => {
    const rand = Math.random();
    if (rand < 0.85) return 'H';
    if (rand < 0.92) return 'S';
    if (rand < 0.97) return 'I';
    return 'A';
  };

  const getPriority = (status) => {
    if (status === 'A') return 4;
    if (status === 'S') return 3;
    if (status === 'I') return 2;
    if (status === 'H') return 1;
    return 0; // Untuk '-'
  };
  
  return siswaList.map(siswa => {
    const presensiPerHari = {};
    const jenisKelamin = Math.random() > 0.5 ? 'Laki-laki' : 'Perempuan';
    
    let hadirCount = 0;
    let sakitCount = 0;
    let izinCount = 0;
    let alpaCount = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dayName = getDayName(day, bulan, tahun);
      
      // Skip Minggu dan Sabtu
      if (dayName === 'Minggu' || dayName === 'Sabtu') {
        presensiPerHari[day] = { status: '-' };
        continue;
      }

      // Ambil jadwal hari ini (default array kosong jika jadwal tidak didefinisikan)
      const scheduledSubjects = mockJadwal[dayName] || [];

      if (mataPelajaran === 'Hasil Akhir') {
        if (scheduledSubjects.length === 0) {
          presensiPerHari[day] = { status: '-' };
        } else {
          let finalStatus = 'H';
          let maxPriority = 0;
          
          for (let i = 0; i < scheduledSubjects.length; i++) {
            const status = generateRandomStatus();
            const p = getPriority(status);
            if (p > maxPriority) {
              maxPriority = p;
              finalStatus = status;
            }
          }
          
          presensiPerHari[day] = { status: finalStatus };
          
          // Rekap hanya jika hari ini ada jadwal (dan status sudah ter-set)
          if (finalStatus === 'H') hadirCount++;
          else if (finalStatus === 'S') sakitCount++;
          else if (finalStatus === 'I') izinCount++;
          else if (finalStatus === 'A') alpaCount++;
        }
      } else {
        // Untuk mata pelajaran spesifik
        if (scheduledSubjects.includes(mataPelajaran)) {
          const status = generateRandomStatus();
          presensiPerHari[day] = { status };
          
          if (status === 'H') hadirCount++;
          else if (status === 'S') sakitCount++;
          else if (status === 'I') izinCount++;
          else if (status === 'A') alpaCount++;
        } else {
          // Tidak ada jadwal mata pelajaran ini di hari ini
          presensiPerHari[day] = { status: '-' };
        }
      }
    }

    const totalHari = hadirCount + sakitCount + izinCount + alpaCount;
    const persentase = totalHari > 0 ? Math.round((hadirCount / totalHari) * 100) : 0;

    return {
      ...siswa,
      jenisKelamin,
      presensiPerHari,
      hadir: hadirCount,
      sakit: sakitCount,
      izin: izinCount,
      alpa: alpaCount,
      persentase
    };
  });
};
