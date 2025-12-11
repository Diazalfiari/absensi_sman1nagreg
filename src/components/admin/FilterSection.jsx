import React from 'react';
import { dataKelas } from '../../data/mockData';

const FilterSection = ({ filters, onFilterChange, onResetFilter }) => {
  return (
    <div className="glass-panel p-6 mb-8">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Filter</p>
          <h3 className="text-xl font-semibold text-white">Data Kehadiran</h3>
        </div>
        <span className="text-xs text-white/50">Perbarui parameter untuk melihat wawasan terbaru</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filter Kelas */}
        <div>
          <label className="block text-white/70 font-medium mb-2 text-sm">Kelas</label>
          <div className="relative">
            <select
              name="kelas"
              value={filters.kelas}
              onChange={onFilterChange}
              className="w-full px-4 py-3 rounded-2xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <option value="all" className="text-slate-900">Semua Kelas</option>
              {dataKelas.map((kelas) => (
                <option key={kelas.id} value={kelas.nama} className="text-slate-900">
                  {kelas.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Tanggal Mulai */}
        <div>
          <label className="block text-white/70 font-medium mb-2 text-sm">Tanggal Mulai</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={onFilterChange}
            className="w-full px-4 py-3 rounded-2xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>

        {/* Filter Tanggal Akhir */}
        <div>
          <label className="block text-white/70 font-medium mb-2 text-sm">Tanggal Akhir</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={onFilterChange}
            className="w-full px-4 py-3 rounded-2xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>

        {/* Reset Button */}
        <div>
          <label className="block text-white/70 font-medium mb-2 text-sm opacity-0">Reset</label>
          <button
            onClick={onResetFilter}
            className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-semibold transition-all border border-white/20 hover:border-white/30"
          >
            🔄 Reset Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
