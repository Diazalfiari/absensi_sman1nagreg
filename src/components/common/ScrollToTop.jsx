import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  // Otomatis scroll ke atas saat rute halaman berganti
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Deteksi posisi scroll window
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Cek apakah berada di halaman Home atau Login
  const isHomeOrLogin =
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/home';

  // Posisi floating ditumpuk rapi tepat di atas tombol ThemeToggle
  // Di halaman Home & Login: bottom-20 right-5 (sudah sesuai di atas ThemeToggle yang berada di bottom-5 right-5)
  // Di halaman setelah login: beri jarak yang lebih lega dan nyaman di atas ThemeToggle pada mode HP & Tablet
  const positionClasses = isHomeOrLogin
    ? 'bottom-20 right-5 sm:bottom-20 sm:right-6 lg:bottom-20 lg:right-6'
    : 'bottom-[9.5rem] right-4 sm:bottom-[9.5rem] sm:right-6 lg:bottom-20 lg:right-6';

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`fixed ${positionClasses} z-50 p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-50 hover:border-zinc-700 shadow-soft transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e5ba4b] ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
      aria-label="Kembali ke atas"
      title="Kembali ke atas"
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        <svg
          className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 19.5V4.5m0 0l-6 6m6-6l6 6"
          />
        </svg>
      </div>
    </button>
  );
};

export default ScrollToTop;
