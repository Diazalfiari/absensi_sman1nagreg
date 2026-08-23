import React, { useEffect } from 'react';

const Notification = ({ 
  isOpen, 
  type = 'success', 
  title, 
  message, 
  onClose, 
  duration = 3500,
  position = 'top-center'
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const typeConfig = {
    success: {
      border: 'border-emerald-500/60',
      badgeBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      titleColor: 'text-emerald-400',
      icon: '✅',
      defaultTitle: 'Berhasil'
    },
    error: {
      border: 'border-rose-500/60',
      badgeBg: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
      titleColor: 'text-rose-400',
      icon: '❌',
      defaultTitle: 'Terjadi Kesalahan'
    },
    warning: {
      border: 'border-amber-500/60',
      badgeBg: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      titleColor: 'text-amber-400',
      icon: '⚠️',
      defaultTitle: 'Perhatian'
    },
    info: {
      border: 'border-blue-500/60',
      badgeBg: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      titleColor: 'text-blue-400',
      icon: 'ℹ️',
      defaultTitle: 'Informasi'
    }
  };

  const currentConfig = typeConfig[type] || typeConfig.info;

  const positionStyles = {
    'top-center': 'top-8 left-1/2 -translate-x-1/2',
    'top-right': 'top-8 right-8',
    'bottom-center': 'bottom-8 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-8 right-8'
  };

  return (
    <>
      {/* Overlay tipis agar interaksi fokus ke notifikasi */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[9998] transition-opacity"
        onClick={onClose}
      />
      
      {/* Notification Toast Card di depan modal (z-[9999]) */}
      <div 
        className={`fixed ${positionStyles[position]} z-[9999] pointer-events-auto transition-all transform duration-300 ease-out`}
        style={{ maxWidth: 'calc(100vw - 2rem)' }}
      >
        <div className={`
          bg-zinc-900/95 ${currentConfig.border}
          border-2 rounded-2xl
          shadow-[0_25px_60px_rgba(0,0,0,0.85)]
          p-4 sm:p-5
          min-w-[320px] sm:min-w-[420px] max-w-lg
        `}>
          <div className="flex items-start gap-3.5">
            <div className={`flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-xl ${currentConfig.badgeBg}`}>
              <span className="text-xl">{currentConfig.icon}</span>
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <h3 className={`font-semibold text-sm sm:text-base ${currentConfig.titleColor}`}>
                {title || currentConfig.defaultTitle}
              </h3>
              {message && (
                <p className="mt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed break-words">
                  {message}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Tutup Notifikasi"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;
