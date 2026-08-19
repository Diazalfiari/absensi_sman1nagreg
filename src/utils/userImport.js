/**
 * utils/userImport.js
 * Semua logic parsing/import data pengguna dari Excel/CSV.
 * Tidak mengandung JSX atau React state.
 */

/**
 * Map kolom array ke objek user sesuai role.
 * Siswa : cols[0]=nama, [1]=username, [2]=password, [3]=nipd, [4]=kelas, [5]=jenis_kelamin
 * Guru  : cols[0]=nama, [1]=username, [2]=password, [3]=nip,  [4]=jenis_kelamin, [5]=wali_kelas
 */
function mapColsToUser(cols, role, idOffset = 0) {
  if (role === 'siswa') {
    return {
      id: Date.now() + idOffset,
      role: 'siswa',
      nama: cols[0] || '',
      username: cols[1] || '',
      password: cols[2] || '',
      nipd: cols[3] || '',
      kelas: cols[4] || '',
      jenis_kelamin: cols[5] || '',
    };
  }
  return {
    id: Date.now() + idOffset,
    role: 'guru',
    nama: cols[0] || '',
    username: cols[1] || '',
    password: cols[2] || '',
    nip: cols[3] || '',
    jenis_kelamin: cols[4] || '',
    wali_kelas: cols[5] || '',
  };
}

/**
 * Cek apakah baris pertama adalah baris header.
 * Kata-kata yang dianggap header: 'nama', 'name', 'no'.
 */
function isHeaderRow(firstCell) {
  return ['nama', 'name', 'no'].includes((firstCell || '').toLowerCase());
}

/**
 * Parse tab-separated text (hasil copy dari Excel).
 * Setiap baris = satu user. Kolom dipisahkan dengan tab.
 *
 * Format kolom:
 *   Siswa : Nama | Username | Password | NIS  | Kelas
 *   Guru  : Nama | Username | Password | NIP
 */
export function parsePastedText(text, role) {
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
 * Split satu baris CSV dengan mempertimbangkan field yang dibungkus tanda kutip.
 * Contoh: "Ahmad, Rizki";siswa123;pass → ['Ahmad, Rizki', 'siswa123', 'pass']
 */
function splitCsvLine(line, sep) {
  if (sep !== ',') {
    // Tab atau semicolon: split sederhana sudah aman
    return line.split(sep).map((c) => c.replace(/^"|"$/g, '').trim());
  }

  // Comma: perlu parse proper agar field berkoma tetap utuh
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
 * Deteksi separator dari baris pertama file CSV.
 * Prioritas: tab → semicolon → comma.
 * Excel di locale Indonesia/Eropa menggunakan semicolon (;).
 */
function detectSeparator(firstLine) {
  if (firstLine.includes('\t')) return '\t';
  if (firstLine.includes(';')) return ';';
  return ',';
}

/**
 * Parse teks file CSV (.csv) ke array user.
 * Auto-deteksi separator: tab, semicolon, atau comma.
 *
 * Format kolom:
 *   Siswa : Nama | Username | Password | NIS  | Kelas
 *   Guru  : Nama | Username | Password | NIP
 */
export function parseCsvText(text, role) {
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
