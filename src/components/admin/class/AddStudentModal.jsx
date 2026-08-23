import React, { useState, useMemo } from 'react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';

const AddStudentModal = ({
  isOpen,
  onClose,
  onAdd,
  allStudents = [],
  classList = [],
  currentClassId = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  // Extract unique class list if classList is not provided
  const availableClasses = useMemo(() => {
    if (classList && classList.length > 0) return classList;
    if (!allStudents) return [];

    const unique = new Set();
    allStudents.forEach((s) => {
      const c = s.nama_kelas || s.kelas;
      if (c) unique.add(c);
    });
    return Array.from(unique).sort().map((c) => ({ id: c, nama_kelas: c }));
  }, [classList, allStudents]);

  // Filter students based on search query, selected class & status
  const filteredStudents = useMemo(() => {
    if (!allStudents) return [];

    let list = [...allStudents];

    // Filter berdasarkan status (aktif / lulus)
    if (statusFilter === 'aktif') {
      list = list.filter((s) => {
        const st = s.status_siswa || s.status;
        return !st || st === 'aktif';
      });
    } else if (statusFilter === 'lulus') {
      list = list.filter((s) => {
        const st = s.status_siswa || s.status;
        return st === 'lulus';
      });
    }

    // Filter berdasarkan kelas asal
    if (classFilter === 'unassigned') {
      list = list.filter((s) => !s.kelas && !s.nama_kelas && !s.kelas_id);
    } else if (classFilter) {
      list = list.filter(
        (s) =>
          s.nama_kelas === classFilter ||
          s.kelas === classFilter ||
          s.kelas_id?.toString() === classFilter
      );
    }

    // Sort alfabetis berdasarkan nama
    list.sort((a, b) => (a.nama || '').localeCompare(b.nama || ''));

    // Filter berdasarkan keyword
    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase();
    return list.filter(
      (s) =>
        (s.nama && s.nama.toLowerCase().includes(query)) ||
        (s.nipd && s.nipd.toLowerCase().includes(query)) ||
        (s.nisn && s.nisn.toLowerCase().includes(query)) ||
        (s.kelas && s.kelas.toLowerCase().includes(query)) ||
        (s.nama_kelas && s.nama_kelas.toLowerCase().includes(query))
    );
  }, [allStudents, classFilter, statusFilter, searchQuery]);

  // Eligible students that can be added (not already in this class)
  const selectableStudents = useMemo(() => {
    return filteredStudents.filter((student) => {
      const c = student.nama_kelas || student.kelas;
      return c !== currentClassId;
    });
  }, [filteredStudents, currentClassId]);

  const handleToggleStudent = (studentIdStr) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentIdStr)
        ? prev.filter((id) => id !== studentIdStr)
        : [...prev, studentIdStr]
    );
  };

  const handleToggleSelectAll = () => {
    const selectableIds = selectableStudents.map((s) => (s.id || s.user_id).toString());
    const isAllSelected =
      selectableIds.length > 0 &&
      selectableIds.every((id) => selectedStudentIds.includes(id));

    if (isAllSelected) {
      setSelectedStudentIds((prev) => prev.filter((id) => !selectableIds.includes(id)));
    } else {
      setSelectedStudentIds((prev) => Array.from(new Set([...prev, ...selectableIds])));
    }
  };

  const handleAdd = () => {
    if (selectedStudentIds.length === 0) return;

    const selectedStudents = allStudents.filter((s) =>
      selectedStudentIds.includes((s.id || s.user_id)?.toString())
    );

    if (selectedStudents.length > 0) {
      onAdd(selectedStudents);
      handleClose();
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setClassFilter('');
    setStatusFilter('');
    setSelectedStudentIds([]);
    onClose();
  };

  const isAllSelectableChecked =
    selectableStudents.length > 0 &&
    selectableStudents.every((s) =>
      selectedStudentIds.includes((s.id || s.user_id).toString())
    );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Tambah / Mutasi Siswa ke Kelas ${currentClassId}`}
      size="lg"
    >
      <div className="space-y-4">
        {/* ── Search & Filter Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-zinc-400 mb-1">Cari Siswa</label>
            <input
              type="text"
              placeholder="Ketik nama, NIPD, atau NISN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Filter Kelas Asal</label>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            >
              <option value="">Semua Kelas</option>
              <option value="unassigned">⚠️ Belum Ada Kelas</option>
              {availableClasses.map((cls) => (
                <option key={cls.id || cls.nama_kelas} value={cls.nama_kelas}>
                  Kelas {cls.nama_kelas}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Status Siswa</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium"
            >
              <option value="">Semua Status</option>
              <option value="aktif">🟢 Siswa Aktif</option>
              <option value="lulus">🎓 Siswa Lulus</option>
            </select>
          </div>
        </div>

        {/* ── Action & Selection Summary Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-y border-zinc-800/80 py-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-400">
              Ditemukan: <strong className="text-zinc-200">{filteredStudents.length}</strong> siswa
            </span>
            {selectedStudentIds.length > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-500/20 text-[#aebcff] border border-primary-500/30 font-semibold font-mono">
                {selectedStudentIds.length} dipilih
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {selectableStudents.length > 0 && (
              <button
                type="button"
                onClick={handleToggleSelectAll}
                className="text-xs text-[#aebcff] hover:text-primary-300 font-medium transition-colors"
              >
                {isAllSelectableChecked ? 'Batalkan Semua' : `Pilih Semua (${selectableStudents.length})`}
              </button>
            )}

            {(classFilter || statusFilter || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setClassFilter('');
                  setStatusFilter('');
                  setSearchQuery('');
                }}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 underline"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* ── Student List Box (Multi-Select) ── */}
        <div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-h-72 overflow-y-auto p-2 space-y-1 custom-scrollbar divide-y divide-zinc-900">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const sIdStr = (student.id || student.user_id).toString();
                const currentStudentClass = student.nama_kelas || student.kelas;
                const isAlreadyInClass = currentStudentClass === currentClassId;
                const isSelected = selectedStudentIds.includes(sIdStr);
                const isLulus = (student.status_siswa || student.status) === 'lulus';

                return (
                  <label
                    key={sIdStr}
                    onClick={(e) => {
                      if (isAlreadyInClass) e.preventDefault();
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-lg transition-colors ${
                      isAlreadyInClass
                        ? 'opacity-40 cursor-not-allowed bg-zinc-900/30'
                        : isSelected
                        ? 'bg-primary-500/15 border border-primary-500/40 cursor-pointer shadow-sm'
                        : 'hover:bg-zinc-900/60 cursor-pointer border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {!isAlreadyInClass && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleStudent(sIdStr)}
                          className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-primary-600 focus:ring-primary-500 focus:ring-offset-zinc-950 cursor-pointer"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-zinc-200 text-sm">{student.nama}</span>
                          {isLulus ? (
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold">
                              🎓 Lulus (Alumni)
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                              Aktif
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-zinc-500 mt-0.5 font-mono flex items-center gap-2">
                          {student.nipd && <span>NIPD: {student.nipd}</span>}
                          {student.nisn && <span>• NISN: {student.nisn}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs">
                      {isAlreadyInClass ? (
                        <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded text-[11px] border border-zinc-700">
                          Sudah di kelas ini
                        </span>
                      ) : currentStudentClass ? (
                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded text-[11px] border border-amber-500/20 font-medium">
                          Dari Kelas {currentStudentClass}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded text-[11px] border border-zinc-700 font-medium">
                          Belum ada kelas
                        </span>
                      )}
                    </div>
                  </label>
                );
              })
            ) : (
              <div className="text-center py-10 text-zinc-500 text-sm">
                Tidak ada siswa yang sesuai dengan pencarian atau filter yang dipilih.
              </div>
            )}
          </div>
        </div>

        {/* ── Modal Footer ── */}
        <div className="pt-3 flex items-center justify-between gap-3 border-t border-zinc-800">
          <p className="text-xs text-zinc-400">
            {selectedStudentIds.length > 0 ? (
              <span>
                <strong>{selectedStudentIds.length}</strong> siswa akan dimasukkan ke Kelas <strong>{currentClassId}</strong>
              </span>
            ) : (
              'Centang siswa yang ingin ditambahkan / dimutasi.'
            )}
          </p>

          <div className="flex gap-2.5">
            <Button type="button" variant="outline" onClick={handleClose}>
              Batal
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleAdd}
              disabled={selectedStudentIds.length === 0}
            >
              {selectedStudentIds.length > 0
                ? `Tambahkan ${selectedStudentIds.length} Siswa`
                : 'Pilih Siswa'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddStudentModal;
