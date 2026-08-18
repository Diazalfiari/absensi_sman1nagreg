import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExcelJS from 'exceljs';
import Sidebar from '../../components/common/Sidebar';
import Button from '../../components/common/Button';
import { getCurrentUser } from '../../utils/helpers';
import { dataSiswa, dataMapel } from '../../data/mockData';
import Footer from '../../components/common/Footer';

const LaporanBulanan = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [filters, setFilters] = useState({
    bulan: new Date().getMonth() + 1,
    tahun: new Date().getFullYear(),
    kelas: 'X-1',
    mataPelajaran: 'Matematika',
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

  // Generate mock data presensi untuk setiap siswa setiap hari
  const generatePresensiData = () => {
    const siswaList = dataSiswa[filters.kelas] || [];
    const daysInMonth = getDaysInMonth(filters.bulan, filters.tahun);
    
    return siswaList.map(siswa => {
      const presensiPerHari = {};
      const jenisKelamin = Math.random() > 0.5 ? 'Laki-laki' : 'Perempuan';
      
      let hadirCount = 0;
      let sakitCount = 0;
      let izinCount = 0;
      let alpaCount = 0;

      for (let day = 1; day <= daysInMonth; day++) {
        const dayName = getDayName(day, filters.bulan, filters.tahun);
        
        // Skip Minggu dan Sabtu
        if (dayName === 'Minggu' || dayName === 'Sabtu') {
          presensiPerHari[day] = { status: '-', color: 'bg-blue-400' };
          continue;
        }

        // Generate random status dengan bobot Hadir lebih tinggi
        const rand = Math.random();
        if (rand < 0.85) {
          presensiPerHari[day] = { status: 'H', color: 'bg-yellow-400' };
          hadirCount++;
        } else if (rand < 0.92) {
          presensiPerHari[day] = { status: 'S', color: 'bg-blue-500' };
          sakitCount++;
        } else if (rand < 0.97) {
          presensiPerHari[day] = { status: 'I', color: 'bg-purple-500' };
          izinCount++;
        } else {
          presensiPerHari[day] = { status: 'A', color: 'bg-red-500' };
          alpaCount++;
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

  const presensiData = generatePresensiData();
  const daysInMonth = getDaysInMonth(filters.bulan, filters.tahun);
  const bulanName = bulanOptions.find(b => b.value === filters.bulan)?.label;

  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Presensi');

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

    worksheet.getCell('C3').value = 'Mata Pelajaran:';
    worksheet.getCell('C3').font = { bold: true };
    worksheet.getCell('D3').value = filters.mataPelajaran;

    worksheet.addRow([]);

    // Header informasi
    const headerRow = worksheet.addRow(['LAPORAN PRESENSI SISWA']);
    headerRow.font = { bold: true, size: 16 };
    headerRow.alignment = { horizontal: 'center' };
    worksheet.mergeCells(`A${headerRow.number}:D${headerRow.number}`);

    const schoolRow = worksheet.addRow(['SMA NEGERI 1 NAGREG']);
    schoolRow.font = { bold: true, size: 14 };
    schoolRow.alignment = { horizontal: 'center' };
    worksheet.mergeCells(`A${schoolRow.number}:D${schoolRow.number}`);

    const mapelRow = worksheet.addRow([filters.mataPelajaran]);
    mapelRow.font = { bold: true, size: 12 };
    mapelRow.alignment = { horizontal: 'center' };
    worksheet.mergeCells(`A${mapelRow.number}:D${mapelRow.number}`);

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
    tableHeaderRow1.getCell(summaryStartCol + 3).value = 'alpa';
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
    presensiData.forEach((siswa, index) => {
      const dataRow = worksheet.addRow([
        index + 1,
        siswa.nipd,
        siswa.nama,
        siswa.jenisKelamin
      ]);

      // Add attendance status for each day
      for (let day = 1; day <= daysInMonth; day++) {
        const cell = dataRow.getCell(4 + day);
        const status = siswa.presensiPerHari[day]?.status || '-';
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
      dataRow.getCell(summaryStartCol + 3).value = siswa.alpa;
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
      { label: 'TOTAL - Hadir', calc: (day) => presensiData.filter(s => s.presensiPerHari[day]?.status === 'H').length },
      { label: 'Sakit', calc: (day) => presensiData.filter(s => s.presensiPerHari[day]?.status === 'S').length },
      { label: 'Ijin', calc: (day) => presensiData.filter(s => s.presensiPerHari[day]?.status === 'I').length },
      { label: 'alpa', calc: (day) => presensiData.filter(s => s.presensiPerHari[day]?.status === 'A').length },
      { label: '% Kehadiran', calc: (day) => {
        const hadir = presensiData.filter(s => s.presensiPerHari[day]?.status === 'H').length;
        const aktif = presensiData.filter(s => {
          const status = s.presensiPerHari[day]?.status;
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
    link.download = `Laporan_Presensi_${filters.mataPelajaran}_${filters.kelas}_${bulanName}_${filters.tahun}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
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

        {/* Filter Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Bulan
              </label>
              <select
                name="bulan"
                value={filters.bulan}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-50 dark-select focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              >
                {bulanOptions.map(bulan => (
                  <option key={bulan.value} value={bulan.value}>
                    {bulan.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Tahun
              </label>
              <input
                type="number"
                name="tahun"
                value={filters.tahun}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-50 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                min="2020"
                max="2030"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Kelas
              </label>
              <select
                name="kelas"
                value={filters.kelas}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-50 dark-select focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              >
                {kelasOptions.map(kelas => (
                  <option key={kelas} value={kelas}>
                    {kelas}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Mata Pelajaran
              </label>
              <select
                name="mataPelajaran"
                value={filters.mataPelajaran}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-50 dark-select focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              >
                {dataMapel.map(mapel => (
                  <option key={mapel.id} value={mapel.nama}>
                    {mapel.nama}
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

        {/* Info Box - Active Filter */}
        <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4 mb-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-300">
            <span className="font-medium text-zinc-50">Menampilkan:</span>
            <span className="bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-lg whitespace-nowrap">{filters.mataPelajaran}</span>
            <span className="bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-lg whitespace-nowrap">{filters.kelas}</span>
            <span className="bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-lg whitespace-nowrap">{bulanName} {filters.tahun}</span>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <table className="w-full text-xs md:text-sm border-collapse min-w-max">
              <thead>
                <tr className="bg-zinc-950 text-zinc-300">
                  <th rowSpan="2" className="px-3 py-3 text-center text-xs font-medium uppercase border border-zinc-800">No</th>
                  <th rowSpan="2" className="px-3 py-3 text-center text-xs font-medium uppercase border border-zinc-800">NIPD</th>
                  <th rowSpan="2" className="px-3 py-3 text-left text-xs font-medium uppercase border border-zinc-800">Nama Siswa</th>
                  <th rowSpan="2" className="px-3 py-3 text-center text-xs font-medium uppercase border border-zinc-800">Gender</th>
                  <th colSpan={daysInMonth} className="px-3 py-2 text-center text-xs font-medium uppercase border border-zinc-800">Tanggal</th>
                  <th colSpan="5" className="px-3 py-2 text-center text-xs font-medium uppercase border border-zinc-800">Rekap</th>
                </tr>
                <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800">
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                    <th key={day} className="px-2 py-2 text-center text-xs border border-zinc-800">
                      <div>{day.toString().padStart(2, '0')}</div>
                      <div className="text-[10px] font-normal text-zinc-500">
                        {getDayName(day, filters.bulan, filters.tahun).substring(0, 3)}
                      </div>
                    </th>
                  ))}
                  <th className="px-3 py-2 text-center text-xs border border-zinc-800 text-emerald-400">H</th>
                  <th className="px-3 py-2 text-center text-xs border border-zinc-800 text-amber-400">S</th>
                  <th className="px-3 py-2 text-center text-xs border border-zinc-800 text-accent-400">I</th>
                  <th className="px-3 py-2 text-center text-xs border border-zinc-800 text-rose-400">A</th>
                  <th className="px-3 py-2 text-center text-xs border border-zinc-800">%</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                {presensiData.map((siswa, index) => (
                  <tr key={siswa.id} className="hover:bg-zinc-900 transition-colors border-b border-zinc-800">
                    <td className="px-3 py-2 text-center border-r border-zinc-800">{index + 1}</td>
                    <td className="px-3 py-2 text-center border-r border-zinc-800 text-zinc-400">{siswa.nipd}</td>
                    <td className="px-3 py-2 border-r border-zinc-800 font-medium text-zinc-50">{siswa.nama}</td>
                    <td className="px-3 py-2 text-center border-r border-zinc-800">{siswa.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}</td>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                      const presensi = siswa.presensiPerHari[day];
                      let textColor = '';
                      if (presensi?.status === 'H') textColor = 'text-emerald-400';
                      if (presensi?.status === 'S') textColor = 'text-amber-400';
                      if (presensi?.status === 'I') textColor = 'text-accent-400';
                      if (presensi?.status === 'A') textColor = 'text-rose-400';
                      if (presensi?.status === '-') textColor = 'text-zinc-600';

                      return (
                        <td key={day} className={`px-2 py-2 text-center border-r border-zinc-800 ${textColor} font-medium`}>
                          {presensi?.status || '-'}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 text-center border-r border-zinc-800 text-emerald-400">{siswa.hadir}</td>
                    <td className="px-3 py-2 text-center border-r border-zinc-800 text-amber-400">{siswa.sakit}</td>
                    <td className="px-3 py-2 text-center border-r border-zinc-800 text-accent-400">{siswa.izin}</td>
                    <td className="px-3 py-2 text-center border-r border-zinc-800 text-rose-400">{siswa.alpa}</td>
                    <td className="px-3 py-2 text-center font-medium text-zinc-50">
                      {siswa.persentase}%
                    </td>
                  </tr>
                ))}
                
                {/* Hadir Row */}
                <tr className="bg-zinc-950 font-medium border-b border-zinc-800">
                  <td colSpan="3" className="px-3 py-2 text-center border-r border-zinc-800 text-zinc-400 uppercase text-xs">TOTAL</td>
                  <td className="px-3 py-2 text-center border-r border-zinc-800 text-emerald-400">H</td>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const dayName = getDayName(day, filters.bulan, filters.tahun);
                    if (dayName === 'Minggu' || dayName === 'Sabtu') {
                      return <td key={day} className="px-2 py-2 text-center border-r border-zinc-800 text-zinc-600">-</td>;
                    }
                    
                    const totalHadirPerHari = presensiData.filter(siswa => 
                      siswa.presensiPerHari[day]?.status === 'H'
                    ).length;
                    
                    return (
                      <td key={day} className="px-2 py-2 text-center border-r border-zinc-800 text-emerald-400">
                        {totalHadirPerHari}
                      </td>
                    );
                  })}
                </tr>

                {/* Sakit Row */}
                <tr className="bg-zinc-950 font-medium border-b border-zinc-800">
                  <td colSpan="3" className="px-3 py-2 border-r border-zinc-800"></td>
                  <td className="px-3 py-2 text-center border-r border-zinc-800 text-amber-400">S</td>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const dayName = getDayName(day, filters.bulan, filters.tahun);
                    if (dayName === 'Minggu' || dayName === 'Sabtu') {
                      return <td key={day} className="px-2 py-2 text-center border-r border-zinc-800 text-zinc-600">-</td>;
                    }
                    
                    const totalSakitPerHari = presensiData.filter(siswa => 
                      siswa.presensiPerHari[day]?.status === 'S'
                    ).length;
                    
                    return (
                      <td key={day} className="px-2 py-2 text-center border-r border-zinc-800 text-amber-400">
                        {totalSakitPerHari}
                      </td>
                    );
                  })}
                </tr>

                {/* Ijin Row */}
                <tr className="bg-zinc-950 font-medium border-b border-zinc-800">
                  <td colSpan="3" className="px-3 py-2 border-r border-zinc-800"></td>
                  <td className="px-3 py-2 text-center border-r border-zinc-800 text-accent-400">I</td>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const dayName = getDayName(day, filters.bulan, filters.tahun);
                    if (dayName === 'Minggu' || dayName === 'Sabtu') {
                      return <td key={day} className="px-2 py-2 text-center border-r border-zinc-800 text-zinc-600">-</td>;
                    }
                    
                    const totalIzinPerHari = presensiData.filter(siswa => 
                      siswa.presensiPerHari[day]?.status === 'I'
                    ).length;
                    
                    return (
                      <td key={day} className="px-2 py-2 text-center border-r border-zinc-800 text-accent-400">
                        {totalIzinPerHari}
                      </td>
                    );
                  })}
                </tr>

                {/* Alpa Row */}
                <tr className="bg-zinc-950 font-medium border-b border-zinc-800">
                  <td colSpan="3" className="px-3 py-2 border-r border-zinc-800"></td>
                  <td className="px-3 py-2 text-center border-r border-zinc-800 text-rose-400">A</td>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const dayName = getDayName(day, filters.bulan, filters.tahun);
                    if (dayName === 'Minggu' || dayName === 'Sabtu') {
                      return <td key={day} className="px-2 py-2 text-center border-r border-zinc-800 text-zinc-600">-</td>;
                    }
                    
                    const totalalpaPerHari = presensiData.filter(siswa => 
                      siswa.presensiPerHari[day]?.status === 'A'
                    ).length;
                    
                    return (
                      <td key={day} className="px-2 py-2 text-center border-r border-zinc-800 text-rose-400">
                        {totalalpaPerHari}
                      </td>
                    );
                  })}
                </tr>

                {/* % Kehadiran Row */}
                <tr className="bg-zinc-900 font-medium">
                  <td colSpan="3" className="px-3 py-2 border-r border-zinc-800"></td>
                  <td className="px-3 py-2 text-center border-r border-zinc-800 text-zinc-50">%</td>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const dayName = getDayName(day, filters.bulan, filters.tahun);
                    if (dayName === 'Minggu' || dayName === 'Sabtu') {
                      return <td key={day} className="px-2 py-2 text-center border-r border-zinc-800 text-zinc-600">-</td>;
                    }
                    
                    const totalHadirPerHari = presensiData.filter(siswa => 
                      siswa.presensiPerHari[day]?.status === 'H'
                    ).length;
                    const totalSiswaAktifPerHari = presensiData.filter(siswa => {
                      const status = siswa.presensiPerHari[day]?.status;
                      return status && status !== '-';
                    }).length;
                    
                    const persentasePerHari = totalSiswaAktifPerHari > 0 ? 
                      Math.round((totalHadirPerHari / totalSiswaAktifPerHari) * 100) : 0;
                    
                    return (
                      <td key={day} className="px-2 py-2 text-center border-r border-zinc-800 text-zinc-50">
                        {persentasePerHari}%
                      </td>
                    );
                  })}
                </tr>
              </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

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
