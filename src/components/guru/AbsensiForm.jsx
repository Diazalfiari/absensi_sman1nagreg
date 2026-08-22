import React, { useState } from 'react';
import { dataKelas, dataMapel, dataSiswa } from '../../data/mockData';
import Button from '../common/Button';

const STATUS_CONFIG = [
  {
    key: 'Hadir',
    label: 'Hadir',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.74-5.25Z" clipRule="evenodd" />
      </svg>
    ),
    activeClass: 'bg-[#eafaf1] text-emerald-800 border-emerald-400 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-600 shadow-sm',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    key: 'Sakit',
    label: 'Sakit',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v1.5H4.5A2.25 2.25 0 0 0 2.25 9v9.75A2.25 2.25 0 0 0 4.5 21h15a2.25 2.25 0 0 0 2.25-2.25V9A2.25 2.25 0 0 0 19.5 6.75H18v-1.5A1.5 1.5 0 0 0 16.5 3.75h-9Zm1.5 3V5.25h6v1.5h-6Zm3 4.5a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5H9.75a.75.75 0 0 1 0-1.5h1.5V12a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
      </svg>
    ),
    activeClass: 'bg-[#fef9e7] text-amber-800 border-amber-400 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-600 shadow-sm',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    key: 'Izin',
    label: 'Izin',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
      </svg>
    ),
    activeClass: 'bg-[#eff4ff] text-blue-800 border-blue-400 dark:bg-blue-950/50 dark:text-[#aebcff] dark:border-blue-600 shadow-sm',
    iconColor: 'text-blue-600 dark:text-[#9eafff]',
  },
  {
    key: 'Alpa',
    label: 'Alpa',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
      </svg>
    ),
    activeClass: 'bg-[#fef2f2] text-rose-800 border-rose-400 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-600 shadow-sm',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
];

