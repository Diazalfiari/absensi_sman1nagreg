import React from 'react';
import logoSmansan from '../../assets/images/logosmansan.png';

const Loading = ({ 
  fullscreen = false, 
  text = 'Memuat...', 
  size = 'md',
  overlay = true 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Spinner dengan logo */}
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full border-4 border-white/20 border-t-primary-500 animate-spin`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src={logoSmansan}
            alt="Logo" 
            className="w-6 h-6 object-contain opacity-50"
          />
        </div>
      </div>
      
      {text && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-white/90 font-medium">{text}</p>
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
          </div>
        </div>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-ink-950 via-ink-900 to-ink-900">
        {overlay && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        )}
        <div className="relative z-10">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <LoadingSpinner />
    </div>
  );
};

// Loading overlay untuk digunakan di atas konten
export const LoadingOverlay = ({ show, text = 'Memuat...' }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-ink-900/80 backdrop-blur-sm rounded-lg">
      <Loading text={text} size="lg" fullscreen={false} />
    </div>
  );
};

// Loading inline untuk button atau component kecil
export const LoadingInline = ({ size = 'sm', className = '' }) => {
  const sizeClasses = {
    xs: 'w-4 h-4 border-2',
    sm: 'w-5 h-5 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full border-white/30 border-t-white animate-spin ${className}`}></div>
  );
};

// Loading progress bar
export const LoadingProgress = ({ progress = 0, text = '' }) => {
  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-white/70">{text}</span>
        <span className="text-sm font-semibold text-white">{progress}%</span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Loading;
