import React, { useState } from 'react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';

const KelulusanAngkatanModal = ({
  isOpen,
  onClose,
  onConfirm,
  classes = [],
}) => {
  const [loading, setLoading] = useState(false);

  const totalSiswa = classes.reduce(
    (acc, cls) => acc + (parseInt(cls.total_siswa, 10) || 0),
    0
  );

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm('XII');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Kelulusan Serentak: Seluruh Angkatan Kelas XII"
      size="lg"
    >
      <div className="space-y-5">
        {/* ── Banner Summary ── */}
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 text-2xl font-bold border border-emerald-500/30">
              🎓
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Angkatan Tingkat Akhir</p>
              <h3 className="text-xl font-bold text-zinc-100">Seluruh Angkatan Kelas XII</h3>
              <p className="text-xs text-zinc-400 mt-0.5">{classes.length} Rombel Terdata (XII-1 s/d XII-12)</p>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-right">
            <p className="text-xs text-emerald-400 font-medium">Total Calon Alumni</p>
            <p className="text-xl font-bold text-zinc-100">{totalSiswa} Siswa</p>
          </div>
        </div>

        {/* ── Class List Preview ── */}
        <div>
          <p className="text-xs font-semibold text-zinc-300 mb-2">
            Rincian Rombel Tingkat XII ({classes.length} Rombel)
          </p>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 max-h-56 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {classes.map((cls) => {
                const jml = parseInt(cls.total_siswa, 10) || 0;

                return (
                  <div
                    key={cls.id || cls.nama_kelas}
                    className="flex items-center justify-between p-2 rounded-lg border border-zinc-800/80 bg-zinc-900/60 text-xs"
                  >
                    <span className="font-bold text-zinc-200">{cls.nama_kelas}</span>
                    <span className="text-emerald-400 font-mono font-semibold">{jml} Siswa</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Impact Notice ── */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-start gap-2.5">
          <span className="text-base leading-none">⚠️</span>
          <p>
            Tindakan ini akan mengubah status seluruh siswa aktif di <strong>Angkatan Kelas XII ({totalSiswa} siswa)</strong> menjadi <strong>Lulus (Alumni)</strong> dan melepaskan seluruh rombel kelas XII agar siap digunakan untuk tahun ajaran berikutnya.
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
            onClick={handleConfirm}
            disabled={loading || totalSiswa === 0}
            className="!bg-emerald-600 hover:!bg-emerald-500 border-emerald-500"
          >
            {loading ? 'Memproses Kelulusan 1 Angkatan...' : `Luluskan Seluruh Angkatan XII (${totalSiswa} Siswa)`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default KelulusanAngkatanModal;
