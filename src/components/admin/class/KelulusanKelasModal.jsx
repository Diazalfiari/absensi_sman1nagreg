import React, { useState, useEffect } from 'react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';

const KelulusanKelasModal = ({
  isOpen,
  onClose,
  onConfirm,
  currentClass,
  students = [],
}) => {
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && students.length > 0) {
      setSelectedStudentIds(students.map((s) => s.id));
    }
  }, [isOpen, students]);

  const handleToggleSelectAll = () => {
    if (selectedStudentIds.length === students.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(students.map((s) => s.id));
    }
  };

  const handleToggleStudent = (studentId) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async () => {
    if (selectedStudentIds.length === 0) return;
    try {
      setLoading(true);
      await onConfirm({
        studentIds: selectedStudentIds,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!currentClass) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Proses Kelulusan Siswa: Kelas ${currentClass.nama_kelas}`}
      size="lg"
    >
      <div className="space-y-5">
        {/* ── Header Class Card ── */}
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 text-2xl font-bold border border-emerald-500/30">
              🎓
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Tingkat Akhir SMA</p>
              <h3 className="text-xl font-bold text-zinc-100">Kelas {currentClass.nama_kelas}</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Tahun Ajaran: {currentClass.tahun_ajaran || '2025/2026'}</p>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-right">
            <p className="text-[11px] text-emerald-400 font-medium">Calon Alumni</p>
            <p className="text-base font-bold text-zinc-100">{students.length} Siswa Terdaftar</p>
          </div>
        </div>

        {/* ── Checklist Siswa yang Lulus ── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-zinc-300">
              Pilih Siswa yang Dinyatakan Lulus ({selectedStudentIds.length} dari {students.length} siswa)
            </p>
            <button
              type="button"
              onClick={handleToggleSelectAll}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              {selectedStudentIds.length === students.length ? 'Batalkan Semua' : 'Pilih Semua Siswa'}
            </button>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 max-h-64 overflow-y-auto custom-scrollbar divide-y divide-zinc-900">
            {students.length > 0 ? (
              students.map((student, idx) => {
                const isChecked = selectedStudentIds.includes(student.id);

                return (
                  <label
                    key={student.id || idx}
                    className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                      isChecked ? 'bg-emerald-500/10 hover:bg-emerald-500/15' : 'hover:bg-zinc-900/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleStudent(student.id)}
                        className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-zinc-950"
                      />
                      <div>
                        <p className="text-sm font-medium text-zinc-200">{student.nama}</p>
                        <p className="text-[11px] text-zinc-500 font-mono">
                          {student.nipd ? `NIPD: ${student.nipd}` : ''}
                          {student.nisn ? ` • NISN: ${student.nisn}` : ''}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        isChecked
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {isChecked ? '✓ Lulus' : 'Belum Lulus'}
                    </span>
                  </label>
                );
              })
            ) : (
              <div className="py-8 text-center text-zinc-500 text-xs">
                Tidak ada siswa yang terdaftar di kelas ini.
              </div>
            )}
          </div>
        </div>

        {/* ── Status Impact Notice ── */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-start gap-2.5">
          <span className="text-base leading-none">⚠️</span>
          <p>
            Siswa yang dinyatakan lulus statusnya akan otomatis diubah menjadi <strong>Lulus (Alumni)</strong> dan dilepaskan dari rombel aktif agar kelas dapat digunakan untuk angkatan berikutnya.
          </p>
        </div>

        {/* ── Modal Footer ── */}
        <div className="pt-3 flex justify-end gap-3 border-t border-zinc-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            disabled={loading || selectedStudentIds.length === 0}
            className="!bg-emerald-600 hover:!bg-emerald-500 border-emerald-500"
          >
            {loading ? 'Memproses Kelulusan...' : `Luluskan ${selectedStudentIds.length} Siswa`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default KelulusanKelasModal;
