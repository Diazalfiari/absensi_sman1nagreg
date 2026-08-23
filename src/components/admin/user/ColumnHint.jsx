import React from 'react';

/**
 * ColumnHint
 * Menampilkan informasi urutan kolom yang diharapkan saat import Excel atau Copy-Paste.
 *
 * Props:
 *   role - 'siswa' | 'guru'
 */
const ColumnHint = ({ role }) => (
  <div className="p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg text-xs text-zinc-500 space-y-1">
    <p className="font-medium text-zinc-300">Urutan kolom spreadsheet yang diharapkan:</p>
    <p className="text-primary-400 font-mono text-[11px] leading-relaxed">
      {role === 'siswa'
        ? 'Nama Lengkap | Username | Password | Email | Nomor HP | NIPD | NISN | Kelas (cth: X-1) | Jenis Kelamin (L/P) | Alamat'
        : 'Nama Lengkap | Username | Password | Email | Nomor HP | NIP | Mata Pelajaran'}
    </p>
    <p className="text-zinc-500">Baris judul/header (opsional) akan dilewati secara otomatis.</p>
  </div>
);

export default ColumnHint;
