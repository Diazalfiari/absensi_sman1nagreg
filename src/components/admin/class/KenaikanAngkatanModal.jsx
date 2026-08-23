import React, { useState } from 'react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';

const KenaikanAngkatanModal = ({
  isOpen,
  onClose,
  onConfirm,
  tingkatAsal = 'X',
  classes = [],
}) => {
  const [loading, setLoading] = useState(false);

  const nextTingkat = tingkatAsal === 'X' ? 'XI' : 'XII';

  const totalSiswa = classes.reduce(
    (acc, cls) => acc + (parseInt(cls.total_siswa, 10) || 0),
    0
  );

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm(tingkatAsal);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Kenaikan Kelas Serentak: Seluruh Angkatan Kelas ${tingkatAsal}`}
      size="lg"
    >
      <div className="space-y-5">
        {/* ── Banner Summary ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/80">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Angkatan Asal</p>
            <p className="mt-1 text-2xl font-bold text-zinc-100">
              Tingkat {tingkatAsal}
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">{classes.length} Rombel • {totalSiswa} Siswa Terdata</p>
          </div>

          <div className="p-4 rounded-xl border border-primary-500/30 bg-primary-500/10 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-primary-300 uppercase tracking-wider">Tingkat Tujuan</p>
              <p className="mt-1 text-2xl font-bold text-[#9eafff]">
                Tingkat {nextTingkat}
              </p>
            </div>
            <p className="text-xs text-primary-300/80 mt-1">Otomatis dipetakan sesuai rombel paralel</p>
          </div>
        </div>

        {/* ── Mapping Rombel Preview ── */}
        <div>
          <p className="text-xs font-semibold text-zinc-300 mb-2">
            Pratinjau Pemetaan Rombel ({classes.length} Rombel Terdata)
          </p>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 max-h-56 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {classes.map((cls) => {
                const targetName = (cls.nama_kelas || '')
                  .replace(/^X-/, 'XI-')
                  .replace(/^XI-/, 'XII-');
                const jml = parseInt(cls.total_siswa, 10) || 0;

                return (
                  <div
                    key={cls.id || cls.nama_kelas}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-800/80 bg-zinc-900/60 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-200">{cls.nama_kelas}</span>
                      <span className="text-primary-400">➔</span>
                      <span className="font-bold text-[#9eafff]">{targetName}</span>
                    </div>
                    <span className="text-zinc-400 font-mono">{jml} Siswa</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Notice Box ── */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-start gap-2.5">
          <span className="text-base leading-none">⚠️</span>
          <p>
            Tindakan ini akan memindahkan seluruh siswa aktif pada <strong>Tingkat {tingkatAsal} ({totalSiswa} siswa)</strong> secara serentak ke rombel <strong>Tingkat {nextTingkat}</strong>.
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
          >
            {loading ? 'Memproses 1 Angkatan...' : `Konfirmasi Naikkan Angkatan ${tingkatAsal} (${totalSiswa} Siswa)`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default KenaikanAngkatanModal;
