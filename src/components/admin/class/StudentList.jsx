import React from 'react';

const StudentList = ({ students, onMutate }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-zinc-400 bg-zinc-950/50 uppercase border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4 font-medium">No</th>
              <th className="px-6 py-4 font-medium">Nama Siswa</th>
              <th className="px-6 py-4 font-medium">NIPD / NISN</th>
              <th className="px-6 py-4 font-medium">L/P</th>
              <th className="px-6 py-4 font-medium">Kontak (Email / No. HP)</th>
              <th className="px-6 py-4 font-medium">Alamat</th>
              <th className="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {students && students.length > 0 ? (
              students.map((student, index) => (
                <tr key={student.id || index} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{index + 1}</td>
                  
                  {/* Nama & Username */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-100">{student.nama}</div>
                    {student.username && (
                      <div className="text-xs text-zinc-500 font-mono">@{student.username}</div>
                    )}
                  </td>

                  {/* NIPD & NISN */}
                  <td className="px-6 py-4">
                    <div className="font-mono text-zinc-200 text-xs font-semibold">{student.nipd || '-'}</div>
                    {student.nisn && (
                      <div className="text-[11px] text-zinc-500 font-mono">NISN: {student.nisn}</div>
                    )}
                  </td>

                  {/* Gender */}
                  <td className="px-6 py-4 text-xs">
                    {student.gender === 'P' ? (
                      <span className="text-pink-400 font-medium">♀ Perempuan</span>
                    ) : (
                      <span className="text-sky-400 font-medium">♂ Laki-laki</span>
                    )}
                  </td>

                  {/* Kontak */}
                  <td className="px-6 py-4 text-xs">
                    <div className="text-zinc-300">{student.email || '-'}</div>
                    {student.phone && <div className="text-zinc-500 font-mono mt-0.5">{student.phone}</div>}
                  </td>

                  {/* Alamat */}
                  <td className="px-6 py-4 text-xs text-zinc-400 max-w-[200px] truncate" title={student.alamat || ''}>
                    {student.alamat || '-'}
                  </td>

                  {/* Aksi */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <button
                        onClick={() => onMutate && onMutate(student)}
                        className="px-3 py-1.5 text-xs text-zinc-300 hover:text-primary-400 transition-colors bg-zinc-800 rounded-md border border-zinc-700 hover:border-primary-500/30"
                      >
                        Pindah Kelas
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-zinc-500">
                  Belum ada siswa yang terdaftar di kelas ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
