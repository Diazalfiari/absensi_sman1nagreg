import React from 'react';

const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => {
  const iconColors = {
    primary: 'text-primary-400 bg-primary-500/10 border-primary-500/20',
    success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    danger: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    info: 'text-accent-400 bg-accent-500/10 border-accent-500/20',
  };

  return (
    <div className="rounded-2xl border border-white/10 p-5 bg-zinc-900 transition-colors hover:border-white/20"> 
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-zinc-400 mb-1">{title}</p>
          <h3 className="text-3xl font-semibold text-white tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-zinc-500 mt-1.5">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg ${iconColors[color]}`}>
          <span>{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