const AbsensiForm = ({ onSubmit }) => {
  const [selectedKelas, setSelectedKelas] = useState('');
  const [selectedMapel, setSelectedMapel] = useState('');
  const [presensiData, setAbsensiData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split('T')[0]
  );

  const handleKelasChange = (e) => {
    const kelas = e.target.value;
    setSelectedKelas(kelas);
    setSelectedMapel('');
    
    // Inisialisasi data presensi untuk kelas terpilih
    if (kelas && dataSiswa[kelas]) {
      const initialData = dataSiswa[kelas].map((siswa) => ({
        ...siswa,
        status: 'Hadir', // Status default
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
    setAbsensiData((prevData) =>
      prevData.map((siswa) =>
        siswa.id === siswaId ? { ...siswa, status } : siswa
      )
    );
  };

  const handleSetAllStatus = (status) => {
    setAbsensiData((prevData) =>
      prevData.map((siswa) => ({ ...siswa, status }))
    );
  };

  const handleSubmit = () => {
    if (!selectedKelas || !selectedMapel || !selectedDate) {
      alert('Silakan pilih kelas, mata pelajaran, dan tanggal terlebih dahulu');
      return;
    }

    // Periksa apakah semua siswa sudah memiliki status
    const allHaveStatus = presensiData.every((siswa) => siswa.status);
    if (!allHaveStatus) {
      alert('Pastikan semua siswa sudah dipilih status kehadirannya');
      return;
    }

    const submitData = {
      kelas: selectedKelas,
      mapel: selectedMapel,
      tanggal: selectedDate,
      data: presensiData,
    };

    if (onSubmit) {
      onSubmit(submitData);
    }

    alert('Data presensi berhasil disimpan!');
    
    // Reset form
    setSelectedKelas('');
    setSelectedMapel('');
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setAbsensiData([]);
  };

  return (
    <div className="space-y-6">
      {/* Form Pemilihan Kelas, Mapel & Tanggal */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block font-medium text-zinc-300">Kelas</label>
          <select
            value={selectedKelas}
            onChange={handleKelasChange}
            className="dark-select w-full rounded-2xl border border-zinc-700 px-4 py-3 text-zinc-50 focus:outline-none focus:ring-2 focus:ring-primary-400"
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
          <label className="mb-2 block font-medium text-zinc-300">Mata Pelajaran</label>
          <select
            value={selectedMapel}
            onChange={handleMapelChange}
            disabled={!selectedKelas}
            className="dark-select w-full rounded-2xl border border-zinc-700 px-4 py-3 text-zinc-50 focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:opacity-40"
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
          <label className="mb-2 block font-medium text-zinc-300">Tanggal Absensi</label>
          <input
            type="date"
            value={selectedDate}
            max={new Date().toISOString().split('T')[0]}
            onChange={handleDateChange}
            className="dark-select w-full rounded-2xl border border-zinc-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
      </div>

      {/* Konten Daftar Siswa */}
      {selectedKelas && presensiData.length > 0 && (
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-xl backdrop-blur-xl">
          {/* Header Panel */}
          <div className="flex flex-col gap-3 border-b border-zinc-800 bg-[#172654] px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Ruang Presensi</p>
              <h3 className="text-lg font-semibold text-zinc-50">
                Daftar Siswa Kelas {selectedKelas}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-[#d8deff]">
                {presensiData.length} Siswa
              </span>
              <button
                type="button"
                onClick={() => handleSetAllStatus('Hadir')}
                className="rounded-xl border border-emerald-400/30 bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/30"
              >
                ✓ Semua Hadir
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 1. TAMPILAN MOBILE / HP (< md): CARD GRID SEPERTI PADA GAMBAR (NO SLIDE)  */}
          {/* ========================================================================= */}
          <div className="space-y-4 p-4 md:hidden">
            {presensiData.map((siswa) => {
              const studentId = siswa.nipd || siswa.nis || siswa.id;
              const hasMarked = Boolean(siswa.status);

              return (
                <div
                  key={siswa.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-900/90"
                >
                  {/* Header Siswa: Nama + ID/NIS + Badge Status (Tanpa Foto) */}
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-display text-base font-bold text-zinc-900 dark:text-zinc-50">
                        {siswa.nama}
                      </h4>
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        ID: {studentId}
                      </p>
                    </div>

                    {/* Badge Status */}
                    {hasMarked && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Marked
                      </span>
                    )}
                  </div>

                  {/* Grid Tombol Status (2 Kolom x 2 Baris: Hadir, Sakit, Izin, Alpa) */}
                  <div className="mt-3.5 grid grid-cols-2 gap-2.5">
                    {STATUS_CONFIG.map((opt) => {
                      const isSelected = (siswa.status || '').toLowerCase() === opt.key.toLowerCase();

                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => handleStatusChange(siswa.id, opt.key)}
                          className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border py-3 px-2 text-center transition-all duration-150 active:scale-[0.98] ${
                            isSelected
                              ? opt.activeClass
                              : 'border-zinc-200 bg-zinc-50/70 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700/70 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-800'
                          }`}
                        >
                          <span className={isSelected ? opt.iconColor : 'text-zinc-400 dark:text-zinc-500'}>
                            {opt.icon}
                          </span>
                          <span className="text-xs font-semibold sm:text-sm">
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* 2. TAMPILAN TABLE UNTUK TABLET & DESKTOP (>= md)                          */}
          {/* ========================================================================= */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-zinc-50">
              <thead className="border-b border-zinc-800 bg-zinc-800/60">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">No</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">NIS / ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Nama Siswa</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Status Kehadiran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {presensiData.map((siswa, index) => (
                  <tr key={siswa.id} className="transition-colors hover:bg-zinc-800/40">
                    <td className="px-6 py-4 text-sm text-zinc-400">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-mono text-zinc-300">{siswa.nipd || siswa.nis || siswa.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-zinc-100">{siswa.nama}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {STATUS_CONFIG.map((opt) => {
                          const isSelected = (siswa.status || '').toLowerCase() === opt.key.toLowerCase();

                          return (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => handleStatusChange(siswa.id, opt.key)}
                              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                                isSelected
                                  ? opt.activeClass
                                  : 'border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800'
                              }`}
                            >
                              <span className={isSelected ? opt.iconColor : 'text-zinc-400'}>
                                {React.cloneElement(opt.icon, { className: 'w-4 h-4' })}
                              </span>
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tombol Simpan Presensi */}
          <div className="border-t border-zinc-800 bg-zinc-900/90 p-4 sm:p-6">
            <Button
              onClick={handleSubmit}
              variant="primary"
              size="lg"
              fullWidth
              className="!bg-[#e5ba4b] !text-[#172654] hover:!bg-[#f0cb69]"
            >
              Simpan Presensi Kelas <span aria-hidden="true">&#8594;</span>
            </Button>
          </div>
        </div>
      )}

      {!selectedKelas && (
        <div className="rounded-2xl border border-[#30457f]/50 bg-[#172654]/30 p-8 text-center text-[#d8deff]">
          <p className="text-base font-medium">
            Silakan pilih kelas, mata pelajaran, dan tanggal untuk memulai pengisian presensi siswa.
          </p>
        </div>
      )}
    </div>
  );
};

export default AbsensiForm;
