import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Pagination from '../../components/common/Pagination';
import VisualIcon from '../../components/common/VisualIcon';
import { getCurrentUser } from '../../utils/helpers';
import Footer from '../../components/common/Footer';
import { presensiService } from '../../services/presensiService';

const SiswaRiwayat = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [historyList, setHistoryList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'siswa') {
      navigate('/login');
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await presensiService.getSiswaHistory(currentPage, itemsPerPage);
      const items = Array.isArray(res) ? res : res.data || res.items || [];
      const total = res.meta?.totalItems || res.totalItems || items.length;

      setHistoryList(items);
      setTotalItems(total);
    } catch (err) {
      console.error('Gagal mengambil riwayat presensi siswa:', err);
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

  return (
    <div className="bg-zinc-950 min-h-[100dvh] text-zinc-50 selection:bg-[#29438f]/30">
      <Sidebar role="siswa" />

      <main className="mt-16 flex-1 p-5 sm:p-7 lg:ml-72 lg:mt-0 lg:p-10">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* ── Header Section ── */}
          <section className="grid overflow-hidden rounded-[28px] border border-[#30457f] bg-[#172654] text-white shadow-[0_24px_70px_rgba(23,38,84,0.2)] dark:bg-[#111b3c] lg:grid-cols-[1.3fr_0.7fr]">
            <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#9eafff]/10 blur-3xl" aria-hidden="true" />
              <button
                type="button"
                onClick={() => navigate('/siswa')}
                className="relative inline-flex items-center gap-2 text-sm font-medium text-[#c5cfe0] transition-colors hover:text-white"
              >
                <span aria-hidden="true">&#8592;</span>
                Kembali ke Dashboard
              </button>
              <p className="relative mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#aebcff]">
                Buku Kehadiran
              </p>
              <h1 className="relative mt-3 max-w-xl font-display text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">
                Riwayat Kehadiran Siswa
              </h1>
              <p className="relative mt-4 max-w-lg text-sm leading-7 text-[#c5cfe0] sm:text-base">
                Catatan riwayat status presensi kehadiran Anda pada setiap sesi pertemuan pembelajaran.
              </p>
              <div className="relative mt-8 grid max-w-md grid-cols-2 gap-3 border-t border-white/10 pt-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Nama Siswa</p>
                  <p className="mt-2 text-sm font-medium text-[#edf1ff]">{currentUser?.nama || '-'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#aebcff]">NIPD / NISN</p>
                  <p className="mt-2 text-sm font-medium text-[#edf1ff]">{currentUser?.nipd || currentUser?.nisn || currentUser?.nis || '-'}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between border-t border-white/10 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#aebcff]">Total Sesi Tercatat</p>
                  <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em] text-white">
                    {totalItems} Pertemuan
                  </p>
                  <p className="mt-2 text-sm text-[#c5cfe0]">
                    Data kehadiran tersimpan di sistem presensi resmi.
                  </p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e5ba4b] text-[#172654]" aria-hidden="true">
                  <VisualIcon name="calendar" className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-8 border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={() => navigate('/siswa/jadwal')}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#d8deff] hover:text-white transition-colors"
                >
                  <span>📅</span> Buka Kalender Jadwal Pelajaran &#8594;
                </button>
              </div>
            </div>
          </section>

          {/* ── Table Card ── */}
          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-3xl overflow-hidden shadow-lg">
            <div className="p-6 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-display font-semibold text-zinc-50">Daftar Rekam Kehadiran</h2>
                <p className="text-xs text-zinc-400 mt-1">Rekam status kehadiran per mata pelajaran dan tanggal sesi.</p>
              </div>
              <span className="w-fit rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs font-medium text-zinc-400">
                Halaman {currentPage} dari {totalPages}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-950/70 text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Tanggal &amp; Waktu</th>
                    <th className="px-6 py-4 font-semibold">Mata Pelajaran &amp; Guru</th>
                    <th className="px-6 py-4 text-center font-semibold">Status Kehadiran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-sm text-zinc-300">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-zinc-500">
                        <div className="inline-flex items-center gap-2">
                          <span className="h-4 w-4 rounded-full border-2 border-zinc-600 border-t-transparent animate-spin" />
                          Memuat riwayat kehadiran...
                        </div>
                      </td>
                    </tr>
                  ) : historyList.length > 0 ? (
                    historyList.map((item, index) => {
                      const mapelName = item.nama_mapel || item.mata_pelajaran || item.mapel || '-';
                      const rawDate = item.tanggal ? String(item.tanggal).substring(0, 10) : '';

                      return (
                        <tr key={item.id || index} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="font-semibold text-zinc-100">{formatTanggalLokal(rawDate)}</p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              {item.jam_mulai ? `${item.jam_mulai.substring(0, 5)} - ${item.jam_selesai ? item.jam_selesai.substring(0, 5) : ''}` : '-'}
                              {item.ruang ? ` • ${item.ruang}` : ''}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-zinc-100">{mapelName}</p>
                            <p className="text-xs text-zinc-400 mt-0.5">
                              {item.nama_guru ? `👨‍🏫 ${item.nama_guru}` : ''}
                              {item.topik_materi ? ` • 📖 ${item.topik_materi}` : ''}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                                item.status === 'Hadir'
                                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                  : item.status === 'Izin'
                                  ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                                  : item.status === 'Sakit'
                                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                  : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                              }`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              {item.status || 'Hadir'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-zinc-500">
                        Belum ada catatan riwayat kehadiran yang tersimpan di sistem.
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

export default SiswaRiwayat;
