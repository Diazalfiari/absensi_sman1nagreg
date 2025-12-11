import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExcelJS from 'exceljs';
import Sidebar from '../../components/common/Sidebar';
import Button from '../../components/common/Button';
import { getCurrentUser } from '../../utils/helpers';
import { dataSiswa } from '../../data/mockData';
import Footer from '../../components/common/Footer';

const LaporanBulanan = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [filters, setFilters] = useState({
    bulan: new Date().getMonth() + 1,
    tahun: new Date().getFullYear(),
    kelas: 'X-1',
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
    'X-1', 'X-2', 'X-3',
    'XI IPA 1', 'XI IPA 2', 'XI IPS 1',
    'XII IPA 1', 'XII IPA 2', 'XII IPS 1'
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const getDayName = (day, month, year) => {
    const date = new Date(year, month - 1, day);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[date.getDay()];
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: name === 'bulan' || name === 'tahun' ? parseInt(value) : value,
    }));
  };

  // Generate mock data absensi untuk setiap siswa setiap hari
  const generateAbsensiData = () => {
    const siswaList = dataSiswa[filters.kelas] || [];
    const daysInMonth = getDaysInMonth(filters.bulan, filters.tahun);
    
    return siswaList.map(siswa => {
      const absensiPerHari = {};
      const jenisKelamin = Math.random() > 0.5 ? 'Laki-laki' : 'Perempuan';
      
      let hadirCount = 0;
      let sakitCount = 0;
      let izinCount = 0;
      let alfaCount = 0;

      for (let day = 1; day <= daysInMonth; day++) {
        const dayName = getDayName(day, filters.bulan, filters.tahun);
        
        // Skip Minggu dan Sabtu
        if (dayName === 'Minggu' || dayName === 'Sabtu') {
          absensiPerHari[day] = { status: '-', color: 'bg-blue-400' };
          continue;
        }

        // Generate random status dengan bobot Hadir lebih tinggi
        const rand = Math.random();
        if (rand < 0.85) {
          absensiPerHari[day] = { status: 'H', color: 'bg-yellow-400' };
          hadirCount++;
        } else if (rand < 0.92) {
          absensiPerHari[day] = { status: 'S', color: 'bg-blue-500' };
          sakitCount++;
        } else if (rand < 0.97) {
          absensiPerHari[day] = { status: 'I', color: 'bg-purple-500' };
          izinCount++;
        } else {
          absensiPerHari[day] = { status: 'A', color: 'bg-red-500' };
          alfaCount++;
        }
      }

      const totalHari = hadirCount + sakitCount + izinCount + alfaCount;
      const persentase = totalHari > 0 ? Math.round((hadirCount / totalHari) * 100) : 0;

      return {
        ...siswa,
        jenisKelamin,
        absensiPerHari,
        hadir: hadirCount,
        sakit: sakitCount,
        izin: izinCount,
        alfa: alfaCount,
        persentase
      };
    });
  };

  const absensiData = generateAbsensiData();
  const daysInMonth = getDaysInMonth(filters.bulan, filters.tahun);
  const bulanName = bulanOptions.find(b => b.value === filters.bulan)?.label;

  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Absensi');

    // Setup kolom untuk filter
    worksheet.mergeCells('A1:D1');
    worksheet.getCell('A1').value = 'FILTER DATA';
    worksheet.getCell('A1').font = { bold: true, size: 14 };
    worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('A1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };

    // Label dan dropdown filter
    worksheet.getCell('A2').value = 'Bulan:';
    worksheet.getCell('A2').font = { bold: true };
    worksheet.getCell('B2').value = bulanName;
    worksheet.getCell('B2').dataValidation = {
      type: 'list',
      allowBlank: false,
      formulae: ['"Januari,Februari,Maret,April,Mei,Juni,Juli,Agustus,September,Oktober,November,Desember"']
    };

    worksheet.getCell('C2').value = 'Tahun:';
    worksheet.getCell('C2').font = { bold: true };
    worksheet.getCell('D2').value = filters.tahun;
    worksheet.getCell('D2').dataValidation = {
      type: 'list',
      allowBlank: false,
      formulae: ['"2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030"']
    };

    worksheet.getCell('A3').value = 'Kelas:';
    worksheet.getCell('A3').font = { bold: true };
    worksheet.getCell('B3').value = filters.kelas;
    worksheet.getCell('B3').dataValidation = {
      type: 'list',
      allowBlank: false,
      formulae: ['"X-1,X-2,X-3,XI IPA 1,XI IPA 2,XI IPS 1,XII IPA 1,XII IPA 2,XII IPS 1"']
    };

    worksheet.addRow([]);

    // Header informasi
    const headerRow = worksheet.addRow(['LAPORAN ABSENSI SISWA']);
    headerRow.font = { bold: true, size: 16 };
    headerRow.alignment = { horizontal: 'center' };
    worksheet.mergeCells(`A${headerRow.number}:D${headerRow.number}`);

    const schoolRow = worksheet.addRow(['SMA NEGERI 1 NAGREG']);
    schoolRow.font = { bold: true, size: 14 };
    schoolRow.alignment = { horizontal: 'center' };
    worksheet.mergeCells(`A${schoolRow.number}:D${schoolRow.number}`);

    const yearRow = worksheet.addRow([`TAHUN AJARAN ${filters.tahun}/${filters.tahun + 1}`]);
    yearRow.font = { bold: true };
    yearRow.alignment = { horizontal: 'center' };
    worksheet.mergeCells(`A${yearRow.number}:D${yearRow.number}`);

    worksheet.addRow([]);

    // Table header
    const tableHeaderRow1 = worksheet.addRow(['No', 'NIPD', 'Nama Siswa', 'Jenis Kelamin']);
    const daysInMonth = getDaysInMonth(filters.bulan, filters.tahun);
    
    // Add days headers
    for (let day = 1; day <= daysInMonth; day++) {
      tableHeaderRow1.getCell(4 + day).value = day.toString().padStart(2, '0');
    }
    
    // Add summary columns
    const summaryStartCol = 5 + daysInMonth;
    tableHeaderRow1.getCell(summaryStartCol).value = 'Hadir';
    tableHeaderRow1.getCell(summaryStartCol + 1).value = 'Sakit';
    tableHeaderRow1.getCell(summaryStartCol + 2).value = 'Ijin';
    tableHeaderRow1.getCell(summaryStartCol + 3).value = 'Alfa';
    tableHeaderRow1.getCell(summaryStartCol + 4).value = '% Kehadiran';

    // Style header
    tableHeaderRow1.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    tableHeaderRow1.alignment = { horizontal: 'center', vertical: 'middle' };
    tableHeaderRow1.eachCell((cell) => {
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

    // Day names row
    const tableHeaderRow2 = worksheet.addRow(['', '', '', '']);
    for (let day = 1; day <= daysInMonth; day++) {
      tableHeaderRow2.getCell(4 + day).value = getDayName(day, filters.bulan, filters.tahun).substring(0, 3);
    }
    tableHeaderRow2.font = { bold: true, size: 9 };
    tableHeaderRow2.alignment = { horizontal: 'center' };

    // Data rows
    absensiData.forEach((siswa, index) => {
      const dataRow = worksheet.addRow([
        index + 1,
        siswa.nipd,
        siswa.nama,
        siswa.jenisKelamin
      ]);

      // Add attendance status for each day
      for (let day = 1; day <= daysInMonth; day++) {
        const cell = dataRow.getCell(4 + day);
        const status = siswa.absensiPerHari[day]?.status || '-';
        cell.value = status;
        
        // Color coding
        if (status === 'H') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
        } else if (status === 'S') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0070C0' } };
        } else if (status === 'I') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7030A0' } };
        } else if (status === 'A') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF0000' } };
          cell.font = { color: { argb: 'FFFFFFFF' } };
        } else if (status === '-') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF00B0F0' } };
        }
        
        cell.alignment = { horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      }

      // Add summary
      dataRow.getCell(summaryStartCol).value = siswa.hadir;
      dataRow.getCell(summaryStartCol + 1).value = siswa.sakit;
      dataRow.getCell(summaryStartCol + 2).value = siswa.izin;
      dataRow.getCell(summaryStartCol + 3).value = siswa.alfa;
      dataRow.getCell(summaryStartCol + 4).value = `${siswa.persentase}%`;
      
      dataRow.alignment = { horizontal: 'center' };
      dataRow.eachCell((cell) => {
        if (!cell.fill) {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        }
      });
    });

    // Summary rows
    const summaryRows = [
      { label: 'TOTAL - Hadir', calc: (day) => absensiData.filter(s => s.absensiPerHari[day]?.status === 'H').length },
      { label: 'Sakit', calc: (day) => absensiData.filter(s => s.absensiPerHari[day]?.status === 'S').length },
      { label: 'Ijin', calc: (day) => absensiData.filter(s => s.absensiPerHari[day]?.status === 'I').length },
      { label: 'Alfa', calc: (day) => absensiData.filter(s => s.absensiPerHari[day]?.status === 'A').length },
      { label: '% Kehadiran', calc: (day) => {
        const hadir = absensiData.filter(s => s.absensiPerHari[day]?.status === 'H').length;
        const aktif = absensiData.filter(s => {
          const status = s.absensiPerHari[day]?.status;
          return status && status !== '-';
        }).length;
        return aktif > 0 ? `${Math.round((hadir / aktif) * 100)}%` : '-';
      }}
    ];

    summaryRows.forEach((summary, idx) => {
      const summaryRow = worksheet.addRow(['', '', idx === 0 ? 'TOTAL' : '', summary.label]);
      summaryRow.font = { bold: true };
      
      for (let day = 1; day <= daysInMonth; day++) {
        const dayName = getDayName(day, filters.bulan, filters.tahun);
        const cell = summaryRow.getCell(4 + day);
        
        if (dayName === 'Minggu' || dayName === 'Sabtu') {
          cell.value = '-';
        } else {
          cell.value = summary.calc(day);
        }
        
        cell.alignment = { horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      }
    });

    // Set column widths
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 12;
    worksheet.getColumn(3).width = 25;
    worksheet.getColumn(4).width = 12;
    
    for (let i = 0; i < daysInMonth; i++) {
      worksheet.getColumn(5 + i).width = 4;
    }
    
    worksheet.getColumn(summaryStartCol).width = 8;
    worksheet.getColumn(summaryStartCol + 1).width = 8;
    worksheet.getColumn(summaryStartCol + 2).width = 8;
    worksheet.getColumn(summaryStartCol + 3).width = 8;
    worksheet.getColumn(summaryStartCol + 4).width = 12;

    // Generate and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_Absensi_${filters.kelas}_${bulanName}_${filters.tahun}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink-950 via-ink-900 to-primary-950">
      <Sidebar role="admin" />
      
      <div className="lg:ml-64 p-4 md:py-6 md:pr-6 md:pl-10 lg:py-8 lg:pr-8 lg:pl-14">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white mb-2">
            Laporan Absensi Bulanan
          </h1>
          <p className="text-sm md:text-base text-white/60">Laporan detail kehadiran siswa per bulan</p>
        </div>

        {/* Filter Section */}
        <div className="glass-panel p-4 md:p-6 mb-4 md:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/60 mb-2">
                Bulan
              </label>
              <select
                name="bulan"
                value={filters.bulan}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white dark-select focus:outline-none focus:border-primary-400/50"
              >
                {bulanOptions.map(bulan => (
                  <option key={bulan.value} value={bulan.value}>
                    {bulan.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/60 mb-2">
                Tahun
              </label>
              <input
                type="number"
                name="tahun"
                value={filters.tahun}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-400/50"
                min="2020"
                max="2030"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/60 mb-2">
                Kelas
              </label>
              <select
                name="kelas"
                value={filters.kelas}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white dark-select focus:outline-none focus:border-primary-400/50"
              >
                {kelasOptions.map(kelas => (
                  <option key={kelas} value={kelas}>
                    {kelas}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="primary"
                onClick={handleExportExcel}
                className="w-full"
              >
                Export Excel
              </Button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <table className="w-full text-xs md:text-sm border-collapse min-w-max">
              <thead>
                <tr className="bg-gradient-to-r from-primary-700/80 via-primary-500/80 to-accent-500/70 text-white">
                  <th rowSpan="2" className="px-3 py-3 text-center text-xs font-semibold uppercase border border-white/20">No</th>
                  <th rowSpan="2" className="px-3 py-3 text-center text-xs font-semibold uppercase border border-white/20">NIPD</th>
                  <th rowSpan="2" className="px-3 py-3 text-left text-xs font-semibold uppercase border border-white/20">Nama Siswa</th>
                  <th rowSpan="2" className="px-3 py-3 text-center text-xs font-semibold uppercase border border-white/20">Jenis Kelamin</th>
                  <th colSpan={daysInMonth} className="px-3 py-2 text-center text-xs font-semibold uppercase border border-white/20">Tanggal</th>
                  <th colSpan="5" className="px-3 py-2 text-center text-xs font-semibold uppercase border border-white/20">Rekap Absensi</th>
                </tr>
                <tr className="bg-gradient-to-r from-primary-700/80 via-primary-500/80 to-accent-500/70 text-white">
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                    <th key={day} className="px-2 py-2 text-center text-xs border border-white/20">
                      <div>{day.toString().padStart(2, '0')}</div>
                      <div className="text-[10px] font-normal">
                        {getDayName(day, filters.bulan, filters.tahun).substring(0, 3)}
                      </div>
                    </th>
                  ))}
                  <th className="px-3 py-2 text-center text-xs border border-white/20">Hadir</th>
                  <th className="px-3 py-2 text-center text-xs border border-white/20">Sakit</th>
                  <th className="px-3 py-2 text-center text-xs border border-white/20">Ijin</th>
                  <th className="px-3 py-2 text-center text-xs border border-white/20">Alfa</th>
                  <th className="px-3 py-2 text-center text-xs border border-white/20">% Kehadiran</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {absensiData.map((siswa, index) => (
                  <tr key={siswa.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-3 py-2 text-center border border-white/10">{index + 1}</td>
                    <td className="px-3 py-2 text-center border border-white/10">{siswa.nipd}</td>
                    <td className="px-3 py-2 border border-white/10">{siswa.nama}</td>
                    <td className="px-3 py-2 text-center border border-white/10">{siswa.jenisKelamin}</td>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                      const absensi = siswa.absensiPerHari[day];
                      return (
                        <td key={day} className={`px-2 py-2 text-center border border-white/10 ${absensi?.color || ''} font-bold`}>
                          {absensi?.status || '-'}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 text-center border border-white/10 bg-yellow-400/20 font-semibold">{siswa.hadir}</td>
                    <td className="px-3 py-2 text-center border border-white/10 bg-blue-500/20 font-semibold">{siswa.sakit}</td>
                    <td className="px-3 py-2 text-center border border-white/10 bg-purple-500/20 font-semibold">{siswa.izin}</td>
                    <td className="px-3 py-2 text-center border border-white/10 bg-red-500/20 font-semibold">{siswa.alfa}</td>
                    <td className={`px-3 py-2 text-center border border-white/10 font-semibold ${
                      siswa.persentase >= 90 ? 'bg-green-500/20 text-green-200' :
                      siswa.persentase >= 80 ? 'bg-yellow-400/20 text-yellow-200' :
                      'bg-red-500/20 text-red-200'
                    }`}>
                      {siswa.persentase}%
                    </td>
                  </tr>
                ))}
                
                {/* Hadir Row */}
                <tr className="bg-yellow-400/20 font-semibold">
                  <td colSpan="3" className="px-3 py-2 text-center border border-white/20 uppercase">TOTAL</td>
                  <td className="px-3 py-2 text-center border border-white/20">Hadir</td>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const dayName = getDayName(day, filters.bulan, filters.tahun);
                    if (dayName === 'Minggu' || dayName === 'Sabtu') {
                      return <td key={day} className="px-2 py-2 text-center border border-white/20 bg-blue-400/20">-</td>;
                    }
                    
                    const totalHadirPerHari = absensiData.filter(siswa => 
                      siswa.absensiPerHari[day]?.status === 'H'
                    ).length;
                    
                    return (
                      <td key={day} className="px-2 py-2 text-center border border-white/20">
                        {totalHadirPerHari}
                      </td>
                    );
                  })}
                  {/* <td className="px-3 py-2 text-center border border-white/20">
                    {absensiData.reduce((sum, siswa) => sum + siswa.hadir, 0)}
                  </td>
                  <td colSpan="4" className="px-3 py-2 border border-white/20"></td> */}
                </tr>

                {/* Sakit Row */}
                <tr className="bg-blue-500/20 font-semibold">
                  <td colSpan="3" className="px-3 py-2 border border-white/20"></td>
                  <td className="px-3 py-2 text-center border border-white/20">Sakit</td>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const dayName = getDayName(day, filters.bulan, filters.tahun);
                    if (dayName === 'Minggu' || dayName === 'Sabtu') {
                      return <td key={day} className="px-2 py-2 text-center border border-white/20 bg-blue-400/20">-</td>;
                    }
                    
                    const totalSakitPerHari = absensiData.filter(siswa => 
                      siswa.absensiPerHari[day]?.status === 'S'
                    ).length;
                    
                    return (
                      <td key={day} className="px-2 py-2 text-center border border-white/20">
                        {totalSakitPerHari}
                      </td>
                    );
                  })}
                  {/* <td className="px-3 py-2 border border-white/20"></td>
                  <td className="px-3 py-2 text-center border border-white/20">
                    {absensiData.reduce((sum, siswa) => sum + siswa.sakit, 0)}
                  </td>
                  <td colSpan="3" className="px-3 py-2 border border-white/20"></td> */}
                </tr>

                {/* Ijin Row */}
                <tr className="bg-purple-500/20 font-semibold">
                  <td colSpan="3" className="px-3 py-2 border border-white/20"></td>
                  <td className="px-3 py-2 text-center border border-white/20">Ijin</td>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const dayName = getDayName(day, filters.bulan, filters.tahun);
                    if (dayName === 'Minggu' || dayName === 'Sabtu') {
                      return <td key={day} className="px-2 py-2 text-center border border-white/20 bg-blue-400/20">-</td>;
                    }
                    
                    const totalIzinPerHari = absensiData.filter(siswa => 
                      siswa.absensiPerHari[day]?.status === 'I'
                    ).length;
                    
                    return (
                      <td key={day} className="px-2 py-2 text-center border border-white/20">
                        {totalIzinPerHari}
                      </td>
                    );
                  })}
                  {/* <td colSpan="2" className="px-3 py-2 border border-white/20"></td>
                  <td className="px-3 py-2 text-center border border-white/20">
                    {absensiData.reduce((sum, siswa) => sum + siswa.izin, 0)}
                  </td>
                  <td colSpan="2" className="px-3 py-2 border border-white/20"></td> */}
                </tr>

                {/* Alfa Row */}
                <tr className="bg-red-500/20 font-semibold">
                  <td colSpan="3" className="px-3 py-2 border border-white/20"></td>
                  <td className="px-3 py-2 text-center border border-white/20">Alfa</td>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const dayName = getDayName(day, filters.bulan, filters.tahun);
                    if (dayName === 'Minggu' || dayName === 'Sabtu') {
                      return <td key={day} className="px-2 py-2 text-center border border-white/20 bg-blue-400/20">-</td>;
                    }
                    
                    const totalAlfaPerHari = absensiData.filter(siswa => 
                      siswa.absensiPerHari[day]?.status === 'A'
                    ).length;
                    
                    return (
                      <td key={day} className="px-2 py-2 text-center border border-white/20">
                        {totalAlfaPerHari}
                      </td>
                    );
                  })}
                  {/* <td colSpan="3" className="px-3 py-2 border border-white/20"></td>
                  <td className="px-3 py-2 text-center border border-white/20">
                    {absensiData.reduce((sum, siswa) => sum + siswa.alfa, 0)}
                  </td>
                  <td className="px-3 py-2 border border-white/20"></td> */}
                </tr>

                {/* % Kehadiran Row */}
                <tr className="bg-white/20 font-semibold">
                  <td colSpan="3" className="px-3 py-2 border border-white/20"></td>
                  <td className="px-3 py-2 text-center border border-white/20">% Kehadiran</td>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const dayName = getDayName(day, filters.bulan, filters.tahun);
                    if (dayName === 'Minggu' || dayName === 'Sabtu') {
                      return <td key={day} className="px-2 py-2 text-center border border-white/20 bg-blue-400/20">-</td>;
                    }
                    
                    const totalHadirPerHari = absensiData.filter(siswa => 
                      siswa.absensiPerHari[day]?.status === 'H'
                    ).length;
                    const totalSiswaAktifPerHari = absensiData.filter(siswa => {
                      const status = siswa.absensiPerHari[day]?.status;
                      return status && status !== '-';
                    }).length;
                    
                    const persentasePerHari = totalSiswaAktifPerHari > 0 ? 
                      Math.round((totalHadirPerHari / totalSiswaAktifPerHari) * 100) : 0;
                    
                    return (
                      <td key={day} className="px-2 py-2 text-center border border-white/20">
                        {persentasePerHari}%
                      </td>
                    );
                  })}
                  {/* <td colSpan="4" className="px-3 py-2 border border-white/20"></td>
                  <td className="px-3 py-2 text-center border border-white/20">
                    {absensiData.length > 0 ? 
                      Math.round(
                        absensiData.reduce((sum, siswa) => sum + siswa.persentase, 0) / absensiData.length
                      ) : 0
                    }%
                  </td> */}
                </tr>
              </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Keterangan */}
        <div className="glass-panel p-4 md:p-6 mt-4 md:mt-6">
          <h3 className="text-white font-semibold mb-3 md:mb-4 text-sm md:text-base">Keterangan:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-xs md:text-sm text-white/80">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center font-bold text-black">H</span>
              <span>= Hadir</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-white">S</span>
              <span>= Sakit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center font-bold text-white">I</span>
              <span>= Ijin</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-red-500 rounded flex items-center justify-center font-bold text-white">A</span>
              <span>= Alfa</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LaporanBulanan;
