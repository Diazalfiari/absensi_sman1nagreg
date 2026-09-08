/**
 * src/services/mapelService.js
 * Service frontend untuk komunikasi API Manajemen Mata Pelajaran (/api/mapel).
 */
import api from './api';

export const mapelService = {
  /**
   * Mengambil seluruh daftar mata pelajaran beserta statistik terkait
   * @param {string} search - Pencarian kata kunci nama/kode/kategori
   */
  getAllSubjects: async (search = '') => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    const response = await api.get(`/mapel${params}`);
    return response.data || [];
  },

  /**
   * Mengambil detail satu mata pelajaran
   * @param {number|string} id
   */
  getSubjectById: async (id) => {
    const response = await api.get(`/mapel/${id}`);
    return response.data;
  },

  /**
   * Menambahkan mata pelajaran baru (Admin)
   * @param {object} data - { kodeMapel, namaMapel, kategori }
   */
  createSubject: async (data) => {
    const response = await api.post('/mapel', data);
    return response.data || response;
  },

  /**
   * Memperbarui mata pelajaran (Admin)
   * @param {number|string} id
   * @param {object} data - { kodeMapel, namaMapel, kategori }
   */
  updateSubject: async (id, data) => {
    const response = await api.put(`/mapel/${id}`, data);
    return response.data || response;
  },

  /**
   * Menghapus mata pelajaran (Admin)
   * @param {number|string} id
   */
  deleteSubject: async (id) => {
    const response = await api.delete(`/mapel/${id}`);
    return response;
  },
};

export default mapelService;
