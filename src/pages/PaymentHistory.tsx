import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.ts';
import { PayrollRun, PayrollStatus } from '../types.ts';
import Toast from '../components/Toast.tsx';

const PaymentHistory: React.FC = () => {
  const [history, setHistory] = useState<PayrollRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
    // In production, you might implement a 30s poll here to catch async VFD webhook updates
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    const res = await api.payroll.getHistory();
    if (res.success && Array.isArray(res.data)) {
      setHistory(res.data);
    } else {
      setToast({ message: res.error || "Failed to sync payment records.", type: 'error' });
    }
    setLoading(false);
  };

  /**
   * Filter Logic:
   * Searches across Reference IDs and Period strings.
   */
  const filteredHistory = history.filter(run =>
      run.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      run.period.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatUSD = (cents: number) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

  return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6 md:space-y-8 pb-24">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
          <div className="flex flex-col gap-2">
            <nav className="flex text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">
              <span>Archive</span>
              <span className="mx-2 text-slate-700">/</span>
              <span className="text-primary">Disbursement Logs</span>
            </nav>
            <h1 className="text-white text-3xl md:text-4xl font-black tracking-tight">Payment History</h1>
            <p className="text-slate-400 text-sm font-medium">Verified audit trail of organization-wide payroll cycles.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-slate-800 border border-slate-700 text-white text-sm font-bold hover:bg-slate-700 transition-all">
              <span className="material-symbols-outlined text-[20px]">file_download</span>
              Export Audit
            </button>
            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-primary text-slate-900 text-sm font-black shadow-lg hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[20px] font-bold">add</span>
              New Payroll Run
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-11 pr-4 h-12 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-primary/40 outline-none transition-all text-sm"
                  placeholder="Search by reference (e.g. PY-2024)..."
              />
            </div>
            <div className="flex gap-2">
              <HistoryFilter label="Status: All" />
              <HistoryFilter label="Sort: Newest" icon="sort" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="hidden lg:block">
            <table className="w-full text-left">
              <thead>
              <tr className="bg-slate-800/40 border-b border-slate-800">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Billing Period</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Release Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Value</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
              {loading ? (
                  <tr><td colSpan={5} className="py-20 text-center"><div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
              ) : filteredHistory.length === 0 ? (
                  <tr><td colSpan={5} className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest">No matching records found</td></tr>
              ) : (
                  filteredHistory.map((run) => (
                      <tr key={run.id} className="hover:bg-primary/[0.02] transition-colors cursor-pointer group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-white font-bold text-sm">{run.period}</span>
                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{run.reference}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {new Date(run.payment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 font-black text-white text-sm">{formatUSD(run.total_amount_cents)}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={run.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                              onClick={() => navigate(`/payroll/run/${run.id}`)}
                              className="p-2 text-slate-500 hover:text-primary transition-colors bg-white/5 rounded-lg border border-white/5 group-hover:border-primary/20"
                          >
                            <span className="material-symbols-outlined text-lg">visibility</span>
                          </button>
                        </td>
                      </tr>
                  ))
              )}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="lg:hidden divide-y divide-slate-800">
            {filteredHistory.map((run) => (
                <div key={run.id} className="p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 pr-4">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{run.reference}</p>
                      <h4 className="text-base font-bold text-white truncate">{run.period}</h4>
                    </div>
                    <StatusBadge status={run.status} />
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Value</p>
                      <p className="text-lg font-black text-white">{formatUSD(run.total_amount_cents)}</p>
                    </div>
                    <button
                        onClick={() => navigate(`/payroll/run/${run.id}`)}
                        className="h-10 px-4 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-xs font-black text-primary uppercase tracking-widest"
                    >
                      View Run
                    </button>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

const StatusBadge = ({ status }: { status: PayrollStatus }) => {
  const styles = {
    Disbursed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Processing: 'bg-primary/10 text-primary border-primary/20',
    Pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    Approved: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    Failed: 'bg-red-500/10 text-red-500 border-red-500/20',
    Rejected: 'bg-slate-700/50 text-slate-400 border-slate-600/50',
  };

  return (
      <span className={`inline-flex items-center py-0.5 px-3 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
};

const HistoryFilter = ({ label, icon }: any) => (
    <button className="flex h-12 shrink-0 items-center justify-center gap-3 rounded-xl bg-slate-800 px-4 border border-slate-700 hover:border-primary transition-all">
      {icon && <span className="material-symbols-outlined text-lg text-slate-500">{icon}</span>}
      <span className="text-white text-xs font-bold">{label}</span>
      <span className="material-symbols-outlined text-base opacity-50">expand_more</span>
    </button>
);

export default PaymentHistory;