import React, { useState } from 'react';
import Modal from '../../common/Modal';
import UserForm from './UserForm';
import UserImport from './UserImport';

const ADD_METHODS = [
  { id: 'manual', label: '✏️ Manual' },
  { id: 'excel', label: '📂 Import Excel' },
  { id: 'paste', label: '📋 Copy-Paste Excel' },
];

/**
 * UserModal
 * Modal tambah pengguna baru dengan 3 metode:
 *   - Manual (form)
 *   - Import CSV / Excel
 *   - Copy-Paste dari Excel
 *
 * Props:
 *   isOpen       - boolean
 *   role         - 'siswa' | 'guru'
 *   onClose      - () => void
 *   onSaveManual - (user: object) => void
 *   onSaveBulk   - (users: object[]) => void
 */
const UserModal = ({ isOpen, role, onClose, onSaveManual, onSaveBulk }) => {
  const [addMethod, setAddMethod] = useState('manual');
  const [newUser, setNewUser] = useState({});

  const labelForRole = role === 'siswa' ? 'Siswa' : 'Guru';

  const handleMethodChange = (id) => {
    setAddMethod(id);
    setNewUser({});
  };

  const handleManualChange = (e) =>
    setNewUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSaveManual = (e) => {
    e.preventDefault();
    onSaveManual({ ...newUser, role });
    setNewUser({});
  };

  const handleSaveBulk = (users) => {
    onSaveBulk(users);
  };

  // Reset state saat modal ditutup
  const handleClose = () => {
    setAddMethod('manual');
    setNewUser({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Tambah ${labelForRole}`} size="lg">
      {/* Method Selector — hanya untuk siswa & guru */}
      {role !== 'admin' && (
        <div className="flex gap-2 mb-5 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
          {ADD_METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => handleMethodChange(m.id)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                addMethod === m.id
                  ? 'bg-primary-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      {/* Method: Manual (selalu tampil untuk admin, dan saat dipilih untuk siswa/guru) */}
      {(addMethod === 'manual' || role === 'admin') && (
        <UserForm
          role={role}
          user={newUser}
          onChange={handleManualChange}
          onSubmit={handleSaveManual}
          onCancel={handleClose}
        />
      )}

      {/* Method: Import Excel — hanya untuk siswa & guru */}
      {role !== 'admin' && addMethod === 'excel' && (
        <UserImport
          role={role}
          method="excel"
          onSave={handleSaveBulk}
          onCancel={handleClose}
        />
      )}

      {/* Method: Copy-Paste Excel — hanya untuk siswa & guru */}
      {role !== 'admin' && addMethod === 'paste' && (
        <UserImport
          role={role}
          method="paste"
          onSave={handleSaveBulk}
          onCancel={handleClose}
        />
      )}
    </Modal>
  );
};

export default UserModal;
