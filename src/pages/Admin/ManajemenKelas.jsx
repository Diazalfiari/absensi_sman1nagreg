import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import ClassCard from '../../components/admin/class/ClassCard';
import VisualIcon from '../../components/common/VisualIcon';
import { dataKelas, dataSiswa } from '../../data/mockData';

const gradeGroups = [
  { label: 'Kelas X', prefix: 'X-', accent: 'bg-[#eaf0ff] text-[#29438f] dark:bg-[#152143] dark:text-[#aebcff]' },
  { label: 'Kelas XI', prefix: 'XI-', accent: 'bg-[#f7f1df] text-[#8b681d] dark:bg-[#292615] dark:text-[#f0cb69]' },
  { label: 'Kelas XII', prefix: 'XII-', accent: 'bg-[#eef5f0] text-[#2d6a43] dark:bg-[#172b20] dark:text-[#9ad1ad]' },
];

const ManajemenKelas = () => {
  const navigate = useNavigate();

  const handleClassClick = (id) => {
    navigate(`/admin/manajemen-kelas/${id}`);
  };

  const totalStudents = Object.values(dataSiswa).reduce(
    (total, students) => total + students.length,
    0
  );
  const assignedHomerooms = dataKelas.filter((kelas) => kelas.waliKelas).length;
  const unassignedHomerooms = dataKelas.length - assignedHomerooms;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-zinc-950">
      <Sidebar role="admin" />

      <main className="mt-16 flex-1 p-5 transition-all duration-300 sm:p-7 lg:ml-72 lg:mt-0 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <header className="flex flex-col gap-6 border-b border-zinc-800/80 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#29438f] dark:text-[#9eafff]">
                Administrasi akademik
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-zinc-50 sm:text-5xl">
                Manajemen Kelas
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-500 dark:text-zinc-400 sm:text-base">
                Kelola struktur kelas, wali kelas, dan daftar siswa SMAN 1 Nagreg dari satu tempat.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-[#c8d4f4] bg-[#eaf0ff] px-4 py-3 text-[#29438f] dark:border-[#30457f] dark:bg-[#152143] dark:text-[#aebcff]">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#29438f] text-white dark:bg-[#9eafff] dark:text-[#172654]" aria-hidden="true">
                <VisualIcon name="class" className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">Data kelas aktif</p>
                <p className="mt-0.5 text-xs opacity-75">Tahun ajaran berjalan</p>
              </div>
            </div>
          </header>

          <section className="grid overflow-hidden rounded-3xl border border-[#30457f] bg-[#172654] text-white shadow-[0_24px_70px_rgba(23,38,84,0.2)] dark:bg-[#111b3c] sm:grid-cols-[1.25fr_1fr]">
            <div className="relative overflow-hidden p-6 sm:p-8">
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#9eafff]/10 blur-3xl" aria-hidden="true" />
              <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-[#aebcff]">Ringkasan data</p>
              <h3 className="relative mt-4 max-w-md font-display text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                Semua kelas dalam satu pandangan.
              </h3>
              <p className="relative mt-3 max-w-lg text-sm leading-6 text-[#c5cfe0]">
                Pilih kartu kelas untuk membuka detail siswa dan pengaturan wali kelas.
              </p>
            </div>
            <div className="grid grid-cols-3 border-t border-white/10 sm:border-l sm:border-t-0">
              <div className="flex flex-col items-center justify-center text-center border-r border-white/10 p-4 sm:p-6">
                <p className="text-2xl font-semibold sm:text-3xl">{dataKelas.length}</p>
                <p className="mt-2 text-xs leading-5 text-[#c5cfe0]">Total kelas</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center border-r border-white/10 p-4 sm:p-6">
                <p className="text-2xl font-semibold sm:text-3xl">{totalStudents}</p>
                <p className="mt-2 text-xs leading-5 text-[#c5cfe0]">Siswa terdata</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-4 sm:p-6">
                <p className="text-2xl font-semibold sm:text-3xl">{assignedHomerooms}</p>
                <p className="mt-2 text-xs leading-5 text-[#c5cfe0]">Wali terisi</p>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <p className="text-sm font-semibold text-zinc-50">Perlu perhatian</p>
              <p className="mt-1 text-xs text-zinc-500">Kelas yang belum memiliki wali kelas.</p>
            </div>
            <span className="w-fit rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-sm font-semibold text-amber-700 dark:text-amber-300">
              {unassignedHomerooms} kelas belum terisi
            </span>
          </section>

          <div className="space-y-10">
            {gradeGroups.map((group) => {
              const classesInGroup = dataKelas.filter((kelas) => kelas.nama.startsWith(group.prefix));

              return (
                <section key={group.label}>
                  <div className="mb-5 flex items-center gap-3">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${group.accent}`} aria-hidden="true">
                      <VisualIcon name="class" className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-zinc-50">{group.label}</h3>
                      <p className="mt-1 text-xs text-zinc-500">{classesInGroup.length} kelas terdaftar</p>
                    </div>
                    <div className="h-px flex-1 bg-zinc-800/80" aria-hidden="true" />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                </section>
              );
            })}
          </div>
        </div>
      </main>

      <Footer containerClassName="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10" />
    </div>
  );
};

export default ManajemenKelas;
