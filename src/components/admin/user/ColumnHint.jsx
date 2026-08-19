import React from 'react';

/**
 * ColumnHint
 * Menampilkan informasi urutan kolom yang diharapkan saat import.
 *
 * Props:
 *   role - 'siswa' | 'guru'
 */
const ColumnHint = ({ role }) => (
  <div className="p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg text-xs text-zinc-500 space-y-1">
    <p className="font-medium text-zinc-400">Urutan kolom yang diharapkan:</p>
    <p>
      {role === 'siswa'
        ? 'Nama | Username | Password | NIS | Kelas | Jenis Kelamin (L/P)'
        : 'Nama | Username | Password | NIP | Jenis Kelamin (L/P) | Wali Kelas'}
    </p>
    <p className="text-zinc-600">Baris header (opsional) akan diabaikan secara otomatis.</p>
  </div>
);

export default ColumnHint;
