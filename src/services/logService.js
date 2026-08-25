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
    const validParams = Object.entries(params).reduce((result, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        result[key] = value;
      }
      return result;
    }, {});
    const query = new URLSearchParams(validParams).toString();
    const response = await api.get(`/logs${query ? `?${query}` : ''}`);
    return {
      items: response.data || [],
      total: response.meta?.totalItems || 0,
      meta: response.meta,
    };
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
