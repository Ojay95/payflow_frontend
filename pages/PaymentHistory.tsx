import React from 'react';
import Navigation from '../components/Navigation';

const PaymentHistory: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto w-full space-y-6 md:space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
        <div className="flex flex-col gap-2 min-w-0">
          <nav className="flex text-[10px] md:text-xs text-slate-500 font-black uppercase tracking-widest mb-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <span>Payroll</span>
            <span className="mx-2 text-slate-700">/</span>
            <span className="text-primary">Payment History</span>
          </nav>
          <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">Payment History</h1>
          <p className="text-slate-400 text-sm md:text-base font-medium">Audit logs of processed disbursements and tax filings.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-slate-800 border border-slate-700 text-white text-sm font-bold hover:bg-slate-700 transition-all">
            <span className="material-symbols-outlined text-[20px]">file_download</span>
            <span>Export CSV</span>
          </button>
          <button className="flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-primary text-white text-sm font-black shadow-lg hover:brightness-110 active:scale-[0.98] transition-all">
            <span className="material-symbols-outlined text-[20px] font-bold">add</span>
            <span>New Payroll Run</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-4 md:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input 
              className="block w-full pl-11 pr-4 h-11 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all text-sm" 
              placeholder="Search by reference ID or period..." 
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            <HistoryFilter label="Status: Processed" />
            <HistoryFilter label="Timeframe: 90 Days" icon="calendar_today" />
          </div>
        </div>
      </div>

      {/* High-Density Data Grid */}
      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-800/40 border-b border-slate-700/50">
                <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Period</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Pay Date</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              <HistoryRow 
                period="Oct 16 - Oct 31, 2023" 
                refID="Ref: PY-2023-10B" 
                date="Oct 28, 2023" 
                amount="$42,850.00" 
                status="Processed" 
                active 
              />
              <HistoryRow 
                period="Oct 01 - Oct 15, 2023" 
                refID="Ref: PY-2023-10A" 
                date="Oct 13, 2023" 
                amount="$41,200.00" 
                status="Processed" 
              />
              <HistoryRow 
                period="Sep 16 - Sep 30, 2023" 
                refID="Ref: PY-2023-09B" 
                date="Sep 28, 2023" 
                amount="$39,400.00" 
                status="Processing" 
              />
              <HistoryRow 
                period="Sep 01 - Sep 15, 2023" 
                refID="Ref: PY-2023-09A" 
                date="Sep 13, 2023" 
                amount="$40,150.00" 
                status="Failed" 
              />
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden divide-y divide-slate-800/50">
          <MobileHistoryCard period="Oct 16 - 31, 2023" refID="PY-2023-10B" date="Oct 28" amount="$42,850" status="Processed" active />
          <MobileHistoryCard period="Oct 01 - 15, 2023" refID="PY-2023-10A" date="Oct 13" amount="$41,200" status="Processed" />
          <MobileHistoryCard period="Sep 16 - 30, 2023" refID="PY-2023-09B" date="Sep 28" amount="$39,400" status="Processing" />
          <MobileHistoryCard period="Sep 01 - 15, 2023" refID="PY-2023-09A" date="Sep 13" amount="$40,150" status="Failed" />
        </div>

        <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/10 border-t border-slate-800/50">
          <p className="text-xs text-slate-500 font-medium">
            Page <span className="text-white font-bold">1</span> of 12
          </p>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-400">Previous</button>
            <button className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-primary text-white text-xs font-black shadow-md">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const HistoryFilter = ({ label, icon }: any) => (
  <button className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 border border-slate-700 hover:border-primary transition-all whitespace-nowrap">
    {icon && <span className="material-symbols-outlined text-lg text-slate-500">{icon}</span>}
    <span className="text-white text-xs font-bold">{label}</span>
    <span className="material-symbols-outlined text-base opacity-50">expand_more</span>
  </button>
);

const HistoryRow = ({ period, refID, date, amount, status, active }: any) => (
  <tr className={`hover:bg-primary/[0.02] transition-colors cursor-pointer border-l-4 ${active ? 'border-primary bg-primary/[0.01]' : 'border-transparent'}`}>
    <td className="px-6 py-2.5">
      <div className="flex flex-col min-w-0">
        <span className="text-white font-bold text-sm truncate">{period}</span>
        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest truncate">{refID}</span>
      </div>
    </td>
    <td className="px-6 py-2.5 text-sm text-slate-400">{date}</td>
    <td className="px-6 py-2.5 font-black text-white text-sm">{amount}</td>
    <td className="px-6 py-2.5">
      <span className={`inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
        status === 'Processed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
        status === 'Processing' ? 'bg-primary/10 text-primary border-primary/20' :
        'bg-red-500/10 text-red-500 border-red-500/20'
      }`}>
        {status}
      </span>
    </td>
    <td className="px-6 py-2.5 text-right">
      <div className="flex justify-end gap-1">
        <button className="p-1.5 text-slate-500 hover:text-white transition-colors"><span className="material-symbols-outlined text-lg">receipt_long</span></button>
        <button className="p-1.5 text-slate-500 hover:text-white transition-colors"><span className="material-symbols-outlined text-lg">more_vert</span></button>
      </div>
    </td>
  </tr>
);

const MobileHistoryCard = ({ period, refID, date, amount, status, active }: any) => (
  <div className={`p-4 flex flex-col gap-3 relative overflow-hidden ${active ? 'bg-primary/[0.02]' : ''}`}>
    {active && <div className="absolute left-0 inset-y-0 w-1 bg-primary"></div>}
    <div className="flex justify-between items-start">
      <div className="min-w-0 pr-4">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{refID}</p>
        <h4 className="text-sm font-bold text-white truncate">{period}</h4>
      </div>
      <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border shrink-0 ${
        status === 'Processed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
        status === 'Processing' ? 'bg-primary/10 text-primary border-primary/20' :
        'bg-red-500/10 text-red-500 border-red-500/20'
      }`}>
        {status}
      </span>
    </div>
    <div className="flex justify-between items-end">
      <div>
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Amount</p>
        <p className="text-base font-black text-white">{amount}</p>
      </div>
      <div className="flex gap-2">
        <button className="size-9 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-400">
          <span className="material-symbols-outlined text-lg">receipt_long</span>
        </button>
        <button className="size-9 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-400">
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </div>
  </div>
);

export default PaymentHistory;