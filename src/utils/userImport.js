/**
 * utils/userImport.js
 * Logika parsing data pengguna dari file Excel/CSV dan Copy-Paste Spreadsheet.
 * Format Siswa: Nama Lengkap | NISN | Kelas | Jenis Kelamin
 * Format Guru : Nama Lengkap | NIP | Mata Pelajaran Pengampu
 */

/**
 * Map kolom array ke objek pengguna sesuai role.
 */
function mapColsToUser(cols, role, idOffset = 0) {
  if (role === 'siswa') {
    const nama = (cols[0] || '').trim();
    const nisn = (cols[1] || '').trim();
    const kelas = (cols[2] || '').trim();
    const rawGender = (cols[3] || 'L').trim().toUpperCase();
    const gender = rawGender === 'P' || rawGender === 'PEREMPUAN' ? 'P' : 'L';

    return {
      id: Date.now() + idOffset,
      role: 'siswa',
      nama,
      nisn,
      kelas,
      gender,
    };
  }

  // Role Guru: [0] nama, [1] nip, [2] mata pelajaran
  const nama = (cols[0] || '').trim();
  const nip = (cols[1] || '').trim();
  const spesialisasi = (cols[2] || '').trim();

  return {
    id: Date.now() + idOffset,
    role: 'guru',
    nama,
    nip,
    spesialisasi,
  };
}

/**
 * Cek apakah baris pertama adalah baris header.
 */
function isHeaderRow(firstCell) {
  const cell = (firstCell || '').toLowerCase().trim();
  return ['nama', 'nama lengkap', 'name', 'no', 'nisn', 'nip'].includes(cell);
}

/**
 * Parse tab-separated text (hasil copy langsung dari Excel / Spreadsheet).
 */
export function parsePastedText(text, role) {
  if (!text || !text.trim()) return [];

  const rows = text
    .trim()
    .split('\n')
    .map((r) => r.replace(/\r$/, '').split('\t').map((c) => c.trim()));

  const dataRows = isHeaderRow(rows[0]?.[0]) ? rows.slice(1) : rows;

  return dataRows
    .filter((r) => r.some((c) => c !== ''))
    .map((cols, idx) => mapColsToUser(cols, role, idx));
}

/**
 * Split satu baris CSV dengan kutip koma.
 */
function splitCsvLine(line, sep) {
  if (sep !== ',') {
    return line.split(sep).map((c) => c.replace(/^"|"$/g, '').trim());
  }

  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Deteksi separator CSV.
 */
function detectSeparator(firstLine) {
  if (firstLine.includes('\t')) return '\t';
  if (firstLine.includes(';')) return ';';
  return ',';
}

/**
 * Parse teks file CSV (.csv) ke array user.
 */
export function parseCsvText(text, role) {
  if (!text || !text.trim()) return [];

  const firstLine = text.trim().split('\n')[0] || '';
  const sep = detectSeparator(firstLine);

  const rows = text
    .trim()
    .split('\n')
    .map((r) => splitCsvLine(r.replace(/\r$/, ''), sep));

  const dataRows = isHeaderRow(rows[0]?.[0]) ? rows.slice(1) : rows;

  return dataRows
    .filter((r) => r.some((c) => c !== ''))
    .map((cols, idx) => mapColsToUser(cols, role, idx));
}
