import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExcelJS from 'exceljs';
import Sidebar from '../../components/common/Sidebar';
import FilterSection from '../../components/admin/FilterSection';
import RekapTable from '../../components/admin/RekapTable';
import StatCard from '../../components/admin/StatCard';
import Button from '../../components/common/Button';
import { SkeletonStatCard, SkeletonTable } from '../../components/common/Skeleton';
import { presensiHarian } from '../../data/mockData';
import { getCurrentUser, calculatePercentage } from '../../utils/helpers';
import Footer from '../../components/common/Footer';

const AdminRekap = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    kelas: 'all',
    startDate: '',
    endDate: '',
  });
  const [filteredData, setFilteredData] = useState(presensiHarian);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Gunakan semua data dari presensiHarian
    let filtered = presensiHarian;
    
    // Filter berdasarkan kelas jika dipilih
    if (filters.kelas !== 'all') {
      filtered = filtered.filter((item) => item.kelas === filters.kelas);
    }
    
    // Filter berdasarkan tanggal mulai
    if (filters.startDate) {
      filtered = filtered.filter(item => item.tanggal >= filters.startDate);
    }
    
    // Filter berdasarkan tanggal akhir
    if (filters.endDate) {
      filtered = filtered.filter(item => item.tanggal <= filters.endDate);
    }
    
    setFilteredData(filtered);
  }, [filters]);

  const summary = filteredData.reduce(
    (acc, item) => ({
      total: acc.total + (item.hadir + item.izin + item.sakit + item.alpa),
      hadir: acc.hadir + item.hadir,
      izin: acc.izin + item.izin,
      sakit: acc.sakit + item.sakit,
      alpa: acc.alpa + item.alpa,
    }),
    { total: 0, hadir: 0, izin: 0, sakit: 0, alpa: 0 }
  );

  const persentaseKehadiran = calculatePercentage(summary.hadir, summary.total);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      kelas: 'all',
      startDate: '',
      endDate: '',
    });
  };

  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Rekapitulasi Kehadiran');

    // Format date range for display
    let dateRangeText = '';
    if (filters.startDate && filters.endDate) {
      dateRangeText = `Periode: ${filters.startDate} s/d ${filters.endDate}`;
    } else if (filters.startDate) {
      dateRangeText = `Mulai: ${filters.startDate}`;
    } else if (filters.endDate) {
      dateRangeText = `Sampai: ${filters.endDate}`;
    } else {
      dateRangeText = 'Periode: Semua Data';
    }

    // Header
    const titleRow = worksheet.addRow(['REKAPITULASI KEHADIRAN SISWA']);
    titleRow.font = { bold: true, size: 16 };
    titleRow.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.mergeCells('A1:I1');

    const schoolRow = worksheet.addRow(['SMA NEGERI 1 NAGREG']);
    schoolRow.font = { bold: true, size: 14 };
    schoolRow.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.mergeCells('A2:I2');

    const periodRow = worksheet.addRow([dateRangeText]);
    periodRow.font = { bold: true, size: 12 };
    periodRow.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.mergeCells('A3:I3');

    worksheet.addRow([]);

    // Table header
    const headerRow = worksheet.addRow([
      'No',
      'Tanggal',
      'Kelas',
      'Hadir',
      'Izin',
      'Sakit',
      'alpa',
      'Total',
      '% Kehadiran'
    ]);

    // Style header
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.height = 25;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Data rows
    filteredData.forEach((item, index) => {
      const total = item.hadir + item.izin + item.sakit + item.alpa;
      const persentase = calculatePercentage(item.hadir, total);
      
      const dataRow = worksheet.addRow([
        index + 1,
        item.tanggal,
        item.kelas,
        item.hadir,
        item.izin,
        item.sakit,
        item.alpa,
        total,
        `${persentase}%`
      ]);

      dataRow.alignment = { horizontal: 'center', vertical: 'middle' };
      dataRow.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };

        // Color coding untuk kolom
        if (colNumber === 4) { // Hadir
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD4EDDA' } };
        } else if (colNumber === 5) { // Izin
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3CD' } };
        } else if (colNumber === 6) { // Sakit
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1ECF1' } };
        } else if (colNumber === 7) { // alpa
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8D7DA' } };
        } else if (colNumber === 9) { // % Kehadiran
          if (persentase >= 80) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD4EDDA' } };
            cell.font = { color: { argb: 'FF155724' }, bold: true };
          } else if (persentase >= 60) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3CD' } };
            cell.font = { color: { argb: 'FF856404' }, bold: true };
          } else {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8D7DA' } };
            cell.font = { color: { argb: 'FF721C24' }, bold: true };
          }
        }
      });
    });

    // Summary row
    const summaryRow = worksheet.addRow([
      '',
      '',
      'TOTAL',
      summary.hadir,
      summary.izin,
      summary.sakit,
      summary.alpa,
      summary.total,
      `${persentaseKehadiran}%`
    ]);

    summaryRow.font = { bold: true, size: 12 };
    summaryRow.alignment = { horizontal: 'center', vertical: 'middle' };
    summaryRow.height = 30;
    summaryRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE2EFDA' }
      };
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'thin' },
        bottom: { style: 'medium' },
        right: { style: 'thin' }
      };
    });

    // Set column widths
    worksheet.getColumn(1).width = 5;   // No
    worksheet.getColumn(2).width = 15;  // Tanggal
    worksheet.getColumn(3).width = 15;  // Kelas
    worksheet.getColumn(4).width = 10;  // Hadir
    worksheet.getColumn(5).width = 10;  // Izin
    worksheet.getColumn(6).width = 10;  // Sakit
    worksheet.getColumn(7).width = 10;  // alpa
    worksheet.getColumn(8).width = 10;  // Total
    worksheet.getColumn(9).width = 15;  // % Kehadiran

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `Rekapitulasi_Kehadiran_${date}.xlsx`;

    // Generate and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-zinc-950 min-h-[100dvh] text-white selection:bg-primary-500/30">
      <Sidebar role="admin" />

      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-display tracking-tight">Rekapitulasi Kehadiran</h1>
              <p className="text-zinc-400 mt-1">Filter kelas dan tanggal untuk detail yang Anda butuhkan.</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-white">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="text-xs text-zinc-500 mt-1">Data Hari Ini</p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-sm font-medium text-zinc-300">Statistik Kehadiran Hari Ini</p>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonStatCard key={index} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                <StatCard title="Total" value={summary.total} color="primary" />
                <StatCard title="Hadir" value={summary.hadir} color="success" />
                <StatCard title="Izin" value={summary.izin} color="info" />
                <StatCard title="Sakit" value={summary.sakit} color="warning" />
                <StatCard title="Alpa" value={summary.alpa} color="danger" />
              </div>
            )}
          </div>

          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-400 mb-1">Persentase Kehadiran</p>
                <h3 className="text-3xl font-semibold tracking-tight text-white">{persentaseKehadiran}%</h3>
                <p className="text-zinc-500 text-xs mt-1">Mengikuti filter yang diterapkan</p>
              </div>
              <div className="w-full md:max-w-sm">
                <div className="w-full bg-zinc-950 border border-white/5 rounded-full h-3">
                  <div
                    className={`h-full rounded-full transition-all ${
                      persentaseKehadiran >= 80 ? 'bg-emerald-500' : persentaseKehadiran >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${persentaseKehadiran}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
            <p className="text-sm font-medium text-white mb-4">Filter Data</p>
            <FilterSection filters={filters} onFilterChange={handleFilterChange} onResetFilter={handleResetFilters} />
          </div>

          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 border-b border-white/5 pb-6">
              <div>
                <h3 className="text-xl font-medium text-white">Tabel Rekapitulasi</h3>
                <p className="text-sm text-zinc-400 mt-1">Total {filteredData.length} entri data</p>
              </div>
              <div className="shrink-0">
                <Button onClick={handleExportExcel} size="md" variant="primary" disabled={loading}>
                  Export ke Excel
                </Button>
              </div>
            </div>
            {loading ? (
              <SkeletonTable rows={10} columns={10} />
            ) : (
              <RekapTable data={filteredData} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminRekap;
