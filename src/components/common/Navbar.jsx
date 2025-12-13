import React from 'react';
import { Link } from 'react-router-dom';
import logoSmansan from '../../assets/images/logosmansan.png';
import Button from '../common/Button';

const Navbar = ({ transparent = false }) => {
  const baseClasses = transparent
    ? 'bg-white/5 backdrop-blur-2xl border border-white/10'
    : 'bg-white/10 backdrop-blur-2xl border border-white/15 shadow-soft';

  return (
    <nav className={`${baseClasses} sticky top-0 z-40 py-4 px-6`}> 
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group">
            <img src={logoSmansan} alt="Logo SMAN 1 Nagreg" className="w-10 h-10 object-contain" />
          <div>
            <p className="font-display text-lg text-white">SMAN 1 Nagreg</p>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Absensi Digital</p>
          </div>
        </Link>
        
        <Link to="/login">
          <Button variant="primary" size="md" className="rounded-full px-6 py-2.5">Login</Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
