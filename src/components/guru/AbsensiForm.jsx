import React, { useState } from 'react';
import { dataKelas, dataMapel, dataSiswa } from '../../data/mockData';
import Button from '../common/Button';

const AbsensiForm = ({ onSubmit }) => {
  const [selectedKelas, setSelectedKelas] = useState('');
  const [selectedMapel, setSelectedMapel] = useState('');
  const [absensiData, setAbsensiData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split('T')[0]
  );

  const handleKelasChange = (e) => {
    const kelas = e.target.value;
    setSelectedKelas(kelas);
    setSelectedMapel('');
    
    // Initialize absensi data for selected class
    if (kelas && dataSiswa[kelas]) {
      const initialData = dataSiswa[kelas].map((siswa) => ({
        ...siswa,
        status: 'Hadir', // Default status
      }));
      setAbsensiData(initialData);
    } else {
      setAbsensiData([]);
    }
  };

  const handleMapelChange = (e) => {
    setSelectedMapel(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleStatusChange = (siswaId, status) => {
    setAbsensiData(
      absensiData.map((siswa) =>
        siswa.id === siswaId ? { ...siswa, status } : siswa
      )
    );
  };

  const handleSubmit = () => {
    if (!selectedKelas || !selectedMapel || !selectedDate) {
      alert('Silakan pilih kelas, mata pelajaran, dan tanggal terlebih dahulu');
      return;
    }

    // Check if all students have status
    const allHaveStatus = absensiData.every((siswa) => siswa.status);
    if (!allHaveStatus) {
      alert('Pastikan semua siswa sudah dipilih status kehadirannya');
      return;
    }

    const submitData = {
      kelas: selectedKelas,
      mapel: selectedMapel,
      tanggal: selectedDate,
      data: absensiData,
    };

    if (onSubmit) {
      onSubmit(submitData);
    }

    alert('Data absensi berhasil disimpan!');
    
    // Reset form
    setSelectedKelas('');
    setSelectedMapel('');
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setAbsensiData([]);
  };

  return (
    <div className="space-y-6">
      {/* Kelas, Mapel & Tanggal Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-white/70 font-medium mb-2">Kelas</label>
          <select
            value={selectedKelas}
            onChange={handleKelasChange}
            className="dark-select w-full px-4 py-3 rounded-2xl border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            <option value="">Pilih Kelas</option>
            {dataKelas.map((kelas) => (
              <option key={kelas.id} value={kelas.nama}>
                {kelas.nama}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white/70 font-medium mb-2">Mata Pelajaran</label>
          <select
            value={selectedMapel}
            onChange={handleMapelChange}
            disabled={!selectedKelas}
            className="dark-select w-full px-4 py-3 rounded-2xl border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:opacity-40"
          >
            <option value="">Pilih Mata Pelajaran</option>
            {dataMapel.map((mapel) => (
              <option key={mapel.id} value={mapel.nama}>
                {mapel.nama}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white/70 font-medium mb-2">Tanggal Absensi</label>
          <input
            type="date"
            value={selectedDate}
            max={new Date().toISOString().split('T')[0]}
            onChange={handleDateChange}
            className="dark-select w-full px-4 py-3 rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
      </div>

      {/* Student Table */}
      {selectedKelas && absensiData.length > 0 && (
        <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/5 backdrop-blur-xl">
          <div className="px-6 py-4 bg-gradient-to-r from-primary-600 to-accent-500">
            <h3 className="text-lg font-semibold text-white">
              Daftar Siswa Kelas {selectedKelas}
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.3em] text-white/60">No</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.3em] text-white/60">NIS</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Nama Siswa</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Status Kehadiran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {absensiData.map((siswa, index) => (
                  <tr key={siswa.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 text-sm text-white/80">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-white/80">{siswa.nis}</td>
                    <td className="px-6 py-4 text-sm font-medium">{siswa.nama}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center flex-wrap gap-3">
                        {['Hadir', 'Izin', 'Sakit', 'Alfa'].map((status) => (
                          <label key={status} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`status-${siswa.id}`}
                              value={status}
                              checked={siswa.status === status}
                              onChange={(e) => handleStatusChange(siswa.id, e.target.value)}
                              className="w-4 h-4 text-primary-400 focus:ring-primary-400"
                            />
                            <span className={`text-sm font-medium ${
                              status === 'Hadir' ? 'text-emerald-300' :
                              status === 'Izin' ? 'text-accent-200' :
                              status === 'Sakit' ? 'text-amber-200' :
                              'text-rose-200'
                            }`}>
                              {status}
                            </span>
                          </label>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-white/5 border-t border-white/10">
            <Button
              onClick={handleSubmit}
              variant="primary"
              size="lg"
              fullWidth
            >
              Simpan Absensi
            </Button>
          </div>
        </div>
      )}

      {!selectedKelas && (
        <div className="bg-accent-500/10 border border-accent-500/30 rounded-2xl p-6 text-center text-accent-100">
          <p>Silakan pilih kelas dan mata pelajaran untuk memulai input absensi</p>
        </div>
      )}
    </div>
  );
};

export default AbsensiForm;
