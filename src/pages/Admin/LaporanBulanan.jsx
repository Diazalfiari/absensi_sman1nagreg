import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import VisualIcon from '../../components/common/VisualIcon';
import { getCurrentUser } from '../../utils/helpers';
import { dataMapel } from '../../data/mockData';
import Footer from '../../components/common/Footer';

import ReportFilter from '../../components/admin/reports/ReportFilter';
import MonthlyAttendanceTable from '../../components/admin/reports/MonthlyAttendanceTable';
import { getDaysInMonth } from '../../utils/reportHelpers';
import { generatePresensiData } from '../../utils/attendanceReport';
import { exportMonthlyReport } from '../../utils/exportMonthlyReport';

const LaporanBulanan = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [filters, setFilters] = useState({
    bulan: new Date().getMonth() + 1,
    tahun: new Date().getFullYear(),
    kelas: 'X-1',
    mataPelajaran: 'Hasil Akhir',
  });

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const bulanOptions = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
  ];

  const kelasOptions = [
    'X-1', 'X-2', 'X-3', 'X-4', 'X-5', 'X-6', 'X-7', 'X-8', 'X-9', 'X-10', 'X-11', 'X-12',
    'XI-1', 'XI-2', 'XI-3', 'XI-4', 'XI-5', 'XI-6', 'XI-7', 'XI-8', 'XI-9', 'XI-10', 'XI-11', 'XI-12',
    'XII-1', 'XII-2', 'XII-3', 'XII-4', 'XII-5', 'XII-6', 'XII-7', 'XII-8', 'XII-9', 'XII-10', 'XII-11', 'XII-12'
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: name === 'bulan' || name === 'tahun' ? parseInt(value) : value,
    }));
  };

  const presensiData = generatePresensiData(filters.bulan, filters.tahun, filters.kelas, filters.mataPelajaran);
  const daysInMonth = getDaysInMonth(filters.bulan, filters.tahun);
  const bulanName = bulanOptions.find((b) => b.value === filters.bulan)?.label;

  const reportSummary = presensiData.reduce((summary, siswa) => ({
    hadir: summary.hadir + siswa.hadir,
    sakit: summary.sakit + siswa.sakit,
    izin: summary.izin + siswa.izin,
    alpa: summary.alpa + siswa.alpa,
  }), { hadir: 0, sakit: 0, izin: 0, alpa: 0 });

  const averageAttendance = presensiData.length > 0
    ? Math.round(presensiData.reduce((total, siswa) => total + siswa.persentase, 0) / presensiData.length)
    : 0;

  const handleExportExcel = async () => {
    await exportMonthlyReport({
      filters,
      presensiData,
      bulanName,
      daysInMonth,
    });
  };

  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-zinc-50 selection:bg-[#29438f]/30">
      <Sidebar role="admin" />

      <main className="mt-16 p-5 transition-all duration-300 sm:p-7 lg:ml-72 lg:mt-0 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <header className="flex flex-col gap-6 border-b border-zinc-800/80 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#29438f] dark:text-[#9eafff]">
                Administrasi akademik
              </p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-zinc-50 sm:text-5xl">
                Laporan Bulanan
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-500 dark:text-zinc-400 sm:text-base">
                Baca pola kehadiran siswa per hari dan siapkan laporan sekolah dalam format Excel.
              </p>
            </div>
            <div className="rounded-2xl border border-[#c8d4f4] bg-[#eaf0ff] px-5 py-4 text-[#29438f] dark:border-[#30457f] dark:bg-[#152143] dark:text-[#aebcff]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em]">Periode aktif</p>
              <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em]">{bulanName} {filters.tahun}</p>
              <p className="mt-1 text-xs opacity-75">Kelas {filters.kelas}</p>
            </div>
          </header>

          <section className="grid overflow-hidden rounded-3xl border border-[#30457f] bg-[#172654] text-white shadow-[0_24px_70px_rgba(23,38,84,0.2)] dark:bg-[#111b3c] lg:grid-cols-[1.25fr_1fr]">
            <div className="relative overflow-hidden p-6 sm:p-8">
              <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#9eafff]/10 blur-3xl" aria-hidden="true" />
              <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-[#aebcff]">Presensi terpilih</p>
              <h2 className="relative mt-4 max-w-lg font-display text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                Ringkasan kehadiran {filters.mataPelajaran}.
              </h2>
              <p className="relative mt-3 max-w-xl text-sm leading-6 text-[#c5cfe0]">
                Data berubah langsung ketika periode, kelas, atau mata pelajaran diperbarui.
              </p>
            </div>
            <div className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-4 lg:border-l lg:border-t-0">
              <div className="flex flex-col items-center justify-center text-center border-r border-white/10 p-4 sm:p-5">
                <p className="text-2xl font-semibold">{presensiData.length}</p>
                <p className="mt-2 text-xs leading-5 text-[#c5cfe0]">Siswa</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center border-b border-r border-white/10 p-4 sm:border-b-0 sm:p-5">
                <p className="text-2xl font-semibold">{averageAttendance}%</p>
                <p className="mt-2 text-xs leading-5 text-[#c5cfe0]">Rata-rata hadir</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center border-r border-white/10 p-4 sm:p-5">
                <p className="text-2xl font-semibold">{reportSummary.hadir}</p>
                <p className="mt-2 text-xs leading-5 text-[#c5cfe0]">Catatan hadir</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-4 sm:p-5">
                <p className="text-2xl font-semibold">{daysInMonth}</p>
                <p className="mt-2 text-xs leading-5 text-[#c5cfe0]">Hari kalender</p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">Hadir</p>
              <p className="mt-3 text-2xl font-semibold text-zinc-50">{reportSummary.hadir}</p>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">Sakit</p>
              <p className="mt-3 text-2xl font-semibold text-zinc-50">{reportSummary.sakit}</p>
            </div>
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700 dark:text-blue-300">Izin</p>
              <p className="mt-3 text-2xl font-semibold text-zinc-50">{reportSummary.izin}</p>
            </div>
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-700 dark:text-rose-300">Alpa</p>
              <p className="mt-3 text-2xl font-semibold text-zinc-50">{reportSummary.alpa}</p>
            </div>
          </section>

          <ReportFilter
            filters={filters}
            bulanOptions={bulanOptions}
            kelasOptions={kelasOptions}
            dataMapel={dataMapel}
            onFilterChange={handleFilterChange}
            onExport={handleExportExcel}
          />

          <section className="overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/60">
            <div className="flex flex-col gap-4 border-b border-zinc-800/80 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#29438f] dark:text-[#9eafff]">Data harian</p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-zinc-50">Tabel presensi siswa</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  Geser tabel ke samping untuk melihat seluruh tanggal dan rekap.
                </p>
              </div>
              <div className="w-fit rounded-full border border-zinc-800 bg-zinc-950/60 px-3 py-1.5 text-xs font-medium text-zinc-500">
                {presensiData.length} siswa · {daysInMonth} hari
              </div>
            </div>
            <MonthlyAttendanceTable
              presensiData={presensiData}
              daysInMonth={daysInMonth}
              bulan={filters.bulan}
              tahun={filters.tahun}
            />
          </section>

          <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-50">Keterangan status</p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">Gunakan kode berikut saat membaca tabel laporan.</p>
              </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs text-zinc-500 sm:grid-cols-4">
                 <div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"><VisualIcon name="task" className="h-4 w-4" /></span><span>Hadir</span></div>
                 <div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300"><VisualIcon name="info" className="h-4 w-4" /></span><span>Sakit</span></div>
                 <div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300"><VisualIcon name="message" className="h-4 w-4" /></span><span>Izin</span></div>
                 <div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300"><VisualIcon name="question" className="h-4 w-4" /></span><span>Alpa</span></div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer containerClassName="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10" />
    </div>
  );
};

export default LaporanBulanan;
