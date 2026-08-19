import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { getCurrentUser } from '../../utils/helpers';
import { dataMapel } from '../../data/mockData';
import Footer from '../../components/common/Footer';

// Komponen dan Utility yang sudah dipisah
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
    'X-1', 'X-2', 'X-3','X-4', 'X-5', 'X-6', 'X-7', 'X-8', 'X-9', 'X-10', 'X-11', 'X-12',
    'XI-1', 'XI-2', 'XI-3','XI-4', 'XI-5', 'XI-6', 'XI-7', 'XI-8', 'XI-9', 'XI-10', 'XI-11', 'XI-12',
    'XII-1', 'XII-2', 'XII-3', 'XII-4', 'XII-5', 'XII-6', 'XII-7', 'XII-8', 'XII-9', 'XII-10', 'XII-11', 'XII-12'
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: name === 'bulan' || name === 'tahun' ? parseInt(value) : value,
    }));
  };

  // Kalkulasi data presensi
  const presensiData = generatePresensiData(filters.bulan, filters.tahun, filters.kelas, filters.mataPelajaran);
  const daysInMonth = getDaysInMonth(filters.bulan, filters.tahun);
  const bulanName = bulanOptions.find(b => b.value === filters.bulan)?.label;

  const handleExportExcel = async () => {
    await exportMonthlyReport({
      filters,
      presensiData,
      bulanName,
      daysInMonth,
    });
  };

  return (
    <div className="bg-zinc-950 min-h-[100dvh] text-zinc-50 selection:bg-primary-500/30">
      <Sidebar role="admin" />
      
      <div className="lg:ml-64 p-4 md:py-6 md:pr-6 md:pl-10 lg:py-8 lg:pr-8 lg:pl-14">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-display tracking-tight text-zinc-50 mb-2">
            Laporan Presensi Bulanan
          </h1>
          <p className="text-sm md:text-base text-zinc-400">
            Laporan detail kehadiran siswa per bulan - {filters.mataPelajaran}
          </p>
        </div>

        {/* Filter Section Component */}
        <ReportFilter
          filters={filters}
          bulanOptions={bulanOptions}
          kelasOptions={kelasOptions}
          dataMapel={dataMapel}
          onFilterChange={handleFilterChange}
          onExport={handleExportExcel}
        />

        {/* Info Box - Active Filter */}
        <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4 mb-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-300">
            <span className="font-medium text-zinc-50">Menampilkan:</span>
            <span className="bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-lg whitespace-nowrap">{filters.mataPelajaran}</span>
            <span className="bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-lg whitespace-nowrap">{filters.kelas}</span>
            <span className="bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-lg whitespace-nowrap">{bulanName} {filters.tahun}</span>
          </div>
        </div>

        {/* Table Section Component */}
        <MonthlyAttendanceTable
          presensiData={presensiData}
          daysInMonth={daysInMonth}
          bulan={filters.bulan}
          tahun={filters.tahun}
        />

        {/* Keterangan */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 md:p-6 mt-4 md:mt-6">
          <h3 className="text-zinc-50 font-medium mb-3 md:mb-4 text-sm md:text-base">Keterangan:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-xs md:text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center font-medium text-emerald-400">H</span>
              <span>Hadir</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center font-medium text-amber-400">S</span>
              <span>Sakit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-accent-500/10 border border-accent-500/20 rounded-lg flex items-center justify-center font-medium text-accent-400">I</span>
              <span>Izin</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center justify-center font-medium text-rose-400">A</span>
              <span>Alpa</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LaporanBulanan;
