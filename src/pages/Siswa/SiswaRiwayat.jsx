import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
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
    <div className="bg-ink-900 min-h-screen text-white">
      <Sidebar role="siswa" />
      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Student Panel</p>
              <h1 className="text-4xl font-display">Riwayat Absensi</h1>
              <p className="text-white/70">Lihat catatan kehadiran.</p>
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-white/60 text-xs uppercase tracking-[0.3em]">
                  <tr>
                    <th className="px-6 py-3">Tanggal</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Waktu</th>
                    <th className="px-6 py-3">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-sm">
                  {currentData.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 font-semibold">{formatDate(item.tanggal)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${{
                            Hadir: 'bg-emerald-500/20 text-emerald-200',
                            Izin: 'bg-accent-500/20 text-accent-200',
                            Sakit: 'bg-amber-500/20 text-amber-200',
                            alpa: 'bg-rose-500/20 text-rose-200',
                          }[item.status]}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{item.waktu}</td>
                      <td className="px-6 py-4 text-white/70">{item.keterangan || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={riwayatAbsensiSiswa.length}
              showInfo={true}
            />
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SiswaRiwayat;
