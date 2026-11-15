import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ExcelJS from 'exceljs';
import Sidebar from '../../components/common/Sidebar';
import FilterSection from '../../components/admin/FilterSection';
import RekapTable from '../../components/admin/RekapTable';
import StatCard from '../../components/admin/StatCard';
import Button from '../../components/common/Button';
import { SkeletonStatCard, SkeletonTable } from '../../components/common/Skeleton';
import { getCurrentUser, calculatePercentage } from '../../utils/helpers';
import Footer from '../../components/common/Footer';
import { presensiService } from '../../services/presensiService';
import { kelasService } from '../../services/kelasService';

const AdminRekap = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [loading, setLoading] = useState(true);
  const [classList, setClassList] = useState([]);
  const [filters, setFilters] = useState({
    kelas: 'all',
    startDate: '',
    endDate: '',
  });
  const [rekapData, setRekapData] = useState([]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // ── Load Kelas Options ──
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await kelasService.getAllClasses();
        setClassList(data || []);
      } catch (err) {
        console.error('Gagal memuat daftar kelas untuk filter rekap:', err);
      }
    };
    loadClasses();
  }, []);

  // ── Fetch Rekap Data from MySQL ──
  const fetchRekap = useCallback(async () => {
    try {
      setLoading(true);
      const data = await presensiService.getRekapitulasi({
        kelasId: filters.kelas !== 'all' ? filters.kelas : undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      });

      const formatted = (data || []).map((item) => ({
        id: item.kelas_id || item.nama_kelas,
        tanggal: filters.startDate && filters.endDate ? `${filters.startDate} s/d ${filters.endDate}` : 'Periode Berjalan',
        kelas: item.nama_kelas,
        tingkat: item.tingkat,
        hadir: parseInt(item.hadir, 10) || 0,
        izin: parseInt(item.izin, 10) || 0,
        sakit: parseInt(item.sakit, 10) || 0,
        alpa: parseInt(item.alpa, 10) || 0,
        total: parseInt(item.total, 10) || 0,
      }));

      setRekapData(formatted);
    } catch (err) {
      console.error('Gagal mengambil data rekapitulasi:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRekap();
  }, [fetchRekap]);

  const summary = rekapData.reduce(
    (acc, item) => ({
      total: acc.total + item.total,
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

    let dateRangeText = '';
    if (filters.startDate && filters.endDate) {
      dateRangeText = `Periode: ${filters.startDate} s/d ${filters.endDate}`;
    } else if (filters.startDate) {
      dateRangeText = `Mulai: ${filters.startDate}`;
    } else if (filters.endDate) {
      dateRangeText = `Sampai: ${filters.endDate}`;
    } else {
      dateRangeText = 'Periode: Semua Data Realtime';
    }

    // Title & Header Rows
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
      'Tanggal/Periode',
      'Kelas',
      'Hadir',
      'Izin',
      'Sakit',
      'Alpa',
      'Total Catatan',
      '% Kehadiran',
    ]);

    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.height = 25;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF172654' },
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        right: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      };
    });

    // Data rows
    rekapData.forEach((item, index) => {
      const persentase = calculatePercentage(item.hadir, item.total);
      const row = worksheet.addRow([
        index + 1,
        item.tanggal,
        item.kelas,
        item.hadir,
        item.izin,
        item.sakit,
        item.alpa,
        item.total,
        `${persentase}%`,
      ]);

      row.alignment = { vertical: 'middle' };
      row.getCell(1).alignment = { horizontal: 'center' };
      row.getCell(3).alignment = { horizontal: 'center' };
      row.getCell(4).alignment = { horizontal: 'center' };
      row.getCell(5).alignment = { horizontal: 'center' };
      row.getCell(6).alignment = { horizontal: 'center' };
      row.getCell(7).alignment = { horizontal: 'center' };
      row.getCell(8).alignment = { horizontal: 'center' };
      row.getCell(9).alignment = { horizontal: 'center' };

      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        };
      });
    });

    // Total summary row
    const totalRow = worksheet.addRow([
      'TOTAL',
      '',
      '',
      summary.hadir,
      summary.izin,
      summary.sakit,
      summary.alpa,
      summary.total,
      `${persentaseKehadiran}%`,
    ]);

    totalRow.font = { bold: true };
    totalRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFEAF0FF' },
      };
      cell.border = {
        top: { style: 'double', color: { argb: 'FF172654' } },
        bottom: { style: 'double', color: { argb: 'FF172654' } },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
    worksheet.mergeCells(`A${totalRow.number}:C${totalRow.number}`);

    // Set column widths
    worksheet.columns = [
      { width: 8 },
      { width: 25 },
      { width: 14 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 15 },
      { width: 15 },
    ];

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `Rekapitulasi_Kehadiran_SMAN1Nagreg_${new Date().toISOString().split('T')[0]}.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-50 flex flex-col">
      <Sidebar role="admin" />

      <main className="flex-1 lg:ml-72 p-6 lg:p-8 mt-16 lg:mt-0 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-zinc-100">Rekapitulasi Presensi Siswa</h2>
              <p className="text-sm text-zinc-400 mt-1">
                Laporan data kehadiran seluruh rombel kelas
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="primary"
                onClick={handleExportExcel}
                className="flex items-center justify-center gap-2 w-full sm:w-auto !bg-[#2e7d32] hover:!bg-[#1b5e20] text-white border-none shadow-sm"
              >
                <span>📊</span> Ekspor Rekap Excel
              </Button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              <>
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
              </>
            ) : (
              <>
                <StatCard
                  title="Total Hadir"
                  value={summary.hadir}
                  subValue={`${persentaseKehadiran}% Kehadiran`}
                  status="success"
                  icon="✓"
                />
                <StatCard
                  title="Izin"
                  value={summary.izin}
                  subValue="Siswa Izin"
                  status="info"
                  icon="📝"
                />
                <StatCard
                  title="Sakit"
                  value={summary.sakit}
                  subValue="Siswa Sakit"
                  status="warning"
                  icon="🏥"
                />
                <StatCard
                  title="Alpa"
                  value={summary.alpa}
                  subValue="Tanpa Keterangan"
                  status="danger"
                  icon="✕"
                />
              </>
            )}
          </div>

          {/* Filter Bar */}
          <FilterSection
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            availableClasses={classList}
          />

          {/* Rekap Table */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-base font-semibold text-zinc-200">Rincian Data Kehadiran per Kelas</h3>
              <span className="text-xs text-zinc-500">{today}</span>
            </div>

            {loading ? (
              <SkeletonTable rows={8} />
            ) : (
              <RekapTable data={rekapData} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminRekap;
