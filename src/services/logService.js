/**
 * src/services/logService.js
 * Service frontend untuk komunikasi API audit trail log aktivitas admin.
 */
import api from './api';

export const logService = {
  /**
   * Mengambil daftar log aktivitas dengan pagination, filter, dan search
   */
  getLogs: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/logs${query ? `?${query}` : ''}`);
    return response.data || { items: [], total: 0 };
  },

  /**
   * Mengambil detail log tertentu
   */
  getLogDetail: async (id) => {
    const response = await api.get(`/logs/${id}`);
    return response.data;
  },

  /**
   * Export audit log ke file Excel (.xlsx)
   */
  exportLogsExcel: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/logs/export-excel${query ? `?${query}` : ''}`, {
      responseType: 'blob',
    });
    return response;
  },
};

export default logService;
