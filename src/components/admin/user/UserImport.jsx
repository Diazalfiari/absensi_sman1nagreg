import React, { useRef, useState } from 'react';
import ExcelJS from 'exceljs';
import Button from '../../common/Button';
import ColumnHint from './ColumnHint';
import PreviewTable from './PreviewTable';
import { parseCsvText, parsePastedText } from '../../../utils/userImport';

const INPUT_CLASS =
  'w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors';
const LABEL_CLASS = 'block text-sm font-medium text-zinc-400 mb-1';

/**
 * UserImport
 * Menangani import file Excel/CSV (.xlsx, .xls, .csv) dan copy-paste dari Excel,
 * menampilkan preview tabel, dan memanggil onSave dengan array user.
 */
const UserImport = ({ role, method, onSave, onCancel }) => {
  const fileInputRef = useRef(null);
  const [previewData, setPreviewData] = useState([]);
  const [pasteText, setPasteText] = useState('');
  const [importError, setImportError] = useState('');
  const [isReadingFile, setIsReadingFile] = useState(false);

  const removePreviewRow = (idx) =>
    setPreviewData((prev) => prev.filter((_, i) => i !== idx));

  const handleSaveBulk = async () => {
    if (!previewData.length) return;
    try {
      await onSave(previewData);
      setPreviewData([]);
      setPasteText('');
    } catch (err) {
      // Biarkan previewData tetap ada jika terjadi error dari server
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
        // Parse spreadsheet Excel menggunakan ExcelJS
        const arrayBuffer = await file.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);
        const worksheet = workbook.worksheets[0];

        if (!worksheet) {
          throw new Error('Lembar kerja spreadsheet Excel kosong.');
        }

        const rows = [];
        worksheet.eachRow((row, rowNumber) => {
          const col1 = row.getCell(1).text?.trim();

          // Lewati header jika baris 1 berisi kata 'nama' atau 'nama lengkap'
          if (rowNumber === 1 && (col1.toLowerCase() === 'nama' || col1.toLowerCase() === 'nama lengkap' || col1.toLowerCase() === 'no')) {
            return;
          }

          if (role === 'siswa') {
            const colCount = row.cellCount;
            let nama, username, password, email, phone, nipd, nisn, kelas, gender, alamat;

            if (colCount >= 9) {
              nama = row.getCell(1).text?.trim();
              username = row.getCell(2).text?.trim();
              password = row.getCell(3).text?.trim() || `${username}123`;
              email = row.getCell(4).text?.trim() || '';
              phone = row.getCell(5).text?.trim() || '';
              nipd = row.getCell(6).text?.trim() || username;
              nisn = row.getCell(7).text?.trim() || '';
              kelas = row.getCell(8).text?.trim();
              const rawGender = (row.getCell(9).text?.trim() || 'L').toUpperCase();
              gender = rawGender === 'P' || rawGender === 'PEREMPUAN' ? 'P' : 'L';
              alamat = row.getCell(10).text?.trim() || '';
            } else {
              nama = row.getCell(1).text?.trim();
              username = row.getCell(2).text?.trim();
              password = row.getCell(3).text?.trim() || `${username}123`;
              nipd = row.getCell(4).text?.trim() || username;
              nisn = '';
              email = '';
              kelas = row.getCell(5).text?.trim();
              const rawGender = (row.getCell(6).text?.trim() || 'L').toUpperCase();
              gender = rawGender === 'P' || rawGender === 'PEREMPUAN' ? 'P' : 'L';
              alamat = row.getCell(7).text?.trim() || '';
              phone = row.getCell(8).text?.trim() || '';
            }

            if (nama && username) {
              rows.push({
                id: Date.now() + rowNumber,
                role: 'siswa',
                nama,
                username,
                password,
                email,
                phone,
                nipd,
                nisn,
                kelas,
                gender,
                alamat,
              });
            }
          } else {
            const nama = row.getCell(1).text?.trim();
            const username = row.getCell(2).text?.trim();
            const password = row.getCell(3).text?.trim() || `${username}123`;
            const email = row.getCell(4).text?.trim() || '';
            const phone = row.getCell(5).text?.trim() || '';
            const nip = row.getCell(6).text?.trim() || '';
            const spesialisasi = row.getCell(7).text?.trim() || '';

            if (nama && username) {
              rows.push({
                id: Date.now() + rowNumber,
                role: 'guru',
                nama,
                username,
                password,
                email,
                phone,
                nip,
                spesialisasi,
              });
            }
          }
        });

        if (rows.length === 0) {
          throw new Error('Tidak ada data yang valid ditemukan di dalam file Excel.');
        }

        setPreviewData(rows);
      } else {
        // Parse file CSV / Text
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
  const handlePasteTextChange = (e) => {
    const val = e.target.value;
    setPasteText(val);
    setImportError('');
    if (!val.trim()) {
      setPreviewData([]);
      return;
    }
    try {
      const parsed = parsePastedText(val, role);
      if (!parsed.length) {
        setImportError('Format data tidak sesuai. Pastikan kolom terpisah dengan Tab/koma.');
        setPreviewData([]);
      } else {
        setPreviewData(parsed);
      }
    } catch (err) {
      setImportError(err.message || 'Gagal memproses teks.');
      setPreviewData([]);
    }
  };

  return (
    <div className="space-y-4">
      <ColumnHint role={role} />

      {method === 'excel' ? (
        /* ── Import Excel / CSV ── */
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-zinc-700 hover:border-primary-500 rounded-xl p-8 text-center cursor-pointer transition-colors group"
        >
          <div className="text-3xl mb-2">📂</div>
          <p className="text-sm font-medium text-zinc-300 group-hover:text-primary-400 transition-colors">
            {isReadingFile ? 'Sedang membaca file...' : 'Klik untuk pilih file, atau drag & drop di sini'}
          </p>
          <p className="text-xs text-zinc-500 mt-1">Format didukung: .xlsx, .xls, .csv</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv,.txt"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        /* ── Copy-Paste Excel ── */
        <div>
          <label className={LABEL_CLASS}>
            Tempel data dari baris Excel / Spreadsheet{' '}
            <span className="text-zinc-600 font-normal">(Ctrl+V / ⌘V)</span>
          </label>
          <textarea
            rows={6}
            value={pasteText}
            onChange={handlePasteTextChange}
            placeholder={
              role === 'siswa'
                ? 'Ahmad Fauzi\tahmad.fauzi\tpass123\tahmad@gmail.com\t081234567890\t2021001\t0051234567\tX-1\tL\tJl. Raya Nagreg No. 10\nSiti Nurhaliza\tsiti.n\tpass123\tsiti@gmail.com\t081298765432\t2021002\t0051234568\tX-1\tP\tJl. Raya Nagreg No. 15'
                : 'Budi Santoso\tbudi.sp\tpass123\tbudi@sekolah.sch.id\t081298765432\t198505152010011003\tMatematika\nDewi Lestari\tdewi.l\tpass123\tdewi@sekolah.sch.id\t081345678901\t198906202015022001\tBahasa Indonesia'
            }
            className={`${INPUT_CLASS} resize-none font-mono text-xs`}
          />
        </div>
      )}

      {importError && (
        <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
          ⚠️ {importError}
        </p>
      )}

      {previewData.length > 0 && (
        <>
          <p className="text-xs text-zinc-400">
            Preview:{' '}
            <span className="text-primary-400 font-semibold">{previewData.length} baris data</span>{' '}
            siap {method === 'excel' ? 'diimpor ke database' : 'ditambahkan'}
          </p>
          <PreviewTable data={previewData} role={role} onRemove={removePreviewRow} />
        </>
      )}

      <div className="pt-4 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleSaveBulk}
          disabled={!previewData.length || isReadingFile}
        >
          {method === 'excel' ? 'Import ke Database' : 'Simpan Semua'}{' '}
          {previewData.length > 0 ? `(${previewData.length})` : ''}
        </Button>
      </div>
    </div>
  );
};

export default UserImport;
