/**
 * utils/userImport.js
 * Logika parsing/import data pengguna dari file CSV/Excel dan Copy-Paste Spreadsheet.
 */

/**
 * Map kolom array ke objek user sesuai role.
 * Siswa format lengkap (10 kolom):
 * [0] nama, [1] username, [2] password, [3] email, [4] phone, [5] nipd, [6] nisn, [7] kelas, [8] gender, [9] alamat
 *
 * Siswa format ringkas (8 kolom):
 * [0] nama, [1] username, [2] password, [3] nipd, [4] kelas, [5] gender, [6] alamat, [7] phone
 */
function mapColsToUser(cols, role, idOffset = 0) {
  if (role === 'siswa') {
    if (cols.length >= 9) {
      const rawGender = (cols[8] || 'L').toUpperCase();
      const gender = rawGender === 'P' || rawGender === 'PEREMPUAN' ? 'P' : 'L';

      return {
        id: Date.now() + idOffset,
        role: 'siswa',
        nama: cols[0] || '',
        username: cols[1] || '',
        password: cols[2] || '',
        email: cols[3] || '',
        phone: cols[4] || '',
        nipd: cols[5] || '',
        nisn: cols[6] || '',
        kelas: cols[7] || '',
        gender,
        alamat: cols[9] || '',
      };
    }

    // Format 8 kolom
    const rawGender = (cols[5] || 'L').toUpperCase();
    const gender = rawGender === 'P' || rawGender === 'PEREMPUAN' ? 'P' : 'L';

    return {
      id: Date.now() + idOffset,
      role: 'siswa',
      nama: cols[0] || '',
      username: cols[1] || '',
      password: cols[2] || '',
      email: '',
      nipd: cols[3] || '',
      nisn: '',
      kelas: cols[4] || '',
      gender,
      alamat: cols[6] || '',
      phone: cols[7] || '',
    };
  }

  // Role Guru: [0] nama, [1] username, [2] password, [3] email, [4] phone, [5] nip, [6] spesialisasi
  if (cols.length >= 6) {
    return {
      id: Date.now() + idOffset,
      role: 'guru',
      nama: cols[0] || '',
      username: cols[1] || '',
      password: cols[2] || '',
      email: cols[3] || '',
      phone: cols[4] || '',
      nip: cols[5] || '',
      spesialisasi: cols[6] || '',
    };
  }

  return {
    id: Date.now() + idOffset,
    role: 'guru',
    nama: cols[0] || '',
    username: cols[1] || '',
    password: cols[2] || '',
    nip: cols[3] || '',
    spesialisasi: cols[4] || '',
    phone: cols[5] || '',
  };
}

/**
 * Cek apakah baris pertama adalah baris header.
 */
function isHeaderRow(firstCell) {
  const cell = (firstCell || '').toLowerCase().trim();
  return ['nama', 'nama lengkap', 'name', 'no', 'username'].includes(cell);
}

/**
 * Parse tab-separated text (hasil copy dari Excel / Spreadsheet).
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
 * Split satu baris CSV dengan mempertimbangkan field berkoma yang dibungkus tanda kutip.
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
 * Deteksi separator dari baris pertama file CSV.
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
