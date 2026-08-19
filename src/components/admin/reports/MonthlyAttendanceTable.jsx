import React from 'react';
import { getDayName } from '../../../utils/reportHelpers';

const MonthlyAttendanceTable = ({ presensiData, daysInMonth, bulan, tahun }) => {
  return (
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
                        {getDayName(day, bulan, tahun).substring(0, 3)}
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
