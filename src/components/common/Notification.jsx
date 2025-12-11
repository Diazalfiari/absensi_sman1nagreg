import React, { useEffect } from 'react';

const Notification = ({ 
  isOpen, 
  type = 'success', 
  title, 
  message, 
  onClose, 
  duration = 3000,
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

  const typeStyles = {
    success: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-100',
    error: 'bg-rose-500/20 border-rose-400/40 text-rose-100',
    warning: 'bg-amber-500/20 border-amber-400/40 text-amber-100',
    info: 'bg-blue-500/20 border-blue-400/40 text-blue-100'
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  const positionStyles = {
    'top-center': 'top-8 left-1/2 -translate-x-1/2',
    'top-right': 'top-8 right-8',
    'bottom-center': 'bottom-8 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-8 right-8'
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />
      
      {/* Notification */}
      <div 
        className={`fixed ${positionStyles[position]} z-[9999] animate-slideDown`}
        style={{ maxWidth: 'calc(100vw - 2rem)' }}
      >
        <div className={`
          ${typeStyles[type]}
          border-2 rounded-2xl backdrop-blur-lg
          shadow-2xl shadow-black/50
          p-4 sm:p-6
          min-w-[300px] sm:min-w-[400px]
          transform transition-all duration-300
        `}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-white/10">
              <span className="text-2xl sm:text-3xl">{icons[type]}</span>
            </div>
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className="font-bold text-base sm:text-lg mb-1">{title}</h3>
              )}
              {message && (
                <p className="text-sm sm:text-base text-white/90">{message}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className="text-lg">×</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;
