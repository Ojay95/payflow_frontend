import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthUser, Employee, Wallet } from '../types';

interface AppState {
    // --- Auth State ---
    user: AuthUser | null;
    token: string | null;
    is2faVerified: boolean;

    // --- App State ---
    theme: 'light' | 'dark';
    isGlobalLoading: boolean; // FIXED: Added missing property
    wallet: Wallet | null;
    payrollDraft: {
        employees: Employee[];
        period: string;
        runId?: string;
    } | null;

    // --- Actions ---
    setAuth: (user: AuthUser, token: string) => void;
    set2faVerified: (status: boolean) => void;
    setGlobalLoading: (loading: boolean) => void; // FIXED: Added missing action
    setWallet: (wallet: Wallet) => void;
    logout: () => void;
    toggleTheme: () => void;

    // --- Payroll Actions ---
    setPayrollDraft: (draft: AppState['payrollDraft']) => void;
    updateEmployeeAdjustment: (employeeId: string, adjustments: Employee['adjustments']) => void;
    clearPayrollDraft: () => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            is2faVerified: false,
            isGlobalLoading: false, // FIXED: Initialized property
            theme: 'dark',
            wallet: null,
            payrollDraft: null,

            setAuth: (user, token) => {
                localStorage.setItem('payflow_token', token);
                set({ user, token, is2faVerified: false });
            },

            set2faVerified: (status) => set({ is2faVerified: status }),

            setGlobalLoading: (loading) => set({ isGlobalLoading: loading }), // FIXED: Implemented action

            setWallet: (wallet) => set({ wallet }),

            logout: () => {
                localStorage.removeItem('payflow_token');
                set({
                    user: null,
                    token: null,
                    is2faVerified: false,
                    isGlobalLoading: false,
                    payrollDraft: null,
                    wallet: null
                });
            },

            toggleTheme: () => set((state) => ({
                theme: state.theme === 'light' ? 'dark' : 'light'
            })),

            setPayrollDraft: (payrollDraft) => set({ payrollDraft }),

            updateEmployeeAdjustment: (employeeId, adjustments) => set((state) => {
                if (!state.payrollDraft) return state;
                const nextEmployees = state.payrollDraft.employees.map(emp =>
                    emp.id === employeeId ? { ...emp, adjustments } : emp
                );
                return {
                    payrollDraft: { ...state.payrollDraft, employees: nextEmployees }
                };
            }),

            clearPayrollDraft: () => set({ payrollDraft: null }),
        }),
        {
            name: 'payflow-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                theme: state.theme,
                user: state.user,
                is2faVerified: state.is2faVerified
            }),
        }
    )
);