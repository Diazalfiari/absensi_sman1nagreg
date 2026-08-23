/**
 * src/services/dashboardService.js
 * Service untuk mengambil data analitik dan statistik dashboard dari backend.
 */
import api from './api';

export const dashboardService = {
  /**
   * Mengambil data analitik dashboard admin
   */
  getAdminDashboard: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },

  /**
   * Mengambil jadwal mengajar hari ini untuk dashboard guru
   */
  getGuruDashboard: async () => {
    const response = await api.get('/dashboard/guru');
    return response.data;
  },

  /**
   * Mengambil ringkasan kehadiran & jadwal hari ini untuk siswa
   */
  getSiswaDashboard: async () => {
    const response = await api.get('/dashboard/siswa');
    return response.data;
  },
};

export default dashboardService;
