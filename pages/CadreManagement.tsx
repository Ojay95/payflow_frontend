import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import { api } from '../api';
import { Cadre, ApiResponse } from '../types';
import Toast from '../components/Toast';

const CadreManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cadres, setCadres] = useState<Cadre[]>([]);
  const [availableRules, setAvailableRules] = useState<any[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    earning_components: [
      { name: 'Basic Salary', amount: 0 },
      { name: 'Housing Allowance', amount: 0 },
      { name: 'Transport Allowance', amount: 0 }
    ],
    deduction_rule_ids: [] as string[]
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  /**
   * Production Data Fetching:
   * Syncs existing Cadres and fetches Available Deduction Rules from the backend
   * to populate the creation checklist.
   */
  const fetchInitialData = async () => {
    setLoading(true);
    const [cadreRes, rulesRes] = await Promise.all([
      api.cadres.getAll(),
      api.deductions.getAllRules()
    ]);

    if (cadreRes.success) setCadres(cadreRes.data || []);
    if (rulesRes.success) setAvailableRules(rulesRes.data || []);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      setToast({ message: "Cadre name is required.", type: 'error' });
      return;
    }

    setLoading(true);
    // Submit to /v1/cadres with cent-based values
    const res = await api.cadres.create(formData);

    if (res.success) {
      setToast({ message: "Compensation structure deployed successfully.", type: 'success' });
      setIsModalOpen(false);
      setFormData({
        name: '',
        earning_components: [
          { name: 'Basic Salary', amount: 0 },
          { name: 'Housing Allowance', amount: 0 },
          { name: 'Transport Allowance', amount: 0 }
        ],
        deduction_rule_ids: []
      });
      fetchInitialData();
    } else {
      setToast({ message: res.error || "Failed to create cadre.", type: 'error' });
    }
    setLoading(false);
  };

  const formatUSD = (cents: number) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

  return (
      <div className="min-h-screen bg-background-dark text-slate-200">
        <Navigation />
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <div className="flex">
          <Sidebar activeItem="Settings" />

          <main className="flex-1 max-w-7xl mx-auto px-6 py-10 pb-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div className="space-y-1">
                <h1 className="text-white text-4xl font-black tracking-tight">Salary Structures</h1>
                <p className="text-slate-500 font-medium">Define and scale tiered compensation cadres for your workforce.</p>
              </div>
              <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primary text-slate-900 px-8 h-14 rounded-2xl font-black shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined font-black">add_circle</span>
                New Cadre
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading && cadres.length === 0 ? (
                  <div className="col-span-full py-20 text-center"><div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></div>
              ) : cadres.length === 0 ? (
                  <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-800 rounded-[2.5rem] bg-slate-900/30">
                    <span className="material-symbols-outlined text-5xl text-slate-700 mb-4">account_tree</span>
                    <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No Cadres Assigned</p>
                  </div>
              ) : (
                  cadres.map((c) => (
                      <CadreCard
                          key={c.id}
                          title={c.name}
                          id={c.id}
                          basePay={formatUSD(c.earning_components?.[0]?.amount || 0)}
                          components={c.earning_components?.length || 0}
                          rules={c.deduction_rule_ids?.length || 0}
                      />
                  ))
              )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
                  <div className="bg-slate-900 w-full max-w-2xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
                    <div className="p-8 border-b border-white/5 bg-primary/5 flex items-center justify-between">
                      <h2 className="text-2xl font-black text-white">Define Compensation</h2>
                      <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-2xl">close</span>
                      </button>
                    </div>

                    <div className="p-8 overflow-y-auto space-y-8">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Structure Designation</label>
                        <input
                            className="h-14 bg-slate-950 border border-slate-800 rounded-2xl text-white px-5 focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                            value={formData.name}
                            onChange={(e)=>setFormData({...formData, name: e.target.value})}
                            placeholder="e.g. Senior Backend Engineer (Tier 1)"
                        />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">payments</span> Fixed Earning Components (Cents)
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          {formData.earning_components.map((comp, idx) => (
                              <div key={idx} className="flex gap-3 bg-slate-950 p-3 rounded-2xl border border-white/5">
                                <input className="flex-1 h-12 bg-transparent text-slate-400 font-bold px-2 outline-none" value={comp.name} readOnly />
                                <input
                                    className="w-40 h-12 bg-slate-900 border border-slate-800 rounded-xl text-white px-4 text-right font-mono focus:border-primary outline-none"
                                    type="number"
                                    value={comp.amount}
                                    onChange={(e) => {
                                      const newComps = [...formData.earning_components];
                                      newComps[idx].amount = parseInt(e.target.value) || 0;
                                      setFormData({...formData, earning_components: newComps});
                                    }}
                                />
                              </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">security</span> Statutory Deduction Mapping
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {availableRules.map(rule => (
                              <label key={rule.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${formData.deduction_rule_ids.includes(rule.id) ? 'bg-primary/10 border-primary/40' : 'bg-slate-950 border-white/5 hover:border-white/10'}`}>
                                <input
                                    type="checkbox"
                                    checked={formData.deduction_rule_ids.includes(rule.id)}
                                    onChange={(e) => {
                                      const ids = e.target.checked ? [...formData.deduction_rule_ids, rule.id] : formData.deduction_rule_ids.filter(i=>i!==rule.id);
                                      setFormData({...formData, deduction_rule_ids: ids});
                                    }} className="size-5 rounded border-slate-700 bg-slate-800 text-primary focus:ring-primary/40" />
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-white">{rule.name}</span>
                                  <span className="text-[10px] text-slate-500 font-black uppercase">{rule.type} Rule</span>
                                </div>
                              </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-8 border-t border-white/5 bg-slate-950/50 flex flex-col sm:flex-row justify-end gap-4">
                      <button onClick={() => setIsModalOpen(false)} className="h-14 px-8 font-bold text-slate-500 hover:text-white transition-colors">Discard</button>
                      <button
                          onClick={handleCreate}
                          disabled={loading}
                          className="h-14 px-12 bg-primary text-slate-900 rounded-2xl font-black shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        {loading ? <div className="size-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div> : 'Deploy Structure'}
                      </button>
                    </div>
                  </div>
                </div>
            )}
          </main>
        </div>
      </div>
  );
};

const CadreCard = ({ title, id, basePay, components, rules }: any) => (
    <div className="flex flex-col rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900 group transition-all hover:border-primary/40 hover:translate-y-[-4px]">
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-start">
        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest">
          ID: {id.split('-')[0]}
        </span>
          <span className="material-symbols-outlined text-slate-700 group-hover:text-primary transition-colors">account_tree</span>
        </div>

        <div>
          <h3 className="text-white text-2xl font-black tracking-tight mb-1">{title}</h3>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Global Salary Cadre</p>
        </div>

        <div className="pt-6 border-t border-white/5 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Primary Basic</p>
            <p className="text-xl font-black text-white">{basePay}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
              <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Earnings</p>
              <p className="text-sm font-bold text-white">{components} items</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
              <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Tax Rules</p>
              <p className="text-sm font-bold text-primary">{rules} linked</p>
            </div>
          </div>
        </div>

        <button className="w-full h-12 mt-4 bg-white/5 text-white rounded-xl text-xs font-black uppercase tracking-widest border border-white/5 hover:bg-white/10 transition-all">
          View Configuration
        </button>
      </div>
    </div>
);

export default CadreManagement;