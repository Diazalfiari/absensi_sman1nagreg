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
              <th className="px-6 py-4 font-medium">NISN</th>
              <th className="px-6 py-4 font-medium">Jenis Kelamin</th>
              <th className="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {students && students.length > 0 ? (
              students.map((student, index) => (
                <tr key={student.id || index} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{index + 1}</td>
                  
                  {/* Nama Siswa */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-100">{student.nama}</div>
                  </td>

                  {/* NISN */}
                  <td className="px-6 py-4">
                    <span className="font-mono text-zinc-200 text-xs font-semibold bg-zinc-800/60 px-2.5 py-1 rounded border border-zinc-700/60">
                      {student.nisn || '-'}
                    </span>
                  </td>

                  {/* Jenis Kelamin */}
                  <td className="px-6 py-4 text-xs">
                    {student.gender === 'P' ? (
                      <span className="text-pink-400 font-medium">♀ Perempuan</span>
                    ) : (
                      <span className="text-sky-400 font-medium">♂ Laki-laki</span>
                    )}
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
                <td colSpan="5" className="px-6 py-12 text-center text-zinc-500">
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
