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
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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
    <div className="min-h-[100dvh] bg-zinc-950 text-zinc-50 selection:bg-[#29438f]/20">
      <Sidebar role="admin" />

      <main className="px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:ml-72 lg:px-10 lg:pt-10">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#29438f] dark:text-[#9eafff]">Pusat data sekolah</p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-zinc-50 sm:text-5xl">Rekapitulasi Kehadiran</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">Saring data berdasarkan kelas dan tanggal untuk membaca kehadiran dengan lebih cepat.</p>
            </div>
            <div className="w-fit rounded-xl border border-zinc-800/80 bg-zinc-900 px-4 py-3 sm:text-right">
              <p className="text-sm font-medium text-zinc-50">{today}</p>
              <p className="mt-1 text-xs text-zinc-500">Ringkasan data presensi</p>
            </div>
          </header>

          <section className="mb-8 rounded-3xl border border-[#b9c8f2] bg-[#eaf0ff] p-6 text-[#172654] dark:border-[#26386e] dark:bg-[#152143] dark:text-[#eef2ff] sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#29438f] dark:text-[#aebcff]">Ringkasan tersaring</p>
                <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">Data yang Anda butuhkan, tanpa harus mencari terlalu lama.</h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[#52628e] dark:text-[#b4bfdf]">Gunakan filter untuk mempersempit cakupan, lalu buka detail kelas dari tabel di bawah.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 lg:min-w-[19rem]">
                <div className="rounded-2xl border border-[#c8d4f4] bg-white/60 p-4 dark:border-[#30457f] dark:bg-[#101a35]/60">
                  <p className="text-2xl font-semibold tracking-tight">{filteredData.length}</p>
                  <p className="mt-1 text-xs leading-5 text-[#52628e] dark:text-[#b4bfdf]">Entri tersaring</p>
                </div>
                <div className="rounded-2xl border border-[#c8d4f4] bg-white/60 p-4 dark:border-[#30457f] dark:bg-[#101a35]/60">
                  <p className="text-2xl font-semibold tracking-tight">{persentaseKehadiran}%</p>
                  <p className="mt-1 text-xs leading-5 text-[#52628e] dark:text-[#b4bfdf]">Persentase hadir</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-50">Ringkasan kehadiran</h2>
                <p className="mt-1 text-sm text-zinc-500">Mengikuti filter yang diterapkan</p>
              </div>
              <span className="hidden text-xs font-medium uppercase tracking-[0.16em] text-zinc-500 sm:block">Data terpusat</span>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => <SkeletonStatCard key={index} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <StatCard title="Total" value={summary.total} color="primary" icon="ALL" />
                <StatCard title="Hadir" value={summary.hadir} color="success" icon="H" />
                <StatCard title="Izin" value={summary.izin} color="info" icon="I" />
                <StatCard title="Sakit" value={summary.sakit} color="warning" icon="S" />
                <StatCard title="Alpa" value={summary.alpa} color="danger" icon="A" />
              </div>
            )}
          </section>

          <section className="mb-8 rounded-2xl border border-zinc-800/80 bg-zinc-900 p-6 sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Kinerja keseluruhan</p>
                <p className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-zinc-50">{persentaseKehadiran}%</p>
                <p className="mt-2 text-sm text-zinc-500">Persentase hadir dari {summary.total} total catatan.</p>
              </div>
              <div className="w-full max-w-2xl md:pb-2">
                <div className="h-3 w-full overflow-hidden rounded-full border border-zinc-800 bg-zinc-950" role="progressbar" aria-label={`Persentase kehadiran ${persentaseKehadiran}%`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={Number(persentaseKehadiran)}>
                  <div
                    className={`h-full rounded-full transition-all ${persentaseKehadiran >= 80 ? 'bg-emerald-500' : persentaseKehadiran >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${persentaseKehadiran}%` }}
                  />
                </div>
                <div className="mt-3 flex justify-between gap-4 text-xs text-zinc-500">
                  <span>{summary.hadir} hadir</span>
                  <span>{summary.total} total catatan</span>
                </div>
              </div>
            </div>
          </section>

          <FilterSection filters={filters} onFilterChange={handleFilterChange} onResetFilter={handleResetFilters} />

          <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900 p-4 sm:p-6">
            <div className="mb-6 flex flex-col gap-4 border-b border-zinc-800/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#29438f] dark:text-[#9eafff]">Data detail</p>
                <h2 className="mt-3 text-xl font-semibold text-zinc-50">Tabel rekapitulasi</h2>
                <p className="mt-1 text-sm text-zinc-500">Menampilkan {filteredData.length} entri sesuai filter.</p>
              </div>
              <Button onClick={handleExportExcel} size="md" variant="primary" disabled={loading} className="shrink-0 !bg-[#29438f] !text-white hover:!bg-[#203674]">
                Export ke Excel
              </Button>
            </div>
            {loading ? <SkeletonTable rows={10} columns={10} /> : <RekapTable data={filteredData} />}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminRekap;
