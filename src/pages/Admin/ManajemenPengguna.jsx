import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import Footer from '../../components/common/Footer';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Notification from '../../components/common/Notification';
import UserModal from '../../components/admin/user/UserModal';
import { getCurrentUser } from '../../utils/helpers';
import { userService } from '../../services/userService';
import { kelasService } from '../../services/kelasService';
import { jadwalService } from '../../services/jadwalService';

const INPUT_CLASS =
  'w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors';
const LABEL_CLASS = 'block text-sm font-medium text-zinc-400 mb-1';

const ITEMS_PER_PAGE = 10;

const ManajemenPengguna = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  // ── Page state ──
  const [activeTab, setActiveTab] = useState('siswa');
  const [usersList, setUsersList] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // ── Reference data state (untuk dropdown edit modal) ──
  const [classList, setClassList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);

  // ── Notification Toast state ──
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const showNotification = (type, title, message) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  // ── Tab count state ──
  const [counts, setCounts] = useState({ siswa: 0, guru: 0, admin: 0 });

  // ── Edit modal ──
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // ── Add modal ──
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // ── Delete confirmation ──
  const [deletingUser, setDeletingUser] = useState(null);

  // ── Status toggle confirmation ──
  const [statusToggleUser, setStatusToggleUser] = useState(null);

  // ── Auth guard ──
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') navigate('/login');
  }, [currentUser, navigate]);

  // ── Load reference data (Classes & Subjects) ──
  useEffect(() => {
    const loadReferences = async () => {
      try {
        const [classes, subjects] = await Promise.all([
          kelasService.getAllClasses().catch(() => []),
          jadwalService.getAllSubjects().catch(() => []),
        ]);
        setClassList(classes || []);
        setSubjectList(subjects || []);
      } catch (err) {
        console.error('Gagal memuat referensi data:', err);
      }
    };
    loadReferences();
  }, []);

  // ── Fetch users from API ──
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userService.getUsers({
        role: activeTab,
        search: searchQuery,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });

      setUsersList(res.data || []);
      setTotalUsers(res.meta?.totalItems || 0);
      setTotalPages(res.meta?.totalPages || 1);
    } catch (err) {
      console.error('Gagal memuat daftar pengguna:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, currentPage]);

  // ── Fetch tab counts ──
  const fetchCounts = useCallback(async () => {
    try {
      const [siswaRes, guruRes, adminRes] = await Promise.all([
        userService.getUsers({ role: 'siswa', limit: 1 }),
        userService.getUsers({ role: 'guru', limit: 1 }),
        userService.getUsers({ role: 'admin', limit: 1 }),
      ]);
      setCounts({
        siswa: siswaRes.meta?.totalItems || 0,
        guru: guruRes.meta?.totalItems || 0,
        admin: adminRes.meta?.totalItems || 0,
      });
    } catch (err) {
      console.error('Gagal memuat jumlah tab pengguna:', err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchCounts();
  }, [fetchUsers, fetchCounts]);

  // ── Search handlers ──
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setSearchQuery(searchInput.trim());
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const tabs = [
    { id: 'siswa', label: 'Siswa', count: counts.siswa },
    { id: 'guru', label: 'Guru', count: counts.guru },
    { id: 'admin', label: 'Admin', count: counts.admin },
  ];

  const labelForTab = activeTab === 'siswa' ? 'Siswa' : activeTab === 'guru' ? 'Guru' : 'Admin';

  // ── Edit handlers ──
  const handleEditClick = (user) => {
    setEditingUser({
      ...user,
      kelas: user.nama_kelas || user.kelas || '',
      gender: user.gender || user.jenis_kelamin || 'L',
      spesialisasi: user.spesialisasi || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await userService.updateUser(editingUser.id, editingUser);
      showNotification('success', 'Data Diperbarui', 'Perubahan data pengguna berhasil disimpan ke database.');
      setIsEditModalOpen(false);
      setEditingUser(null);
      fetchUsers();
      fetchCounts();
    } catch (err) {
      showNotification('error', 'Gagal Memperbarui Pengguna', err.message || 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) =>
    setEditingUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ── Add handlers (delegated from UserModal) ──
  const handleSaveManual = async (newUser) => {
    try {
      setLoading(true);
      await userService.createUser(newUser);
      showNotification('success', 'Pengguna Baru Ditambahkan', `Akun '${newUser.nama}' berhasil disimpan ke database.`);
      setIsAddModalOpen(false);
      fetchUsers();
      fetchCounts();
    } catch (err) {
      showNotification('error', 'Gagal Menambahkan Pengguna', err.message || 'Terjadi kesalahan saat menyimpan pengguna baru.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBulk = async (newUsers) => {
    try {
      setLoading(true);
      const result = await userService.createUsersBulk(newUsers);
      if (result.totalGagal > 0) {
        const errorDetails = (result.errors || [])
          .map((e) => `Baris ${e.row}: ${e.error}`)
          .slice(0, 5)
          .join('\n');
        showNotification(
          result.totalBerhasil > 0 ? 'warning' : 'error',
          `Hasil Import (${result.totalBerhasil} Berhasil, ${result.totalGagal} Gagal)`,
          `Berhasil: ${result.totalBerhasil} data\nGagal: ${result.totalGagal} data\n${errorDetails}${result.errors && result.errors.length > 5 ? '\n...dan lainnya' : ''}`
        );
      } else {
        showNotification('success', 'Import Pengguna Berhasil', `${result.totalBerhasil} data pengguna berhasil disimpan ke database.`);
      }
      setIsAddModalOpen(false);
      fetchUsers();
      fetchCounts();
    } catch (err) {
      showNotification('error', 'Gagal Mengimpor Data', err.message || 'Terjadi kesalahan saat mengimpor data pengguna.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ── Delete handler ──
  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;
    try {
      setLoading(true);
      await userService.deleteUser(deletingUser.id);
      showNotification('success', 'Pengguna Dihapus', `Akun '${deletingUser.nama}' berhasil dihapus.`);
      setDeletingUser(null);
      fetchUsers();
      fetchCounts();
    } catch (err) {
      showNotification('error', 'Gagal Menghapus Pengguna', err.message || 'Terjadi kesalahan saat menghapus pengguna.');
    } finally {
      setLoading(false);
    }
  };

  // ── Toggle Status handlers ──
  const handleToggleStatusClick = (user) => {
    setStatusToggleUser(user);
  };

  const handleConfirmToggleStatus = async () => {
    if (!statusToggleUser) return;
    try {
      setLoading(true);
      const newStatus = statusToggleUser.is_active !== 0 ? 0 : 1;
      await userService.toggleStatus(statusToggleUser.id, newStatus);
      showNotification(
        'success',
        'Status Pengguna Diperbarui',
        `Status akun '${statusToggleUser.nama}' berhasil diubah menjadi ${newStatus === 1 ? 'Aktif' : 'Non-aktif'}.`
      );
      setStatusToggleUser(null);
      fetchUsers();
      fetchCounts();
    } catch (err) {
      showNotification('error', 'Gagal Mengubah Status', err.message || 'Terjadi kesalahan saat mengubah status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-950 min-h-[100dvh] text-zinc-50 selection:bg-primary-500/30">
      <Sidebar role="admin" />

      <main className="px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-12 pb-12 lg:ml-72">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-display tracking-tight">
                Manajemen Pengguna
              </h1>
              <p className="text-sm text-zinc-400 mt-1">Kelola data siswa, guru, dan admin sistem presensi</p>
            </div>
            <Button variant="primary" size="md" onClick={() => setIsAddModalOpen(true)}>
              + Tambah {labelForTab}
            </Button>
          </div>

          <Card className="bg-zinc-900 border-zinc-800" padding="none">
            {/* ── Tabs & Search ── */}
            <div className="flex flex-col lg:flex-row justify-between border-b border-zinc-800">
              <div className="flex overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-400'
                        : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        activeTab === tab.id
                          ? 'bg-primary-500/10 text-primary-400'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* ── Search Form ── */}
              <form onSubmit={handleSearchSubmit} className="p-3 lg:border-l border-zinc-800 flex items-center gap-2 sm:min-w-[380px]">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder={
                      activeTab === 'siswa'
                        ? 'Cari nama, NISN, kelas...'
                        : activeTab === 'guru'
                        ? 'Cari nama, NIP, mapel...'
                        : 'Cari nama, NIP...'
                    }
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                      title="Bersihkan kata kunci"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <Button type="submit" variant="primary" size="sm" className="whitespace-nowrap px-4 py-2 text-xs font-semibold">
                  Cari
                </Button>
              </form>
            </div>

            {/* ── Table Sesuai Role ── */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-900/50 text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">Nama Lengkap</th>
                    {activeTab === 'siswa' && <th className="px-6 py-4 font-medium">NISN</th>}
                    {activeTab === 'siswa' && <th className="px-6 py-4 font-medium">Kelas</th>}
                    {activeTab === 'siswa' && <th className="px-6 py-4 font-medium">Jenis Kelamin</th>}
                    {activeTab === 'guru' && <th className="px-6 py-4 font-medium">NIP</th>}
                    {activeTab === 'guru' && <th className="px-6 py-4 font-medium">Mata Pelajaran Pengampu</th>}
                    {activeTab === 'admin' && <th className="px-6 py-4 font-medium">NIP</th>}
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                      <tr key={`skeleton-${index}`} className="border-b border-zinc-800 animate-pulse">
                        <td className="px-6 py-4">
                          <div className="h-4 bg-zinc-800 rounded w-36 mb-1" />
                        </td>

                        {activeTab === 'siswa' && (
                          <>
                            <td className="px-6 py-4">
                              <div className="h-4 bg-zinc-800 rounded w-24" />
                            </td>
                            <td className="px-6 py-4">
                              <div className="h-6 bg-zinc-800 rounded-md w-14" />
                            </td>
                            <td className="px-6 py-4">
                              <div className="h-4 bg-zinc-800 rounded w-20" />
                            </td>
                          </>
                        )}

                        {activeTab === 'guru' && (
                          <>
                            <td className="px-6 py-4">
                              <div className="h-4 bg-zinc-800 rounded w-32" />
                            </td>
                            <td className="px-6 py-4">
                              <div className="h-4 bg-zinc-800 rounded w-28" />
                            </td>
                          </>
                        )}

                        {activeTab === 'admin' && (
                          <td className="px-6 py-4">
                            <div className="h-4 bg-zinc-800 rounded w-32" />
                          </td>
                        )}

                        <td className="px-6 py-4">
                          <div className="h-6 bg-zinc-800 rounded-md w-14" />
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <div className="h-7 bg-zinc-800 rounded-md w-12" />
                            <div className="h-7 bg-zinc-800 rounded-md w-14" />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : usersList.length > 0 ? (
                    usersList.map((user) => (
                      <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors">
                        {/* Nama Lengkap */}
                        <td className="px-6 py-4">
                          <div className="font-medium text-zinc-100">{user.nama}</div>
                        </td>

                        {/* Siswa: NISN */}
                        {activeTab === 'siswa' && (
                          <td className="px-6 py-4">
                            <span className="font-mono text-zinc-200 text-xs font-semibold bg-zinc-800/60 px-2.5 py-1 rounded border border-zinc-700/60">
                              {user.nisn || user.username || '-'}
                            </span>
                          </td>
                        )}

                        {/* Siswa: Kelas */}
                        {activeTab === 'siswa' && (
                          <td className="px-6 py-4 text-zinc-300">
                            <span className="px-2.5 py-1 bg-zinc-800 rounded-md text-xs font-medium border border-zinc-700">
                              {user.nama_kelas || user.kelas || '-'}
                            </span>
                          </td>
                        )}

                        {/* Siswa: Jenis Kelamin */}
                        {activeTab === 'siswa' && (
                          <td className="px-6 py-4 text-zinc-300 text-xs">
                            {user.gender === 'P' || user.jenis_kelamin === 'P' ? (
                              <span className="text-pink-400 font-medium">♀ Perempuan</span>
                            ) : (
                              <span className="text-sky-400 font-medium">♂ Laki-laki</span>
                            )}
                          </td>
                        )}

                        {/* Guru: NIP */}
                        {activeTab === 'guru' && (
                          <td className="px-6 py-4">
                            <span className="font-mono text-zinc-200 text-xs bg-zinc-800/60 px-2.5 py-1 rounded border border-zinc-700/60">
                              {user.nip || user.username || '-'}
                            </span>
                          </td>
                        )}

                        {/* Guru: Mata Pelajaran */}
                        {activeTab === 'guru' && (
                          <td className="px-6 py-4 text-zinc-300 text-xs">
                            <span className="px-2.5 py-1 bg-zinc-800/80 rounded-md text-xs font-medium text-zinc-200 border border-zinc-700/80">
                              {user.spesialisasi || '-'}
                            </span>
                          </td>
                        )}

                        {/* Admin: NIP */}
                        {activeTab === 'admin' && (
                          <td className="px-6 py-4">
                            <span className="font-mono text-zinc-200 text-xs bg-zinc-800/60 px-2.5 py-1 rounded border border-zinc-700/60">
                              {user.nip || user.username || '-'}
                            </span>
                          </td>
                        )}

                        {/* Status Akun */}
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 border rounded-md text-xs font-medium ${
                            user.is_active !== 0
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {user.is_active !== 0 ? 'Aktif' : 'Non-aktif'}
                          </span>
                        </td>

                        {/* Aksi */}
                        <td className="px-6 py-4">
                          <div className="flex justify-end items-center gap-1.5">
                            {/* Tombol Ubah Status Aktif / Nonaktif */}
                            {user.id !== currentUser.id && (
                              <button
                                onClick={() => handleToggleStatusClick(user)}
                                title={user.is_active !== 0 ? 'Klik untuk menonaktifkan pengguna' : 'Klik untuk mengaktifkan pengguna'}
                                className={`px-2.5 py-1.5 text-xs font-medium rounded-md border transition-all flex items-center gap-1.5 ${
                                  user.is_active !== 0
                                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-500/50'
                                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50'
                                }`}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full ${user.is_active !== 0 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                                {user.is_active !== 0 ? 'Nonaktifkan' : 'Aktifkan'}
                              </button>
                            )}

                            {/* Tombol Edit */}
                            <button
                              onClick={() => handleEditClick(user)}
                              className="px-2.5 py-1.5 text-xs text-zinc-300 hover:text-primary-400 transition-colors bg-zinc-800 rounded-md border border-zinc-700 hover:border-primary-500/30"
                            >
                              Edit
                            </button>

                            {/* Tombol Hapus */}
                            {user.id !== currentUser.id && (
                              <button
                                onClick={() => setDeletingUser(user)}
                                className="px-2.5 py-1.5 text-xs text-zinc-400 hover:text-rose-400 transition-colors bg-zinc-800 rounded-md border border-zinc-700 hover:border-rose-500/30"
                              >
                                Hapus
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="100%" className="px-6 py-12 text-center text-zinc-500">
                        Belum ada data {labelForTab.toLowerCase()} yang sesuai.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={totalUsers}
              showInfo
            />
          </Card>
        </div>
      </main>
      <Footer />

      {/* ── Status Toggle Confirmation Dialog ── */}
      <ConfirmDialog
        isOpen={Boolean(statusToggleUser)}
        onClose={() => setStatusToggleUser(null)}
        onConfirm={handleConfirmToggleStatus}
        title={statusToggleUser?.is_active !== 0 ? 'Nonaktifkan Pengguna' : 'Aktifkan Pengguna'}
        message={
          statusToggleUser?.is_active !== 0
            ? `Apakah Anda yakin ingin menonaktifkan akun '${statusToggleUser?.nama}' (${statusToggleUser?.nisn || statusToggleUser?.nip || statusToggleUser?.username})? Pengguna yang berstatus non-aktif tidak akan dapat login ke sistem.`
            : `Apakah Anda yakin ingin mengaktifkan kembali akun '${statusToggleUser?.nama}' (${statusToggleUser?.nisn || statusToggleUser?.nip || statusToggleUser?.username})?`
        }
        confirmText={statusToggleUser?.is_active !== 0 ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan'}
        cancelText="Batal"
        type={statusToggleUser?.is_active !== 0 ? 'warning' : 'info'}
      />

      {/* ── Delete Confirmation Dialog ── */}
      <ConfirmDialog
        isOpen={Boolean(deletingUser)}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Pengguna"
        message={`Apakah Anda yakin ingin menghapus akun '${deletingUser?.nama}' (${deletingUser?.nisn || deletingUser?.nip || deletingUser?.username})? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        type="danger"
      />

      {/* ── Edit Modal ── */}
      {editingUser && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Data ${editingUser.role === 'siswa' ? 'Siswa' : editingUser.role === 'guru' ? 'Guru' : 'Admin'}`}
          size="md"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            {/* Nama Lengkap */}
            <div>
              <label className={LABEL_CLASS}>Nama Lengkap *</label>
              <input
                type="text"
                name="nama"
                value={editingUser.nama || ''}
                onChange={handleEditChange}
                className={INPUT_CLASS}
                required
              />
            </div>

            {/* SISWA: NISN, Kelas, Jenis Kelamin */}
            {editingUser.role === 'siswa' && (
              <>
                <div>
                  <label className={LABEL_CLASS}>NISN (10 digit angka) *</label>
                  <input
                    type="text"
                    name="nisn"
                    value={editingUser.nisn || editingUser.username || ''}
                    onChange={handleEditChange}
                    className={INPUT_CLASS}
                    placeholder="Contoh: 0056789012"
                    pattern="[0-9]*"
                    maxLength={10}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL_CLASS}>Kelas *</label>
                    <select
                      name="kelas"
                      value={editingUser.nama_kelas || editingUser.kelas || ''}
                      onChange={handleEditChange}
                      className={`${INPUT_CLASS} appearance-none cursor-pointer`}
                      required
                    >
                      <option value="">-- Pilih Kelas --</option>
                      {classList.map((cls) => {
                        const name = cls.nama_kelas || cls.name || cls;
                        return (
                          <option key={cls.id || name} value={name}>
                            {name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className={LABEL_CLASS}>Jenis Kelamin *</label>
                    <select
                      name="gender"
                      value={editingUser.gender || editingUser.jenis_kelamin || 'L'}
                      onChange={handleEditChange}
                      className={`${INPUT_CLASS} appearance-none cursor-pointer`}
                      required
                    >
                      <option value="L">♂ Laki-laki</option>
                      <option value="P">♀ Perempuan</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* GURU: NIP, Mata Pelajaran */}
            {editingUser.role === 'guru' && (
              <>
                <div>
                  <label className={LABEL_CLASS}>NIP (18 digit angka) *</label>
                  <input
                    type="text"
                    name="nip"
                    value={editingUser.nip || editingUser.username || ''}
                    onChange={handleEditChange}
                    className={INPUT_CLASS}
                    placeholder="Contoh: 198505152010011007"
                    pattern="[0-9]*"
                    maxLength={18}
                    required
                  />
                </div>

                <div>
                  <label className={LABEL_CLASS}>Mata Pelajaran Pengampu *</label>
                  <select
                    name="spesialisasi"
                    value={editingUser.spesialisasi || ''}
                    onChange={handleEditChange}
                    className={`${INPUT_CLASS} appearance-none cursor-pointer`}
                    required
                  >
                    <option value="">-- Pilih Mata Pelajaran --</option>
                    {subjectList.map((sub) => {
                      const name = sub.nama_mapel || sub.nama || sub;
                      return (
                        <option key={sub.id || name} value={name}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </>
            )}

            {/* ADMIN: NIP */}
            {editingUser.role === 'admin' && (
              <div>
                <label className={LABEL_CLASS}>NIP *</label>
                <input
                  type="text"
                  name="nip"
                  value={editingUser.nip || editingUser.username || ''}
                  onChange={handleEditChange}
                  className={INPUT_CLASS}
                  placeholder="Contoh: 198001012010011001"
                  required
                />
              </div>
            )}

            {/* Status Akun */}
            <div>
              <label className={LABEL_CLASS}>Status Akun</label>
              <select
                name="is_active"
                value={editingUser.is_active !== undefined ? (editingUser.is_active ? 1 : 0) : 1}
                onChange={(e) => setEditingUser((prev) => ({ ...prev, is_active: parseInt(e.target.value, 10) }))}
                className={`${INPUT_CLASS} appearance-none cursor-pointer`}
              >
                <option value={1}>🟢 Aktif</option>
                <option value={0}>🔴 Non-aktif</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary">
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Add Modal (UserModal) ── */}
      {isAddModalOpen && (
        <UserModal
          isOpen={isAddModalOpen}
          role={activeTab}
          onClose={() => setIsAddModalOpen(false)}
          onSaveManual={handleSaveManual}
          onSaveBulk={handleSaveBulk}
        />
      )}

      {/* ── Toast Notification Component ── */}
      <Notification
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default ManajemenPengguna;
