/**
 * src/utils/exportMonthlyReport.js
 * Logic untuk melakukan ekspor laporan bulanan ke format Excel menggunakan ExcelJS.
 */
import ExcelJS from 'exceljs';
import { getDayName } from './reportHelpers';

export const exportMonthlyReport = async ({
  filters,
  presensiData,
  bulanName,
  daysInMonth,
}) => {
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
