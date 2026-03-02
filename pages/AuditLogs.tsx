import React, { useState, useEffect } from 'react';
import { api } from '../api';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';

interface AuditEntry {
  id: string;
  event: string;
  performed_by: string;
  target: string;
  status: 'Success' | 'Warning' | 'Failed' | 'Pending';
  created_at: string;
  metadata?: Record<string, any>;
}

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  /**
   * Production Data Sync:
   * Fetches real-time system logs. In a production environment, this view is
   * critical for compliance (SOC2/GDPR) and troubleshooting disbursements.
   */
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      // Interface with the backend's audit log and transaction repository
      const res = await api.audit.getLogs();

      if (res.success && Array.isArray(res.data)) {
        setLogs(res.data);
      } else {
        setToast({ message: res.error || "Unable to retrieve security logs.", type: 'error' });
      }
      setLoading(false);
    };

    fetchLogs();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
      <div className="min-h-screen bg-slate-50 dark:bg-background-dark transition-colors duration-300">
        <Navigation />
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <div className="flex">
          <Sidebar activeItem="Audit Logs" />

          <main className="flex-1 max-w-7xl mx-auto p-4 md:p-8 pb-24">
            <div className="mb-10">
              <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black tracking-tight mb-2">System Audit Trail</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Immutable record of all administrative and financial operations.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2rem] overflow-hidden shadow-sm dark:shadow-2xl transition-colors">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                  <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-white/5">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Operation Event</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Actor</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Object Target</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Result</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Timestamp</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {loading ? (
                      <tr>
                        <td colSpan={5} className="py-20 text-center">
                          <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                        </td>
                      </tr>
                  ) : logs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">
                          No system events recorded in this period.
                        </td>
                      </tr>
                  ) : (
                      logs.map(log => (
                          <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                            <td className="px-8 py-5">
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{log.event}</span>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">ID: {log.id.split('-')[0]}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-sm font-medium text-slate-600 dark:text-slate-300">
                              {log.performed_by || 'System Engine'}
                            </td>
                            <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400 italic">
                              {log.target}
                            </td>
                            <td className="px-6 py-5">
                              <StatusBadge status={log.status} />
                            </td>
                            <td className="px-8 py-5 text-sm text-slate-400 dark:text-slate-500 text-right font-mono font-medium">
                              {formatDate(log.created_at)}
                            </td>
                          </tr>
                      ))
                  )}
                  </tbody>
                </table>
              </div>

              <div className="p-6 bg-slate-50/50 dark:bg-white/[0.01] border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Access Only</p>
                <button className="text-[10px] font-black text-primary uppercase hover:underline tracking-widest">Export Legal PDF</button>
              </div>
            </div>
          </main>
        </div>
      </div>
  );
};

const StatusBadge = ({ status }: { status: AuditEntry['status'] }) => {
  const styles = {
    Success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    Failed: 'bg-red-500/10 text-red-500 border-red-500/20',
    Pending: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };

  return (
      <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
};

export default AuditLogs;