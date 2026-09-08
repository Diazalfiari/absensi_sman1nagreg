/**
 * src/services/authService.js
 * Service untuk komunikasi endpoint Autentikasi Backend.
 */
import api from './api';

export const authService = {
  /**
   * Login pengguna
   */
  login: async (identifier, role) => {
    const payload = typeof identifier === 'object'
      ? identifier
      : { identifier, role };
    const response = await api.post('/auth/login', payload);
    if (response.data && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Ambil data profil pengguna aktif dari server
   */
  getMe: async () => {
    const response = await api.get('/auth/me');
    if (response.data) {
      localStorage.setItem('currentUser', JSON.stringify(response.data));
    }
    return response.data;
  },

  /**
   * Logout pengguna
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Abaikan error saat logout agar token tetap terhapus di client
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    }
  },

  /**
   * Ubah kata sandi
   */
  changePassword: async (oldPassword, newPassword) => {
    return api.put('/auth/change-password', { oldPassword, newPassword });
  },

  /**
   * Dapatkan user yang sedang tersimpan di localStorage
   */
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Cek apakah user sedang terotentikasi
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};

export default authService;
