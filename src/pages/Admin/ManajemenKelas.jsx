import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import ClassCard from '../../components/admin/class/ClassCard';
import { dataKelas, dataSiswa } from '../../data/mockData';

const ManajemenKelas = () => {
  const navigate = useNavigate();

  const handleClassClick = (id) => {
    navigate(`/admin/manajemen-kelas/${id}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Sidebar role="admin" />
      
      <main className="flex-1 lg:ml-72 p-6 lg:p-8 mt-16 lg:mt-0 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-zinc-100">Manajemen Kelas</h2>
              <p className="text-sm text-zinc-400 mt-1">
                Kelola seluruh data kelas dan siswa SMAN 1 Nagreg
              </p>
            </div>
          </div>

          {/* Grouped Classes */}
          {['Kelas X', 'Kelas XI', 'Kelas XII'].map((groupName) => {
            const prefix = groupName === 'Kelas X' ? 'X-' : groupName === 'Kelas XI' ? 'XI-' : 'XII-';
            const classesInGroup = dataKelas.filter(k => k.nama.startsWith(prefix));
            
            return (
              <div key={groupName} className="mb-10 last:mb-0">
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-xl font-bold text-zinc-100">{groupName}</h3>
                  <div className="h-px flex-1 bg-zinc-800"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {classesInGroup.map((kelas) => {
                    const studentsInClass = dataSiswa[kelas.nama] ? dataSiswa[kelas.nama].length : 0;
                    return (
                      <ClassCard
                        key={kelas.id}
                        kelas={kelas.nama}
                        waliKelas={kelas.waliKelas}
                        jumlahSiswa={studentsInClass}
                        onClick={() => handleClassClick(kelas.nama)}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </main>
      
      <Footer />
    </div>
  );
};

export default ManajemenKelas;
