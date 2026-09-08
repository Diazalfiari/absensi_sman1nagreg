import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Notification from '../../components/common/Notification';
import VisualIcon from '../../components/common/VisualIcon';
import { getCurrentUser } from '../../utils/helpers';
import { mapelService } from '../../services/mapelService';

const KATEGORI_OPTIONS = ['Umum', 'Pilihan', 'Muatan Lokal'];

const getKategoriBadgeColor = (kategori) => {
  const k = (kategori || '').toUpperCase();
  if (k === 'UMUM') {
    return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  }
  if (k === 'PILIHAN') {
    return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
  }
  if (k === 'MUATAN LOKAL' || k === 'MULOK') {
    return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  }
  return 'bg-zinc-800 text-zinc-300 border-zinc-700';
};

const ManajemenMapel = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  // ── State Data & Filter ──
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');

  // ── Modal Tambah / Edit ──
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [formData, setFormData] = useState({
    id: null,
    kodeMapel: '',
    namaMapel: '',
    kategori: 'Umum',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // ── Modal Konfirmasi Hapus ──
  const [deletingSubject, setDeletingSubject] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Toast Notification ──
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const showNotification = (type, title, message) => {
    setNotification({ isOpen: true, type, title, message });
  };

  // ── Auth Guard ──
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // ── Fetch Data ──
  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const data = await mapelService.getAllSubjects();
      setSubjects(data || []);
    } catch (err) {
      console.error('Gagal memuat mata pelajaran:', err);
      setErrorMessage(err.message || 'Gagal memuat data mata pelajaran.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  // ── Filter Data ──
  const filteredSubjects = useMemo(() => {
    return subjects.filter((item) => {
      const matchSearch =
        !searchQuery.trim() ||
        (item.nama_mapel && item.nama_mapel.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.kode_mapel && item.kode_mapel.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchKategori =
        selectedKategori === 'Semua' ||
        (item.kategori && item.kategori.toLowerCase() === selectedKategori.toLowerCase());

      return matchSearch && matchKategori;
    });
  }, [subjects, searchQuery, selectedKategori]);

  // ── Statistik Kurikulum Merdeka ──
  const stats = useMemo(() => {
    const total = subjects.length;
    const umum = subjects.filter((s) => (s.kategori || '').toUpperCase() === 'UMUM').length;
    const pilihan = subjects.filter((s) => (s.kategori || '').toUpperCase() === 'PILIHAN').length;
    const mulok = subjects.filter((s) =>
      ['MUATAN LOKAL', 'MULOK'].includes((s.kategori || '').toUpperCase())
    ).length;
    const totalJadwal = subjects.reduce(
      (acc, s) => acc + (parseInt(s.total_jadwal, 10) || 0),
      0
    );

    return { total, umum, pilihan, mulok, totalJadwal };
  }, [subjects]);

  // ── Buka Modal Tambah ──
  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormData({
      id: null,
      kodeMapel: '',
      namaMapel: '',
      kategori: 'Umum',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // ── Buka Modal Edit ──
  const handleOpenEditModal = (subject) => {
    setModalMode('edit');
    setFormData({
      id: subject.id,
      kodeMapel: subject.kode_mapel || '',
      namaMapel: subject.nama_mapel || '',
      kategori: subject.kategori || 'Umum',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // ── Submit Form Tambah / Edit ──
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.kodeMapel.trim()) {
      setFormError('Kode mata pelajaran wajib diisi.');
      return;
    }
    if (!formData.namaMapel.trim()) {
      setFormError('Nama mata pelajaran wajib diisi.');
      return;
    }

    try {
      setFormSubmitting(true);
      if (modalMode === 'add') {
        await mapelService.createSubject({
          kodeMapel: formData.kodeMapel.trim().toUpperCase(),
          namaMapel: formData.namaMapel.trim(),
          kategori: formData.kategori.trim(),
        });
        showNotification('success', 'Berhasil', `Mata pelajaran '${formData.namaMapel}' berhasil ditambahkan.`);
      } else {
        await mapelService.updateSubject(formData.id, {
          kodeMapel: formData.kodeMapel.trim().toUpperCase(),
          namaMapel: formData.namaMapel.trim(),
          kategori: formData.kategori.trim(),
        });
        showNotification('success', 'Berhasil', `Mata pelajaran '${formData.namaMapel}' berhasil diperbarui.`);
      }

      setIsModalOpen(false);
      await fetchSubjects();
    } catch (err) {
      setFormError(err.message || 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // ── Konfirmasi Hapus ──
  const handleConfirmDelete = async () => {
    if (!deletingSubject || isDeleting) return;

    const targetSubject = deletingSubject;
    try {
      setIsDeleting(true);
      const res = await mapelService.deleteSubject(targetSubject.id);
      showNotification(
        'success',
        'Mata Pelajaran Dihapus',
        res?.message || `Mata pelajaran '${targetSubject.nama_mapel}' berhasil dihapus.`
      );
      setDeletingSubject(null);
      await fetchSubjects();
    } catch (err) {
      showNotification('error', 'Gagal Menghapus', err.message || 'Mata pelajaran tidak dapat dihapus.');
      setDeletingSubject(null);
      await fetchSubjects();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-zinc-50 selection:bg-[#29438f]/30">
      <Sidebar role="admin" />

      <main className="mt-16 p-5 transition-all duration-300 sm:p-7 lg:ml-72 lg:mt-0 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* ── Page Header ── */}
          <header className="flex flex-col gap-6 border-b border-zinc-800/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-400">
                  <VisualIcon name="book" className="h-3.5 w-3.5" />
                  Kurikulum & Akademik
                </span>
              </div>
              <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-zinc-50 sm:text-4xl">
                Manajemen Mata Pelajaran
              </h1>
              <p className="mt-2 text-sm leading-6 text-zinc-400 sm:text-base">
                Kelola master mata pelajaran Kurikulum Merdeka (Kelompok Umum, Pilihan, & Muatan Lokal), serta pantau jadwal dan guru pengampu SMAN 1 Nagreg.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="primary"
                onClick={handleOpenAddModal}
                className="!bg-[#29438f] hover:!bg-[#203674] shadow-lg shadow-blue-900/20 gap-2 font-medium"
              >
                <span>+ Tambah Mata Pelajaran</span>
              </Button>
            </div>
          </header>

          {/* ── Stat Cards Kurikulum Merdeka ── */}
          <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Total Mapel</p>
              <p className="mt-2 text-3xl font-bold text-zinc-50">{loading ? '-' : stats.total}</p>
              <p className="mt-1 text-xs text-zinc-500">Mata pelajaran terdaftar</p>
            </div>

            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">Kelompok Umum</p>
              <p className="mt-2 text-3xl font-bold text-blue-300">{loading ? '-' : stats.umum}</p>
              <p className="mt-1 text-xs text-blue-500/80">Wajib seluruh siswa</p>
            </div>

            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">Kelompok Pilihan</p>
              <p className="mt-2 text-3xl font-bold text-purple-300">{loading ? '-' : stats.pilihan}</p>
              <p className="mt-1 text-xs text-purple-500/80">Fase F / Minat Bakat</p>
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">Muatan Lokal</p>
              <p className="mt-2 text-3xl font-bold text-amber-300">{loading ? '-' : stats.mulok}</p>
              <p className="mt-1 text-xs text-amber-500/80">Bahasa Sunda & Daerah</p>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Jadwal Aktif</p>
              <p className="mt-2 text-3xl font-bold text-emerald-300">{loading ? '-' : stats.totalJadwal}</p>
              <p className="mt-1 text-xs text-emerald-500/80">Sesi kelas mingguan</p>
            </div>
          </section>

          {/* ── Toolbar: Search & Category Filters ── */}
          <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan nama atau kode mapel (misal: MAT-X, Fisika, PPKN-X)..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 pl-10 text-sm text-zinc-100 placeholder-zinc-600 focus:border-[#29438f] focus:outline-none focus:ring-1 focus:ring-[#29438f] transition-all"
              />
              <svg
                className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-zinc-500 hover:text-zinc-300"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills Kurikulum Merdeka */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              <span className="text-xs text-zinc-500 mr-1 hidden sm:inline">Kelompok:</span>
              {['Semua', 'Umum', 'Pilihan', 'Muatan Lokal'].map((kat) => (
                <button
                  key={kat}
                  type="button"
                  onClick={() => setSelectedKategori(kat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedKategori === kat
                      ? 'bg-[#29438f] text-white shadow-sm'
                      : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>
          </section>

          {/* ── Error Banner if any ── */}
          {errorMessage && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300 flex items-center justify-between">
              <span>⚠️ {errorMessage}</span>
              <button
                type="button"
                onClick={fetchSubjects}
                className="text-xs font-semibold underline hover:text-rose-200"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* ── Table Section ── */}
          <section className="overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/60 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 p-5 sm:px-6">
              <div>
                <h2 className="font-display text-lg font-semibold text-zinc-100">Daftar Mata Pelajaran</h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Menampilkan {filteredSubjects.length} dari {subjects.length} mata pelajaran
                </p>
              </div>
              <div className="text-xs font-medium text-zinc-400 bg-zinc-950 px-3 py-1.5 rounded-full border border-zinc-800">
                Tahun Ajaran Aktif
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-900/80 border-b border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th className="px-5 py-3.5 text-center w-14">No</th>
                    <th className="px-5 py-3.5 w-32">Kode Mapel</th>
                    <th className="px-5 py-3.5">Nama Mata Pelajaran</th>
                    <th className="px-5 py-3.5 w-36">Kategori</th>
                    <th className="px-5 py-3.5 text-center w-36">Jadwal Terkait</th>
                    <th className="px-5 py-3.5 text-center w-36">Guru Pengampu</th>
                    <th className="px-5 py-3.5 text-right w-28">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-sm text-zinc-500">
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                          <span>Memuat daftar mata pelajaran...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredSubjects.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-sm text-zinc-500">
                        {searchQuery || selectedKategori !== 'Semua'
                          ? 'Tidak ada mata pelajaran yang cocok dengan filter atau kata kunci pencarian.'
                          : 'Belum ada mata pelajaran yang terdaftar.'}
                      </td>
                    </tr>
                  ) : (
                    filteredSubjects.map((item, index) => {
                      const totalJadwal = parseInt(item.total_jadwal, 10) || 0;
                      const totalGuru = parseInt(item.total_guru, 10) || 0;

                      return (
                        <tr
                          key={item.id}
                          className="transition-colors hover:bg-zinc-850/50 group"
                        >
                          <td className="px-5 py-3.5 text-center text-zinc-500 font-mono text-xs">
                            {index + 1}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="inline-block px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 font-mono text-xs font-semibold text-[#9eafff]">
                              {item.kode_mapel}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-medium text-zinc-100">
                            {item.nama_mapel}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getKategoriBadgeColor(
                                item.kategori
                              )}`}
                            >
                              {item.kategori || 'Umum'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            {totalJadwal > 0 ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                                <span>📅</span> {totalJadwal} Jadwal
                              </span>
                            ) : (
                              <span className="text-xs text-zinc-500">-</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            {totalGuru > 0 ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                                <span>👨‍🏫</span> {totalGuru} Guru
                              </span>
                            ) : (
                              <span className="text-xs text-zinc-500">-</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Edit Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(item)}
                                className="p-2 rounded-lg text-zinc-400 hover:text-primary-400 hover:bg-primary-500/10 transition-colors"
                                title="Edit Mata Pelajaran"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>

                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => setDeletingSubject(item)}
                                className="p-2 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                title="Hapus Mata Pelajaran"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <Footer containerClassName="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10" />

      {/* ── Modal Tambah / Edit Mapel ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !formSubmitting && setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Tambah Mata Pelajaran Baru' : `Edit Mata Pelajaran: ${formData.namaMapel}`}
        size="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300">
              ⚠️ {formError}
            </div>
          )}

          {/* Kode Mapel */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Kode Mata Pelajaran *
            </label>
            <input
              type="text"
              name="kodeMapel"
              value={formData.kodeMapel}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  kodeMapel: e.target.value.toUpperCase(),
                }))
              }
              placeholder="Contoh: MAT-X, BIN-XI, FIS-XII"
              maxLength={20}
              required
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-zinc-100 placeholder-zinc-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors uppercase"
            />
            <p className="mt-1 text-[11px] text-zinc-500">
              Maksimal 20 karakter, gunakan huruf kapital dan tanda strip (misal: BIO-X).
            </p>
          </div>

          {/* Nama Mapel */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Nama Mata Pelajaran *
            </label>
            <input
              type="text"
              name="namaMapel"
              value={formData.namaMapel}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  namaMapel: e.target.value,
                }))
              }
              placeholder="Contoh: Biologi, Informatika, Matematika Tingkat Lanjut"
              maxLength={100}
              required
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Kelompok Kurikulum Merdeka *
            </label>
            <select
              name="kategori"
              value={formData.kategori}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  kategori: e.target.value,
                }))
              }
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors cursor-pointer"
            >
              {KATEGORI_OPTIONS.map((kat) => (
                <option key={kat} value={kat}>
                  {kat}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={formSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={formSubmitting}
              className="!bg-[#29438f] hover:!bg-[#203674]"
            >
              {formSubmitting
                ? 'Menyimpan...'
                : modalMode === 'add'
                ? 'Simpan Mata Pelajaran'
                : 'Perbarui Mata Pelajaran'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Dialog Konfirmasi Hapus ── */}
      <ConfirmDialog
        isOpen={Boolean(deletingSubject)}
        onClose={() => !isDeleting && setDeletingSubject(null)}
        onConfirm={handleConfirmDelete}
        disabled={isDeleting}
        title="Hapus Mata Pelajaran"
        message={
          deletingSubject
            ? parseInt(deletingSubject.total_jadwal, 10) > 0
              ? `Peringatan: Mata pelajaran '${deletingSubject.nama_mapel}' (${deletingSubject.kode_mapel}) saat ini masih terhubung dengan ${deletingSubject.total_jadwal} jadwal pelajaran aktif. Anda harus memindahkan atau menghapus jadwal tersebut terlebih dahulu.`
              : `Apakah Anda yakin ingin menghapus mata pelajaran '${deletingSubject.nama_mapel}' (${deletingSubject.kode_mapel})? Tindakan ini tidak dapat dibatalkan.`
            : ''
        }
        confirmText={isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
        cancelText="Batal"
        type="danger"
      />

      {/* ── Toast Notification ── */}
      <Notification
        isOpen={notification.isOpen}
        onClose={() => setNotification((prev) => ({ ...prev, isOpen: false }))}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </div>
  );
};

export default ManajemenMapel;
