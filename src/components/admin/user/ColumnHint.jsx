import React from 'react';

/**
 * ColumnHint
 * Menampilkan informasi urutan kolom yang diharapkan saat import Excel atau Copy-Paste.
 *
 * Props:
 *   role - 'siswa' | 'guru'
 */
const ColumnHint = ({ role }) => (
  <div className="p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg text-xs text-zinc-400 space-y-1.5">
    <p className="font-semibold text-zinc-200">Urutan kolom spreadsheet yang diharapkan:</p>
    <div className="p-2 bg-zinc-900 border border-zinc-800 rounded font-mono text-[11px] text-[#9eafff]">
      {role === 'siswa'
        ? 'Nama Lengkap | NISN | Kelas (cth: X-1) | Jenis Kelamin (L/P)'
        : 'Nama Lengkap | NIP | Mata Pelajaran Pengampu'}
    </div>
    <p className="text-[11px] text-zinc-500">
      Baris judul/header di baris pertama (misal: "Nama Lengkap", "NISN", dst.) akan dilewati otomatis.
    </p>
  </div>
);

export default ColumnHint;
