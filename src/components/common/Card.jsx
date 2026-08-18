import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle,
  icon,
  className = '',
  padding = 'default',
  hover = false
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-3 sm:p-4',
    default: 'p-4 sm:p-5',
    lg: 'p-6 sm:p-8',
  };

  const hoverClass = hover ? 'hover:border-zinc-700 transition-colors duration-200' : '';

  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl ${hoverClass} ${paddingStyles[padding]} ${className}`}>
      {(title || icon) && (
        <div className="mb-4">
          <div className="flex items-center gap-3">
            {icon && <div className="text-primary-400 text-xl">{icon}</div>}
            <div>
              {title && <h3 className="text-base sm:text-lg font-medium text-zinc-50">{title}</h3>}
              {subtitle && <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
