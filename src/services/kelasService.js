/**
 * src/services/kelasService.js
 * Service untuk komunikasi API manajemen kelas.
 */
import api from './api';

export const kelasService = {
  /**
   * Mengambil daftar seluruh kelas dari database
   */
  getAllClasses: async (tingkat = '') => {
    const params = tingkat && tingkat !== 'Semua' ? `?tingkat=${tingkat}` : '';
    const response = await api.get(`/kelas${params}`);
    return response.data || [];
  },

  /**
   * Mengambil detail kelas beserta daftar siswa
   */
  getClassDetail: async (id) => {
    const response = await api.get(`/kelas/${id}`);
    return response.data;
  },

  /**
   * Tambah kelas baru
   */
  createClass: async (data) => {
    const response = await api.post('/kelas', data);
    return response.data;
  },

  /**
   * Update kelas
   */
  updateClass: async (id, data) => {
    const response = await api.put(`/kelas/${id}`, data);
    return response.data;
  },

  /**
   * Hapus kelas
   */
  deleteClass: async (id) => {
    const response = await api.delete(`/kelas/${id}`);
    return response;
  },

  /**
   * Mutasi siswa (single atau multiple) ke kelas lain
   */
  mutateStudent: async (studentIdOrIds, newClassId) => {
    const payload = Array.isArray(studentIdOrIds)
      ? { studentIds: studentIdOrIds, newClassId }
      : { studentId: studentIdOrIds, newClassId };
    const response = await api.post(`/kelas/${newClassId}/mutasi-siswa`, payload);
    return response.data;
  },

  /**
   * Proses Kenaikan Kelas (Tingkat X -> XI, XI -> XII)
   */
  promoteClass: async (classId, data = {}) => {
    const response = await api.post(`/kelas/${classId}/naik-kelas`, data);
    return response.data;
  },

  /**
   * Proses Kelulusan Siswa Kelas XII
   */
  graduateClass: async (classId, data = {}) => {
    const response = await api.post(`/kelas/${classId}/lulus`, data);
    return response.data;
  },

  /**
   * Proses Kenaikan Kelas Serentak 1 Angkatan (X -> XI atau XI -> XII)
   */
  promoteBatchTingkat: async (tingkatAsal) => {
    const response = await api.post('/kelas/naik-kelas-angkatan', { tingkatAsal });
    return response.data;
  },

  /**
   * Proses Kelulusan Serentak 1 Angkatan (Tingkat XII)
   */
  graduateBatchTingkat: async (tingkat = 'XII') => {
    const response = await api.post('/kelas/lulus-angkatan', { tingkat });
    return response.data;
  },
};

export default kelasService;
