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
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">Tidak ada data yang sesuai dengan filter</p>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-primary-700/80 via-primary-500/80 to-accent-500/70 text-white">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest">No</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest">Tanggal</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest">Kelas</th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest">Hadir</th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest">Izin</th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest">Sakit</th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest">Alfa</th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest">Total</th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest">% Hadir</th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-white">
            {currentData.map((item, index) => {
              const total = item.hadir + item.izin + item.sakit + item.alfa;
              const persentase = calculatePercentage(item.hadir, total);
              const globalIndex = startIndex + index;
              return (
                <tr key={`${item.kelas}-${item.tanggal}-${index}`} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-sm text-white/80">{globalIndex + 1}</td>
                  <td className="px-6 py-4 text-sm text-white/90">{item.tanggal}</td>
                  <td className="px-6 py-4 text-base font-semibold">{item.kelas}</td>
                  <td className="px-6 py-4 text-center text-sm">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-200 rounded-full font-semibold">
                      {item.hadir}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    <span className="px-3 py-1 bg-accent-500/20 text-accent-200 rounded-full font-semibold">
                      {item.izin}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-200 rounded-full font-semibold">
                      {item.sakit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    <span className="px-3 py-1 bg-rose-500/20 text-rose-100 rounded-full font-semibold">
                      {item.alfa}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-lg font-semibold">{total}</td>
                  <td className="px-6 py-4 text-center text-sm">
                    <span className={`px-3 py-1 rounded-full font-semibold ${
                      persentase >= 80 
                        ? 'bg-emerald-500/20 text-emerald-200' 
                        : persentase >= 60 
                        ? 'bg-amber-500/20 text-amber-200' 
                        : 'bg-rose-500/20 text-rose-100'
                    }`}>
                      {persentase}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleShowDetail(item.kelas)}
                      className="px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-200 rounded-lg font-semibold text-sm transition-all border border-primary-400/30 hover:border-primary-400/50"
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
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-600 mb-2">Daftar Siswa</p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {dataSiswa[selectedKelas] && dataSiswa[selectedKelas].length > 0 ? (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs uppercase tracking-wider text-gray-600">No</th>
                        <th className="px-4 py-2 text-left text-xs uppercase tracking-wider text-gray-600">NIPD</th>
                        <th className="px-4 py-2 text-left text-xs uppercase tracking-wider text-gray-600">Nama</th>
                        <th className="px-4 py-2 text-center text-xs uppercase tracking-wider text-gray-600">Hadir</th>
                        <th className="px-4 py-2 text-center text-xs uppercase tracking-wider text-gray-600">Izin</th>
                        <th className="px-4 py-2 text-center text-xs uppercase tracking-wider text-gray-600">Sakit</th>
                        <th className="px-4 py-2 text-center text-xs uppercase tracking-wider text-gray-600">Alfa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dataSiswa[selectedKelas].map((siswa, idx) => (
                        <tr key={siswa.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-700">{idx + 1}</td>
                          <td className="px-4 py-3 text-gray-700">{siswa.nipd}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">{siswa.nama}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-md text-xs font-semibold">
                              {siswa.hadir}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-1 bg-accent-500/20 text-accent-300 rounded-md text-xs font-semibold">
                              {siswa.izin}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded-md text-xs font-semibold">
                              {siswa.sakit}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-1 bg-rose-500/20 text-rose-300 rounded-md text-xs font-semibold">
                              {siswa.alfa}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 text-center py-4">Data siswa tidak tersedia untuk kelas ini</p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-all"
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
