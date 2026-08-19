import React from 'react';
import Button from '../../common/Button';

const INPUT_CLASS =
  'w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors';
const SELECT_CLASS =
  'w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors appearance-none cursor-pointer';
const LABEL_CLASS = 'block text-sm font-medium text-zinc-400 mb-1';

/**
 * UserForm
 * Form tambah pengguna secara manual.
 *
 * Props:
 *   role         - 'siswa' | 'guru' | 'admin'
 *   user         - object nilai form saat ini
 *   onChange     - (e: ChangeEvent) => void
 *   onSubmit     - (e: FormEvent) => void
 *   onCancel     - () => void
 */
const UserForm = ({ role, user, onChange, onSubmit, onCancel }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div>
      <label className={LABEL_CLASS}>Nama Lengkap</label>
      <input
        type="text"
        name="nama"
        value={user.nama || ''}
        onChange={onChange}
        className={INPUT_CLASS}
        placeholder="Nama lengkap pengguna"
        required
      />
    </div>
    <div>
      <label className={LABEL_CLASS}>Username</label>
      <input
        type="text"
        name="username"
        value={user.username || ''}
        onChange={onChange}
        className={INPUT_CLASS}
        placeholder="Username untuk login"
        required
      />
    </div>
    <div>
      <label className={LABEL_CLASS}>Password</label>
      <input
        type="password"
        name="password"
        value={user.password || ''}
        onChange={onChange}
        className={INPUT_CLASS}
        placeholder="Password"
        required
      />
    </div>

    {/* ── Siswa fields ── */}
    {role === 'siswa' && (
      <>
        <div>
          <label className={LABEL_CLASS}>NIS</label>
          <input
            type="text"
            name="nipd"
            value={user.nipd || ''}
            onChange={onChange}
            className={INPUT_CLASS}
            placeholder="Nomor Induk Siswa"
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Kelas</label>
          <input
            type="text"
            name="kelas"
            value={user.kelas || ''}
            onChange={onChange}
            className={INPUT_CLASS}
            placeholder="Contoh: X-1"
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Jenis Kelamin</label>
          <select
            name="jenis_kelamin"
            value={user.jenis_kelamin || ''}
            onChange={onChange}
            className={SELECT_CLASS}
          >
            <option value="" disabled>Pilih jenis kelamin</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>
      </>
    )}

    {/* ── Guru fields ── */}
    {role === 'guru' && (
      <>
        <div>
          <label className={LABEL_CLASS}>NIP</label>
          <input
            type="text"
            name="nip"
            value={user.nip || ''}
            onChange={onChange}
            className={INPUT_CLASS}
            placeholder="Nomor Induk Pegawai"
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Jenis Kelamin</label>
          <select
            name="jenis_kelamin"
            value={user.jenis_kelamin || ''}
            onChange={onChange}
            className={SELECT_CLASS}
          >
            <option value="" disabled>Pilih jenis kelamin</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>
        <div>
          <label className={LABEL_CLASS}>Wali Kelas</label>
          <input
            type="text"
            name="wali_kelas"
            value={user.wali_kelas || ''}
            onChange={onChange}
            className={INPUT_CLASS}
            placeholder="Contoh: X-1, X-2 (opsional)"
          />
        </div>
      </>
    )}

    <div className="pt-4 flex justify-end gap-3">
      <Button type="button" variant="outline" onClick={onCancel}>
        Batal
      </Button>
      <Button type="submit" variant="primary">
        Simpan
      </Button>
    </div>
  </form>
);

export default UserForm;
