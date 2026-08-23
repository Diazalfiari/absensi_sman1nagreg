import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Pagination from '../../components/common/Pagination';
import VisualIcon from '../../components/common/VisualIcon';
import { getCurrentUser } from '../../utils/helpers';
import Footer from '../../components/common/Footer';
import { presensiService } from '../../services/presensiService';

const GuruRiwayat = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [historyList, setHistoryList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'guru') {
      navigate('/login');
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await presensiService.getGuruHistory(currentPage, itemsPerPage);
      const items = Array.isArray(res) ? res : res.data || res.items || [];
      const total = res.meta?.totalItems || res.totalItems || items.length;

      setHistoryList(items);
      setTotalItems(total);
    } catch (err) {
      console.error('Gagal mengambil riwayat sesi presensi guru:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatTanggalLokal = (tglStr) => {
    if (!tglStr) return '-';
    if (typeof tglStr === 'string' && tglStr.includes('-')) {
      const parts = tglStr.substring(0, 10).split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        const localDate = new Date(y, m, d);
        return localDate.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
    }
    const date = new Date(tglStr);
    return isNaN(date.getTime())
      ? tglStr
      : date.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
  };

  // Hitung total hadir kumulatif untuk ringkasan
  const totalSesi = totalItems;
  const totalHadirSemua = historyList.reduce(
    (acc, curr) => acc + parseInt(curr.hadir ?? curr.hadir_count ?? 0, 10),
    0
  );
  const totalSiswaSemua = historyList.reduce(
    (acc, curr) =>
      acc +
      parseInt(
        curr.total_siswa ||
          (parseInt(curr.hadir ?? curr.hadir_count ?? 0, 10) +
            parseInt(curr.izin ?? curr.izin_count ?? 0, 10) +
            parseInt(curr.sakit ?? curr.sakit_count ?? 0, 10) +
            parseInt(curr.alpa ?? curr.alpa_count ?? 0, 10)),
        10
      ),
    0
  );

  return (
    <div className="bg-zinc-950 min-h-[100dvh] text-zinc-50 selection:bg-[#29438f]/30">
      <Sidebar role="guru" />

      <main className="mt-16 flex-1 p-5 sm:p-7 lg:ml-72 lg:mt-0 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* ── Header Banner ── */}
          <section className="grid overflow-hidden rounded-[28px] border border-[#30457f] bg-[#172654] text-white shadow-[0_24px_70px_rgba(23,38,84,0.2)] dark:bg-[#111b3c] lg:grid-cols-[1.3fr_0.7fr]">
            <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#9eafff]/10 blur-3xl" aria-hidden="true" />
              <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-[#aebcff]">Rekam Histori Mengajar</p>
              <h1 className="relative mt-3 max-w-xl font-display text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">
                Catatan Pengisian Presensi
              </h1>
              <p className="relative mt-4 max-w-lg text-sm leading-7 text-[#c5cfe0] sm:text-base">
                Histori sesi kelas, catatan materi, dan rincian kehadiran siswa yang telah Anda simpan di sistem.
              </p>
              <div className="relative mt-8 grid max-w-md grid-cols-2 gap-3 border-t border-white/10 pt-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Guru Pengampu</p>
                  <p className="mt-2 text-sm font-medium text-[#edf1ff]">{currentUser?.nama || '-'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Total Sesi Tercatat</p>
                  <p className="mt-2 text-sm font-medium text-[#edf1ff]">{totalSesi} Sesi Kelas</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between border-t border-white/10 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Ringkasan Sesi Ditampilkan</p>
                  <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em] text-white">
                    {historyList.length} Sesi
                  </p>
                  <p className="mt-2 text-sm text-[#c5cfe0]">
                    {totalSiswaSemua > 0
                      ? `${totalHadirSemua} dari ${totalSiswaSemua} siswa hadir (${(
                          (totalHadirSemua / totalSiswaSemua) *
                          100
                        ).toFixed(1)}%)`
                      : 'Data kehadiran tersimpan'}
                  </p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e5ba4b] text-[#172654]" aria-hidden="true">
                  <VisualIcon name="chart" className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-8 border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={() => navigate('/guru/Jadwal-mengajar')}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#d8deff] hover:text-white transition-colors"
                >
                  <span>📅</span> Buka Kalender Jadwal Mengajar &#8594;
                </button>
              </div>
            </div>
          </section>

          {/* ── Table Card ── */}
          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-3xl overflow-hidden shadow-lg">
            <div className="p-6 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-display font-semibold text-zinc-50">Daftar Rekam Presensi Sesi</h2>
                <p className="text-xs text-zinc-400 mt-1">Rincian status kehadiran per pertemuan dan rombel.</p>
              </div>
              <span className="w-fit rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs font-medium text-zinc-400">
                Halaman {currentPage} dari {totalPages}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-800 bg-zinc-950/70">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Tanggal &amp; Waktu</th>
                    <th className="px-6 py-4 font-semibold">Kelas</th>
                    <th className="px-6 py-4 font-semibold">Mata Pelajaran &amp; Materi</th>
                    <th className="px-4 py-4 text-center font-semibold text-emerald-400">Hadir</th>
                    <th className="px-4 py-4 text-center font-semibold text-amber-400">Sakit</th>
                    <th className="px-4 py-4 text-center font-semibold text-blue-400">Izin</th>
                    <th className="px-4 py-4 text-center font-semibold text-rose-400">Alpa</th>
                    <th className="px-6 py-4 text-center font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-sm text-zinc-300">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-zinc-500">
                        <div className="inline-flex items-center gap-2">
                          <span className="h-4 w-4 rounded-full border-2 border-zinc-600 border-t-transparent animate-spin" />
                          Memuat rekam riwayat presensi...
                        </div>
                      </td>
                    </tr>
                  ) : historyList.length > 0 ? (
                    historyList.map((item, index) => {
                      const hadirVal = parseInt(item.hadir ?? item.hadir_count ?? 0, 10);
                      const sakitVal = parseInt(item.sakit ?? item.sakit_count ?? 0, 10);
                      const izinVal = parseInt(item.izin ?? item.izin_count ?? 0, 10);
                      const alpaVal = parseInt(item.alpa ?? item.alpa_count ?? 0, 10);

                      const mapelName = item.nama_mapel || item.mata_pelajaran || item.mapel || '-';
                      const rawDate = item.tanggal ? String(item.tanggal).substring(0, 10) : '';

                      return (
                        <tr key={item.id || index} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="font-medium text-zinc-100">{formatTanggalLokal(rawDate)}</p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              {item.jam_mulai ? `${item.jam_mulai.substring(0, 5)} - ${item.jam_selesai ? item.jam_selesai.substring(0, 5) : ''}` : '-'}
                              {item.ruang ? ` • ${item.ruang}` : ''}
                            </p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center rounded-lg border border-[#30457f]/60 bg-[#172654]/60 px-2.5 py-1 text-xs font-semibold text-[#aebcff]">
                              Kelas {item.nama_kelas || item.kelas || '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-zinc-100">{mapelName}</p>
                            <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                              {item.topik_materi ? `📖 ${item.topik_materi}` : 'Topik belum ditambahkan'}
                            </p>
                          </td>
                          <td className="px-4 py-4 text-center whitespace-nowrap">
                            <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 text-xs font-bold text-emerald-400">
                              {hadirVal}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center whitespace-nowrap">
                            <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 text-xs font-bold text-amber-400">
                              {sakitVal}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center whitespace-nowrap">
                            <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 text-xs font-bold text-blue-400">
                              {izinVal}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center whitespace-nowrap">
                            <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 text-xs font-bold text-rose-400">
                              {alpaVal}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() =>
                                navigate('/guru/detail-sesi', {
                                  state: {
                                    schedule: {
                                      id: item.schedule_id || item.id,
                                      mataPelajaran: mapelName,
                                      kelas: item.nama_kelas,
                                      jamMulai: item.jam_mulai ? item.jam_mulai.substring(0, 5) : '07:30',
                                      jamSelesai: item.jam_selesai ? item.jam_selesai.substring(0, 5) : '09:00',
                                      ruang: item.ruang,
                                      tingkat: item.tingkat,
                                      mapel_id: item.mapel_id,
                                      kelas_id: item.kelas_id,
                                    },
                                    date: rawDate,
                                  },
                                })
                              }
                              className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:bg-zinc-700 hover:text-white"
                            >
                              Buka Sesi &#8594;
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-zinc-500">
                        Belum ada catatan riwayat sesi presensi yang tersimpan di sistem.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {!loading && totalPages > 1 && (
              <div className="p-4 border-t border-zinc-800 flex justify-center sm:justify-end">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer containerClassName="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10" />
    </div>
  );
};

export default GuruRiwayat;
