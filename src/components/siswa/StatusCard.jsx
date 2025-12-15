import React from 'react';
import { calculatePercentage } from '../../utils/helpers';

const StatCard = ({ title, value, icon, color = 'primary' }) => {
  const colorStyles = {
    primary: 'bg-blue-500/20',
    success: 'bg-emerald-500/20',
    warning: 'bg-amber-400/20',
    danger: 'bg-rose-500/20',
  };

  return (
    <div className={`rounded-2xl p-5 border border-white/10 ${colorStyles[color]} backdrop-blur-lg`}> 
      <div className="flex items-center justify-between mb-2">
        <p className="text-white/70 text-sm font-medium">{title}</p>
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
          <span className="text-xl">{icon}</span>
        </div>
      </div>
      <h3 className="text-3xl font-bold">{value}</h3>
    </div>
  );
};

const StatusCard = ({ siswaData }) => {
  const { totalHadir, totalIzin, totalSakit, totalalpa } = siswaData;
  const totalKehadiran = totalHadir + totalIzin + totalSakit + totalalpa;
  const persentase = calculatePercentage(totalHadir, totalKehadiran);

  return (
    <div className="space-y-6">
      {/* Main Stat Card */}
      <div className="bg-blue-600 rounded-2xl shadow-sm p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-90 mb-1">Persentase Kehadiran</p>
            <h2 className="text-4xl font-bold">{persentase}%</h2>
          </div>
          <div className="text-6xl opacity-80">📊</div>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-3">
          <div
            className="bg-white rounded-full h-3 transition-all duration-500"
            style={{ width: `${persentase}%` }}
          ></div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Hadir"
          value={totalHadir}
          icon="✅"
          color="success"
        />
        <StatCard
          title="Izin"
          value={totalIzin}
          icon="📝"
          color="primary"
        />
        <StatCard
          title="Sakit"
          value={totalSakit}
          icon="🤒"
          color="warning"
        />
        <StatCard
          title="alpa"
          value={totalalpa}
          icon="❌"
          color="danger"
        />
      </div>
    </div>
  );
};

export default StatusCard;
