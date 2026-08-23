/**
 * src/services/api.js
 * HTTP API Client terpusat untuk komunikasi dengan Backend Express.js.
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Helper request HTTP standar
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Ambil token JWT dari localStorage
  const token = localStorage.getItem('authToken');

  const headers = {
    ...options.headers,
  };

  // Jangan pasang Content-Type jika body adalah FormData (biarkan browser set multipart boundary)
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized (Token kadaluwarsa)
    if (response.status === 401) {
      if (endpoint !== '/auth/login') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
      }
    }

    // Jika response bertipe blob / binary (seperti download Excel)
    const contentType = response.headers.get('content-type');
    if (contentType && (contentType.includes('spreadsheetml') || contentType.includes('octet-stream'))) {
      if (!response.ok) {
        throw new Error('Gagal mengunduh file spreadsheet.');
      }
      return response.blob();
    }

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.message || 'Terjadi kesalahan saat memproses permintaan.');
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Tidak dapat terhubung ke server Backend. Pastikan backend aktif di port 5000.');
    }
    throw error;
  }
}

export const api = {
  get: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: (endpoint, body, options = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: (endpoint, body, options = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
