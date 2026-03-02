import { ApiResponse } from './types';
import { useStore } from './store/useStore';

const BASE_URL = 'https://payflow-backend-production.up.railway.app';

const getAuthHeader = () => {
  const token = localStorage.getItem('payflow_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    // Explicitly destructure to ensure we have fresh state references
    const store = useStore.getState();

    try {
      store.setGlobalLoading(true);

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
          ...options.headers,
        },
      });

      if (response.status === 401) {
        store.logout();
        window.location.hash = '#/login';
        return { success: false, error: 'Session expired.' };
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Server error');
      }

      return {
        success: true,
        data: result.data as T,
        message: result.message
      };
    } catch (err: any) {
      console.error(`API Error [${endpoint}]:`, err.message);
      return { success: false, error: err.message };
    } finally {
      // Small timeout to prevent the UI from flickering on fast connections
      setTimeout(() => {
        useStore.getState().setGlobalLoading(false);
      }, 400);
    }
  },

  // Auth, Wallets, Transfers, VFD, Employees, Cadres, Deductions, Payroll, Audit modules remain the same as previous list...
  auth: {
    register: (payload: any) => api.request('/v1/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
    login: (payload: any) => api.request('/v1/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    verify2FA: (code: string) => api.request('/v1/auth/verify-2fa', { method: 'POST', body: JSON.stringify({ code }) }),
    requestPasswordReset: (email: string) => api.request('/v1/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  },
  wallets: {
    getBalances: () => api.request('/v1/wallets', { method: 'GET' }),
    getTransactions: () => api.request('/v1/wallets/transactions', { method: 'GET' }),
    getById: (id: string) => api.request(`/v1/wallets/${id}`, { method: 'GET' }),
  },
  transfers: {
    initiateSingle: (payload: any) => api.request('/v1/transfers', { method: 'POST', body: JSON.stringify(payload) }),
    initiateBulk: (payload: any) => api.request('/v1/bulk-transfers', { method: 'POST', body: JSON.stringify(payload) }),
    getHistory: () => api.request('/v1/transfers', { method: 'GET' }),
    getBulkHistory: () => api.request('/v1/bulk-transfers', { method: 'GET' }),
  },
  vfd: {
    getAccountDetails: () => api.request('/v1/vfd/account', { method: 'GET' }),
    initiateTransfer: (payload: any) => api.request('/v1/vfd/transfer', { method: 'POST', body: JSON.stringify(payload) }),
    getWebhooks: () => api.request('/v1/vfd/webhooks', { method: 'GET' }),
  },
  employees: {
    create: (payload: any) => api.request('/v1/employees', { method: 'POST', body: JSON.stringify(payload) }),
    getAll: () => api.request('/v1/employees', { method: 'GET' }),
    getById: (id: string) => api.request(`/v1/employees/${id}`, { method: 'GET' }),
    verifyBank: (payload: { account_number: string, bank_code: string }) =>
        api.request('/v1/employees/verify-account', { method: 'POST', body: JSON.stringify(payload) }),
  },
  cadres: {
    create: (payload: any) => api.request('/v1/cadres', { method: 'POST', body: JSON.stringify(payload) }),
    getAll: () => api.request('/v1/cadres', { method: 'GET' }),
  },
  deductions: {
    createRule: (payload: any) => api.request('/v1/deduction-rules', { method: 'POST', body: JSON.stringify(payload) }),
    getAllRules: () => api.request('/v1/deduction-rules', { method: 'GET' }),
  },
  payroll: {
    initiate: (payload: { adjustments: Record<string, any> }) =>
        api.request('/v1/payroll-runs', { method: 'POST', body: JSON.stringify(payload) }),
    getHistory: () => api.request('/v1/payroll-runs', { method: 'GET' }),
    getDetails: (id: string) => api.request(`/v1/payroll-runs/${id}`, { method: 'GET' }),
    approve: (id: string) => api.request(`/v1/payroll-runs/${id}/approve`, { method: 'POST' }),
    reject: (id: string, reason: string) =>
        api.request(`/v1/payroll-runs/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),
  },
  audit: {
    getLogs: () => api.request('/v1/audit-logs', { method: 'GET' }),
  }
};