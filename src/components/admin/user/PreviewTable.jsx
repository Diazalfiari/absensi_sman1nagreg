import React from 'react';

/**
 * PreviewTable
 * Menampilkan tabel preview data pengguna sebelum disimpan (bulk import).
 *
 * Props:
 *   data     - array of user objects
 *   role     - 'siswa' | 'guru'
 *   onRemove - (index: number) => void
 */
const PreviewTable = ({ data, role, onRemove }) => {
  if (!data.length) return null;

  const headers =
    role === 'siswa'
      ? ['Nama', 'Username', 'Password', 'NIS', 'Kelas', 'Jenis Kelamin']
      : ['Nama', 'Username', 'Password', 'NIP', 'Jenis Kelamin', 'Wali Kelas'];

  const formatJK = (val) => {
    if (val === 'L') return '♂ L';
    if (val === 'P') return '♀ P';
    return val || '-';
  };

  return (
    <div className="overflow-auto max-h-56 rounded-lg border border-zinc-700 mt-3">
      <table className="w-full text-xs text-left">
        <thead className="bg-zinc-800 sticky top-0">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 text-zinc-400 font-medium whitespace-nowrap">
                {h}
              </th>
            ))}
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-zinc-800/40">
              <td className="px-3 py-2 text-zinc-200">
                {row.nama || <span className="text-rose-400">-</span>}
              </td>
              <td className="px-3 py-2 text-zinc-300">{row.username || '-'}</td>
              <td className="px-3 py-2 text-zinc-500">{row.password ? '••••••' : '-'}</td>
              {role === 'siswa' ? (
                <>
                  <td className="px-3 py-2 text-zinc-300">{row.nipd || '-'}</td>
                  <td className="px-3 py-2 text-zinc-300">{row.kelas || '-'}</td>
                  <td className="px-3 py-2 text-zinc-300">{formatJK(row.jenis_kelamin)}</td>
                </>
              ) : (
                <>
                  <td className="px-3 py-2 text-zinc-300">{row.nip || '-'}</td>
                  <td className="px-3 py-2 text-zinc-300">{formatJK(row.jenis_kelamin)}</td>
                  <td className="px-3 py-2 text-zinc-300">{row.wali_kelas || '-'}</td>
                </>
              )}
              <td className="px-3 py-2">
                <button
                  onClick={() => onRemove(i)}
                  className="text-zinc-600 hover:text-rose-400 transition-colors"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PreviewTable;
