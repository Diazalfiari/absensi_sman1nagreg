/**
 * src/services/presensiService.js
 * Service frontend untuk komunikasi API presensi, sesi belajar mengajar, materi, tugas, dan rekapitulasi.
 */
import api from './api';

export const presensiService = {
  /**
   * Mengambil data sesi mengajar, materi/tugas, dan daftar presensi siswa
   */
  getSession: async (jadwalId, tanggal = '') => {
    const query = tanggal ? `?tanggal=${tanggal}` : '';
    const response = await api.get(`/presensi/sesi/${jadwalId}${query}`);
    return response.data;
  },

  /**
   * Memulai sesi mengajar
   */
  startSession: async (jadwalId, tanggal = '') => {
    const response = await api.post(`/presensi/sesi/${jadwalId}/start`, { tanggal });
    return response.data;
  },

  /**
   * Menyimpan presensi siswa, materi pembelajaran, tugas, dan kuis
   */
  saveSession: async (jadwalId, payload) => {
    const response = await api.post(`/presensi/sesi/${jadwalId}/save`, payload);
    return response.data || response;
  },

  /**
   * Menyelesaikan sesi mengajar
   */
  finishSession: async (jadwalId, payload = {}) => {
    const response = await api.post(`/presensi/sesi/${jadwalId}/finish`, payload);
    return response.data || response;
  },

  /**
   * Mengambil rekapitulasi data kehadiran presensi
   */
  getRekapitulasi: async (params = {}) => {
    const validParams = Object.entries(params).reduce((result, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        result[key] = value;
      }
      return result;
    }, {});
    const query = new URLSearchParams(validParams).toString();
    const response = await api.get(`/presensi/rekapitulasi${query ? `?${query}` : ''}`);
    return response.data;
  },

  /**
   * Mengambil matriks kehadiran bulanan
   */
  getBulanan: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/presensi/bulanan${query ? `?${query}` : ''}`);
    return response.data;
  },

  /**
   * Export matriks bulanan ke format file Excel (.xlsx)
   */
  exportBulananExcel: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/presensi/bulanan/export-excel${query ? `?${query}` : ''}`, {
      responseType: 'blob',
    });
    return response;
  },

  /**
   * Riwayat presensi untuk guru
   */
  getGuruHistory: async (page = 1, limit = 10) => {
    const response = await api.get(`/presensi/riwayat/guru?page=${page}&limit=${limit}`);
    return response.data || [];
  },

  /**
   * Riwayat presensi untuk siswa
   */
  getSiswaHistory: async (page = 1, limit = 10) => {
    const response = await api.get(`/presensi/riwayat/siswa?page=${page}&limit=${limit}`);
    return response.data || [];
  },
};

export default presensiService;
