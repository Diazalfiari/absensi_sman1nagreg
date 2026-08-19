/**
 * src/utils/reportHelpers.js
 * Utility terkait tanggal untuk laporan bulanan.
 */

export const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

export const getDayName = (day, month, year) => {
  const date = new Date(year, month - 1, day);
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[date.getDay()];
};
