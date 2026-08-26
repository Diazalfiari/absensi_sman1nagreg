import React, { useEffect, useState } from 'react';
import { calculatePercentage } from '../../utils/helpers';
import Modal from '../common/Modal';
import Pagination from '../common/Pagination';
import { kelasService } from '../../services/kelasService';

const countStyles = {
  hadir: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  izin: 'border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300',
  sakit: 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  alpa: 'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300',
};

const percentageStyles = (percentage) => {
  if (percentage >= 80) return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
  if (percentage >= 60) return 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300';
  return 'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300';
};

const RekapTable = ({ data }) => {
  const [selectedKelas, setSelectedKelas] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [detailStudents, setDetailStudents] = useState([]);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const handleShowDetail = async (kelasName) => {
    setSelectedKelas(kelasName);
    setShowModal(true);
    setIsLoadingDetail(true);
    setDetailStudents([]);

    try {
      const classes = await kelasService.getAllClasses();
      const targetClass = classes.find(k => k.nama_kelas === kelasName || k.nama === kelasName);
      
      if (targetClass) {
        // Ambil data matriks presensi bulanan untuk menghitung total hadir/izin/sakit/alpa per siswa
        const currentDate = new Date();
        const bulan = currentDate.getMonth() + 1;
        const tahun = currentDate.getFullYear();

        try {
          // Import presensiService di level atas secara dinamis (atau pastikan sudah terimport)
          const { presensiService } = require('../../services/presensiService');
          const data = await presensiService.getBulanan({
            kelasId: targetClass.id,
            bulan,
            tahun,
          });

          if (data && data.students && data.records) {
            const studentsWithStats = data.students.map(std => {
              const stdRecords = data.records.filter(r => r.student_id === std.student_id);
              return {
                ...std,
                id: std.student_id,
                nama: std.nama_siswa || std.nama,
                hadir: stdRecords.filter(r => r.status === 'Hadir').length,
                izin: stdRecords.filter(r => r.status === 'Izin').length,
                sakit: stdRecords.filter(r => r.status === 'Sakit').length,
                alpa: stdRecords.filter(r => r.status === 'Alpa').length,
              };
            });
            setDetailStudents(studentsWithStats);
            return;
          }
        } catch (error) {
          console.error('Gagal mengambil data bulanan:', error);
        }

        // Fallback jika API bulanan gagal: gunakan detail kelas
        const detail = await kelasService.getClassDetail(targetClass.id);
        setDetailStudents(detail.students || []);
      }
    } catch (err) {
      console.error('Gagal mengambil detail kelas:', err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedKelas(null);
    setDetailStudents([]);
  };

  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900 p-10 text-center">
        <p className="text-sm text-zinc-500">Tidak ada data yang sesuai dengan filter.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px]">
          <caption className="sr-only">Tabel rekapitulasi kehadiran siswa berdasarkan tanggal dan kelas</caption>
          <thead>
            <tr className="border-b border-zinc-800/80 bg-[#eaf0ff] text-[#52628e] dark:bg-[#152143] dark:text-[#b4bfdf]">
              <th className="px-5 py-4 text-left text-[0.65rem] font-semibold uppercase tracking-[0.16em]">No</th>
              <th className="px-5 py-4 text-left text-[0.65rem] font-semibold uppercase tracking-[0.16em]">Tanggal</th>
              <th className="px-5 py-4 text-left text-[0.65rem] font-semibold uppercase tracking-[0.16em]">Kelas</th>
              <th className="px-5 py-4 text-center text-[0.65rem] font-semibold uppercase tracking-[0.16em]">Hadir</th>
              <th className="px-5 py-4 text-center text-[0.65rem] font-semibold uppercase tracking-[0.16em]">Izin</th>
              <th className="px-5 py-4 text-center text-[0.65rem] font-semibold uppercase tracking-[0.16em]">Sakit</th>
              <th className="px-5 py-4 text-center text-[0.65rem] font-semibold uppercase tracking-[0.16em]">Alpa</th>
              <th className="px-5 py-4 text-center text-[0.65rem] font-semibold uppercase tracking-[0.16em]">Total</th>
              <th className="px-5 py-4 text-center text-[0.65rem] font-semibold uppercase tracking-[0.16em]">% Hadir</th>
              <th className="px-5 py-4 text-center text-[0.65rem] font-semibold uppercase tracking-[0.16em]">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/70 text-zinc-200">
            {currentData.map((item, index) => {
              const total = item.hadir + item.izin + item.sakit + item.alpa;
              const persentase = calculatePercentage(item.hadir, total);
              const globalIndex = startIndex + index;
              return (
                <tr key={`${item.kelas}-${item.tanggal}-${index}`} className="transition-colors hover:bg-zinc-800/40">
                  <td className="px-5 py-4 text-sm text-zinc-500">{globalIndex + 1}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-400">{item.tanggal}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-zinc-50">{item.kelas}</td>
                  <td className="px-5 py-4 text-center text-sm"><span className={`inline-flex min-w-9 justify-center rounded-lg border px-2.5 py-1 font-semibold ${countStyles.hadir}`}>{item.hadir}</span></td>
                  <td className="px-5 py-4 text-center text-sm"><span className={`inline-flex min-w-9 justify-center rounded-lg border px-2.5 py-1 font-semibold ${countStyles.izin}`}>{item.izin}</span></td>
                  <td className="px-5 py-4 text-center text-sm"><span className={`inline-flex min-w-9 justify-center rounded-lg border px-2.5 py-1 font-semibold ${countStyles.sakit}`}>{item.sakit}</span></td>
                  <td className="px-5 py-4 text-center text-sm"><span className={`inline-flex min-w-9 justify-center rounded-lg border px-2.5 py-1 font-semibold ${countStyles.alpa}`}>{item.alpa}</span></td>
                  <td className="px-5 py-4 text-center text-sm font-semibold text-zinc-50">{total}</td>
                  <td className="px-5 py-4 text-center text-sm"><span className={`inline-flex min-w-[4.5rem] justify-center rounded-lg border px-2.5 py-1 font-semibold ${percentageStyles(persentase)}`}>{persentase}%</span></td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleShowDetail(item.kelas)}
                      className="rounded-lg border border-[#c8d4f4] bg-[#eaf0ff] px-3 py-2 text-sm font-semibold text-[#29438f] transition-all hover:border-[#29438f] hover:bg-[#dce6ff] dark:border-[#30457f] dark:bg-[#152143] dark:text-[#aebcff] dark:hover:border-[#9eafff]"
                    >
                      Lihat detail
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={data.length}
        showInfo={true}
      />

      {showModal && selectedKelas && (
        <Modal isOpen={showModal} onClose={handleCloseModal} title={`Detail Absensi Kelas ${selectedKelas}`} size="2xl">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800">
              <div className="border-b border-zinc-700 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Daftar siswa</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {isLoadingDetail ? (
                  <p className="px-4 py-6 text-center text-sm text-zinc-500">Memuat data siswa...</p>
                ) : detailStudents && detailStudents.length > 0 ? (
                  <table className="w-full min-w-[640px] text-sm">
                    <thead className="sticky top-0 bg-zinc-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-zinc-400">No</th>
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-zinc-400">NIPD</th>
                        <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-zinc-400">Nama</th>
                        <th className="px-4 py-3 text-center text-xs uppercase tracking-wider text-zinc-400">Hadir</th>
                        <th className="px-4 py-3 text-center text-xs uppercase tracking-wider text-zinc-400">Izin</th>
                        <th className="px-4 py-3 text-center text-xs uppercase tracking-wider text-zinc-400">Sakit</th>
                        <th className="px-4 py-3 text-center text-xs uppercase tracking-wider text-zinc-400">Alpa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-700">
                      {detailStudents.map((siswa, idx) => (
                        <tr key={siswa.id} className="hover:bg-zinc-700/50">
                          <td className="px-4 py-3 text-zinc-300">{idx + 1}</td>
                          <td className="px-4 py-3 text-zinc-300">{siswa.nipd || siswa.nis || siswa.id}</td>
                          <td className="px-4 py-3 font-medium text-zinc-100">{siswa.nama}</td>
                          <td className="px-4 py-3 text-center"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${countStyles.hadir}`}>{siswa.hadir || 0}</span></td>
                          <td className="px-4 py-3 text-center"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${countStyles.izin}`}>{siswa.izin || 0}</span></td>
                          <td className="px-4 py-3 text-center"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${countStyles.sakit}`}>{siswa.sakit || 0}</span></td>
                          <td className="px-4 py-3 text-center"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${countStyles.alpa}`}>{siswa.alpa || 0}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="px-4 py-6 text-center text-sm text-zinc-500">Data siswa tidak tersedia untuk kelas ini.</p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={handleCloseModal} className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 transition-all hover:bg-zinc-600">
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
