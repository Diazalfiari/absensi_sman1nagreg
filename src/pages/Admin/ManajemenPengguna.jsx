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

  const labelForTab = activeTab === 'siswa' ? 'Siswa' : 'Guru';

  // ── Edit handlers ──
  const handleEditClick = (user) => {
    setEditingUser({ ...user });
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
      throw err; // Re-throw agar UserModal tidak mereset input form
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBulk = async (newUsers) => {
    try {
      setLoading(true);
      const result = await userService.createUsersBulk(newUsers);
      showNotification('success', 'Import Pengguna Berhasil', `${result.totalBerhasil} data pengguna berhasil disimpan ke database.`);
      setIsAddModalOpen(false);
      fetchUsers();
      fetchCounts();
    } catch (err) {
      showNotification('error', 'Gagal Mengimpor Data', err.message || 'Terjadi kesalahan saat mengimpor data pengguna.');
      throw err; // Re-throw agar preview data tidak dihapus
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
              <p className="text-sm text-zinc-400 mt-1">Kelola data pengguna sistem presensi</p>
            </div>
            <Button variant="primary" size="md" onClick={() => setIsAddModalOpen(true)}>
              + Tambah {activeTab === 'admin' ? 'Admin' : labelForTab}
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

              {/* ── Search Form (On-Demand dengan Tombol Cari) ── */}
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
                        ? 'Cari nama, NIPD, NISN, kelas, gender, email, alamat...'
                        : 'Cari nama, NIP, gelar, mapel, email, kontak...'
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

            {/* ── Table ── */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-900/50 text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">Nama &amp; Username</th>
                    {activeTab === 'siswa' && <th className="px-6 py-4 font-medium">NIPD / NISN</th>}
                    {activeTab === 'siswa' && <th className="px-6 py-4 font-medium">Kelas</th>}
                    {activeTab === 'siswa' && <th className="px-6 py-4 font-medium">L/P</th>}
                    {activeTab === 'guru' && <th className="px-6 py-4 font-medium">NIP</th>}
                    {activeTab === 'guru' && <th className="px-6 py-4 font-medium">Mata Pelajaran</th>}
                    <th className="px-6 py-4 font-medium">Kontak (Email / No. HP)</th>
                    {activeTab === 'siswa' && <th className="px-6 py-4 font-medium">Alamat</th>}
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                      <tr key={`skeleton-${index}`} className="border-b border-zinc-800 animate-pulse">
                        {/* Nama & Username */}
                        <td className="px-6 py-4">
                          <div className="h-4 bg-zinc-800 rounded w-32 mb-1.5" />
                          <div className="h-3 bg-zinc-800/60 rounded w-20" />
                        </td>

                        {/* Siswa: NIPD & NISN */}
                        {activeTab === 'siswa' && (
                          <td className="px-6 py-4">
                            <div className="h-4 bg-zinc-800 rounded w-20 mb-1" />
                            <div className="h-3 bg-zinc-800/60 rounded w-16" />
                          </td>
                        )}

                        {/* Siswa: Kelas */}
                        {activeTab === 'siswa' && (
                          <td className="px-6 py-4">
                            <div className="h-6 bg-zinc-800 rounded-md w-12" />
                          </td>
                        )}

                        {/* Siswa: Gender */}
                        {activeTab === 'siswa' && (
                          <td className="px-6 py-4">
                            <div className="h-4 bg-zinc-800 rounded w-16" />
                          </td>
                        )}

                        {/* Guru: NIP */}
                        {activeTab === 'guru' && (
                          <td className="px-6 py-4">
                            <div className="h-4 bg-zinc-800 rounded w-28" />
                          </td>
                        )}

                        {/* Guru: Mata Pelajaran */}
                        {activeTab === 'guru' && (
                          <td className="px-6 py-4">
                            <div className="h-4 bg-zinc-800 rounded w-24" />
                          </td>
                        )}

                        {/* Kontak: Email & No HP */}
                        <td className="px-6 py-4">
                          <div className="h-4 bg-zinc-800 rounded w-36 mb-1" />
                          <div className="h-3 bg-zinc-800/60 rounded w-24" />
                        </td>

                        {/* Siswa: Alamat */}
                        {activeTab === 'siswa' && (
                          <td className="px-6 py-4">
                            <div className="h-4 bg-zinc-800 rounded w-28" />
                          </td>
                        )}

                        {/* Status */}
                        <td className="px-6 py-4">
                          <div className="h-6 bg-zinc-800 rounded-md w-14" />
                        </td>

                        {/* Aksi */}
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
                        {/* Nama & Username */}
                        <td className="px-6 py-4">
                          <div className="font-medium text-zinc-100">{user.nama}</div>
                          <div className="text-xs text-zinc-500 font-mono">@{user.username}</div>
                        </td>

                        {/* NIPD & NISN untuk Siswa */}
                        {activeTab === 'siswa' && (
                          <td className="px-6 py-4">
                            <div className="font-mono text-zinc-200 text-xs font-semibold">{user.nipd || '-'}</div>
                            {user.nisn && (
                              <div className="text-[11px] text-zinc-500 font-mono">NISN: {user.nisn}</div>
                            )}
                          </td>
                        )}

                        {/* Kelas untuk Siswa */}
                        {activeTab === 'siswa' && (
                          <td className="px-6 py-4 text-zinc-300">
                            <span className="px-2.5 py-1 bg-zinc-800 rounded-md text-xs font-medium border border-zinc-700">
                              {user.nama_kelas || user.kelas || '-'}
                            </span>
                          </td>
                        )}

                        {/* Jenis Kelamin untuk Siswa */}
                        {activeTab === 'siswa' && (
                          <td className="px-6 py-4 text-zinc-300 text-xs">
                            {user.gender === 'P' || user.jenis_kelamin === 'P' ? (
                              <span className="text-pink-400 font-medium">♀ Perempuan</span>
                            ) : (
                              <span className="text-sky-400 font-medium">♂ Laki-laki</span>
                            )}
                          </td>
                        )}

                        {/* NIP untuk Guru */}
                        {activeTab === 'guru' && (
                          <td className="px-6 py-4 font-mono text-zinc-300 text-xs">{user.nip || '-'}</td>
                        )}

                        {/* Spesialisasi / Mata Pelajaran untuk Guru */}
                        {activeTab === 'guru' && (
                          <td className="px-6 py-4 text-zinc-300 text-xs max-w-[180px] truncate">
                            <div className="font-medium text-zinc-200">{user.spesialisasi || 'Guru Pengampu'}</div>
                          </td>
                        )}

                        {/* Kontak: Email & No HP */}
                        <td className="px-6 py-4 text-xs">
                          <div className="text-zinc-300">{user.email || '-'}</div>
                          {user.phone && <div className="text-zinc-500 font-mono mt-0.5">{user.phone}</div>}
                        </td>

                        {/* Alamat untuk Siswa */}
                        {activeTab === 'siswa' && (
                          <td className="px-6 py-4 text-xs text-zinc-400 max-w-[180px] truncate" title={user.alamat || ''}>
                            {user.alamat || '-'}
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
                        Belum ada data pengguna yang sesuai.
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
            ? `Apakah Anda yakin ingin menonaktifkan akun '${statusToggleUser?.nama}' (${statusToggleUser?.username})? Pengguna yang berstatus non-aktif tidak akan dapat login ke sistem.`
            : `Apakah Anda yakin ingin mengaktifkan kembali akun '${statusToggleUser?.nama}' (${statusToggleUser?.username})?`
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
        message={`Apakah Anda yakin ingin menghapus akun '${deletingUser?.nama}' (${deletingUser?.username})? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        type="danger"
      />

      {/* ── Edit Modal ── */}
      {editingUser && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Pengguna"
          size="lg"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div>
                <label className={LABEL_CLASS}>Username *</label>
                <input
                  type="text"
                  name="username"
                  value={editingUser.username || ''}
                  onChange={handleEditChange}
                  className={INPUT_CLASS}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editingUser.email || ''}
                  onChange={handleEditChange}
                  className={INPUT_CLASS}
                  placeholder="email@sekolah.sch.id"
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Nomor HP / WhatsApp</label>
                <input
                  type="text"
                  name="phone"
                  value={editingUser.phone || ''}
                  onChange={handleEditChange}
                  className={INPUT_CLASS}
                  placeholder="Contoh: 081234567890"
                />
              </div>
            </div>

            {editingUser.role === 'siswa' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL_CLASS}>NIPD</label>
                    <input
                      type="text"
                      name="nipd"
                      value={editingUser.nipd || ''}
                      onChange={handleEditChange}
                      className={INPUT_CLASS}
                      placeholder="Nomor Induk Peserta Didik"
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>NISN</label>
                    <input
                      type="text"
                      name="nisn"
                      value={editingUser.nisn || ''}
                      onChange={handleEditChange}
                      className={INPUT_CLASS}
                      placeholder="Nomor Induk Siswa Nasional (10 digit)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL_CLASS}>Kelas</label>
                    <input
                      type="text"
                      name="kelas"
                      value={editingUser.nama_kelas || editingUser.kelas || ''}
                      onChange={handleEditChange}
                      className={INPUT_CLASS}
                      placeholder="Contoh: X-1"
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Jenis Kelamin</label>
                    <select
                      name="gender"
                      value={editingUser.gender || editingUser.jenis_kelamin || 'L'}
                      onChange={handleEditChange}
                      className={`${INPUT_CLASS} appearance-none cursor-pointer`}
                    >
                      <option value="L">♂ Laki-laki</option>
                      <option value="P">♀ Perempuan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={LABEL_CLASS}>Alamat</label>
                  <textarea
                    name="alamat"
                    value={editingUser.alamat || ''}
                    onChange={handleEditChange}
                    rows={2}
                    className={INPUT_CLASS}
                    placeholder="Alamat tempat tinggal"
                  />
                </div>
              </>
            )}

            {editingUser.role === 'guru' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLASS}>NIP</label>
                  <input
                    type="text"
                    name="nip"
                    value={editingUser.nip || ''}
                    onChange={handleEditChange}
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Mata Pelajaran</label>
                  <input
                    type="text"
                    name="spesialisasi"
                    value={editingUser.spesialisasi || ''}
                    onChange={handleEditChange}
                    className={INPUT_CLASS}
                    placeholder="Contoh: Matematika"
                  />
                </div>
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

      {/* ── Toast Notification Component (Tampil di depan modal z-[9999]) ── */}
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
