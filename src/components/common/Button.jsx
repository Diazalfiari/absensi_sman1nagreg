import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  type = 'button',
  disabled = false,
  fullWidth = false,
  icon = null,
  className = ''
}) => {
  const baseStyles = 'font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 tracking-tight disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 text-white shadow-glow hover:shadow-soft hover:translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/15 disabled:opacity-50',
    success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-glow hover:brightness-110 disabled:opacity-50',
    danger: 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-glow hover:brightness-110 disabled:opacity-50',
    outline: 'border border-white/30 text-white hover:bg-white/10 disabled:opacity-40',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3.5 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
