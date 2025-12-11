import React from 'react';
import Button from './Button';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Konfirmasi', 
  message = 'Apakah Anda yakin?',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  type = 'info' // info, warning, danger, success
}) => {
  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (type) {
      case 'warning':
        return { icon: '⚠️', color: 'amber' };
      case 'danger':
        return { icon: '🚨', color: 'red' };
      case 'success':
        return { icon: '✅', color: 'emerald' };
      default:
        return { icon: 'ℹ️', color: 'primary' };
    }
  };

  const { icon, color } = getIconAndColor();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Dialog */}
      <div className="relative glass-panel max-w-md w-full p-6 md:p-8 rounded-2xl border-2 border-white/20 animate-scale-in">
        {/* Icon */}
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${color}-500/20 border border-${color}-500/50 flex items-center justify-center`}>
          <span className="text-3xl">{icon}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-semibold text-center mb-3">
          {title}
        </h3>

        {/* Message */}
        <p className="text-white/70 text-center mb-6">
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="secondary" 
            onClick={onClose}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button 
            onClick={onConfirm}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ConfirmDialog;
