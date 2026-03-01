import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser, Employee } from '../types';

interface AppState {
  user: AuthUser | null;
  token: string | null;
  theme: 'light' | 'dark';
  payrollDraft: {
    employees: Employee[];
    period: string;
  } | null;
  
  // Actions
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
  toggleTheme: () => void;
  setPayrollDraft: (draft: AppState['payrollDraft']) => void;
  updateEmployeeAdjustment: (employeeId: string, adjustments: Employee['adjustments']) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      theme: 'dark', // Set dark mode as default
      payrollDraft: null,

      setAuth: (user, token) => set({ user, token }),
      logout: () => {
        localStorage.removeItem('payflow_token');
        set({ user: null, token: null, payrollDraft: null });
      },
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setPayrollDraft: (payrollDraft) => set({ payrollDraft }),
      updateEmployeeAdjustment: (employeeId, adjustments) => set((state) => {
        if (!state.payrollDraft) return state;
        const nextEmployees = state.payrollDraft.employees.map(emp => 
          emp.id === employeeId ? { ...emp, adjustments } : emp
        );
        return { payrollDraft: { ...state.payrollDraft, employees: nextEmployees } };
      }),
    }),
    {
      name: 'payflow-storage',
    }
  )
);