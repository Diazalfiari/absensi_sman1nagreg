import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Pagination from '../../components/common/Pagination';
import { getCurrentUser, formatDate } from '../../utils/helpers';
import { riwayatAbsensiSiswa } from '../../data/mockData';
import Footer from '../../components/common/Footer';

const SiswaRiwayat = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(riwayatAbsensiSiswa.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = riwayatAbsensiSiswa.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'siswa') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  return (
    <div className="bg-zinc-950 min-h-[100dvh] text-white selection:bg-primary-500/30">
      <Sidebar role="siswa" />
      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-display tracking-tight text-white">Riwayat Absensi</h1>
              <p className="text-zinc-400 mt-1">Lihat catatan kehadiran.</p>
            </div>
          </div>

          <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-950 text-zinc-400 text-sm border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-medium">Tanggal</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Waktu</th>
                    <th className="px-6 py-4 font-medium">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm text-zinc-300">
                  {currentData.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{formatDate(item.tanggal)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            item.status === 'Hadir' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            item.status === 'Izin' ? 'bg-accent-500/10 text-accent-400 border-accent-500/20' :
                            item.status === 'Sakit' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{item.waktu}</td>
                      <td className="px-6 py-4 text-zinc-400">{item.keterangan || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-white/5">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={riwayatAbsensiSiswa.length}
                showInfo={true}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SiswaRiwayat;
