import React from 'react';

const StudentList = ({ students, onRemove }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-zinc-400 bg-zinc-950/50 uppercase border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4 font-medium">No</th>
              <th className="px-6 py-4 font-medium">NIPD/NIS</th>
              <th className="px-6 py-4 font-medium">Nama Siswa</th>
              <th className="px-6 py-4 font-medium">Kelas</th>
              <th className="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {students && students.length > 0 ? (
              students.map((student, index) => (
                <tr key={student.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 text-zinc-400">{index + 1}</td>
                  <td className="px-6 py-4 text-zinc-400">{student.nipd}</td>
                  <td className="px-6 py-4 font-medium text-zinc-100">{student.nama}</td>
                  <td className="px-6 py-4 text-zinc-400">
                    <span className="px-2 py-1 bg-zinc-800 rounded text-xs border border-zinc-700">
                      {student.kelas || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <button
                        onClick={() => onRemove(student)}
                        className="px-3 py-1.5 text-xs text-zinc-400 hover:text-rose-400 transition-colors bg-zinc-800 rounded-md border border-zinc-700 hover:border-rose-500/30"
                      >
                        Hapus dari Kelas
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-zinc-500">
                  Tidak ada siswa di kelas ini.
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
