import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import heroImage from '../assets/images/smansan2.jpg';

const accessPoints = [
  {
    role: 'Siswa',
    description: 'Lakukan presensi mandiri dengan verifikasi foto dan lokasi.',
    tone: 'bg-[#eaf0ff] dark:bg-[#152143]',
  },
  {
    role: 'Guru',
    description: 'Kelola presensi kelas dan pantau riwayat kehadiran.',
    tone: 'bg-[#f3f5f8] dark:bg-[#1b1d22]',
  },
  {
    role: 'Admin',
    description: 'Atur pengguna, kelas, jadwal, dan laporan sekolah.',
    tone: 'bg-[#f7f1df] dark:bg-[#292615]',
  },
];

const Home = () => {
  return (
    <div className="home-page min-h-[100dvh] overflow-hidden bg-zinc-950 text-zinc-50 selection:bg-[#29438f]/20">
      <Navbar transparent={true} />

      <main>
        <section className="relative mx-auto max-w-7xl px-6 pb-20 pt-10 sm:pt-16 lg:px-8 lg:pb-28 lg:pt-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#29438f]/10 blur-3xl dark:bg-[#6d80d8]/10"
          />

          <div className="relative grid items-center gap-14 lg:grid-cols-[0.93fr_1.07fr] lg:gap-16">
            <div className="max-w-2xl">
              <div className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#29438f] dark:text-[#9eafff]">
                <span className="h-px w-10 bg-[#e5ba4b]" />
                Portal kehadiran sekolah
              </div>

              <h1 className="max-w-xl font-display text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-zinc-50 sm:text-6xl lg:text-[4.65rem]">
                Presensi digital untuk sekolah yang lebih tertib.
              </h1>

              <p className="mt-7 max-w-lg text-base leading-8 text-zinc-500 dark:text-zinc-400 sm:text-lg">
                Satu pintu untuk mencatat, memantau, dan meninjau kehadiran warga SMAN 1 Nagreg.
              </p>

              <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <Link
                  to="/login"
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#29438f] px-6 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(41,67,143,0.24)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#203674] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5ba4b] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                >
                  Masuk ke sistem
                  <span aria-hidden="true" className="text-lg leading-none">&#8594;</span>
                </Link>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Akses sesuai peran Anda</span>
              </div>
            </div>

            <div className="relative lg:pl-2">
              <div className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
                <figure className="overflow-hidden rounded-2xl border border-zinc-800/70 bg-zinc-900 shadow-[0_24px_70px_rgba(15,23,42,0.16)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.3)] sm:row-span-2">
                  <img
                    src={heroImage}
                    alt="Keluarga besar SMAN 1 Nagreg"
                    className="h-full min-h-[360px] w-full object-cover grayscale-[12%] transition duration-700 hover:scale-[1.025] hover:grayscale-0 sm:min-h-[520px]"
                  />
                </figure>

                <aside className="flex min-h-[220px] flex-col justify-between rounded-2xl bg-[#eaf0ff] p-6 text-[#172654] dark:bg-[#152143] dark:text-[#eef2ff] sm:min-h-0">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#29438f] dark:text-[#aebcff]">
                      Satu sistem
                    </p>
                    <p className="mt-5 max-w-[14rem] font-display text-2xl font-semibold leading-tight tracking-[-0.03em]">
                      Kehadiran tercatat dengan jelas.
                    </p>
                  </div>
                  <p className="mt-8 text-sm leading-6 text-[#52628e] dark:text-[#b4bfdf]">
                    Data presensi tersusun dalam alur yang mudah dipahami oleh setiap peran.
                  </p>
                </aside>

                <div className="flex items-center justify-between rounded-2xl border border-zinc-800/70 bg-zinc-900 px-6 py-5 dark:bg-zinc-900">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Untuk seluruh warga sekolah</p>
                    <p className="mt-2 text-sm font-medium text-zinc-50">Siswa, guru, dan admin</p>
                  </div>
                  <div aria-hidden="true" className="h-10 w-10 rounded-xl border border-[#e5ba4b]/70 bg-[#e5ba4b]/10" />
                </div>
              </div>
              <p className="mt-4 text-xs leading-5 text-zinc-500 dark:text-zinc-500">
                Lingkungan belajar SMAN 1 Nagreg, tempat presensi dimulai setiap hari.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-800/70 bg-zinc-900/40" aria-labelledby="access-title">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.76fr_1.24fr] lg:gap-20 lg:px-8 lg:py-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#29438f] dark:text-[#9eafff]">Dibuat untuk alur sekolah</p>
              <h2 id="access-title" className="mt-4 max-w-sm font-display text-3xl font-semibold leading-tight tracking-[-0.035em] text-zinc-50 sm:text-4xl">
                Semua peran punya ruang kerja yang jelas.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-500 dark:text-zinc-400">
                Masuk sekali, lalu gunakan fitur yang sesuai dengan tanggung jawab Anda di sekolah.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {accessPoints.map((item, index) => (
                <article
                  key={item.role}
                  className={`${item.tone} rounded-2xl p-6 transition duration-200 hover:-translate-y-1 ${index === 0 ? 'sm:col-span-2' : ''}`}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#29438f] dark:text-[#aebcff]">{item.role}</p>
                      <p className="mt-4 max-w-md text-base leading-7 text-[#33436f] dark:text-zinc-300">{item.description}</p>
                    </div>
                    <span aria-hidden="true" className="text-xl text-[#29438f] dark:text-[#aebcff]">&#8599;</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer containerClassName="mx-auto max-w-7xl px-6 lg:px-8" />
    </div>
  );
};

export default Home;
