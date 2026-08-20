import React from 'react';

const ClassCard = ({ kelas, jumlahSiswa, waliKelas, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[218px] w-full flex-col rounded-2xl border border-zinc-800/80 bg-zinc-900 p-5 text-left shadow-[0_12px_40px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-[#9eafff] hover:shadow-[0_18px_45px_rgba(41,67,143,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#29438f] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Ruang kelas</p>
          <h3 className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em] text-zinc-50 transition-colors group-hover:text-[#29438f] dark:group-hover:text-[#aebcff]">
            {kelas}
          </h3>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c8d4f4] bg-[#eaf0ff] text-xs font-bold text-[#29438f] dark:border-[#30457f] dark:bg-[#152143] dark:text-[#aebcff]" aria-hidden="true">
          K
        </span>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-zinc-500">Siswa</p>
          <p className="mt-2 text-lg font-semibold text-zinc-50">{jumlahSiswa}</p>
        </div>
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-zinc-500">Wali</p>
          <p className={`mt-2 truncate text-sm font-semibold ${waliKelas ? 'text-zinc-50' : 'text-amber-700 dark:text-amber-300'}`}>
            {waliKelas || 'Belum diatur'}
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-zinc-800/80 pt-4">
        <span className="text-xs font-medium text-zinc-500">Buka pengelolaan kelas</span>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#29438f] transition-transform group-hover:translate-x-1 dark:text-[#aebcff]">
          Detail <span aria-hidden="true">&#8594;</span>
        </span>
      </div>
    </button>
  );
};

export default ClassCard;
