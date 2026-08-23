/**
 * src/services/userService.js
 * Service untuk komunikasi API manajemen pengguna (CRUD & Impor Excel).
 */
import api from './api';

export const userService = {
  /**
   * Mengambil daftar pengguna dengan filter peran, pencarian, dan pagination
   */
  getUsers: async ({ role = '', search = '', page = 1, limit = 10 } = {}) => {
    const params = new URLSearchParams();
    if (role && role !== 'Semua') params.append('role', role);
    if (search) params.append('search', search);
    params.append('page', page);
    params.append('limit', limit);

    const response = await api.get(`/users?${params.toString()}`);
    return response;
  },

  /**
   * Detail pengguna berdasarkan ID
   */
  getUserDetail: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Tambah pengguna baru
   */
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  /**
   * Perbarui informasi pengguna
   */
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  /**
   * Ubah status aktif / non-aktif pengguna
   */
  toggleStatus: async (id, isActive) => {
    const response = await api.patch(`/users/${id}/status`, { isActive });
    return response.data;
  },

  /**
   * Hapus pengguna
   */
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response;
  },

  /**
   * Tambah pengguna secara massal (bulk insert)
   */
  createUsersBulk: async (usersArray) => {
    const response = await api.post('/users/bulk', { users: usersArray });
    return response.data;
  },

  /**
   * Unggah file spreadsheet Excel untuk impor massal pengguna
   */
  importExcel: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/users/import-excel', formData);
    return response.data;
  },
};

export default userService;
