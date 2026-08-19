import React from 'react';
import Button from '../../common/Button';

const ReportFilter = ({
  filters,
  bulanOptions,
  kelasOptions,
  dataMapel,
  onFilterChange,
  onExport
}) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Bulan
          </label>
          <select
            name="bulan"
            value={filters.bulan}
            onChange={onFilterChange}
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-50 dark-select focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          >
            {bulanOptions.map((bulan) => (
              <option key={bulan.value} value={bulan.value}>
                {bulan.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Tahun
          </label>
          <input
            type="number"
            name="tahun"
            value={filters.tahun}
            onChange={onFilterChange}
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-50 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            min="2020"
            max="2030"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Kelas
          </label>
          <select
            name="kelas"
            value={filters.kelas}
            onChange={onFilterChange}
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-50 dark-select focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          >
            {kelasOptions.map((kelas) => (
              <option key={kelas} value={kelas}>
                {kelas}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Mata Pelajaran
          </label>
          <select
            name="mataPelajaran"
            value={filters.mataPelajaran}
            onChange={onFilterChange}
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-50 dark-select focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          >
            <option value="Hasil Akhir">Hasil Akhir</option>
            {dataMapel.map((mapel) => (
              <option key={mapel.id} value={mapel.nama}>
                {mapel.nama}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <Button
            variant="primary"
            onClick={onExport}
            className="w-full"
          >
            Export Excel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportFilter;
