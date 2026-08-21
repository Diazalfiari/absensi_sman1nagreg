const CURRENT_USER_KEY = 'currentUser';

// Fungsi untuk format tanggal
export const formatDate = (date) => {
  const d = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('id-ID', options);
};

// Fungsi untuk format waktu
export const formatTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

// Fungsi untuk mendapatkan tanggal hari ini
export const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Fungsi untuk mendapatkan nama hari
export const getDayName = (date) => {
  const d = new Date(date);
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[d.getDay()];
};

// Fungsi untuk menghitung persentase kehadiran
export const calculatePercentage = (hadir, total) => {
  const present = Number(hadir);
  const count = Number(total);
  if (!Number.isFinite(present) || !Number.isFinite(count) || count <= 0) return 0;
  return Number(((present / count) * 100).toFixed(2));
};

export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Fungsi untuk mengambil data dari localStorage
export const getFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return null;
  }
};

// Fungsi untuk menghapus data dari localStorage
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// Fungsi untuk validasi apakah user sudah login
export const isAuthenticated = () => getFromLocalStorage(CURRENT_USER_KEY) !== null;

export const getCurrentUser = () => getFromLocalStorage(CURRENT_USER_KEY);

export const logout = () => removeFromLocalStorage(CURRENT_USER_KEY);

// Fungsi untuk filter data berdasarkan kelas dan tanggal
export const filterData = (data, kelas, startDate, endDate) => {
  const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
  const end = endDate ? new Date(`${endDate}T23:59:59.999`) : null;

  return data.filter((item) => {
    const itemDate = new Date(item.tanggal);
    const kelasMatch = !kelas || kelas === 'all' || item.kelas === kelas;
    const dateMatch =
      (!start || itemDate >= start) && (!end || itemDate <= end);
    return kelasMatch && dateMatch;
  });
};
