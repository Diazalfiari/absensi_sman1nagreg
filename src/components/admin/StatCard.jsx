import React from 'react';

const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => {
  const iconColors = {
    primary: 'text-[#29438f] bg-[#eaf0ff] border-[#c8d4f4] dark:text-[#aebcff] dark:bg-[#1c2c5e] dark:border-[#30457f]',
    success: 'text-emerald-700 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-300',
    warning: 'text-amber-700 bg-amber-500/10 border-amber-500/20 dark:text-amber-300',
    danger: 'text-rose-700 bg-rose-500/10 border-rose-500/20 dark:text-rose-300',
    info: 'text-[#29438f] bg-[#eaf0ff] border-[#c8d4f4] dark:text-[#aebcff] dark:bg-[#1c2c5e] dark:border-[#30457f]',
  };

  return (
    <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-700">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-zinc-500">{title}</p>
          <h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-zinc-50">{value}</h3>
          {subtitle && <p className="mt-2 text-xs leading-5 text-zinc-500">{subtitle}</p>}
        </div>
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${iconColors[color]}`} aria-hidden="true">{icon || title.charAt(0)}</span>
      </div>
      <div className={`mt-5 h-1 w-12 rounded-full ${color === 'success' ? 'bg-emerald-600 dark:bg-emerald-400' : color === 'warning' ? 'bg-amber-600 dark:bg-amber-400' : color === 'danger' ? 'bg-rose-600 dark:bg-rose-400' : 'bg-[#29438f] dark:bg-[#9eafff]'}`} aria-hidden="true" />
    </article>
  );
};

export default StatCard;
