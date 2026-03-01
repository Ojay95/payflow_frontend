import { ApiResponse } from './types';
import { MOCK_DATA, simulateDelay } from './services/mockService';

const BASE_URL = 'http://localhost:8080';
const USE_MOCK = true; // Can be toggled or controlled via env vars

const getAuthHeader = () => {
  const token = localStorage.getItem('payflow_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    if (USE_MOCK) {
      await simulateDelay();
      
      // Specialized mock logic for login
      if (endpoint === '/v1/auth/login') {
        return { success: true, data: MOCK_DATA.auth as any, isMock: true };
      }

      // Find best matching mock key. We check if the endpoint contains the key name.
      // e.g. /v1/payroll-runs contains 'payroll'
      const mockKey = Object.keys(MOCK_DATA).find(k => endpoint.toLowerCase().includes(k.toLowerCase()));
      const mockResult = mockKey ? (MOCK_DATA as any)[mockKey] : null;
      
      // If we expect an array (based on common GET patterns) but got nothing, return []
      const finalData = mockResult || (endpoint.includes('get') || options.method === 'GET' ? [] : {});
      
      return { success: true, data: finalData as T, isMock: true };
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
          ...options.headers,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('payflow_token');
        window.location.hash = '#/login';
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Server error');
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  auth: {
    register: (payload: any) => api.request('/v1/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
    login: (payload: any) => api.request('/v1/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  },

  cadres: {
    create: (payload: any) => api.request('/v1/cadres', { method: 'POST', body: JSON.stringify(payload) }),
    getAll: () => api.request('/v1/cadres', { method: 'GET' }),
  },

  employees: {
    create: (payload: any) => api.request('/v1/employees', { method: 'POST', body: JSON.stringify(payload) }),
    getAll: () => api.request('/v1/employees', { method: 'GET' }),
  },

  payroll: {
    initiate: (payload: any) => api.request('/v1/payroll-runs', { method: 'POST', body: JSON.stringify(payload) }),
    getHistory: () => api.request('/v1/payroll-runs', { method: 'GET' }),
  }
};