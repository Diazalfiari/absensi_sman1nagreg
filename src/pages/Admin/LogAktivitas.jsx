import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ExcelJS from 'exceljs';
import Sidebar from '../../components/common/Sidebar';
import VisualIcon from '../../components/common/VisualIcon';
import Pagination from '../../components/common/Pagination';
import Notification from '../../components/common/Notification';
import Footer from '../../components/common/Footer';
import Button from '../../components/common/Button';
import { getCurrentUser } from '../../utils/helpers';
import { logService } from '../../services/logService';

const ROLE_BADGE = {
  admin: {
    label: 'Admin',
    className: 'bg-[#1b2a54] text-[#aebcff] border-[#30457f]',
    dotClass: 'bg-[#9eafff]',
  },
  guru: {
    label: 'Guru',
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dotClass: 'bg-emerald-400',
  },
  siswa: {
    label: 'Siswa',
    className: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dotClass: 'bg-amber-400',
  },
};

const STATUS_BADGE = {
  success: {
    label: 'Sukses',
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  info: {
    label: 'Info',
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  warning: {
    label: 'Peringatan',
    className: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  },
};

const KATEGORI_OPTIONS = [
  'Semua Kategori',
  'Presensi',
  'Laporan',
  'Manajemen Pengguna',
  'Manajemen Kelas',
  'Jadwal',
  'Autentikasi',
  'Akademik',
];

const LogAktivitas = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [logs, setLogs] = useState([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('Semua');
  const [selectedKategori, setSelectedKategori] = useState('Semua Kategori');
  const [selectedDateFilter, setSelectedDateFilter] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLogDetail, setSelectedLogDetail] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [notification, setNotification] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  const itemsPerPage = 8;

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // ── Fetch Logs from Backend ──
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await logService.getLogs({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery.trim(),
        role: selectedRole !== 'Semua' ? selectedRole : undefined,
        kategori: selectedKategori !== 'Semua Kategori' ? selectedKategori : undefined,
        dateFilter: selectedDateFilter !== 'Semua' ? selectedDateFilter : undefined,
      });

      const rawItems = res.items || [];
      const formattedItems = rawItems.map((log) => {
        const dateObj = log.created_at ? new Date(log.created_at) : new Date();
        const dateStr = dateObj.toISOString().split('T')[0];
        const timeStr = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        return {
          id: log.id,
          user: log.nama_user || log.nama || 'Pengguna',
          role: log.role || 'admin',
          kategori: log.kategori || 'Sistem',
          aksi: log.aksi || 'Aktivitas',
          deskripsi: log.deskripsi || '-',
          tanggal: dateStr,
          waktu: timeStr,
          timestamp: `${dateStr} ${timeStr}`,
          status: log.status || 'success',
          ipAddress: log.ip_address || '127.0.0.1',
          device: log.user_agent || 'Browser',
        };
      });

      setLogs(formattedItems);
      setTotalLogs(res.total || formattedItems.length);
    } catch (err) {
      console.error('Gagal mengambil data audit log:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchQuery, selectedRole, selectedKategori, selectedDateFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const totalPages = Math.ceil(totalLogs / itemsPerPage) || 1;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRole('Semua');
    setSelectedKategori('Semua Kategori');
    setSelectedDateFilter('Semua');
    setCurrentPage(1);
    setNotification({
      isOpen: true,
      type: 'info',
      title: 'Filter Direset',
      message: 'Seluruh kriteria pencarian dan filter log telah dikembalikan ke kondisi awal.',
    });
  };

  // Export to Excel handler
  const handleExportExcel = async () => {
    try {
      setIsExporting(true);

      // Ambil seluruh log untuk diekspor
      const allLogsRes = await logService.getLogs({
        page: 1,
        limit: 1000,
        search: searchQuery.trim(),
        role: selectedRole !== 'Semua' ? selectedRole : undefined,
        kategori: selectedKategori !== 'Semua Kategori' ? selectedKategori : undefined,
        dateFilter: selectedDateFilter !== 'Semua' ? selectedDateFilter : undefined,
      });

      const exportItems = (allLogsRes.items || []).map((log) => {
        const dateObj = log.created_at ? new Date(log.created_at) : new Date();
        const dateStr = dateObj.toISOString().split('T')[0];
        const timeStr = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        return {
          timestamp: `${dateStr} ${timeStr}`,
          user: log.nama_user || log.nama || 'Pengguna',
          role: (log.role || 'admin').toUpperCase(),
          kategori: log.kategori || 'Sistem',
          aksi: `${log.aksi}: ${log.deskripsi}`,
          ipAddress: log.ip_address || '-',
          device: log.user_agent || '-',
        };
      });

      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'SMAN 1 Nagreg System';
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet('Log Aktivitas');

      // Title & Header
      worksheet.mergeCells('A1:G1');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = 'LOG AKTIVITAS SISTEM PRESENSI SMAN 1 NAGREG';
      titleCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF172654' },
      };
      worksheet.getRow(1).height = 30;

      worksheet.mergeCells('A2:G2');
      const subTitleCell = worksheet.getCell('A2');
      subTitleCell.value = `Tanggal Ekspor: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })} | Total Catatan: ${exportItems.length} Data`;
      subTitleCell.font = { italic: true, size: 10, color: { argb: 'FF555555' } };
      subTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getRow(2).height = 20;

      // Table Header
      const headers = ['No', 'Waktu & Tanggal', 'Nama Pengguna', 'Peran', 'Kategori', 'Aksi / Aktivitas', 'IP & Perangkat'];
      worksheet.getRow(4).values = headers;
      const headerRow = worksheet.getRow(4);
      headerRow.height = 24;
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF29438F' },
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'medium' },
          right: { style: 'thin' },
        };
      });

      // Populate Data Rows
      exportItems.forEach((item, index) => {
        const row = worksheet.addRow([
          index + 1,
          item.timestamp,
          item.user,
          item.role,
          item.kategori,
          item.aksi,
          `${item.ipAddress} (${item.device})`,
        ]);

        row.height = 22;
        row.alignment = { vertical: 'middle' };
        row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
        row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
        row.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };
        row.getCell(5).alignment = { horizontal: 'center', vertical: 'middle' };

        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
            left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
            bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
            right: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          };
        });
      });

      // Column Widths
      worksheet.columns = [
        { width: 8 },
        { width: 22 },
        { width: 25 },
        { width: 12 },
        { width: 22 },
        { width: 55 },
        { width: 30 },
      ];

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `Log_Aktivitas_SMAN1Nagreg_${new Date().toISOString().split('T')[0]}.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);

      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Ekspor Berhasil!',
        message: 'File Log Aktivitas format Excel telah berhasil diunduh.',
      });
    } catch (err) {
      console.error('Export error:', err);
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Gagal Ekspor',
        message: 'Terjadi kendala saat memproses file Excel.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-zinc-950 text-zinc-50 selection:bg-[#29438f]/30">
      <Sidebar role="admin" />

      <main className="mt-16 flex-1 p-5 sm:p-7 lg:ml-72 lg:mt-0 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header Hero Section */}
          <section className="grid overflow-hidden rounded-[28px] border border-[#30457f] bg-[#172654] text-white shadow-[0_24px_70px_rgba(23,38,84,0.2)] dark:bg-[#111b3c] lg:grid-cols-[1.35fr_0.65fr]">
            <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#9eafff]/10 blur-3xl" aria-hidden="true" />
              <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-[#aebcff]">Audit &amp; Keamanan</p>
              <h1 className="relative mt-4 font-display text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                Log Aktivitas Sistem
              </h1>
              <p className="relative mt-3 max-w-2xl text-sm leading-6 text-[#d8deff] sm:text-base">
                Audit riwayat seluruh aktivitas operasional presensi siswa, pembaruan jadwal kelas, mutasi rombel, kenaikan kelas, kelulusan, serta log autentikasi secara *real-time*.
              </p>
            </div>

            <div className="flex flex-col justify-between border-t border-white/10 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Status Rekaman Log</p>
                <div className="mt-3 flex items-center gap-2.5">
                  <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                  <span className="font-display text-lg font-semibold text-white">Sistem Aktif &amp; Terlindungi</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-[#c5cfe0]">Audit trail tersimpan aman dan siap diekspor untuk kebutuhan pelaporan resmi.</p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <Button
                  onClick={handleExportExcel}
                  disabled={isExporting || totalLogs === 0}
                  className="w-full !bg-[#e5ba4b] !text-[#172654] hover:!bg-[#f0cb69] transition-all font-semibold"
                >
                  <VisualIcon name="report" className="h-4 w-4 mr-2" />
                  {isExporting ? 'Memproses Ekspor...' : 'Ekspor Log (.xlsx)'}
                </Button>
              </div>
            </div>
          </section>

          {/* Metric Summary Cards */}
          <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-5 shadow-sm">
              <p className="text-xs font-medium text-zinc-500">Total Log Sistem</p>
              <p className="mt-2 font-display text-2xl font-bold text-zinc-50">{loading ? '...' : totalLogs}</p>
              <p className="mt-1 text-xs text-zinc-500">Keseluruhan entri audit</p>
            </article>

            <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-5 shadow-sm">
              <p className="text-xs font-medium text-emerald-400">Aktivitas Guru</p>
              <p className="mt-2 font-display text-2xl font-bold text-emerald-400">
                {loading ? '...' : logs.filter((l) => l.role === 'guru').length}
              </p>
              <p className="mt-1 text-xs text-zinc-500">Presensi &amp; materi kelas</p>
            </article>

            <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-5 shadow-sm">
              <p className="text-xs font-medium text-[#9eafff]">Aktivitas Admin</p>
              <p className="mt-2 font-display text-2xl font-bold text-[#9eafff]">
                {loading ? '...' : logs.filter((l) => l.role === 'admin').length}
              </p>
              <p className="mt-1 text-xs text-zinc-500">Manajemen user &amp; jadwal</p>
            </article>

            <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-5 shadow-sm">
              <p className="text-xs font-medium text-amber-400">Aktivitas Siswa</p>
              <p className="mt-2 font-display text-2xl font-bold text-amber-400">
                {loading ? '...' : logs.filter((l) => l.role === 'siswa').length}
              </p>
              <p className="mt-1 text-xs text-zinc-500">Akses jadwal &amp; presensi</p>
            </article>
          </section>

          {/* Filter & Search Bar */}
          <section className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-[0_16px_45px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Search input */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Cari Aktivitas
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Nama user, aksi, kata kunci..."
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#9eafff] focus:outline-none focus:ring-2 focus:ring-[#9eafff]/20 transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Kategori */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Kategori
                </label>
                <select
                  value={selectedKategori}
                  onChange={(e) => {
                    setSelectedKategori(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-[#9eafff] focus:outline-none focus:ring-2 focus:ring-[#9eafff]/20 transition-all"
                >
                  {KATEGORI_OPTIONS.map((kat) => (
                    <option key={kat} value={kat} className="bg-zinc-900 text-zinc-100">
                      {kat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Role */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Peran Pengguna
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => {
                    setSelectedRole(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-[#9eafff] focus:outline-none focus:ring-2 focus:ring-[#9eafff]/20 transition-all"
                >
                  <option value="Semua" className="bg-zinc-900">Semua Peran</option>
                  <option value="admin" className="bg-zinc-900">Administrator</option>
                  <option value="guru" className="bg-zinc-900">Guru</option>
                  <option value="siswa" className="bg-zinc-900">Siswa</option>
                </select>
              </div>

              {/* Filter Tanggal */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Filter Waktu
                </label>
                <select
                  value={selectedDateFilter}
                  onChange={(e) => {
                    setSelectedDateFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-[#9eafff] focus:outline-none focus:ring-2 focus:ring-[#9eafff]/20 transition-all"
                >
                  <option value="Semua" className="bg-zinc-900">Semua Waktu</option>
                  <option value="today" className="bg-zinc-900">Hari Ini</option>
                  <option value="yesterday" className="bg-zinc-900">Kemarin</option>
                </select>
              </div>
            </div>

            {/* Active filter summary & reset button */}
            {(searchQuery || selectedRole !== 'Semua' || selectedKategori !== 'Semua Kategori' || selectedDateFilter !== 'Semua') && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/80 pt-4 text-xs">
                <p className="text-zinc-400">
                  Menampilkan <span className="font-semibold text-zinc-200">{logs.length}</span> dari{' '}
                  <span className="font-semibold text-zinc-200">{totalLogs}</span> aktivitas sesuai filter
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="font-medium text-[#9eafff] transition-colors hover:text-white"
                >
                  Reset Semua Filter ✕
                </button>
              </div>
            )}
          </section>

          {/* Activity Logs Table */}
          <section className="overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/60 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between border-b border-zinc-800/80 p-5 sm:p-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9eafff]">Audit Trail</p>
                <h2 className="mt-1 font-display text-2xl font-semibold tracking-[-0.04em] text-zinc-50">
                  Daftar Rekaman Aktivitas
                </h2>
              </div>
              <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-zinc-400">
                {totalLogs} entri
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-zinc-400">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#9eafff] border-t-transparent mb-3" />
                Memuat data audit log...
              </div>
            ) : logs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm" aria-label="Tabel log aktivitas">
                  <thead className="border-b border-zinc-800 text-xs uppercase tracking-[0.12em] text-zinc-400">
                    <tr>
                      <th className="px-5 py-4">Waktu &amp; Tanggal</th>
                      <th className="px-5 py-4">Pengguna</th>
                      <th className="px-5 py-4">Kategori</th>
                      <th className="px-5 py-4">Aktivitas &amp; Deskripsi</th>
                      <th className="px-5 py-4 text-center">Status</th>
                      <th className="px-5 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                    {logs.map((log) => {
                      const roleMeta = ROLE_BADGE[log.role] || ROLE_BADGE.admin;
                      const statusMeta = STATUS_BADGE[log.status] || STATUS_BADGE.success;

                      return (
                        <tr
                          key={log.id}
                          className="transition-colors hover:bg-[#1b2a54]/30"
                        >
                          <td className="px-5 py-4 whitespace-nowrap">
                            <p className="font-semibold text-zinc-100 font-mono text-xs">{log.waktu}</p>
                            <p className="text-[11px] text-zinc-500">{log.tanggal}</p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="font-semibold text-zinc-100">{log.user}</p>
                            <div className="mt-1 flex items-center gap-1.5">
                              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${roleMeta.className}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${roleMeta.dotClass}`} />
                                {roleMeta.label}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="rounded-lg border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-xs font-medium text-zinc-300">
                              {log.kategori}
                            </span>
                          </td>

                          <td className="px-5 py-4 max-w-md">
                            <p className="font-semibold text-zinc-100">{log.aksi}</p>
                            <p className="mt-0.5 text-xs text-zinc-400 line-clamp-1">{log.deskripsi}</p>
                          </td>

                          <td className="px-5 py-4 text-center whitespace-nowrap">
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusMeta.className}`}>
                              {statusMeta.label}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedLogDetail(log)}
                              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-[#9eafff] hover:bg-[#1b2a54] hover:text-white"
                            >
                              Detail ↗
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-zinc-600">
                  <VisualIcon name="info" className="h-6 w-6" />
                </span>
                <p className="mt-4 font-semibold text-zinc-200">Tidak ada log aktivitas yang cocok</p>
                <p className="mt-1 text-xs text-zinc-500">Coba ubah kriteria pencarian atau atur ulang filter.</p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 inline-flex items-center rounded-xl bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-700"
                >
                  Reset Filter
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <div className="border-t border-zinc-800/80 p-5 sm:p-7">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer containerClassName="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10" />

      {/* Detail Log Modal / Dialog */}
      {selectedLogDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 bg-[#111b3c] p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Audit Detail</p>
                <h3 className="mt-1 font-display text-xl font-bold text-white">Rincian Log Aktivitas</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLogDetail(null)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 p-6 text-sm text-zinc-300">
              <div className="grid grid-cols-2 gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Pengguna</p>
                  <p className="mt-1 font-semibold text-zinc-100">{selectedLogDetail.user}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Peran</p>
                  <p className="mt-1 font-semibold text-zinc-100 uppercase">{selectedLogDetail.role}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Waktu &amp; Tanggal</p>
                  <p className="mt-1 font-medium text-zinc-200 font-mono text-xs">{selectedLogDetail.timestamp}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Kategori</p>
                  <p className="mt-1 font-medium text-zinc-200">{selectedLogDetail.kategori}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Aksi / Operasi</p>
                <p className="mt-1 font-semibold text-zinc-100">{selectedLogDetail.aksi}</p>
              </div>

              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Deskripsi Rinci</p>
                <div className="mt-1.5 rounded-xl border border-zinc-800 bg-zinc-950 p-3.5 text-xs text-zinc-300 leading-relaxed">
                  {selectedLogDetail.deskripsi}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-4 text-xs">
                <div>
                  <p className="text-zinc-500">IP Address</p>
                  <p className="mt-1 font-mono font-medium text-zinc-300">{selectedLogDetail.ipAddress}</p>
                </div>
                <div>
                  <p className="text-zinc-500">User Agent / Perangkat</p>
                  <p className="mt-1 font-medium text-zinc-300">{selectedLogDetail.device}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-800 bg-zinc-950/80 p-4 text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLogDetail(null)}
              >
                Tutup Rincian
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      <Notification
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        duration={3000}
      />
    </div>
  );
};

export default LogAktivitas;
