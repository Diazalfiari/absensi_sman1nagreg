import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import Footer from '../../components/common/Footer';
import UserModal from '../../components/admin/user/UserModal';
import { getCurrentUser } from '../../utils/helpers';
import { users as initialUsers } from '../../data/mockData';

const INPUT_CLASS =
  'w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors';
const LABEL_CLASS = 'block text-sm font-medium text-zinc-400 mb-1';

const ITEMS_PER_PAGE = 10;

const ManajemenPengguna = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  // ── Page state ──
  const [activeTab, setActiveTab] = useState('siswa');
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // ── Edit modal ──
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // ── Add modal ──
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // ── Auth guard ──
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') navigate('/login');
  }, [currentUser, navigate]);

  // ── Reset page on tab / search change ──
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // ── Derived data ──
  const filteredUsers = users.filter((user) => {
    const matchesTab = user.role === activeTab;
    const q = searchQuery.toLowerCase();
    return (
      matchesTab &&
      (user.nama?.toLowerCase().includes(q) ||
        user.username?.toLowerCase().includes(q) ||
        user.nipd?.toLowerCase().includes(q) ||
        user.nip?.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const tabs = [
    { id: 'siswa', label: 'Siswa', count: users.filter((u) => u.role === 'siswa').length },
    { id: 'guru', label: 'Guru', count: users.filter((u) => u.role === 'guru').length },
    { id: 'admin', label: 'Admin', count: users.filter((u) => u.role === 'admin').length },
  ];

  const labelForTab = activeTab === 'siswa' ? 'Siswa' : 'Guru';

  // ── Edit handlers ──
  const handleEditClick = (user) => {
    setEditingUser({ ...user });
    setIsEditModalOpen(true);
  };
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
    setIsEditModalOpen(false);
    setEditingUser(null);
  };
  const handleEditChange = (e) =>
    setEditingUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ── Add handlers (delegated from UserModal) ──
  const handleSaveManual = (newUser) => {
    setUsers([...users, { ...newUser, id: Date.now() }]);
    setIsAddModalOpen(false);
  };
  const handleSaveBulk = (newUsers) => {
    setUsers([...users, ...newUsers]);
    setIsAddModalOpen(false);
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
            <div className="flex flex-col sm:flex-row justify-between border-b border-zinc-800">
              <div className="flex overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
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
              <div className="p-3 sm:border-l border-zinc-800 flex items-center sm:min-w-[300px]">
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Cari pengguna..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* ── Table ── */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-900/50 text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">Nama</th>
                    <th className="px-6 py-4 font-medium">Username</th>
                    {activeTab === 'siswa' && <th className="px-6 py-4 font-medium">NIS</th>}
                    {activeTab === 'siswa' && <th className="px-6 py-4 font-medium">Kelas</th>}
                    {activeTab === 'guru' && <th className="px-6 py-4 font-medium">NIP</th>}
                    {activeTab === 'guru' && <th className="px-6 py-4 font-medium">Wali Kelas</th>}
                    {(activeTab === 'siswa' || activeTab === 'guru') && (
                      <th className="px-6 py-4 font-medium">Jenis Kelamin</th>
                    )}
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-zinc-100">{user.nama}</td>
                        <td className="px-6 py-4 text-zinc-400">{user.username}</td>
                        {activeTab === 'siswa' && (
                          <td className="px-6 py-4 text-zinc-400">{user.nipd || '-'}</td>
                        )}
                        {activeTab === 'siswa' && (
                          <td className="px-6 py-4 text-zinc-400">
                            <span className="px-2 py-1 bg-zinc-800 rounded text-xs border border-zinc-700">
                              {user.kelas || '-'}
                            </span>
                          </td>
                        )}
                        {activeTab === 'guru' && (
                          <td className="px-6 py-4 text-zinc-400">{user.nip || '-'}</td>
                        )}
                        {activeTab === 'guru' && (
                          <td className="px-6 py-4 text-zinc-400 max-w-[160px] truncate">
                            {user.wali_kelas || '-'}
                          </td>
                        )}
                        {(activeTab === 'siswa' || activeTab === 'guru') && (
                          <td className="px-6 py-4 text-zinc-400">
                            {user.jenis_kelamin === 'L'
                              ? '♂ Laki-laki'
                              : user.jenis_kelamin === 'P'
                              ? '♀ Perempuan'
                              : '-'}
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-xs font-medium">
                            Aktif
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(user)}
                              className="px-3 py-1.5 text-xs text-zinc-400 hover:text-primary-400 transition-colors bg-zinc-800 rounded-md border border-zinc-700 hover:border-primary-500/30"
                            >
                              Edit
                            </button>
                            {user.id !== currentUser.id && (
                              <button className="px-3 py-1.5 text-xs text-zinc-400 hover:text-rose-400 transition-colors bg-zinc-800 rounded-md border border-zinc-700 hover:border-rose-500/30">
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
              totalItems={filteredUsers.length}
              showInfo
            />
          </Card>
        </div>
      </main>
      <Footer />

      {/* ── Edit Modal ── */}
      {editingUser && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Pengguna"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className={LABEL_CLASS}>Nama Lengkap</label>
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
              <label className={LABEL_CLASS}>Username</label>
              <input
                type="text"
                name="username"
                value={editingUser.username || ''}
                onChange={handleEditChange}
                className={INPUT_CLASS}
                required
              />
            </div>
            {editingUser.role === 'siswa' && (
              <>
                <div>
                  <label className={LABEL_CLASS}>NIS</label>
                  <input type="text" name="nipd" value={editingUser.nipd || ''} onChange={handleEditChange} className={INPUT_CLASS} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Kelas</label>
                  <input type="text" name="kelas" value={editingUser.kelas || ''} onChange={handleEditChange} className={INPUT_CLASS} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Jenis Kelamin</label>
                  <select name="jenis_kelamin" value={editingUser.jenis_kelamin || ''} onChange={handleEditChange} className={`${INPUT_CLASS} appearance-none cursor-pointer`}>
                    <option value="">-- Pilih --</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </>
            )}
            {editingUser.role === 'guru' && (
              <>
                <div>
                  <label className={LABEL_CLASS}>NIP</label>
                  <input type="text" name="nip" value={editingUser.nip || ''} onChange={handleEditChange} className={INPUT_CLASS} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Jenis Kelamin</label>
                  <select name="jenis_kelamin" value={editingUser.jenis_kelamin || ''} onChange={handleEditChange} className={`${INPUT_CLASS} appearance-none cursor-pointer`}>
                    <option value="">-- Pilih --</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLASS}>Wali Kelas</label>
                  <input type="text" name="wali_kelas" value={editingUser.wali_kelas || ''} onChange={handleEditChange} className={INPUT_CLASS} placeholder="Contoh: X-1, X-2" />
                </div>
              </>
            )}
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
    </div>
  );
};

export default ManajemenPengguna;
