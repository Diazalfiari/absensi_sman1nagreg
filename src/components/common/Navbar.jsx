import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ transparent = false }) => {
  const baseClasses = transparent
    ? 'bg-white/5 backdrop-blur-2xl border border-white/10'
    : 'bg-white/10 backdrop-blur-2xl border border-white/15 shadow-soft';

  return (
    <nav className={`${baseClasses} sticky top-0 z-40 py-4 px-6`}> 
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
            <span className="text-white font-bold text-2xl tracking-tight">S</span>
            <div className="absolute inset-0 rounded-2xl border border-white/30 opacity-40"></div>
          </div>
          <div>
            <p className="font-display text-lg text-white">SMAN 1 Nagreg</p>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Absensi Digital</p>
          </div>
        </Link>
        
        <Link to="/login">
          <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-accent-400 to-primary-500 text-white font-semibold shadow-glow hover:shadow-soft hover:-translate-y-0.5 transition-all">
            Login
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
