import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle,
  icon,
  className = '',
  padding = 'default',
  shadow = true,
  hover = false
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    default: 'p-4',
    lg: 'p-6',
  };

  const shadowClass = shadow ? 'shadow-soft' : '';
  const hoverClass = hover ? 'hover:shadow-glow transition-shadow duration-300 hover:-translate-y-0.5' : '';

  return (
    <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl ${shadowClass} ${hoverClass} ${paddingStyles[padding]} ${className}`}>
      {(title || icon) && (
        <div className="mb-4">
          <div className="flex items-center gap-3">
            {icon && <div className="text-primary-300 text-2xl">{icon}</div>}
            <div>
              {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
              {subtitle && <p className="text-sm text-slate-300 mt-1">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
