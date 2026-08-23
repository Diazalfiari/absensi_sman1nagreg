import React, { useState, useMemo, useEffect } from 'react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';

const KenaikanKelasModal = ({
  isOpen,
  onClose,
  onConfirm,
  currentClass,
  students = [],
  allClasses = [],
}) => {
  const [selectedTargetClassId, setSelectedTargetClassId] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const nextTingkat = currentClass?.tingkat === 'X' ? 'XI' : 'XII';

  // Target class options (tingkat selanjutnya)
  const targetClassOptions = useMemo(() => {
    if (!allClasses) return [];
    return allClasses.filter((cls) => cls.tingkat === nextTingkat);
  }, [allClasses, nextTingkat]);

  // Set default target class (e.g. X-1 -> XI-1) and select all students
  useEffect(() => {
    if (isOpen && currentClass) {
      const defaultTargetName = (currentClass.nama_kelas || '')
        .replace(/^X-/, 'XI-')
        .replace(/^XI-/, 'XII-');
      
      const defaultTarget = targetClassOptions.find((c) => c.nama_kelas === defaultTargetName) || targetClassOptions[0];
      if (defaultTarget) {
        setSelectedTargetClassId((defaultTarget.id || defaultTarget.nama_kelas).toString());
      }

      // Check all students by default
      setSelectedStudentIds(students.map((s) => s.id));
    }
  }, [isOpen, currentClass, targetClassOptions, students]);

  const targetClassObj = useMemo(() => {
    return targetClassOptions.find((c) => (c.id || c.nama_kelas).toString() === selectedTargetClassId.toString());
  }, [targetClassOptions, selectedTargetClassId]);

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
    if (!targetClassObj || selectedStudentIds.length === 0) return;
    try {
      setLoading(true);
      await onConfirm({
        targetClassId: targetClassObj.id || targetClassObj.nama_kelas,
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
      title={`Proses Kenaikan Kelas: ${currentClass.nama_kelas}`}
      size="lg"
    >
      <div className="space-y-5">
        {/* ── Summary & Target Banner ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/80">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Kelas Asal</p>
            <p className="mt-1 text-xl font-bold text-zinc-100">
              Kelas {currentClass.nama_kelas}
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">Tingkat {currentClass.tingkat} • {students.length} Siswa</p>
          </div>

          <div className="p-4 rounded-xl border border-primary-500/30 bg-primary-500/10">
            <label className="block text-xs font-semibold text-primary-300 uppercase tracking-wider mb-1.5">
              Target Kelas Tujuan (Tingkat {nextTingkat})
            </label>
            <select
              value={selectedTargetClassId}
              onChange={(e) => setSelectedTargetClassId(e.target.value)}
              className="w-full bg-zinc-950 border border-primary-500/40 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-primary-500 font-semibold"
            >
              {targetClassOptions.map((cls) => (
                <option key={cls.id || cls.nama_kelas} value={cls.id || cls.nama_kelas}>
                  Kelas {cls.nama_kelas} {cls.nama_wali_kelas ? `(Wali: ${cls.nama_wali_kelas})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Checklist Siswa yang Naik Kelas ── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-zinc-300">
              Pilih Siswa yang Naik Kelas ({selectedStudentIds.length} dari {students.length} terpilih)
            </p>
            <button
              type="button"
              onClick={handleToggleSelectAll}
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors font-medium"
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
                      isChecked ? 'bg-primary-500/10 hover:bg-primary-500/15' : 'hover:bg-zinc-900/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleStudent(student.id)}
                        className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-primary-600 focus:ring-primary-500 focus:ring-offset-zinc-950"
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
                      className={`text-xs px-2 py-0.5 rounded font-medium ${
                        isChecked
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {isChecked ? `Naik ke ${targetClassObj?.nama_kelas || nextTingkat}` : 'Tinggal Kelas'}
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

        {/* ── Notice Box ── */}
        <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-zinc-400 flex items-start gap-2.5">
          <span className="text-primary-400 text-base leading-none">💡</span>
          <p>
            Siswa yang dicentang akan otomatis dipindahkan ke <strong>Kelas {targetClassObj?.nama_kelas}</strong>. Siswa yang tidak dicentang akan tetap berada di kelas saat ini ({currentClass.nama_kelas}).
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
            disabled={loading || selectedStudentIds.length === 0 || !targetClassObj}
          >
            {loading ? 'Memproses...' : `Naikkan ${selectedStudentIds.length} Siswa ke Kelas ${targetClassObj?.nama_kelas || ''}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default KenaikanKelasModal;
