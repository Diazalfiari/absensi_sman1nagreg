import React, { useState } from 'react';
import { calculatePercentage } from '../../utils/helpers';
import Modal from '../common/Modal';
import Pagination from '../common/Pagination';
import { dataSiswa } from '../../data/mockData';

const RekapTable = ({ data }) => {
  const [selectedKelas, setSelectedKelas] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handleShowDetail = (kelas) => {
    setSelectedKelas(kelas);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedKelas(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
        <p className="text-zinc-500">Tidak ada data yang sesuai dengan filter</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-800 text-zinc-400 border-b border-zinc-700">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest">No</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest">Tanggal</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest">Kelas</th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest">Hadir</th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest">Izin</th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest">Sakit</th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest">Alpa</th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest">Total</th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest">% Hadir</th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-200">
            {currentData.map((item, index) => {
              const total = item.hadir + item.izin + item.sakit + item.alpa;
              const persentase = calculatePercentage(item.hadir, total);
              const globalIndex = startIndex + index;
              return (
                <tr key={`${item.kelas}-${item.tanggal}-${index}`} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-zinc-400">{globalIndex + 1}</td>
                  <td className="px-6 py-4 text-sm text-zinc-300">{item.tanggal}</td>
                  <td className="px-6 py-4 text-base font-semibold text-zinc-100">{item.kelas}</td>
                  <td className="px-6 py-4 text-center text-sm">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-semibold">
                      {item.hadir}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full font-semibold">
                      {item.izin}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-semibold">
                      {item.sakit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full font-semibold">
                      {item.alpa}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-lg font-semibold text-zinc-100">{total}</td>
                  <td className="px-6 py-4 text-center text-sm">
                    <span className={`px-3 py-1 rounded-full font-semibold ${
                      persentase >= 80 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : persentase >= 60 
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {persentase}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleShowDetail(item.kelas)}
                      className="px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 rounded-lg font-semibold text-sm transition-all border border-primary-400/20 hover:border-primary-400/40"
                    >
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        totalItems={data.length}
        showInfo={true}
      />

      {showModal && selectedKelas && (
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={`Detail Absensi Kelas ${selectedKelas}`}
          size="2xl"
        >
          <div className="space-y-4">
            <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
              <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Daftar Siswa</p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {dataSiswa[selectedKelas] && dataSiswa[selectedKelas].length > 0 ? (
                  <table className="w-full text-sm">
                    <thead className="bg-zinc-700 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs uppercase tracking-wider text-zinc-400">No</th>
                        <th className="px-4 py-2 text-left text-xs uppercase tracking-wider text-zinc-400">NIPD</th>
                        <th className="px-4 py-2 text-left text-xs uppercase tracking-wider text-zinc-400">Nama</th>
                        <th className="px-4 py-2 text-center text-xs uppercase tracking-wider text-zinc-400">Hadir</th>
                        <th className="px-4 py-2 text-center text-xs uppercase tracking-wider text-zinc-400">Izin</th>
                        <th className="px-4 py-2 text-center text-xs uppercase tracking-wider text-zinc-400">Sakit</th>
                        <th className="px-4 py-2 text-center text-xs uppercase tracking-wider text-zinc-400">Alpa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-700">
                      {dataSiswa[selectedKelas].map((siswa, idx) => (
                        <tr key={siswa.id} className="hover:bg-zinc-700/50">
                          <td className="px-4 py-3 text-zinc-300">{idx + 1}</td>
                          <td className="px-4 py-3 text-zinc-300">{siswa.nipd}</td>
                          <td className="px-4 py-3 font-medium text-zinc-100">{siswa.nama}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md text-xs font-semibold">
                              {siswa.hadir}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md text-xs font-semibold">
                              {siswa.izin}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded-md text-xs font-semibold">
                              {siswa.sakit}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-1 bg-rose-500/10 text-rose-400 rounded-md text-xs font-semibold">
                              {siswa.alpa}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-zinc-500 text-center py-4">Data siswa tidak tersedia untuk kelas ini</p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-lg font-semibold transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RekapTable;
