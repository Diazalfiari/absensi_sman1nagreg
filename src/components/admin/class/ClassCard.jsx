import React from 'react';

const ClassCard = ({ kelas, jumlahSiswa, waliKelas, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-primary-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all cursor-pointer group flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-zinc-100 group-hover:text-primary-400 transition-colors">
          {kelas}
        </h3>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800 rounded-full border border-zinc-700">
          <span className="text-sm">👥</span>
          <span className="text-sm font-medium text-zinc-300">
            {jumlahSiswa} Siswa
          </span>
        </div>
      </div>
      
      <div className="mt-auto">
        <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Wali Kelas</p>
        <p className="text-sm text-zinc-300 font-medium truncate">
          {waliKelas || <span className="text-zinc-600 italic">Belum ditentukan</span>}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-end">
        <span className="text-sm text-primary-400 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          Lihat Detail <span>→</span>
        </span>
      </div>
    </div>
  );
};

export default ClassCard;
