import React, { useRef, useState } from 'react';
import ExcelJS from 'exceljs';
import Button from '../../common/Button';
import ColumnHint from './ColumnHint';
import PreviewTable from './PreviewTable';
import { parseCsvText, parsePastedText } from '../../../utils/userImport';

/**
 * UserImport
 * Menangani import file Excel (.xlsx, .xls, .csv) dan copy-paste dari Excel.
 * Format Siswa: Nama Lengkap | NISN | Kelas | Jenis Kelamin
 * Format Guru : Nama Lengkap | NIP | Mata Pelajaran Pengampu
 */
const UserImport = ({ role, method, onSave, onCancel }) => {
  const fileInputRef = useRef(null);
  const [previewData, setPreviewData] = useState([]);
  const [pasteText, setPasteText] = useState('');
  const [importError, setImportError] = useState('');
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const removePreviewRow = (idx) =>
    setPreviewData((prev) => prev.filter((_, i) => i !== idx));

  const handleSaveBulk = async () => {
    if (!previewData.length) return;
    try {
      setIsSubmitting(true);
      setImportError('');
      await onSave(previewData);
      setPreviewData([]);
      setPasteText('');
    } catch (err) {
      setImportError(err.message || 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Read Excel .xlsx / .xls or CSV file ──
  const readFile = async (file) => {
    setImportError('');
    setPreviewData([]);
    setIsReadingFile(true);

    try {
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);
        const worksheet = workbook.worksheets[0];

        if (!worksheet) {
          throw new Error('Lembar kerja spreadsheet Excel kosong.');
        }

        const rows = [];
        worksheet.eachRow((row, rowNumber) => {
          const col1 = row.getCell(1).text?.trim() || '';

          // Lewati header jika baris 1 berisi judul kolom
          if (
            rowNumber === 1 &&
            (col1.toLowerCase() === 'nama' ||
              col1.toLowerCase() === 'nama lengkap' ||
              col1.toLowerCase() === 'no' ||
              col1.toLowerCase() === 'name')
          ) {
            return;
          }

          if (role === 'siswa') {
            // Kolom: [1] Nama Lengkap, [2] NISN, [3] Kelas, [4] Jenis Kelamin
            const nama = row.getCell(1).text?.trim() || '';
            const nisn = row.getCell(2).text?.trim() || '';
            const kelas = row.getCell(3).text?.trim() || '';
            const rawGender = (row.getCell(4).text?.trim() || 'L').toUpperCase();
            const gender = rawGender === 'P' || rawGender === 'PEREMPUAN' ? 'P' : 'L';

            if (nama || nisn) {
              rows.push({
                id: Date.now() + rowNumber,
                role: 'siswa',
                nama,
                nisn,
                kelas,
                gender,
              });
            }
          } else {
            // Guru Kolom: [1] Nama Lengkap, [2] NIP, [3] Mata Pelajaran Pengampu
            const nama = row.getCell(1).text?.trim() || '';
            const nip = row.getCell(2).text?.trim() || '';
            const spesialisasi = row.getCell(3).text?.trim() || '';

            if (nama || nip) {
              rows.push({
                id: Date.now() + rowNumber,
                role: 'guru',
                nama,
                nip,
                spesialisasi,
              });
            }
          }
        });

        if (rows.length === 0) {
          throw new Error('Tidak ada baris data yang ditemukan di dalam file Excel.');
        }

        setPreviewData(rows);
      } else {
        // Parse CSV
        const text = await file.text();
        const parsed = parseCsvText(text, role);
        if (!parsed.length) throw new Error('Tidak ada data yang ditemukan.');
        setPreviewData(parsed);
      }
    } catch (err) {
      setImportError(err.message || 'Gagal membaca file spreadsheet.');
    } finally {
      setIsReadingFile(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  };

  // ── Paste textarea handler ──
const processPasteText = (val) => {
  setPasteText(val);
  setImportError('');
  if (!val.trim()) {
    setPreviewData([]);
    return;
  }
  try {
    const parsed = parsePastedText(val, role);
    if (!parsed.length) {
      setImportError('Format data tidak sesuai. Pastikan kolom terpisah dengan Tab dari Excel.');
      setPreviewData([]);
    } else {
      setPreviewData(parsed);
    }
  } catch (err) {
    setImportError(err.message || 'Gagal memproses teks.');
    setPreviewData([]);
  }
};

const handlePasteTextChange = (e) => processPasteText(e.target.value);

// Tab menyisipkan karakter tab (pemisah kolom), bukan pindah fokus
const handlePasteKeyDown = (e) => {
  if (e.key !== 'Tab' || e.shiftKey) return; // Shift+Tab tetap untuk keluar dari textarea

  e.preventDefault();
  const el = e.target;
  const { selectionStart, selectionEnd, value } = el;

  processPasteText(value.slice(0, selectionStart) + '\t' + value.slice(selectionEnd));

  // Kembalikan posisi kursor setelah React selesai render ulang
  requestAnimationFrame(() => {
    el.selectionStart = el.selectionEnd = selectionStart + 1;
  });
};

  const validCount = previewData.filter((r) =>
    role === 'siswa'
      ? r.nama && r.nisn && r.kelas && r.gender
      : r.nama && r.nip && r.spesialisasi
  ).length;
  const invalidCount = previewData.length - validCount;

  return (
    <div className="space-y-4">
      <ColumnHint role={role} />

      {method === 'excel' ? (
        /* ── Import Excel / CSV ── */
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`cursor-pointer border-2 border-dashed border-zinc-800 hover:border-primary-500/60 rounded-xl ${previewData.length > 0 ? 'p-3' : 'p-5'} text-center bg-zinc-950 transition-all`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className={`${previewData.length > 0 ? 'text-xl mb-1' : 'text-3xl mb-2'}`}>📂</div>
          <p className="text-sm font-medium text-zinc-300">
            {isReadingFile ? 'Sedang membaca file...' : 'Klik untuk pilih file spreadsheet (.xlsx, .xls, .csv)'}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">atau drag & drop file ke area ini</p>
        </div>
      ) : (
        /* ── Copy-Paste dari Excel ── */
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">
            Tempel (Paste) data dari tabel Excel di sini:
          </label>
          <textarea
            value={pasteText}
            onChange={handlePasteTextChange}
            onKeyDown={handlePasteKeyDown}
            rows={previewData.length > 0 ? 3 : 4}
            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors resize-y [tab-size:8]"
            placeholder={
              role === 'siswa'
                ? `Contoh (Salin 4 kolom dari Excel):\nBudi Santoso\t0012345678\tX-1\tL\nSiti Aminah\t0012345679\tX-1\tP`
                : `Contoh (Salin 3 kolom dari Excel):\nAndi Setiawan\t198001012010011001\tMatematika\nSiti Rahma\t198202022011022002\tBahasa Indonesia`
            }
          />
          <p className="mt-1 text-[11px] text-zinc-500">
  Untuk ketik manual,bukan dari Copy paste Excel, maka Tekan <kbd>Tab</kbd> untuk pindah kolom.
</p>
        </div>
      )}

      {importError && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-400">
          ⚠️ {importError}
        </div>
      )}

      {/* ── Preview Section ── */}
      {previewData.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>
              Total terdeteksi: <strong className="text-zinc-200">{previewData.length} baris</strong>
              {' | '}
              <span className="text-emerald-400 font-medium">Valid: {validCount}</span>
              {invalidCount > 0 && (
                <span className="text-rose-400 font-medium ml-2">Perlu perbaikan: {invalidCount}</span>
              )}
            </span>
            <button
              type="button"
              onClick={() => {
                setPreviewData([]);
                setPasteText('');
              }}
              className="text-zinc-500 hover:text-rose-400 transition-colors"
            >
              Hapus Semua
            </button>
          </div>

          <PreviewTable data={previewData} role={role} onRemove={removePreviewRow} />
        </div>
      )}

      {/* ── Action Buttons Footer (Always visible & sticky at modal bottom) ── */}
      <div className="sticky bottom-0 bg-zinc-900/95 backdrop-blur-md pt-3.5 pb-2 -mx-6 px-6 -mb-6 border-t border-zinc-800 flex items-center justify-between gap-3 z-10">
        <div className="text-xs text-zinc-400">
          {previewData.length > 0 ? (
            <span>
              Siap simpan <strong className="text-zinc-200">{previewData.length}</strong> data ({validCount} valid)
            </span>
          ) : (
            <span className="text-zinc-500">Belum ada data untuk disimpan</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Batal
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSaveBulk}
            disabled={!previewData.length || isSubmitting}
            className="!bg-[#29438f] hover:!bg-[#203674] shadow-md shadow-blue-950/40"
          >
            {isSubmitting
              ? 'Menyimpan...'
              : `Simpan ${previewData.length} Data ${role === 'siswa' ? 'Siswa' : 'Guru'}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserImport;
