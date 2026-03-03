import React, { useState, useEffect } from 'react';
import { api } from '../api.ts';
import { useStore } from '../store/useStore.ts';
import Navigation from '../components/Navigation.tsx';
import Toast from '../components/Toast.tsx';
import { UserRole } from '../types.ts';

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Deductions');
    const [toast, setToast] = useState<{message: string, type: 'success' | 'info' | 'error'} | null>(null);
    const { wallet, setWallet } = useStore();

    const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
        setToast({ message, type });
    };

    return (
        <div className="min-h-screen bg-background-dark pb-20">
            <Navigation />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <main className="flex-1 flex justify-center py-8">
                <div className="max-w-7xl w-full px-4 md:px-8 flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-white text-3xl md:text-4xl font-black tracking-tight">System Configuration</h1>
                        <p className="text-slate-400 text-sm md:text-base">Manage fiscal rules, workforce access, and production banking integrations.</p>
                    </div>

                    <div className="border-b border-slate-800 flex gap-8 overflow-x-auto scrollbar-hide">
                        {['Deductions', 'Team Management', 'Bank Integration', 'Security'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex items-center justify-center border-b-2 pb-4 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="mt-4">
                        {activeTab === 'Deductions' && <DeductionsTab onToast={showToast} />}
                        {activeTab === 'Team Management' && <TeamTab onToast={showToast} />}
                        {activeTab === 'Bank Integration' && <BankTab wallet={wallet} setWallet={setWallet} onToast={showToast} />}
                        {activeTab === 'Security' && <SecurityTab onToast={showToast} />}
                    </div>
                </div>
            </main>
        </div>
    );
};

/**
 * Deductions Tab:
 * Interfaces with /v1/deduction-rules to manage tax and pension logic
 * that the backend Payroll Engine applies globally.
 */
const DeductionsTab = ({ onToast }: any) => {
    const [rules, setRules] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', amount: 0, type: 'percentage' });

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        const res = await api.deductions.getAllRules();
        if (res.success) setRules(res.data || []);
    };

    const handleCreateRule = async () => {
        setLoading(true);
        const res = await api.deductions.createRule(formData);
        if (res.success) {
            onToast("Global deduction rule synchronized.");
            fetchRules();
            setFormData({ name: '', amount: 0, type: 'percentage' });
        } else {
            onToast(res.error || "Failed to save rule.", "error");
        }
        setLoading(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit space-y-6">
                <h3 className="text-lg font-black text-white">Create Fiscal Rule</h3>
                <div className="space-y-4">
                    <RuleInput label="Rule Identifier" value={formData.name} onChange={(e:any)=>setFormData({...formData, name: e.target.value})} placeholder="e.g. PAYE-TAX-2024" />
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Calculation Mode</label>
                        <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                            <button onClick={()=>setFormData({...formData, type: 'flat'})} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${formData.type === 'flat' ? 'bg-primary text-slate-900' : 'text-slate-500'}`}>FLAT AMOUNT</button>
                            <button onClick={()=>setFormData({...formData, type: 'percentage'})} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${formData.type === 'percentage' ? 'bg-primary text-slate-900' : 'text-slate-500'}`}>PERCENTAGE</button>
                        </div>
                    </div>
                    <RuleInput label={formData.type === 'flat' ? "Value (¢)" : "Rate (%)"} type="number" value={formData.amount} onChange={(e:any)=>setFormData({...formData, amount: parseInt(e.target.value) || 0})} placeholder="e.g. 1500" />
                </div>
                <button disabled={loading} onClick={handleCreateRule} className="w-full bg-primary text-slate-900 font-black py-4 rounded-xl shadow-lg hover:brightness-110 disabled:opacity-50 transition-all">
                    {loading ? 'Processing...' : 'Deploy Global Rule'}
                </button>
            </div>
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800"><h3 className="text-sm font-black text-white uppercase tracking-widest">Active System Rules</h3></div>
                <div className="divide-y divide-slate-800">
                    {rules.length > 0 ? rules.map((r, i) => (
                        <div key={i} className="p-6 flex justify-between items-center hover:bg-white/[0.01]">
                            <div><p className="font-bold text-white">{r.name}</p><p className="text-xs text-slate-500">System-wide enforcement</p></div>
                            <div className="text-right"><p className="text-sm font-black text-primary">{r.type === 'percentage' ? `${r.amount}%` : `$${(r.amount/100).toLocaleString()}`}</p></div>
                        </div>
                    )) : <p className="p-10 text-center text-slate-600 font-bold uppercase text-xs tracking-widest">No global rules configured</p>}
                </div>
            </div>
        </div>
    );
};

