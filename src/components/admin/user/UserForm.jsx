import React from 'react';
import Button from '../../common/Button';

const INPUT_CLASS =
  'w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors';
const SELECT_CLASS =
  'w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors appearance-none cursor-pointer';
const LABEL_CLASS = 'block text-sm font-medium text-zinc-400 mb-1.5';

const UserForm = ({ role, user, classList = [], subjectList = [], onChange, onSubmit, onCancel }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    {/* ── 1. FORM SISWA ── */}
    {role === 'siswa' && (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLASS}>Nama Lengkap Siswa *</label>
            <input
              type="text"
              name="nama"
              value={user.nama || ''}
              onChange={onChange}
              className={INPUT_CLASS}
              placeholder="Contoh: Budi Santoso"
              required
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>NISN (10 Digit) *</label>
            <input
              type="text"
              name="nisn"
              value={user.nisn || ''}
              onChange={onChange}
              className={`${INPUT_CLASS} font-mono`}
              placeholder="Contoh: 0012345678"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLASS}>Kelas *</label>
            <select
              name="kelas"
              value={user.kelas || user.kelasId || ''}
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
            <label className={LABEL_CLASS}>Jenis Kelamin *</label>
            <select
              name="gender"
              value={user.gender || user.jenis_kelamin || 'L'}
              onChange={onChange}
              className={SELECT_CLASS}
              required
            >
              <option value="L">♂ Laki-laki</option>
              <option value="P">♀ Perempuan</option>
            </select>
          </div>
        </div>
      </>
    )}

    {/* ── 2. FORM GURU ── */}
    {role === 'guru' && (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLASS}>Nama Lengkap Guru *</label>
            <input
              type="text"
              name="nama"
              value={user.nama || ''}
              onChange={onChange}
              className={INPUT_CLASS}
              placeholder="Contoh: Andi Setiawan, S.Pd"
              required
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>NIP (Nomor Induk Pegawai) *</label>
            <input
              type="text"
              name="nip"
              value={user.nip || ''}
              onChange={onChange}
              className={`${INPUT_CLASS} font-mono`}
              placeholder="Contoh: 198001012010011001"
              required
            />
          </div>
        </div>

        <div>
          <label className={LABEL_CLASS}>Mata Pelajaran Pengampu *</label>
          <select
            name="spesialisasi"
            value={user.spesialisasi || user.mapel || ''}
            onChange={onChange}
            className={SELECT_CLASS}
            required
          >
            <option value="">-- Pilih Mata Pelajaran --</option>
            {subjectList && subjectList.length > 0 ? (
              subjectList.map((s) => (
                <option key={s.id || s.nama_mapel} value={s.nama_mapel}>
                  {s.nama_mapel} ({s.kategori || 'Umum'})
                </option>
              ))
            ) : (
              <>
                <option value="Matematika">Matematika</option>
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                <option value="Bahasa Inggris">Bahasa Inggris</option>
                <option value="Fisika">Fisika</option>
                <option value="Kimia">Kimia</option>
                <option value="Biologi">Biologi</option>
                <option value="Sejarah">Sejarah</option>
                <option value="Pendidikan Jasmani">Pendidikan Jasmani</option>
              </>
            )}
          </select>
        </div>
      </>
    )}

    {/* ── 3. FORM ADMIN ── */}
    {role === 'admin' && (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLASS}>Nama Lengkap Admin *</label>
          <input
            type="text"
            name="nama"
            value={user.nama || ''}
            onChange={onChange}
            className={INPUT_CLASS}
            placeholder="Contoh: Administrator Sekolah"
            required
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>NIP Admin *</label>
          <input
            type="text"
            name="nip"
            value={user.nip || ''}
            onChange={onChange}
            className={`${INPUT_CLASS} font-mono`}
            placeholder="Contoh: 198001012010011001"
            required
          />
        </div>
      </div>
    )}

    <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800/80">
      <Button type="button" variant="outline" onClick={onCancel}>
        Batal
      </Button>
      <Button type="submit" variant="primary" className="!bg-[#29438f] hover:!bg-[#203674]">
        Simpan Data
      </Button>
    </div>
  </form>
);

export default UserForm;
