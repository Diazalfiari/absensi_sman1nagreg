import React from 'react';
import Button from '../../common/Button';

const inputClasses = 'w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-50 transition-colors focus:border-[#29438f] focus:outline-none focus:ring-2 focus:ring-[#29438f]/20 dark:focus:border-[#9eafff]';
const labelClasses = 'mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500';

const ReportFilter = ({
  filters,
  bulanOptions,
  kelasOptions,
  dataMapel,
  onFilterChange,
  onExport
}) => {
  return (
    <section className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-zinc-800/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#29438f] dark:text-[#9eafff]">Pengaturan laporan</p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-zinc-50">Atur tampilan data</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">Pilih periode dan cakupan laporan yang ingin ditinjau.</p>
        </div>
        <span className="w-fit rounded-full border border-zinc-800 bg-zinc-950/60 px-3 py-1.5 text-xs font-medium text-zinc-500">Perubahan langsung</span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label htmlFor="report-bulan" className={labelClasses}>Bulan</label>
          <select
            id="report-bulan"
            name="bulan"
            value={filters.bulan}
            onChange={onFilterChange}
            className={`${inputClasses} dark-select`}
          >
            {bulanOptions.map((bulan) => (
              <option key={bulan.value} value={bulan.value}>{bulan.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="report-tahun" className={labelClasses}>Tahun</label>
          <input
            id="report-tahun"
            type="number"
            name="tahun"
            value={filters.tahun}
            onChange={onFilterChange}
            className={inputClasses}
            min="2020"
            max="2030"
          />
        </div>

        <div>
          <label htmlFor="report-kelas" className={labelClasses}>Kelas</label>
          <select
            id="report-kelas"
            name="kelas"
            value={filters.kelas}
            onChange={onFilterChange}
            className={`${inputClasses} dark-select`}
          >
            {kelasOptions.map((kelas) => (
              <option key={kelas} value={kelas}>{kelas}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="report-mapel" className={labelClasses}>Mata pelajaran</label>
          <select
            id="report-mapel"
            name="mataPelajaran"
            value={filters.mataPelajaran}
            onChange={onFilterChange}
            className={`${inputClasses} dark-select`}
          >
            <option value="Hasil Akhir">Hasil Akhir</option>
            {dataMapel.map((mapel) => (
              <option key={mapel.id} value={mapel.nama}>{mapel.nama}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <Button
            variant="primary"
            onClick={onExport}
            className="!w-full !bg-[#29438f] !text-white hover:!bg-[#20336f]"
          >
            Export ke Excel
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ReportFilter;
