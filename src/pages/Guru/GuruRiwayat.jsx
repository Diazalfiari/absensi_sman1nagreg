import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Pagination from '../../components/common/Pagination';
import { getCurrentUser } from '../../utils/helpers';
import { riwayatAbsensiGuru } from '../../data/mockData';
import Footer from '../../components/common/Footer';

const GuruRiwayat = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(riwayatAbsensiGuru.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = riwayatAbsensiGuru.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'guru') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  return (
    <div className="bg-zinc-950 min-h-[100dvh] text-zinc-50 selection:bg-primary-500/30">
      <Sidebar role="guru" />
      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-display tracking-tight text-zinc-50">Catatan Pengisian</h1>
              <p className="text-zinc-400 mt-1">Lihat histori kelas dan status kehadiran yang pernah dicatat.</p>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-zinc-400 text-sm border-b border-zinc-800 bg-zinc-950">
                  <tr>
                    <th className="px-6 py-4 font-medium">Tanggal</th>
                    <th className="px-6 py-4 font-medium">Kelas</th>
                    <th className="px-6 py-4 font-medium">Mapel</th>
                    <th className="px-6 py-4 text-center font-medium">Hadir</th>
                    <th className="px-6 py-4 text-center font-medium">Izin</th>
                    <th className="px-6 py-4 text-center font-medium">Sakit</th>
                    <th className="px-6 py-4 text-center font-medium">Alpa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm text-zinc-300">
                  {currentData.map((item, index) => {
                    return (
                      <tr key={item.id} className="hover:bg-zinc-900 transition-colors">
                        <td className="px-6 py-4 font-medium text-zinc-50">{item.tanggal}</td>
                        <td className="px-6 py-4">{item.kelas}</td>
                        <td className="px-6 py-4">{item.mapel}</td>
                        <td className="px-6 py-4 text-center text-emerald-400">{item.hadir}</td>
                        <td className="px-6 py-4 text-center text-accent-400">{item.izin}</td>
                        <td className="px-6 py-4 text-center text-amber-400">{item.sakit}</td>
                        <td className="px-6 py-4 text-center text-rose-400">{item.alpa}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-zinc-800">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={riwayatAbsensiGuru.length}
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

export default GuruRiwayat;
