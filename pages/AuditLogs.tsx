import React from 'react';
import Navigation from '../components/Navigation';

const AuditLogs: React.FC = () => {
  const logs = [
    { id: '1', event: 'Payroll Disbursement', user: 'Maria Rodriguez', target: 'June 2024 Cycle', status: 'Success', date: '2024-06-25 14:22' },
    { id: '2', event: 'New Employee Added', user: 'Alex Johnson', target: 'Sarah Chen', status: 'Success', date: '2024-06-24 09:15' },
    { id: '3', event: 'Cadre Updated', user: 'System', target: 'Senior Engineer Tier', status: 'Success', date: '2024-06-23 11:04' },
    { id: '4', event: 'Failed Login Attempt', user: 'Unknown', target: 'admin@acme.com', status: 'Warning', date: '2024-06-22 23:45' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background-dark transition-colors duration-300">
      <Navigation />
      <main className="max-w-[1200px] mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-slate-900 dark:text-white text-3xl font-black mb-2">Audit Trail</h1>
          <p className="text-slate-500 dark:text-slate-400">Security monitoring and system compliance records.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-2xl transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-white/5">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Event</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Performed By</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Target</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{log.event}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{log.user}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{log.target}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${
                        log.status === 'Success' 
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' 
                          : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 dark:text-slate-500 text-right font-medium">{log.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuditLogs;