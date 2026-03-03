import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.ts';
import { useStore } from '../store/useStore.ts';
import { PayrollRun, Wallet } from '../types.ts';
import Toast from '../components/Toast.tsx';

const Dashboard: React.FC = () => {
  const [showInitModal, setShowInitModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<PayrollRun[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const navigate = useNavigate();
  const { user, wallet, setWallet, setPayrollDraft } = useStore();

  /**
   * Production Data Fetching:
   * Syncs wallet balance and payroll history from live backend endpoints.
   */
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const [walletRes, historyRes] = await Promise.all([
        api.wallets.getBalances(),
        api.payroll.getHistory()
      ]);

      if (walletRes.success && walletRes.data) {
        setWallet(walletRes.data);
      }

      if (historyRes.success && Array.isArray(historyRes.data)) {
        setHistory(historyRes.data);
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, [setWallet]);

  /**
   * Initiate Payroll Flow:
   * Calls the backend to create a new payroll run record before entering the detail view.
   */
  const handleStartPayroll = async () => {
    setLoading(true);
    const [empRes, payrollRes] = await Promise.all([
      api.employees.getAll(),
      api.payroll.initiate({ adjustments: {} })
    ]);

    if (empRes.success && payrollRes.success) {
      const employees = Array.isArray(empRes.data) ? empRes.data : [];

      // Update store with actual backend run details
      setPayrollDraft({
        runId: payrollRes.data?.id,
        employees: employees.map((e: any) => ({ ...e, adjustments: [] })),
        period: 'Oct 01 - Oct 15, 2023' // In prod, this would be returned by the backend
      });

      navigate(`/payroll/run/${payrollRes.data?.id || 'new'}`);
    } else {
      setToast({
        message: payrollRes.error || "Failed to initiate payroll run.",
        type: 'error'
      });
    }
    setLoading(false);
    setShowInitModal(false);
  };

  // Helper for cent-to-dollar display
  const formatCurrency = (cents: number = 0) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
          .format(cents / 100);

  return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-10 pb-20">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-white dark:bg-slate-800/30 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm shadow-sm transition-colors">
          <div className="flex flex-col gap-2">
            <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Welcome, {user?.name?.split(' ')[0] || 'Admin'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">
              {user?.business_name} • Payroll Command Center
            </p>
          </div>
          <button
              onClick={() => setShowInitModal(true)}
              className="w-full lg:w-auto flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-black shadow-lg hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined font-bold">play_arrow</span>
            Run New Payroll
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <StatCard
              title="Wallet Balance"
              value={formatCurrency(wallet?.balance_cents)}
              trend="Live Balance"
              color="primary"
          />
          <StatCard
              title="VFD Virtual Account"
              value={wallet?.account_number || "Not Linked"}
              trend="Funding Source"
              color="emerald"
          />
          <StatCard
              title="Active Employees"
              value={history[0]?.employees_count || "0"}
              trend="Current Workforce"
              color="blue"
              className="sm:col-span-2 lg:col-span-1"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden flex flex-col shadow-sm transition-colors">
            <div className="p-5 md:p-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-[10px] md:text-xs">Compliance & Readiness</h3>
              <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-xl">verified_user</span>
            </div>
            <div className="p-5 md:p-6 space-y-5 flex-1">
              <CheckItem
                  label="VFD Bank Integration"
                  sub={wallet?.account_number ? "Account Provisioned" : "Provisioning Required"}
                  completed={!!wallet?.account_number}
                  action={!wallet?.account_number ? "Link" : undefined}
                  onClick={() => navigate('/settings')}
              />
              <CheckItem
                  label="Tax Compliance"
                  sub="RC1234567 • Fully Verified"
                  completed
              />
              <CheckItem
                  label="Pending Approvals"
                  sub="Check for cycles awaiting release"
                  action="Review"
                  onClick={() => navigate('/payroll/approvals')}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden flex flex-col shadow-sm transition-colors">
            <div className="p-5 md:p-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-[10px] md:text-xs">Disbursement History</h3>
              <button onClick={() => navigate('/payroll/history')} className="text-[10px] font-black text-primary uppercase hover:underline">Full Audit</button>
            </div>
            <div className="p-5 md:p-6 divide-y divide-slate-100 dark:divide-slate-800/50">
              {history.length > 0 ? history.slice(0, 4).map((run) => (
                  <div key={run.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="flex flex-col min-w-0 pr-4">
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{run.period}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-600 font-black uppercase truncate">{run.reference}</span>
                    </div>
                    <div className="text-right shrink-0">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded mr-3 ${
                      run.status === 'Disbursed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {run.status}
                  </span>
                      <span className="text-sm font-black text-slate-900 dark:text-white">{formatCurrency(run.total_amount_cents)}</span>
                    </div>
                  </div>
              )) : (
                  <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-8 font-medium">No disbursement records found.</p>
              )}
            </div>
          </div>
        </div>

        {showInitModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-slate-950/40 backdrop-blur-md">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-lg rounded-2xl p-6 md:p-10 shadow-2xl transition-colors">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4">Confirm Payroll Run</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base mb-8 md:mb-10 leading-relaxed">
                  Initiating this run will calculate earnings and deductions for all active employees. You will be able to review line-items before final approval.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={() => setShowInitModal(false)} className="flex-1 h-12 font-bold text-slate-400 order-2 sm:order-1 hover:text-slate-900 dark:hover:text-white transition-colors">Cancel</button>
                  <button
                      onClick={handleStartPayroll}
                      disabled={loading}
                      className="flex-1 h-12 bg-primary text-white rounded-xl font-black flex items-center justify-center shadow-md order-1 sm:order-2 hover:brightness-110"
                  >
                    {loading ? <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Confirm & Initiate'}
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

const StatCard = ({ title, value, trend, color, className }: any) => {
  const colors: any = {
    primary: 'text-primary border-primary/20 bg-primary/5 dark:bg-primary/5',
    emerald: 'text-emerald-600 dark:text-emerald-500 border-emerald-500/20 bg-emerald-500/5',
    blue: 'text-blue-600 dark:text-blue-500 border-blue-500/20 bg-blue-500/5'
  };
  return (
      <div className={`p-6 md:p-8 rounded-2xl border shadow-sm hover:border-primary/40 transition-all ${colors[color] || colors.primary} ${className}`}>
        <p className="text-slate-500 dark:text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-4">{title}</p>
        <div className="flex flex-wrap items-baseline gap-2 md:gap-3">
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-none transition-colors truncate w-full">{value}</h3>
          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">{trend}</span>
        </div>
      </div>
  );
};

const CheckItem = ({ label, sub, completed, action, onClick }: any) => (
    <div className="flex items-start gap-4 group">
      <div className={`mt-0.5 size-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${completed ? 'bg-primary border-primary text-white shadow-sm shadow-primary/20' : 'border-slate-200 dark:border-slate-800'}`}>
        {completed && <span className="material-symbols-outlined text-sm font-black">check</span>}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight transition-colors">{label}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 transition-colors">{sub}</p>
      </div>
      {action && (
          <button
              onClick={onClick}
              className="shrink-0 text-[10px] font-black text-primary uppercase border-b border-primary/20 hover:border-primary transition-colors py-0.5"
          >
            {action}
          </button>
      )}
    </div>
);

export default Dashboard;