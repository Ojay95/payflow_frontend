
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const PayrollApprovals: React.FC = () => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-dark flex flex-col">
      <Navigation />
      
      <div className="flex flex-1">
        <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden lg:flex flex-col justify-between p-4 h-[calc(100vh-64px)] sticky top-16">
          <div className="flex flex-col gap-4">
            <div className="px-3 py-4 border-b border-slate-800">
              <h1 className="text-white text-base font-semibold">PayFlow Admin</h1>
              <p className="text-slate-500 text-xs">Global HR Solutions</p>
            </div>
            <SidebarItem onClick={() => navigate('/dashboard')} icon="grid_view" label="Overview" />
            <SidebarItem icon="verified" label="Approvals" active />
            <SidebarItem onClick={() => navigate('/payroll/history')} icon="history" label="History" />
            <SidebarItem onClick={() => navigate('/audit-logs')} icon="receipt_long" label="Audit Logs" />
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 bg-background-dark">
          <div className="max-w-[1200px] w-full mx-auto p-4 md:p-8">
            <div className="flex flex-wrap justify-between items-end gap-3 mb-8">
              <div className="flex min-w-72 flex-col gap-1">
                <p className="text-white text-3xl font-black leading-tight tracking-tight">Payroll Approvals</p>
                <p className="text-slate-500 text-base font-normal">Final review for Oct 15 - Oct 31 payment cycle.</p>
              </div>
            </div>

            <div className="bg-slate-900 border-2 border-primary/30 rounded-xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-800 bg-primary/5">
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/20 rounded-lg text-primary">
                      <span className="material-symbols-outlined text-2xl font-bold">account_balance_wallet</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Full-Time Staff Payroll</h3>
                      <p className="text-sm text-slate-500">Requested by Maria Rodriguez • Oct 1 - Oct 15</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Total Amount</p>
                    <p className="text-3xl font-black text-white">$82,400.00</p>
                  </div>
                </div>
              </div>

              <div className="p-6 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[11px] text-slate-500 uppercase tracking-widest border-b border-slate-800">
                      <th className="pb-3 font-bold">Employee</th>
                      <th className="pb-3 font-bold">Gross Pay</th>
                      <th className="pb-3 font-bold">Deductions</th>
                      <th className="pb-3 font-bold text-right">Net Payout</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <TableRow name="John Doe" gross="$4,200.00" tax="-$950.00" net="$3,250.00" initials="JD" />
                    <TableRow name="Alice Smith" gross="$3,800.00" tax="-$840.00" net="$2,960.00" initials="AS" />
                  </tbody>
                </table>
              </div>

              <div className="bg-slate-800/40 p-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium italic">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  Approved runs disburse on Friday, Oct 14th
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <button 
                    onClick={() => setShowRejectModal(true)}
                    className="flex-1 md:px-8 py-3 bg-slate-800 text-red-400 border border-red-400/20 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 hover:bg-red-500/10"
                  >
                    <span className="material-symbols-outlined">close</span> Reject
                  </button>
                  <button className="flex-1 md:px-8 py-3 bg-primary text-slate-900 font-bold rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 hover:brightness-110">
                    <span className="material-symbols-outlined font-bold">check</span> Approve & Release
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">Reject Payroll Run</h2>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Reason for Rejection</label>
                <textarea 
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  className="w-full bg-slate-800 border-white/10 rounded-xl text-white text-sm p-4 h-32 focus:ring-primary focus:border-primary"
                  placeholder="e.g. Total amount exceeds quarterly budget, please review Sarah's bonus..."
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowRejectModal(false)} className="flex-1 h-12 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button 
                  disabled={!rejectComment.trim()}
                  onClick={() => setShowRejectModal(false)}
                  className={`flex-1 h-12 rounded-xl text-sm font-bold transition-all ${rejectComment.trim() ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${active ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}
  >
    <span className="material-symbols-outlined">{icon}</span>
    <p className="text-sm">{label}</p>
  </button>
);

const TableRow = ({ name, gross, tax, net, initials }: any) => (
  <tr>
    <td className="py-4 flex items-center gap-3">
      <div className="size-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold border border-primary/20">{initials}</div>
      <span className="font-bold text-white text-sm">{name}</span>
    </td>
    <td className="py-4 text-sm text-slate-400">{gross}</td>
    <td className="py-4 text-sm text-red-400">{tax}</td>
    <td className="py-4 text-sm font-black text-right text-white">{net}</td>
  </tr>
);

export default PayrollApprovals;
