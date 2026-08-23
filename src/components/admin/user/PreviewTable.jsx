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
      ? ['Nama Lengkap', 'Username', 'Password', 'Email', 'NIPD', 'NISN', 'Kelas', 'JK', 'No HP', 'Alamat']
      : ['Nama Lengkap', 'Username', 'Password', 'Email', 'NIP', 'Mata Pelajaran', 'No HP'];

  const formatJK = (val) => {
    if (val === 'P' || val === 'Perempuan') return '♀ P';
    return '♂ L';
  };

  return (
    <div className="overflow-auto max-h-56 rounded-lg border border-zinc-700 mt-3">
      <table className="w-full text-xs text-left whitespace-nowrap">
        <thead className="bg-zinc-800 sticky top-0">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 text-zinc-400 font-medium">
                {h}
              </th>
            ))}
            <th className="px-3 py-2 text-right" />
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-zinc-800/40">
              <td className="px-3 py-2 text-zinc-200 font-medium">
                {row.nama || <span className="text-rose-400">-</span>}
              </td>
              <td className="px-3 py-2 text-zinc-300 font-mono">@{row.username || '-'}</td>
              <td className="px-3 py-2 text-zinc-400 font-mono text-[11px]">
                {row.password ? row.password : <span className="text-zinc-600">(default)</span>}
              </td>
              <td className="px-3 py-2 text-zinc-400">{row.email || '-'}</td>
              {role === 'siswa' ? (
                <>
                  <td className="px-3 py-2 text-zinc-300 font-mono">{row.nipd || '-'}</td>
                  <td className="px-3 py-2 text-zinc-300 font-mono">{row.nisn || '-'}</td>
                  <td className="px-3 py-2 text-zinc-300">{row.kelas || '-'}</td>
                  <td className="px-3 py-2 text-zinc-300">{formatJK(row.gender || row.jenis_kelamin)}</td>
                  <td className="px-3 py-2 text-zinc-300 font-mono">{row.phone || row.nomor_hp || '-'}</td>
                  <td className="px-3 py-2 text-zinc-400 max-w-[120px] truncate">{row.alamat || '-'}</td>
                </>
              ) : (
                <>
                  <td className="px-3 py-2 text-zinc-300 font-mono">{row.nip || '-'}</td>
                  <td className="px-3 py-2 text-zinc-300">{row.spesialisasi || '-'}</td>
                  <td className="px-3 py-2 text-zinc-300 font-mono">{row.phone || '-'}</td>
                </>
              )}
              <td className="px-3 py-2 text-right">
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                  title="Hapus baris ini"
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
