import React from 'react';

/**
 * PreviewTable
 * Menampilkan tabel preview data pengguna sebelum disimpan (bulk import / paste).
 *
 * Props:
 *   data     - array of user objects
 *   role     - 'siswa' | 'guru'
 *   onRemove - (index: number) => void
 */
const PreviewTable = ({ data, role, onRemove }) => {
  if (!data || !data.length) return null;

  const headers =
    role === 'siswa'
      ? ['No', 'Nama Lengkap', 'NISN', 'Kelas', 'Jenis Kelamin', 'Aksi']
      : ['No', 'Nama Lengkap', 'NIP', 'Mata Pelajaran Pengampu', 'Aksi'];

  const formatJK = (val) => {
    if (!val) return <span className="text-rose-400">Kosong</span>;
    const upper = String(val).toUpperCase();
    if (upper === 'P' || upper === 'PEREMPUAN') return '♀ Perempuan';
    if (upper === 'L' || upper === 'LAKI-LAKI') return '♂ Laki-laki';
    return <span className="text-rose-400">{val} (Invalid)</span>;
  };

  return (
    <div className="overflow-auto max-h-56 rounded-lg border border-zinc-800 bg-zinc-950 mt-2">
      <table className="w-full text-xs text-left whitespace-nowrap">
        <thead className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10 shadow-sm">
          <tr>
            {headers.map((h, i) => (
              <th
                key={h}
                className={`px-3 py-2.5 text-zinc-400 font-semibold ${
                  i === 0 ? 'text-center w-12' : i === headers.length - 1 ? 'text-right w-16' : ''
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-850">
          {data.map((row, i) => {
            const hasError =
              role === 'siswa'
                ? !row.nama || !row.nisn || !row.kelas || !row.gender
                : !row.nama || !row.nip || !row.spesialisasi;

            return (
              <tr
                key={i}
                className={`transition-colors ${
                  hasError ? 'bg-rose-950/20 hover:bg-rose-950/30' : 'hover:bg-zinc-900/60'
                }`}
              >
                <td className="px-3 py-2 text-center text-zinc-500 font-mono">{i + 1}</td>
                <td className="px-3 py-2 text-zinc-200 font-medium">
                  {row.nama ? (
                    row.nama
                  ) : (
                    <span className="text-rose-400 italic">Nama tidak boleh kosong</span>
                  )}
                </td>

                {role === 'siswa' ? (
                  <>
                    <td className="px-3 py-2 text-zinc-300 font-mono">
                      {row.nisn ? (
                        row.nisn
                      ) : (
                        <span className="text-rose-400 italic">NISN tidak boleh kosong</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-zinc-300">
                      {row.kelas ? (
                        <span className="inline-block px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-medium text-[11px]">
                          {row.kelas}
                        </span>
                      ) : (
                        <span className="text-rose-400 italic">Kelas kosong</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-zinc-300">{formatJK(row.gender)}</td>
                  </>
                ) : (
                  <>
                    <td className="px-3 py-2 text-zinc-300 font-mono">
                      {row.nip ? (
                        row.nip
                      ) : (
                        <span className="text-rose-400 italic">NIP tidak boleh kosong</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-zinc-300">
                      {row.spesialisasi ? (
                        <span className="inline-block px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-medium text-[11px]">
                          {row.spesialisasi}
                        </span>
                      ) : (
                        <span className="text-rose-400 italic">Mata pelajaran kosong</span>
                      )}
                    </td>
                  </>
                )}

                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    className="text-zinc-500 hover:text-rose-400 transition-colors px-2 py-1 rounded hover:bg-rose-500/10"
                    title="Hapus baris ini"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PreviewTable;
