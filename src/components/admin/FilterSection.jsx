import React from 'react';
import { dataKelas } from '../../data/mockData';

const FilterSection = ({ filters, onFilterChange, onResetFilter }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500">Filter</p>
          <h3 className="text-xl font-semibold text-zinc-50">Data Kehadiran</h3>
        </div>
        <span className="text-xs text-zinc-500">Perbarui parameter untuk melihat wawasan terbaru</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filter Kelas */}
        <div>
          <label className="block text-zinc-400 font-medium mb-2 text-sm">Kelas</label>
          <div className="relative">
            <select
              name="kelas"
              value={filters.kelas}
              onChange={onFilterChange}
              className="w-full px-4 py-3 rounded-2xl bg-zinc-800 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <option value="all">Semua Kelas</option>
              {dataKelas.map((kelas) => (
                <option key={kelas.id} value={kelas.nama}>
                  {kelas.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Tanggal Mulai */}
        <div>
          <label className="block text-zinc-400 font-medium mb-2 text-sm">Tanggal Mulai</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={onFilterChange}
            className="w-full px-4 py-3 rounded-2xl bg-zinc-800 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>

        {/* Filter Tanggal Akhir */}
        <div>
          <label className="block text-zinc-400 font-medium mb-2 text-sm">Tanggal Akhir</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={onFilterChange}
            className="w-full px-4 py-3 rounded-2xl bg-zinc-800 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>

        {/* Reset Button */}
        <div>
          <label className="block text-zinc-400 font-medium mb-2 text-sm opacity-0">Reset</label>
          <button
            onClick={onResetFilter}
            className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-2xl font-semibold transition-all border border-zinc-700 hover:border-zinc-600"
          >
            🔄 Reset Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
