import React, { useState, useMemo } from 'react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';

const PindahKelasModal = ({
  isOpen,
  onClose,
  onConfirm,
  student,
  currentClassId,
  allClasses = [],
}) => {
  const [selectedTingkat, setSelectedTingkat] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');

  // Filter kelas tujuan: tidak menyertakan kelas saat ini
  const targetClasses = useMemo(() => {
    if (!allClasses || allClasses.length === 0) return [];

    return allClasses
      .filter((cls) => {
        const clsName = cls.nama_kelas || cls.nama;
        return clsName !== currentClassId && cls.id !== currentClassId;
      })
      .filter((cls) => {
        if (selectedTingkat === 'Semua') return true;
        return cls.tingkat === selectedTingkat || (cls.nama_kelas || '').startsWith(selectedTingkat + '-');
      })
      .filter((cls) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
          (cls.nama_kelas && cls.nama_kelas.toLowerCase().includes(query)) ||
          (cls.nama_wali_kelas && cls.nama_wali_kelas.toLowerCase().includes(query))
        );
      });
  }, [allClasses, currentClassId, selectedTingkat, searchQuery]);

  const selectedClassObj = useMemo(() => {
    return allClasses.find((c) => (c.id || c.nama_kelas).toString() === selectedClassId.toString());
  }, [allClasses, selectedClassId]);

  const handleClose = () => {
    setSelectedTingkat('Semua');
    setSearchQuery('');
    setSelectedClassId('');
    onClose();
  };

  const handleSave = () => {
    if (!selectedClassObj || !student) return;
    onConfirm(student, selectedClassObj);
    handleClose();
  };

  if (!student) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Pindahkan Siswa ke Kelas Lain"
      size="lg"
    >
      <div className="space-y-5">
        {/* ── Student Information Card ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 text-primary-400 font-bold border border-primary-500/20">
              {student.gender === 'P' ? '♀' : '♂'}
            </div>
            <div>
              <p className="font-semibold text-zinc-100 text-base">{student.nama}</p>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">
                {student.nipd ? `NIPD: ${student.nipd}` : ''}
                {student.nisn ? ` • NISN: ${student.nisn}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Kelas saat ini:</span>
            <span className="px-2.5 py-1 bg-zinc-800 text-zinc-200 rounded-lg text-xs font-semibold border border-zinc-700">
              {currentClassId}
            </span>
          </div>
        </div>

        {/* ── Filter & Search Kelas Tujuan ── */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['Semua', 'X', 'XI', 'XII'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTingkat(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedTingkat === t
                      ? 'bg-[#29438f] text-white shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {t === 'Semua' ? 'Semua Tingkat' : `Tingkat ${t}`}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Cari kelas atau wali..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-56 bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          {/* ── Class Grid Selection ── */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 max-h-64 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {targetClasses.length > 0 ? (
                targetClasses.map((cls) => {
                  const isSelected = selectedClassId === (cls.id || cls.nama_kelas).toString();
                  const totalSiswa = cls.total_siswa || 0;

                  return (
                    <div
                      key={cls.id || cls.nama_kelas}
                      onClick={() => setSelectedClassId((cls.id || cls.nama_kelas).toString())}
                      className={`flex flex-col justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-primary-500 bg-primary-500/10 shadow-[0_0_15px_rgba(41,67,143,0.3)] ring-1 ring-primary-500'
                          : 'border-zinc-800/80 bg-zinc-900/60 hover:bg-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-sm text-zinc-100">
                          Kelas {cls.nama_kelas}
                        </span>
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full text-xs transition-colors ${
                            isSelected
                              ? 'bg-primary-500 text-white font-bold'
                              : 'border border-zinc-700 bg-zinc-800 text-transparent'
                          }`}
                        >
                          ✓
                        </span>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
                        <span className="truncate max-w-[110px]" title={cls.nama_wali_kelas || 'Belum ada wali'}>
                          Wali: {cls.nama_wali_kelas || '-'}
                        </span>
                        <span className="text-zinc-500 font-mono shrink-0">{totalSiswa} Siswa</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-8 text-center text-zinc-500 text-xs">
                  Tidak ada kelas tujuan yang sesuai kriteria pencarian.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Selection Summary ── */}
        {selectedClassObj && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-red-600 flex items-center gap-2">
            <span className="text-base">ℹ️</span>
            <span>
              Siswa <strong>{student.nama}</strong> akan dipindahkan dari <strong>{currentClassId}</strong> ke kelas{' '}
              <strong>{selectedClassObj.nama_kelas}</strong>.
            </span>
          </div>
        )}

        {/* ── Footer Buttons ── */}
        <div className="pt-3 flex justify-end gap-3 border-t border-zinc-800">
          <Button type="button" variant="outline" onClick={handleClose}>
            Batal
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSave}
            disabled={!selectedClassId}
          >
            Konfirmasi Pindah Kelas
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PindahKelasModal;
