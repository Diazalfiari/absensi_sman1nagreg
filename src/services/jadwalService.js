/**
 * src/services/jadwalService.js
 * Service frontend untuk komunikasi API jadwal pelajaran & mata pelajaran.
 */
import api from './api';

export const jadwalService = {
  /**
   * Mengambil semua jadwal pelajaran (untuk Admin)
   */
  getAllSchedules: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/jadwal${query ? `?${query}` : ''}`);
    return response.data || [];
  },

  /**
   * Mengambil jadwal mengajar guru yang sedang login
   */
  getTeacherSchedules: async () => {
    const response = await api.get('/jadwal/guru');
    return response.data || [];
  },

  /**
   * Mengambil jadwal pelajaran siswa yang sedang login
   */
  getStudentSchedules: async () => {
    const response = await api.get('/jadwal/siswa');
    return response.data || [];
  },

  /**
   * Mengambil seluruh daftar mata pelajaran
   */
  getAllSubjects: async () => {
    const response = await api.get('/jadwal/mata-pelajaran');
    return response.data || [];
  },

  /**
   * Mengambil detail jadwal berdasarkan ID
   */
  getScheduleById: async (id) => {
    const response = await api.get(`/jadwal/${id}`);
    return response.data;
  },

  /**
   * Tambah jadwal baru (Admin)
   */
  createSchedule: async (data) => {
    const response = await api.post('/jadwal', data);
    return response.data;
  },

  /**
   * Update jadwal pelajaran (Admin)
   */
  updateSchedule: async (id, data) => {
    const response = await api.put(`/jadwal/${id}`, data);
    return response.data;
  },

  /**
   * Hapus jadwal pelajaran (Admin)
   */
  deleteSchedule: async (id) => {
    const response = await api.delete(`/jadwal/${id}`);
    return response.data;
  },
};

export default jadwalService;
