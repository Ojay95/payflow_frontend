
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

interface AdjustmentItem {
  item_name: string;
  amount: number; // in cents
  description: string;
  component_type: 'earnings' | 'deduction';
}

const PayrollRunDetail: React.FC = () => {
  const navigate = useNavigate();
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  
  const [currentAdjustments, setCurrentAdjustments] = useState<AdjustmentItem[]>([]);

  const [employees, setEmployees] = useState([
    { 
      id: '1', 
      name: "Sarah Chen", 
      email: "sarah.c@innovate.com",
      role: "Sr. Product Designer", 
      base_salary_cents: 850000, 
      adjustments: [] as AdjustmentItem[] 
    },
    { 
      id: '2', 
      name: "Marcus Wright", 
      email: "marcus.w@innovate.com",
      role: "Fullstack Developer", 
      base_salary_cents: 720000, 
      adjustments: [
        { item_name: "Performance Bonus", amount: 250000, description: "Q3 Target exceeded", component_type: "earnings" }
      ] as AdjustmentItem[]
    },
    { 
      id: '3', 
      name: "Temi Temio", 
      email: "temiiii.temio@innovate.com",
      role: "Marketing Lead", 
      base_salary_cents: 680000, 
      adjustments: [] as AdjustmentItem[] 
    },
  ]);

  const handleOpenAdjustments = (emp: any) => {
    setSelectedEmployee(emp);
    setCurrentAdjustments(emp.adjustments.length > 0 ? [...emp.adjustments] : [{
      item_name: '',
      amount: 0,
      description: '',
      component_type: 'earnings'
    }]);
    setShowAdjustmentModal(true);
  };

  const addItem = () => {
    setCurrentAdjustments([...currentAdjustments, {
      item_name: '',
      amount: 0,
      description: '',
      component_type: 'earnings'
    }]);
  };

  const removeItem = (index: number) => {
    setCurrentAdjustments(currentAdjustments.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof AdjustmentItem, value: any) => {
    const next = [...currentAdjustments];
    next[index] = { ...next[index], [field]: value };
    setCurrentAdjustments(next);
  };

  const saveAdjustments = () => {
    setEmployees(employees.map(emp => 
      emp.id === selectedEmployee.id 
        ? { ...emp, adjustments: currentAdjustments.filter(a => a.item_name.trim() !== '') } 
        : emp
    ));
    setShowAdjustmentModal(false);
  };

  const totals = useMemo(() => {
    let gross = 0;
    let net = 0;
    employees.forEach(emp => {
      const base = emp.base_salary_cents;
      const adj = emp.adjustments.reduce((sum, a) => {
        return sum + (a.component_type === 'earnings' ? a.amount : -a.amount);
      }, 0);
      gross += base;
      net += (base + adj);
    });
    return { gross: (gross/100).toLocaleString(), net: (net/100).toLocaleString(), deductions: ((gross - net)/100).toLocaleString() };
  }, [employees]);

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto pb-48">
      <div className="flex flex-wrap gap-2 py-4 md:py-6">
        <Link to="/payroll/history" className="text-slate-500 text-xs md:text-sm font-bold hover:text-primary transition-colors">Payroll History</Link>
        <span className="text-slate-700 text-xs md:text-sm">/</span>
        <span className="text-white text-xs md:text-sm font-black">June 2024 Cycle</span>
      </div>

      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 pb-10">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <h1 className="text-white text-2xl md:text-3xl font-black leading-tight tracking-tight">Review Run - June 2024</h1>
            <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-amber-900/40 text-amber-400 border border-amber-800/50 text-[10px] font-black uppercase tracking-widest">Draft</span>
          </div>
          <p className="text-slate-400 text-sm md:text-base font-medium">Verify employee earnings and line-item adjustments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
        <SummaryCard title="Base Disbursement" value={`$${totals.gross}`} icon="payments" />
        <SummaryCard title="Net Adjustments" value={`$${totals.deductions}`} icon="account_balance_wallet" />
        <SummaryCard title="Final Net Payout" value={`$${totals.net}`} icon="account_balance" primary className="sm:col-span-2 lg:col-span-1" />
      </div>

      {/* Main Review Table/List */}
      <div className="bg-card-dark border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="hidden md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/40 border-b border-slate-700">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Employee</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Base Pay</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Adjustment Items</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Net Disbursement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {employees.map(emp => {
                 const netCents = emp.base_salary_cents + emp.adjustments.reduce((s, a) => s + (a.component_type === 'earnings' ? a.amount : -a.amount), 0);
                 return (
                  <tr key={emp.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-slate-700 shrink-0" style={{ backgroundImage: `url(https://picsum.photos/seed/${emp.email}/100/100)`, backgroundSize: 'cover' }}></div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{emp.name}</p>
                          <p className="text-xs text-slate-500 truncate">{emp.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-300">${(emp.base_salary_cents / 100).toLocaleString()}</td>
                    <td className="px-6 py-5">
                      <button 
                        onClick={() => handleOpenAdjustments(emp)}
                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2 bg-primary/5 px-3 py-2 rounded-xl border border-primary/10 transition-all active:scale-[0.98]"
                      >
                        <span className="material-symbols-outlined text-sm">add_circle</span>
                        {emp.adjustments.length > 0 ? `${emp.adjustments.length} Line Items` : 'Add Adjustment'}
                      </button>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <p className="text-sm font-black text-white">${(netCents / 100).toLocaleString()}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-slate-800">
          {employees.map(emp => {
             const netCents = emp.base_salary_cents + emp.adjustments.reduce((s, a) => s + (a.component_type === 'earnings' ? a.amount : -a.amount), 0);
             return (
              <div key={emp.id} className="p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-slate-700 shrink-0" style={{ backgroundImage: `url(https://picsum.photos/seed/${emp.email}/100/100)`, backgroundSize: 'cover' }}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-white truncate">{emp.name}</p>
                    <p className="text-xs text-slate-500 truncate">{emp.role}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-y border-white/5">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base Pay</p>
                    <p className="text-sm font-bold text-white">${(emp.base_salary_cents / 100).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Net Disburse</p>
                    <p className="text-sm font-black text-primary">${(netCents / 100).toLocaleString()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleOpenAdjustments(emp)}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">edit_note</span>
                  {emp.adjustments.length > 0 ? `Manage Adjustments (${emp.adjustments.length})` : 'Add Adjustments'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Action Footer */}
      <footer className="fixed bottom-0 left-0 lg:left-72 right-0 bg-[#0F172A]/90 backdrop-blur-md border-t border-slate-800 p-4 md:p-6 shadow-2xl z-[100]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex flex-col">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Grand Total (Net)</p>
              <p className="text-2xl md:text-3xl font-black text-white tracking-tight">${totals.net}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/payroll/approvals')}
            className="w-full sm:w-auto min-w-[240px] h-14 bg-primary text-slate-900 rounded-2xl font-black text-base shadow-2xl shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Submit for Final Review
          </button>
        </div>
      </footer>

      {showAdjustmentModal && selectedEmployee && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 w-full max-w-3xl rounded-3xl md:rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 md:p-8 border-b border-white/5 bg-primary/5 flex items-center justify-between">
              <div className="min-w-0 pr-4">
                <h2 className="text-xl md:text-2xl font-black text-white truncate">Line Items: {selectedEmployee.name}</h2>
                <p className="text-slate-400 text-xs md:text-sm font-medium mt-1">Add contextual earnings or deductions.</p>
              </div>
              <button onClick={() => setShowAdjustmentModal(false)} className="size-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-500 hover:text-white transition-colors shrink-0">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="p-4 md:p-8 overflow-y-auto space-y-4 md:space-y-6 flex-1 bg-slate-900/50">
              {currentAdjustments.map((item, idx) => (
                <div key={idx} className="bg-slate-900 border border-white/10 rounded-2xl p-4 md:p-6 relative group">
                  <button 
                    onClick={() => removeItem(idx)}
                    className="absolute top-4 right-4 text-slate-600 hover:text-red-400 transition-colors p-2"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Reason / Item Name</label>
                      <input 
                        className="h-12 bg-slate-800 border border-white/10 rounded-xl text-white px-4 text-sm focus:ring-2 focus:ring-primary/40 outline-none"
                        placeholder="e.g. Performance Bonus"
                        value={item.item_name}
                        onChange={(e) => updateItem(idx, 'item_name', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Type</label>
                        <select 
                          className="h-12 bg-slate-800 border border-white/10 rounded-xl text-white px-3 text-xs md:text-sm focus:ring-2 focus:ring-primary/40 outline-none appearance-none"
                          value={item.component_type}
                          onChange={(e) => updateItem(idx, 'component_type', e.target.value)}
                        >
                          <option value="earnings">Earnings (+)</option>
                          <option value="deduction">Deduction (-)</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Amount (¢)</label>
                        <input 
                          type="number"
                          className="h-12 bg-slate-800 border border-white/10 rounded-xl text-white px-3 text-sm focus:ring-2 focus:ring-primary/40 outline-none"
                          placeholder="10000 = $100"
                          value={item.amount}
                          onChange={(e) => updateItem(idx, 'amount', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Internal Notes</label>
                      <input 
                        className="h-12 bg-slate-800 border border-white/10 rounded-xl text-white px-4 text-sm focus:ring-2 focus:ring-primary/40 outline-none"
                        placeholder="Optional description for payslip..."
                        value={item.description}
                        onChange={(e) => updateItem(idx, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button 
                onClick={addItem}
                className="w-full h-14 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-3 text-slate-500 hover:text-primary hover:border-primary/40 transition-all font-black text-sm uppercase tracking-widest"
              >
                <span className="material-symbols-outlined">add</span>
                Add Line Item
              </button>
            </div>

            <div className="p-6 md:p-8 bg-slate-900 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex gap-6 w-full md:w-auto justify-around md:justify-start">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Additions</p>
                  <p className="text-xl font-black text-green-400">
                    +${(currentAdjustments.filter(a => a.component_type === 'earnings').reduce((s, a) => s + a.amount, 0) / 100).toLocaleString()}
                  </p>
                </div>
                <div className="w-px h-10 bg-white/10 hidden md:block"></div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Cuts</p>
                  <p className="text-xl font-black text-red-400">
                    -${(currentAdjustments.filter(a => a.component_type === 'deduction').reduce((s, a) => s + a.amount, 0) / 100).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button onClick={() => setShowAdjustmentModal(false)} className="flex-1 md:px-6 h-12 font-bold text-slate-500 hover:text-white transition-colors">Discard</button>
                <button onClick={saveAdjustments} className="flex-1 md:px-10 h-12 bg-primary text-slate-900 rounded-xl font-black shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all">Save Adjustments</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({ title, value, icon, primary, className }: any) => (
  <div className={`flex flex-col gap-2 rounded-2xl p-6 border shadow-xl transition-transform hover:scale-[1.02] ${className} ${primary ? 'bg-primary text-slate-900 border-primary' : 'bg-slate-900 border-slate-800'}`}>
    <div className="flex justify-between items-start">
      <p className={`text-[10px] font-black uppercase tracking-widest ${primary ? 'text-slate-800' : 'text-slate-500'}`}>{title}</p>
      <span className={`material-symbols-outlined ${primary ? 'text-slate-800' : 'text-primary'}`}>{icon}</span>
    </div>
    <p className={`tracking-tight text-3xl font-black leading-tight ${primary ? 'text-slate-900' : 'text-white'}`}>{value}</p>
  </div>
);

export default PayrollRunDetail;
