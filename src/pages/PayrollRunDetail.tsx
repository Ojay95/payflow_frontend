import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.ts';
import { useStore } from '../store/useStore.ts';
import { AdjustmentItem, Employee, PayrollRun } from '../types.ts';
import Toast from '../components/Toast.tsx';

const PayrollRunDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { payrollDraft, setPayrollDraft } = useStore();

  const [loading, setLoading] = useState(true);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [currentAdjustments, setCurrentAdjustments] = useState<AdjustmentItem[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  /**
   * Production Data Sync:
   * Fetches the specific payroll run state and linked employees from the backend.
   */
  useEffect(() => {
    const fetchRunDetails = async () => {
      if (!id || id === 'new') return;

      setLoading(true);
      const res = await api.payroll.getDetails(id);

      if (res.success && res.data) {
        // Sync local draft with production backend state
        setPayrollDraft({
          runId: res.data.id,
          employees: res.data.employees || [],
          period: res.data.period
        });
      } else {
        setToast({ message: res.error || "Failed to load payroll details.", type: 'error' });
      }
      setLoading(false);
    };

    fetchRunDetails();
  }, [id, setPayrollDraft]);

  const handleOpenAdjustments = (emp: Employee) => {
    setSelectedEmployee(emp);
    // Initialize with existing adjustments or one empty row
    setCurrentAdjustments(emp.adjustments?.length > 0
        ? [...emp.adjustments]
        : [{ item_name: '', amount: 0, description: '', component_type: 'earnings' }]
    );
    setShowAdjustmentModal(true);
  };

  /**
   * Save Adjustments:
   * In production, we update the local store draft.
   * The final 'Submit' call sends the entire adjustments map to the backend.
   */
  const saveAdjustments = () => {
    if (selectedEmployee) {
      const validAdjustments = currentAdjustments.filter(a => a.item_name.trim() !== '' && a.amount > 0);
      useStore.getState().updateEmployeeAdjustment(selectedEmployee.id, validAdjustments);
      setToast({ message: `Adjustments saved for ${selectedEmployee.full_name}`, type: 'success' });
    }
    setShowAdjustmentModal(false);
  };

  const handleSubmitRun = async () => {
    if (!payrollDraft?.runId) return;

    setLoading(true);
    // Construct the adjustments payload for the backend engine
    const adjustmentMap = payrollDraft.employees.reduce((acc, emp) => {
      if (emp.adjustments.length > 0) acc[emp.id] = emp.adjustments;
      return acc;
    }, {} as Record<string, AdjustmentItem[]>);

    const res = await api.payroll.initiate({ adjustments: adjustmentMap });

    if (res.success) {
      navigate('/payroll/approvals');
    } else {
      setToast({ message: res.error || "Failed to submit payroll run.", type: 'error' });
    }
    setLoading(false);
  };

  // Helper for cent-to-dollar precision
  const formatUSD = (cents: number) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

  const totals = useMemo(() => {
    if (!payrollDraft) return { gross: "$0", net: "$0", adjs: "$0" };

    let grossCents = 0;
    let netCents = 0;

    payrollDraft.employees.forEach(emp => {
      const base = emp.base_salary_cents;
      const adjTotal = emp.adjustments.reduce((sum, a) =>
          sum + (a.component_type === 'earnings' ? a.amount : -a.amount), 0
      );
      grossCents += base;
      netCents += (base + adjTotal);
    });

    return {
      gross: formatUSD(grossCents),
      net: formatUSD(netCents),
      adjs: formatUSD(netCents - grossCents)
    };
  }, [payrollDraft]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto pb-48">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <div className="flex flex-wrap gap-2 py-4">
          <Link to="/dashboard" className="text-slate-500 text-xs font-bold hover:text-primary transition-colors">Dashboard</Link>
          <span className="text-slate-700 text-xs">/</span>
          <span className="text-white text-xs font-black uppercase tracking-widest">{payrollDraft?.period || 'Current Cycle'}</span>
        </div>

        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 pb-10">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              <h1 className="text-white text-3xl font-black tracking-tight">Review Run Details</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-900/40 text-amber-400 border border-amber-800/50 text-[10px] font-black uppercase">Draft Mode</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">Validation step for {payrollDraft?.employees.length} employee disbursements.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
          <SummaryCard title="Scheduled Gross" value={totals.gross} icon="payments" />
          <SummaryCard title="Total Adjustments" value={totals.adjs} icon="account_balance_wallet" />
          <SummaryCard title="Expected Net Payout" value={totals.net} icon="account_balance" primary />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="hidden md:table-header-group">
            <tr className="bg-slate-800/40 border-b border-slate-700">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Pay</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Manual Line Items</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Net Disbursement</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
            {payrollDraft?.employees.map(emp => {
              const net = emp.base_salary_cents + emp.adjustments.reduce((s, a) => s + (a.component_type === 'earnings' ? a.amount : -a.amount), 0);
              return (
                  <tr key={emp.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-primary text-xs uppercase">
                          {emp.full_name[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{emp.full_name}</p>
                          <p className="text-[10px] text-slate-500 font-black uppercase">{emp.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-300">{formatUSD(emp.base_salary_cents)}</td>
                    <td className="px-6 py-5">
                      <button
                          onClick={() => handleOpenAdjustments(emp)}
                          className="text-[10px] font-black uppercase text-primary bg-primary/5 px-3 py-2 rounded-xl border border-primary/10 hover:bg-primary/10 transition-all"
                      >
                        {emp.adjustments.length > 0 ? `${emp.adjustments.length} Adjustments` : '+ Add Adjustment'}
                      </button>
                    </td>
                    <td className="px-6 py-5 text-right text-sm font-black text-white">{formatUSD(net)}</td>
                  </tr>
              );
            })}
            </tbody>
          </table>
        </div>

        <footer className="fixed bottom-0 left-0 lg:left-72 right-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-6 z-[100]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Grand Total to Fund</p>
              <p className="text-3xl font-black text-white">{totals.net}</p>
            </div>
            <button
                onClick={handleSubmitRun}
                disabled={loading}
                className="px-10 h-14 bg-primary text-slate-900 rounded-2xl font-black shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Submit for Approval'}
            </button>
          </div>
        </footer>

        {showAdjustmentModal && selectedEmployee && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
              <div className="bg-slate-900 w-full max-w-2xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-white/5 bg-primary/5 flex justify-between items-center">
                  <h2 className="text-xl font-black text-white">Adjustments: {selectedEmployee.full_name}</h2>
                  <button onClick={() => setShowAdjustmentModal(false)} className="text-slate-500 hover:text-white"><span className="material-symbols-outlined">close</span></button>
                </div>
                <div className="p-8 overflow-y-auto space-y-4">
                  {currentAdjustments.map((item, idx) => (
                      <div key={idx} className="bg-slate-950 p-6 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormGroup label="Description" value={item.item_name} onChange={(e:any) => {
                          const n = [...currentAdjustments]; n[idx].item_name = e.target.value; setCurrentAdjustments(n);
                        }} placeholder="e.g. Overtime" />
                        <div className="grid grid-cols-2 gap-2">
                          <FormGroup label="Type" isSelect value={item.component_type} onChange={(e:any) => {
                            const n = [...currentAdjustments]; n[idx].component_type = e.target.value as any; setCurrentAdjustments(n);
                          }} />
                          <FormGroup label="Amount (¢)" type="number" value={item.amount} onChange={(e:any) => {
                            const n = [...currentAdjustments]; n[idx].amount = parseInt(e.target.value) || 0; setCurrentAdjustments(n);
                          }} placeholder="5000 = $50" />
                        </div>
                      </div>
                  ))}
                  <button onClick={() => setCurrentAdjustments([...currentAdjustments, { item_name: '', amount: 0, description: '', component_type: 'earnings' }])} className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-500 font-black text-xs uppercase hover:text-primary transition-colors">+ Add Line Item</button>
                </div>
                <div className="p-8 border-t border-white/5 flex justify-end gap-4">
                  <button onClick={() => setShowAdjustmentModal(false)} className="px-6 font-bold text-slate-500">Cancel</button>
                  <button onClick={saveAdjustments} className="px-8 h-12 bg-primary text-slate-900 rounded-xl font-black">Apply Changes</button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

const FormGroup = ({ label, isSelect, ...props }: any) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      {isSelect ? (
          <select className="h-12 bg-slate-800 border border-white/10 rounded-xl text-white px-3 text-sm" {...props}>
            <option value="earnings">Earnings (+)</option>
            <option value="deduction">Deduction (-)</option>
          </select>
      ) : (
          <input className="h-12 bg-slate-800 border border-white/10 rounded-xl text-white px-4 text-sm outline-none focus:ring-1 focus:ring-primary" {...props} />
      )}
    </div>
);

const SummaryCard = ({ title, value, icon, primary }: any) => (
    <div className={`p-6 rounded-2xl border shadow-xl ${primary ? 'bg-primary border-primary' : 'bg-slate-900 border-slate-800'}`}>
      <div className="flex justify-between items-start mb-4">
        <p className={`text-[10px] font-black uppercase tracking-widest ${primary ? 'text-slate-900' : 'text-slate-500'}`}>{title}</p>
        <span className={`material-symbols-outlined ${primary ? 'text-slate-900' : 'text-primary'}`}>{icon}</span>
      </div>
      <p className={`text-3xl font-black ${primary ? 'text-slate-900' : 'text-white'}`}>{value}</p>
    </div>
);

export default PayrollRunDetail;