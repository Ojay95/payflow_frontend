import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { PayrollRun } from '../types';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';

const PayrollApprovals: React.FC = () => {
  const [runs, setRuns] = useState<PayrollRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null); // Stores run ID
  const [rejectComment, setRejectComment] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingRuns();
  }, []);

  const fetchPendingRuns = async () => {
    setLoading(true);
    const res = await api.payroll.getHistory();
    if (res.success && Array.isArray(res.data)) {
      // Production Filter: Only show runs that are 'Pending' or 'Processing' for approval
      const pending = res.data.filter(run => run.status === 'Pending' || run.status === 'Processing');
      setRuns(pending);
    }
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    const res = await api.payroll.approve(id);

    if (res.success) {
      setToast({ message: "Payroll approved. Disbursement initiated via VFD/Korapay.", type: 'success' });
      fetchPendingRuns();
    } else {
      setToast({ message: res.error || "Approval failed.", type: 'error' });
    }
    setActionLoading(null);
  };

  const handleReject = async () => {
    if (!showRejectModal || !rejectComment.trim()) return;

    setActionLoading(showRejectModal);
    const res = await api.payroll.reject(showRejectModal, rejectComment);

    if (res.success) {
      setToast({ message: "Payroll run rejected and returned to draft.", type: 'success' });
      setShowRejectModal(null);
      setRejectComment('');
      fetchPendingRuns();
    } else {
      setToast({ message: res.error || "Rejection failed.", type: 'error' });
    }
    setActionLoading(null);
  };

  const formatUSD = (cents: number) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

  return (
      <div className="min-h-screen bg-background-dark flex flex-col">
        <Navigation />
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <div className="flex flex-1">
          <Sidebar activeItem="Approvals" />

          <main className="flex-1 flex flex-col min-w-0 bg-background-dark">
            <div className="max-w-[1200px] w-full mx-auto p-4 md:p-8">
              <div className="mb-8">
                <h1 className="text-white text-3xl font-black tracking-tight">Authorization Center</h1>
                <p className="text-slate-500 text-base mt-1">Review and release pending payroll disbursements.</p>
              </div>

              {loading ? (
                  <div className="flex justify-center py-20">
                    <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
              ) : runs.length === 0 ? (
                  <div className="bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-2xl p-20 text-center">
                    <span className="material-symbols-outlined text-slate-700 text-5xl mb-4">verified</span>
                    <p className="text-slate-500 font-bold uppercase tracking-widest">No runs awaiting approval</p>
                  </div>
              ) : (
                  <div className="space-y-8">
                    {runs.map((run) => (
                        <div key={run.id} className="bg-slate-900 border-2 border-primary/20 rounded-2xl overflow-hidden shadow-2xl transition-all hover:border-primary/40">
                          <div className="p-6 border-b border-slate-800 bg-primary/5 flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
                                <span className="material-symbols-outlined text-2xl font-bold">payments</span>
                              </div>
                              <div>
                                <h3 className="text-lg font-black text-white">{run.period} Cycle</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{run.reference}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-8">
                              <div className="text-right">
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Total Payout</p>
                                <p className="text-3xl font-black text-white">{formatUSD(run.total_amount_cents)}</p>
                              </div>
                              <div className="text-right border-l border-slate-800 pl-8">
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Staff Count</p>
                                <p className="text-2xl font-black text-primary">{run.employees_count}</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-slate-800/20 p-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-amber-500 font-black uppercase tracking-tighter">
                              <span className="material-symbols-outlined text-sm">lock</span>
                              Multi-Admin Verification Required
                            </div>
                            <div className="flex gap-4 w-full md:w-auto">
                              <button
                                  onClick={() => setShowRejectModal(run.id)}
                                  disabled={!!actionLoading}
                                  className="flex-1 md:px-8 py-3 bg-slate-900 text-red-400 border border-red-400/20 font-black rounded-xl hover:bg-red-500/10 transition-all disabled:opacity-50"
                              >
                                Reject Run
                              </button>
                              <button
                                  onClick={() => handleApprove(run.id)}
                                  disabled={!!actionLoading}
                                  className="flex-1 md:px-10 py-3 bg-primary text-slate-900 font-black rounded-xl shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                              >
                                {actionLoading === run.id ? (
                                    <div className="size-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                      <span className="material-symbols-outlined font-black">check_circle</span>
                                      Approve & Release
                                    </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
              )}
            </div>
          </main>
        </div>

        {showRejectModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-8">
                <h2 className="text-2xl font-black text-white mb-2">Flag for Rejection</h2>
                <p className="text-slate-500 text-sm mb-6">Provide a reason for the operator to review this cycle.</p>
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Rejection Note</label>
                    <textarea
                        value={rejectComment}
                        onChange={(e) => setRejectComment(e.target.value)}
                        className="w-full bg-slate-800 border border-white/10 rounded-xl text-white text-sm p-4 h-32 focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                        placeholder="e.g. Discrepancy in bonus calculations for the engineering team..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { setShowRejectModal(null); setRejectComment(''); }} className="flex-1 h-12 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors">Cancel</button>
                    <button
                        disabled={!rejectComment.trim() || !!actionLoading}
                        onClick={handleReject}
                        className={`flex-1 h-12 rounded-xl text-sm font-black transition-all ${rejectComment.trim() ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                    >
                      {actionLoading === showRejectModal ? 'Rejecting...' : 'Confirm Rejection'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default PayrollApprovals;