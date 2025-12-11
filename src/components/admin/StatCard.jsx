import React from 'react';

const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => {
  const colorStyles = {
    primary: 'from-primary-500/30 via-primary-500/10 to-transparent',
    success: 'from-emerald-400/30 via-emerald-400/10 to-transparent',
    warning: 'from-amber-400/30 via-amber-400/10 to-transparent',
    danger: 'from-rose-500/30 via-rose-500/10 to-transparent',
    info: 'from-accent-400/30 via-accent-400/10 to-transparent',
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur-xl shadow-soft hover:shadow-glow transition-all`}> 
      <div className={`absolute inset-0 bg-gradient-to-br ${colorStyles[color]} opacity-80`}></div>
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-white/70 mb-2">{title}</p>
          <h3 className="text-4xl font-bold text-white">{value}</h3>
          {subtitle && <p className="text-xs text-white/70 mt-2">{subtitle}</p>}
        </div>
        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl">
          <span>{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
