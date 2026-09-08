import React, { useState, useEffect } from 'react';
import Modal from '../../common/Modal';
import UserForm from './UserForm';
import UserImport from './UserImport';
import { kelasService } from '../../../services/kelasService';
import { jadwalService } from '../../../services/jadwalService';

const ADD_METHODS = [
  { id: 'manual', label: '✏️ Tambah Manual' },
  { id: 'excel', label: '📂 Import Excel (.xlsx)' },
  { id: 'paste', label: '📋 Copy-Paste Excel' },
];

/**
 * UserModal
 * Modal tambah pengguna baru dengan 3 metode:
 *   - Manual (Siswa, Guru, Admin)
 *   - Import file Spreadsheet Excel / CSV (Siswa & Guru)
 *   - Copy-Paste dari baris Excel (Siswa & Guru)
 */
const UserModal = ({ isOpen, role, onClose, onSaveManual, onSaveBulk }) => {
  const [addMethod, setAddMethod] = useState('manual');
  const [newUser, setNewUser] = useState({});
  const [classList, setClassList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);

  const labelForRole = role === 'siswa' ? 'Siswa' : role === 'guru' ? 'Guru' : 'Admin';

  // Fetch daftar kelas dari database untuk dropdown siswa
  useEffect(() => {
    if (isOpen && role === 'siswa') {
      const loadClasses = async () => {
        try {
          const classes = await kelasService.getAllClasses();
          setClassList(classes);
        } catch (err) {
          console.error('Gagal memuat daftar kelas untuk dropdown:', err);
        }
      };
      loadClasses();
    }
  }, [isOpen, role]);

  // Fetch daftar mata pelajaran dari database untuk dropdown guru
  useEffect(() => {
    if (isOpen && role === 'guru') {
      const loadSubjects = async () => {
        try {
          const subjects = await jadwalService.getAllSubjects();
          setSubjectList(subjects);
        } catch (err) {
          console.error('Gagal memuat daftar mata pelajaran:', err);
        }
      };
      loadSubjects();
    }
  }, [isOpen, role]);

  const handleMethodChange = (id) => {
    setAddMethod(id);
  };

  const handleManualChange = (e) =>
    setNewUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSaveManual = async (e) => {
    e.preventDefault();
    try {
      await onSaveManual({
        gender: 'L',
        ...newUser,
        role,
      });
      setNewUser({}); // Reset input HANYA saat request berhasil!
    } catch (err) {
      // Biarkan newUser tetap utuh saat gagal agar inputan pengguna tidak hilang
    }
  };

  const handleSaveBulk = async (users) => {
    try {
      await onSaveBulk(users);
    } catch (err) {
      // Biarkan data tetap utuh saat gagal
      throw err;
    }
  };

  // Reset state saat modal ditutup
  const handleClose = () => {
    setAddMethod('manual');
    setNewUser({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Tambah Pengguna: ${labelForRole}`}
      size={addMethod === 'manual' ? 'lg' : '2xl'}
    >
      {/* Method Selector — hanya untuk Siswa & Guru (Admin hanya manual) */}
      {role !== 'admin' && (
        <div className="flex gap-2 mb-5 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
          {ADD_METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => handleMethodChange(m.id)}
              className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                addMethod === m.id
                  ? 'bg-[#29438f] text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      {/* Method: Manual */}
      {(addMethod === 'manual' || role === 'admin') && (
        <UserForm
          role={role}
          user={newUser}
          classList={classList}
          subjectList={subjectList}
          onChange={handleManualChange}
          onSubmit={handleSaveManual}
          onCancel={handleClose}
        />
      )}

      {/* Method: Import Excel — Siswa & Guru */}
      {role !== 'admin' && addMethod === 'excel' && (
        <UserImport
          role={role}
          method="excel"
          classList={classList}
          subjectList={subjectList}
          onSave={handleSaveBulk}
          onCancel={handleClose}
        />
      )}

      {/* Method: Copy-Paste Excel — Siswa & Guru */}
      {role !== 'admin' && addMethod === 'paste' && (
        <UserImport
          role={role}
          method="paste"
          classList={classList}
          subjectList={subjectList}
          onSave={handleSaveBulk}
          onCancel={handleClose}
        />
      )}
    </Modal>
  );
};

export default UserModal;
