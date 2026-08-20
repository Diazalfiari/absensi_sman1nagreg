import React from 'react';
import { Link } from 'react-router-dom';
import logoSmansan from '../../assets/images/logosmansan.png';

const Navbar = ({ transparent = false }) => {
  const baseClasses = transparent
    ? 'bg-zinc-950/70 backdrop-blur-xl'
    : 'bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800';

  return (
    <nav className={`${baseClasses} sticky top-0 z-40 px-6 py-4 lg:px-8`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="group flex items-center gap-3" aria-label="Kembali ke beranda SMAN 1 Nagreg">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800/80 bg-zinc-900/80 p-1.5 transition duration-200 group-hover:border-[#e5ba4b]/70">
            <img src={logoSmansan} alt="Logo SMAN 1 Nagreg" className="h-full w-full object-contain" />
          </span>
          <span>
            <span className="block font-display text-base font-semibold tracking-[-0.02em] text-zinc-50 sm:text-lg">SMAN 1 Nagreg</span>
            <span className="hidden text-[0.65rem] font-medium uppercase tracking-[0.16em] text-zinc-500 sm:block">Sistem presensi</span>
          </span>
        </Link>

        <Link
          to="/login"
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-zinc-700/80 bg-zinc-900/70 px-4 text-sm font-semibold text-zinc-50 transition duration-200 hover:border-[#e5ba4b]/70 hover:bg-zinc-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5ba4b] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          Masuk
          <span aria-hidden="true" className="text-base leading-none text-[#e5ba4b]">&#8594;</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
