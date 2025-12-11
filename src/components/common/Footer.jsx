import React from 'react';

const Footer = ({ containerClassName = 'max-w-6xl mx-auto px-4' }) => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 py-8 text-white/60 text-sm">
      <div className={`text-center ${containerClassName}`}>
        © {year} SMAN 1 Nagreg
      </div>
    </footer>
  );
};

export default Footer;
