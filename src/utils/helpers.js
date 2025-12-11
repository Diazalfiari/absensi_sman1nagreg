// Utility functions untuk aplikasi absensi

// Fungsi untuk menghitung jarak antara dua koordinat GPS (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Radius bumi dalam meter
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance; // dalam meter
};

// Fungsi untuk validasi apakah lokasi dalam area sekolah
export const isInSchoolArea = (userLat, userLng, schoolLat, schoolLng, radius) => {
  const distance = calculateDistance(userLat, userLng, schoolLat, schoolLng);
  return distance <= radius;
};

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
  if (total === 0) return 0;
  return ((hadir / total) * 100).toFixed(2);
};

// Fungsi untuk menyimpan data ke localStorage
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
export const isAuthenticated = () => {
  const user = getFromLocalStorage('currentUser');
  return user !== null;
};

// Fungsi untuk mendapatkan user yang sedang login
export const getCurrentUser = () => {
  return getFromLocalStorage('currentUser');
};

// Fungsi untuk logout
export const logout = () => {
  removeFromLocalStorage('currentUser');
};

// Fungsi untuk filter data berdasarkan kelas dan tanggal
export const filterData = (data, kelas, startDate, endDate) => {
  return data.filter((item) => {
    const kelasMatch = !kelas || kelas === 'all' || item.kelas === kelas;
    const dateMatch =
      (!startDate || new Date(item.tanggal) >= new Date(startDate)) &&
      (!endDate || new Date(item.tanggal) <= new Date(endDate));
    return kelasMatch && dateMatch;
  });
};
