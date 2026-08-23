import React from 'react';
import Button from '../../common/Button';

const INPUT_CLASS =
  'w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors';
const SELECT_CLASS =
  'w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors appearance-none cursor-pointer';
const LABEL_CLASS = 'block text-sm font-medium text-zinc-400 mb-1';

const UserForm = ({ role, user, classList = [], onChange, onSubmit, onCancel }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className={LABEL_CLASS}>Nama Lengkap *</label>
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
        <label className={LABEL_CLASS}>Username *</label>
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
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label className={LABEL_CLASS}>Password *</label>
        <input
          type="password"
          name="password"
          value={user.password || ''}
          onChange={onChange}
          className={INPUT_CLASS}
          placeholder="Password akun"
          required
        />
      </div>
      <div>
        <label className={LABEL_CLASS}>Email</label>
        <input
          type="email"
          name="email"
          value={user.email || ''}
          onChange={onChange}
          className={INPUT_CLASS}
          placeholder="email@contoh.sch.id"
        />
      </div>
      <div>
        <label className={LABEL_CLASS}>Nomor HP / WhatsApp</label>
        <input
          type="text"
          name="phone"
          value={user.phone || ''}
          onChange={onChange}
          className={INPUT_CLASS}
          placeholder="081234567890"
        />
      </div>
    </div>

    {/* ── Siswa fields ── */}
    {role === 'siswa' && (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLASS}>NIPD *</label>
            <input
              type="text"
              name="nipd"
              value={user.nipd || ''}
              onChange={onChange}
              className={INPUT_CLASS}
              placeholder="Nomor Induk Peserta Didik"
              required
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>NISN</label>
            <input
              type="text"
              name="nisn"
              value={user.nisn || ''}
              onChange={onChange}
              className={INPUT_CLASS}
              placeholder="Nomor Induk Siswa Nasional (10 digit)"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLASS}>Kelas *</label>
            <select
              name="kelas"
              value={user.kelas || ''}
              onChange={onChange}
              className={SELECT_CLASS}
              required
            >
              <option value="">-- Pilih Kelas --</option>
              {classList && classList.length > 0 ? (
                classList.map((cls) => (
                  <option key={cls.id || cls.nama_kelas} value={cls.nama_kelas}>
                    Kelas {cls.nama_kelas}
                  </option>
                ))
              ) : (
                <>
                  <option value="X-1">Kelas X-1</option>
                  <option value="X-2">Kelas X-2</option>
                  <option value="XI-1">Kelas XI-1</option>
                  <option value="XII-1">Kelas XII-1</option>
                </>
              )}
            </select>
          </div>
          <div>
            <label className={LABEL_CLASS}>Jenis Kelamin</label>
            <select
              name="gender"
              value={user.gender || user.jenis_kelamin || 'L'}
              onChange={onChange}
              className={SELECT_CLASS}
            >
              <option value="L">♂ Laki-laki</option>
              <option value="P">♀ Perempuan</option>
            </select>
          </div>
        </div>

        <div>
          <label className={LABEL_CLASS}>Alamat Tempat Tinggal</label>
          <textarea
            name="alamat"
            value={user.alamat || ''}
            onChange={onChange}
            rows={2}
            className={INPUT_CLASS}
            placeholder="Alamat lengkap siswa (contoh: Jl. Raya Nagreg No. 12)"
          />
        </div>
      </>
    )}

    {/* ── Guru fields ── */}
    {role === 'guru' && (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <label className={LABEL_CLASS}>Mata Pelajaran Pengampu</label>
          <input
            type="text"
            name="spesialisasi"
            value={user.spesialisasi || ''}
            onChange={onChange}
            className={INPUT_CLASS}
            placeholder="Contoh: Matematika"
          />
        </div>
      </div>
    )}

    <div className="pt-4 flex justify-end gap-3">
      <Button type="button" variant="outline" onClick={onCancel}>
        Batal
      </Button>
      <Button type="submit" variant="primary">
        Simpan Data
      </Button>
    </div>
  </form>
);

export default UserForm;
