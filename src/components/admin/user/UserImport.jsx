import React, { useRef, useState } from 'react';
import Button from '../../common/Button';
import ColumnHint from './ColumnHint';
import PreviewTable from './PreviewTable';
import { parseCsvText, parsePastedText } from '../../../utils/userImport';

const INPUT_CLASS =
  'w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors';
const LABEL_CLASS = 'block text-sm font-medium text-zinc-400 mb-1';

/**
 * UserImport
 * Menangani import CSV (klik/drag-drop) dan copy-paste dari Excel,
 * menampilkan preview, dan memanggil onSave dengan array user.
 *
 * Props:
 *   role      - 'siswa' | 'guru'
 *   method    - 'excel' | 'paste'
 *   onSave    - (users: UserObject[]) => void
 *   onCancel  - () => void
 */
const UserImport = ({ role, method, onSave, onCancel }) => {
  const fileInputRef = useRef(null);
  const [previewData, setPreviewData] = useState([]);
  const [pasteText, setPasteText] = useState('');
  const [importError, setImportError] = useState('');

  const removePreviewRow = (idx) =>
    setPreviewData((prev) => prev.filter((_, i) => i !== idx));

  const handleSaveBulk = () => {
    if (!previewData.length) return;
    onSave(previewData);
  };

  // ── CSV file handler ──
  const readFile = (file) => {
    setImportError('');
    setPreviewData([]);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = parseCsvText(ev.target.result, role);
        if (!parsed.length) throw new Error('Tidak ada data yang ditemukan.');
        setPreviewData(parsed);
      } catch (err) {
        setImportError(err.message || 'Gagal membaca file.');
      }
    };
    reader.readAsText(file);
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
      if (!parsed.length) throw new Error('Tidak ada data yang dapat dibaca.');
      setPreviewData(parsed);
    } catch (err) {
      setImportError(err.message);
      setPreviewData([]);
    }
  };

  return (
    <div className="space-y-4">
      <ColumnHint role={role} />

      {method === 'excel' ? (
        /* ── Import CSV ── */
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-zinc-700 hover:border-primary-500 rounded-xl p-8 text-center cursor-pointer transition-colors group"
        >
          <div className="text-3xl mb-2">📂</div>
          <p className="text-sm font-medium text-zinc-300 group-hover:text-primary-400 transition-colors">
            Klik untuk pilih file, atau drag &amp; drop di sini
          </p>
          <p className="text-xs text-zinc-500 mt-1">Format: .csv (Excel → Save As CSV)</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        /* ── Copy-Paste Excel ── */
        <div>
          <label className={LABEL_CLASS}>
            Tempel data dari Excel{' '}
            <span className="text-zinc-600 font-normal">(Ctrl+V / ⌘V)</span>
          </label>
          <textarea
            rows={6}
            value={pasteText}
            onChange={handlePasteTextChange}
            placeholder={
              role === 'siswa'
                ? 'Ahmad Rizki\trizki01\tpass123\t2021001\tX-1\nBudi S\tbudi01\tpass456\t2021002\tX-2'
                : 'Budi Santoso\tbudi.sp\tpass123\t198505152010011003'
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
            <span className="text-primary-400 font-semibold">{previewData.length} baris</span>{' '}
            akan {method === 'excel' ? 'diimpor' : 'ditambahkan'}
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
          disabled={!previewData.length}
        >
          {method === 'excel' ? 'Import' : 'Tambahkan'}{' '}
          {previewData.length > 0 ? `(${previewData.length})` : ''}
        </Button>
      </div>
    </div>
  );
};

export default UserImport;
