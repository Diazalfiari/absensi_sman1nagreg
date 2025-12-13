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
    primary: 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:hover:bg-blue-600',
    secondary: 'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200 disabled:opacity-50',
    success: 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50',
    danger: 'bg-rose-600 text-white shadow-sm hover:bg-rose-700 disabled:opacity-50',
    outline: 'border border-slate-300 text-slate-800 hover:bg-slate-100 disabled:opacity-40',
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
