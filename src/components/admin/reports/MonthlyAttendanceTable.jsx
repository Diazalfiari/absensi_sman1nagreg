import React from 'react';
import { getDayName } from '../../../utils/reportHelpers';

const MonthlyAttendanceTable = ({ presensiData, daysInMonth, bulan, tahun }) => {
  return (
    <div className="overflow-hidden border-t border-zinc-800/80 bg-zinc-900/60">
      <div className="max-h-[70vh] overflow-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-[1280px] w-full border-collapse text-xs md:text-sm">
              <caption className="sr-only">Laporan presensi bulanan siswa berdasarkan tanggal dan status</caption>
              <thead className="sticky top-0 z-20">
                <tr className="bg-[#172654] text-[#eef2ff] dark:bg-[#111b3c]">
                  <th rowSpan="2" className="border border-[#30457f] px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em]">No</th>
                  <th rowSpan="2" className="border border-[#30457f] px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em]">NIPD</th>
                  <th rowSpan="2" className="border border-[#30457f] px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em]">Nama Siswa</th>
                  <th rowSpan="2" className="border border-[#30457f] px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em]">Gender</th>
                  <th colSpan={daysInMonth} className="border border-[#30457f] px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.12em]">Tanggal</th>
                  <th colSpan="5" className="border border-[#30457f] px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.12em]">Rekap</th>
                </tr>
                <tr className="border-b border-[#30457f] bg-[#eaf0ff] text-[#52628e] dark:bg-[#152143] dark:text-[#b4bfdf]">
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                    <th key={day} className="border border-[#c8d4f4] px-2 py-2 text-center text-xs dark:border-[#30457f]">
                      <div>{day.toString().padStart(2, '0')}</div>
                        <div className="text-[10px] font-normal text-zinc-500">
                        {getDayName(day, bulan, tahun).substring(0, 3)}
                      </div>
                    </th>
                  ))}
                  <th className="border border-[#c8d4f4] px-3 py-2 text-center text-xs text-emerald-700 dark:border-[#30457f] dark:text-emerald-300">H</th>
                  <th className="border border-[#c8d4f4] px-3 py-2 text-center text-xs text-amber-700 dark:border-[#30457f] dark:text-amber-300">S</th>
                  <th className="border border-[#c8d4f4] px-3 py-2 text-center text-xs text-blue-700 dark:border-[#30457f] dark:text-blue-300">I</th>
                  <th className="border border-[#c8d4f4] px-3 py-2 text-center text-xs text-rose-700 dark:border-[#30457f] dark:text-rose-300">A</th>
                  <th className="border border-[#c8d4f4] px-3 py-2 text-center text-xs dark:border-[#30457f]">%</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                {presensiData.map((siswa, index) => (
                  <tr key={siswa.id} className="border-b border-zinc-800/80 transition-colors hover:bg-[#eaf0ff]/50 dark:hover:bg-[#152143]/50">
                    <td className="border-r border-zinc-800/80 px-3 py-2 text-center text-zinc-500">{index + 1}</td>
                    <td className="border-r border-zinc-800/80 px-3 py-2 text-center text-zinc-500">{siswa.nipd}</td>
                    <td className="border-r border-zinc-800/80 px-3 py-2 font-semibold text-zinc-50">{siswa.nama}</td>
                    <td className="border-r border-zinc-800/80 px-3 py-2 text-center text-zinc-500">{siswa.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}</td>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                      const presensi = siswa.presensiPerHari[day];
                      let statusStyle = 'text-zinc-500';
                      if (presensi?.status === 'H') statusStyle = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
                      if (presensi?.status === 'S') statusStyle = 'bg-amber-500/10 text-amber-700 dark:text-amber-300';
                      if (presensi?.status === 'I') statusStyle = 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
                      if (presensi?.status === 'A') statusStyle = 'bg-rose-500/10 text-rose-700 dark:text-rose-300';

                      return (
                        <td key={day} className={`border-r border-zinc-800/80 px-2 py-2 text-center font-semibold ${statusStyle}`}>
                          {presensi?.status || '-'}
                        </td>
                      );
                    })}
                    <td className="border-r border-zinc-800/80 px-3 py-2 text-center font-semibold text-emerald-700 dark:text-emerald-300">{siswa.hadir}</td>
                    <td className="border-r border-zinc-800/80 px-3 py-2 text-center font-semibold text-amber-700 dark:text-amber-300">{siswa.sakit}</td>
                    <td className="border-r border-zinc-800/80 px-3 py-2 text-center font-semibold text-blue-700 dark:text-blue-300">{siswa.izin}</td>
                    <td className="border-r border-zinc-800/80 px-3 py-2 text-center font-semibold text-rose-700 dark:text-rose-300">{siswa.alpa}</td>
                    <td className="px-3 py-2 text-center font-semibold text-zinc-50">
                      {siswa.persentase}%
                    </td>
                  </tr>
                ))}
                
                {/* Hadir Row */}
                <tr className="bg-zinc-950 font-medium border-b border-zinc-800">
                  <td colSpan="3" className="px-3 py-2 text-center border-r border-zinc-800 text-zinc-400 uppercase text-xs">TOTAL</td>
                  <td className="px-3 py-2 text-center border-r border-zinc-800 text-emerald-400">H</td>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const dayName = getDayName(day, bulan, tahun);
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
                    const dayName = getDayName(day, bulan, tahun);
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
                    const dayName = getDayName(day, bulan, tahun);
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
                    const dayName = getDayName(day, bulan, tahun);
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
                    const dayName = getDayName(day, bulan, tahun);
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
  );
};

export default MonthlyAttendanceTable;
