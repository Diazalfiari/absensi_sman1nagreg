import React from 'react';
import { Link } from 'react-router-dom';
import logoSmansan from '../../assets/images/logosmansan.png';
import Button from '../common/Button';

const Navbar = ({ transparent = false }) => {
  const baseClasses = transparent
    ? 'bg-transparent'
    : 'bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800';

  return (
    <nav className={`${baseClasses} sticky top-0 z-40 py-4 px-6`}> 
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group">
          <img src={logoSmansan} alt="Logo SMAN 1 Nagreg" className="w-10 h-10 object-contain" />
          <p className="font-display text-lg text-zinc-50 font-medium">SMAN 1 Nagreg</p>
        </Link>
        
        <Link to="/login">
          <Button variant="primary" size="sm" className="rounded-full px-5">Login</Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
