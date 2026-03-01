
import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { api } from '../api';

const CadreManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cadres, setCadres] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    earning_components: [
      { name: 'Basic Salary', amount: 500000 },
      { name: 'Housing Allowance', amount: 150000 }
    ],
    deduction_rule_ids: [] as number[]
  });

  useEffect(() => {
    fetchCadres();
  }, []);

  const fetchCadres = async () => {
    const res = await api.cadres.getAll();
    if (res.success) setCadres(res.data || []);
  };

  const handleCreate = async () => {
    setLoading(true);
    const res = await api.cadres.create(formData);
    if (res.success) {
      setIsModalOpen(false);
      fetchCadres();
    } else {
      alert(res.error || 'Failed to create cadre.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background-dark text-slate-200 font-display">
      <Navigation />
      
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex flex-wrap justify-between items-end gap-3 mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-4xl font-black leading-tight tracking-tight">Cadre Management</h1>
            <p className="text-slate-400 text-base font-normal">Define organizational compensation structures.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center rounded-xl h-12 px-6 bg-primary text-slate-900 text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all gap-2"
          >
            <span className="material-symbols-outlined font-bold">add</span>
            New Structure
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cadres.length === 0 ? (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
              <span className="material-symbols-outlined text-4xl text-white/20 mb-4">analytics</span>
              <p className="text-slate-500 font-medium">No compensation cadres defined yet.</p>
            </div>
          ) : (
            cadres.map((c, idx) => (
              <CadreCard key={idx} title={c.name} tier={`Structure ID: ${c.id}`} range={`Base: $${(c.earning_components?.[0]?.amount/100).toLocaleString()}`} benefits={c.earning_components?.map((e:any)=>e.name) || []} img={`https://picsum.photos/seed/${c.id}/400/225`} />
            ))
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-indigo-dark w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              <div className="p-8 border-b border-white/5 bg-primary/5 flex items-center justify-between">
                <h2 className="text-2xl font-black text-white">Create Cadre</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500"><span className="material-symbols-outlined">close</span></button>
              </div>
              <div className="p-8 overflow-y-auto space-y-6">
                 <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Cadre Name</label>
                    <input className="h-12 bg-slate-900 border-white/10 rounded-xl text-white px-4" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} placeholder="Intermediate Software Engineer" />
                 </div>
                 
                 <div className="space-y-4">
                    <h3 className="text-xs font-black text-primary uppercase tracking-widest">Earning Components (Cents)</h3>
                    {formData.earning_components.map((comp, idx) => (
                      <div key={idx} className="flex gap-3">
                        <input className="flex-1 h-12 bg-slate-900 border-white/10 rounded-xl text-white px-4 text-sm" value={comp.name} readOnly />
                        <input className="w-32 h-12 bg-slate-900 border-white/10 rounded-xl text-white px-4 text-sm" type="number" value={comp.amount} onChange={(e) => {
                          const newComps = [...formData.earning_components];
                          newComps[idx].amount = parseInt(e.target.value);
                          setFormData({...formData, earning_components: newComps});
                        }} />
                      </div>
                    ))}
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-xs font-black text-primary uppercase tracking-widest">Deduction Rules</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[{id: 1, name: 'PAYE'}, {id: 2, name: 'Pension'}].map(rule => (
                        <label key={rule.id} className="flex items-center gap-3 p-3 bg-slate-900 border border-white/5 rounded-xl cursor-pointer">
                          <input type="checkbox" onChange={(e) => {
                             const ids = e.target.checked ? [...formData.deduction_rule_ids, rule.id] : formData.deduction_rule_ids.filter(i=>i!==rule.id);
                             setFormData({...formData, deduction_rule_ids: ids});
                          }} className="rounded border-white/10 bg-slate-800 text-primary" />
                          <span className="text-sm font-medium text-white">{rule.name} (Rule {rule.id})</span>
                        </label>
                      ))}
                    </div>
                 </div>
              </div>
              <div className="p-8 border-t border-white/5 flex justify-end gap-4">
                <button onClick={handleCreate} disabled={loading} className="px-10 py-3 bg-primary text-slate-900 rounded-xl font-bold flex items-center gap-2">
                  {loading && <div className="size-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>}
                  Save Cadre
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// ... CadreCard component from original CadreManagement.tsx
const CadreCard = ({ title, tier, range, benefits, color = "primary", img }: any) => {
  const badgeClasses = {
    primary: 'bg-primary/20 text-blue-400 border-primary/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  };

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-slate-900 group">
      <div className="w-full aspect-video bg-cover bg-center grayscale group-hover:grayscale-0 transition-all opacity-60 group-hover:opacity-100" style={{ backgroundImage: `url(${img})` }}></div>
      <div className="p-6">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 border ${(badgeClasses as any)[color]}`}>{tier}</span>
        <h3 className="text-white text-xl font-bold tracking-tight mb-4">{title}</h3>
        <p className="text-white text-lg font-black mb-6">{range}</p>
        <button className="w-full py-3 bg-slate-800 text-white rounded-xl text-sm font-bold border border-white/5">Details</button>
      </div>
    </div>
  );
};

export default CadreManagement;
