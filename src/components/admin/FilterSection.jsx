import React, { useState, useEffect } from 'react';
import { kelasService } from '../../services/kelasService';

const FilterSection = ({ filters, onFilterChange, onResetFilter, onReset, availableClasses }) => {
  const [fetchedClasses, setFetchedClasses] = useState([]);

  useEffect(() => {
    if (!availableClasses || availableClasses.length === 0) {
      kelasService.getAllClasses()
        .then(data => setFetchedClasses(data))
        .catch(err => console.error('Gagal mengambil data kelas:', err));
    }
  }, [availableClasses]);

  const classesToDisplay = availableClasses && availableClasses.length > 0
    ? availableClasses
    : fetchedClasses;

  const handleReset = onResetFilter || onReset;

  return (
    <section className="mb-8 rounded-2xl border border-zinc-800/80 bg-zinc-900 p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#29438f] dark:text-[#9eafff]">Filter data</p>
          <h3 className="mt-3 text-xl font-semibold text-zinc-50">Persempit rekapitulasi</h3>
        </div>
        <span className="text-xs text-zinc-500">Perbarui parameter untuk melihat hasil terbaru.</span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <label htmlFor="rekap-kelas" className="mb-2 block text-sm font-medium text-zinc-300">Kelas</label>
          <select
            id="rekap-kelas"
            name="kelas"
            value={filters.kelas}
            onChange={onFilterChange}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-100 focus:border-[#29438f] focus:outline-none focus:ring-2 focus:ring-[#29438f]/40"
          >
            <option value="all">Semua Kelas</option>
            {classesToDisplay.map((kelas) => (
              <option key={kelas.id || kelas.nama_kelas || kelas.nama} value={kelas.id || kelas.nama_kelas || kelas.nama}>
                Kelas {kelas.nama_kelas || kelas.nama}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="rekap-start-date" className="mb-2 block text-sm font-medium text-zinc-300">Tanggal mulai</label>
          <input
            id="rekap-start-date"
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={onFilterChange}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-100 focus:border-[#29438f] focus:outline-none focus:ring-2 focus:ring-[#29438f]/40"
          />
        </div>

        <div>
          <label htmlFor="rekap-end-date" className="mb-2 block text-sm font-medium text-zinc-300">Tanggal akhir</label>
          <input
            id="rekap-end-date"
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={onFilterChange}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-100 focus:border-[#29438f] focus:outline-none focus:ring-2 focus:ring-[#29438f]/40"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={handleReset}
            type="button"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 font-semibold text-zinc-200 transition-all hover:border-zinc-600 hover:bg-zinc-700"
          >
            Reset filter
          </button>
        </div>
      </div>
    </section>
  );
};

export default FilterSection;
