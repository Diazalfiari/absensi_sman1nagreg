import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
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
    <div className="bg-ink-900 min-h-screen text-white">
      <Sidebar role="guru" />
      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Riwayat Absensi</p>
              <h1 className="text-4xl font-display">Catatan Pengisian</h1>
              <p className="text-white/70">Lihat histori kelas dan status kehadiran yang pernah dicatat.</p>
            </div>
          </div>

          <Card className="text-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-white/60 text-xs uppercase tracking-[0.3em] bg-white/5">
                  <tr>
                    <th className="px-6 py-3">Tanggal</th>
                    <th className="px-6 py-3">Kelas</th>
                    <th className="px-6 py-3">Mapel</th>
                    <th className="px-6 py-3 text-center">Hadir</th>
                    <th className="px-6 py-3 text-center">Izin</th>
                    <th className="px-6 py-3 text-center">Sakit</th>
                    <th className="px-6 py-3 text-center">Alfa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-sm">
                  {currentData.map((item, index) => {
                    return (
                      <tr key={item.id} className="hover:bg-white/5">
                        <td className="px-6 py-4 font-medium">{item.tanggal}</td>
                        <td className="px-6 py-4">{item.kelas}</td>
                        <td className="px-6 py-4">{item.mapel}</td>
                        <td className="px-6 py-4 text-center text-emerald-300">{item.hadir}</td>
                        <td className="px-6 py-4 text-center text-amber-200">{item.izin}</td>
                        <td className="px-6 py-4 text-center text-amber-400">{item.sakit}</td>
                        <td className="px-6 py-4 text-center text-rose-300">{item.alfa}</td>
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
              totalItems={riwayatAbsensiGuru.length}
              showInfo={true}
            />
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GuruRiwayat;