/**
 * Bank Integration:
 * The most critical production setting.
 * Connects to /v1/vfd/account to provision actual virtual accounts for the business.
 */
const BankTab = ({ wallet, setWallet, onToast }: any) => {
    const [loading, setLoading] = useState(false);

    const handleProvisionAccount = async () => {
        setLoading(true);
        onToast("Initiating VFD Secure Provisioning...", "info");

        // Call backend to generate a virtual account via VFD provider
        const res = await api.vfd.getAccountDetails();

        if (res.success && res.data) {
            setWallet(res.data); // Update store with new account_number
            onToast("VFD Virtual Account linked successfully.");
        } else {
            onToast(res.error || "Provisioning failed. Contact support.", "error");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto py-12 flex flex-col items-center text-center space-y-8">
            <div className="size-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                <span className="material-symbols-outlined text-5xl">account_balance</span>
            </div>
            <div>
                <h3 className="text-3xl font-black text-white">Disbursement Source</h3>
                <p className="text-slate-400 mt-2 font-medium max-w-lg">Provision a dedicated VFD virtual account to fund your organization's payroll runs and track disbursements in real-time.</p>
            </div>

            <div className="w-full bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
                {wallet?.account_number ? (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Active VFD Account</p>
                            <p className="text-4xl font-mono font-black text-white tracking-tighter">{wallet.account_number}</p>
                            <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">PayFlow Corporate (VFD Bank)</p>
                        </div>
                        <button className="text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">Download Funding Instructions</button>
                    </div>
                ) : (
                    <button
                        onClick={handleProvisionAccount}
                        disabled={loading}
                        className="w-full bg-primary text-slate-900 font-black py-5 rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-lg flex items-center justify-center gap-3"
                    >
                        {loading ? <div className="size-6 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div> : 'Provision VFD Account'}
                    </button>
                )}
            </div>
        </div>
    );
};

const TeamTab = ({ onToast }: any) => (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center">
            <div><h3 className="text-xl font-black text-white">Access Control</h3><p className="text-sm text-slate-500">Manage administrative roles for this business ID.</p></div>
            <button className="bg-white/5 text-white font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all">Invite Admin</button>
        </div>
        <div className="divide-y divide-slate-800">
            <UserRow name="Production Admin" email="admin@payflow.io" role={UserRole.ADMIN} />
            <UserRow name="Finance Operator" email="ops@payflow.io" role={UserRole.OPERATOR} />
        </div>
    </div>
);

const SecurityTab = ({ onToast }: any) => (
    <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex items-center justify-between">
            <div><h4 className="text-lg font-black text-white">Two-Factor Authentication</h4><p className="text-sm text-slate-500">Require TOTP for all payroll releases.</p></div>
            <div className="size-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center"><span className="material-symbols-outlined">verified_user</span></div>
        </div>
    </div>
);

const UserRow = ({ name, email, role }: any) => (
    <div className="p-6 flex items-center justify-between hover:bg-white/[0.01] transition-all">
        <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-primary text-xl">{name[0]}</div>
            <div><p className="font-bold text-white">{name}</p><p className="text-xs text-slate-500 font-medium">{email}</p></div>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${role === UserRole.ADMIN ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>{role}</span>
    </div>
);

const RuleInput = ({ label, ...props }: any) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
        <input className="h-12 bg-slate-950 border border-slate-800 rounded-xl text-white px-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all" {...props} />
    </div>
);

export default Settings;