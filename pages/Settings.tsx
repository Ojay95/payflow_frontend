
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Toast from '../components/Toast';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Deductions');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
  };

  return (
    <div className="min-h-screen bg-background-dark">
      <Navigation />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <main className="flex-1 flex justify-center py-8">
        <div className="max-w-[1200px] w-full px-6 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-3xl font-black leading-tight tracking-tight">System Settings</h1>
            <p className="text-slate-400 text-base font-normal">Manage global rules, automation schedules, and user access.</p>
          </div>

          <div className="border-b border-slate-800 flex gap-8 overflow-x-auto">
            {['Deductions', 'Schedule', 'Team Management', 'Bank Integration'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center justify-center border-b-2 pb-3 font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'Deductions' && <DeductionsTab onSave={() => showToast("Global rule registered successfully.")} />}
          {activeTab === 'Schedule' && <ScheduleTab onUpdate={() => showToast("Payroll schedule policy updated.")} />}
          {activeTab === 'Team Management' && <TeamTab onInvite={() => showToast("Team invitations sent.")} />}
          {activeTab === 'Bank Integration' && <BankTab onLink={() => {
            showToast("Connecting to Plaid...", "info");
            setTimeout(() => showToast("Bank linked successfully."), 2000);
          }} />}
        </div>
      </main>
    </div>
  );
};

const DeductionsTab = ({ onSave }: any) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-1">
      <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 flex flex-col gap-5">
        <div>
          <h3 className="text-lg font-bold text-white">New Global Rule</h3>
          <p className="text-sm text-slate-400">Apply a logic to all salary cadres.</p>
        </div>
        <div className="flex flex-col gap-4">
          <RuleInput label="Rule Name" placeholder="e.g. PAYE Tax" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-white">Calculation Logic</label>
            <div className="flex gap-2 p-1 bg-slate-900 rounded-lg border border-slate-700">
              <button className="flex-1 px-4 py-2 text-xs font-bold rounded-md bg-primary text-slate-900">Flat Amount</button>
              <button className="flex-1 px-4 py-2 text-xs font-bold rounded-md text-slate-400">Percentage</button>
            </div>
          </div>
          <RuleInput label="Value" placeholder="e.g. 15%" />
        </div>
        <button onClick={onSave} className="w-full bg-primary text-slate-900 font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all">
          Register Global Rule
        </button>
      </div>
    </div>
    <div className="lg:col-span-2">
      <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-lg font-bold text-white">Active Global Rules</h3>
        </div>
        <div className="divide-y divide-white/5">
          <RuleRow name="PAYE Tax" sub="Standard income tax" calc="15.00% of Gross" />
          <RuleRow name="Pension Fund" sub="National contributory scheme" calc="8.00% of Basic" />
        </div>
      </div>
    </div>
  </div>
);

const ScheduleTab = ({ onUpdate }: any) => (
  <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-10 max-w-2xl mx-auto shadow-2xl">
    <div className="flex items-center gap-6 mb-10">
      <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
        <span className="material-symbols-outlined text-3xl">event_repeat</span>
      </div>
      <div>
        <h3 className="text-2xl font-black text-white">Automation Schedule</h3>
        <p className="text-gray-400 font-medium">Define recurring disbursement windows.</p>
      </div>
    </div>
    <div className="space-y-8">
      <div className="flex flex-col gap-3">
        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Payment Frequency</label>
        <div className="grid grid-cols-3 gap-3">
          {['Weekly', 'Bi-Weekly', 'Monthly'].map(f => (
            <button key={f} className={`py-4 rounded-xl border font-bold text-sm transition-all ${f === 'Monthly' ? 'bg-primary border-primary text-slate-900 shadow-lg shadow-primary/20' : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Disbursement Day</label>
        <select className="h-14 bg-slate-800 border-white/10 rounded-xl text-white font-bold px-4 focus:ring-primary">
          <option>25th of the Month</option>
          <option>Last Friday of the Month</option>
          <option>Last Day of the Month</option>
        </select>
      </div>
      <button onClick={onUpdate} className="w-full bg-primary text-slate-900 font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all">
        Update Schedule Policy
      </button>
    </div>
  </div>
);

const TeamTab = ({ onInvite }: any) => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteFields, setInviteFields] = useState([{ email: '', role: 'Operator' }]);

  const addInviteField = () => setInviteFields([...inviteFields, { email: '', role: 'Operator' }]);

  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-8 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Authorized Users</h3>
          <p className="text-sm text-gray-500 font-medium">Manage RBAC for your organization.</p>
        </div>
        <button 
          onClick={() => setIsInviteOpen(true)}
          className="bg-primary text-slate-900 font-bold px-6 py-2.5 rounded-xl text-sm hover:brightness-110 shadow-lg shadow-primary/20"
        >
          Invite Team Members
        </button>
      </div>
      <div className="divide-y divide-white/5">
        <UserRow name="Alex Johnson" email="alex@acme.com" role="Admin" />
        <UserRow name="Maria Rodriguez" email="maria@acme.com" role="Operator" />
        <UserRow name="Chen Wei" email="chen@acme.com" role="Approver" />
      </div>

      {isInviteOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-indigo-dark w-full max-w-xl rounded-3xl border border-white/10 shadow-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-white">Invite Team</h2>
              <button onClick={() => setIsInviteOpen(false)} className="text-slate-500 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6 pr-2">
              {inviteFields.map((field, idx) => (
                <div key={idx} className="flex gap-3">
                  <input 
                    className="flex-1 bg-slate-900 border-white/10 rounded-xl text-white px-4 h-12 text-sm focus:ring-primary outline-none" 
                    placeholder="Email Address"
                  />
                  <select className="w-32 bg-slate-900 border-white/10 rounded-xl text-white text-xs px-2 h-12 focus:ring-primary outline-none">
                    <option>Operator</option>
                    <option>Approver</option>
                    <option>Admin</option>
                  </select>
                </div>
              ))}
              <button onClick={addInviteField} className="text-primary text-xs font-bold hover:underline">+ Add another email</button>
            </div>
            <button 
              onClick={() => { setIsInviteOpen(false); onInvite(); }}
              className="w-full h-14 bg-primary text-slate-900 font-bold rounded-xl shadow-lg hover:brightness-110 transition-all"
            >
              Send Invitations
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const BankTab = ({ onLink }: any) => (
  <div className="max-w-2xl mx-auto py-12 text-center">
    <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20">
      <span className="material-symbols-outlined text-4xl">account_balance</span>
    </div>
    <h3 className="text-3xl font-black text-white mb-2">Connect Your Bank</h3>
    <p className="text-gray-400 mb-10 font-medium leading-relaxed">Securely link your business bank account for automated payroll disbursements via Plaid or Mono.</p>
    <div className="bg-indigo-dark border border-white/10 rounded-3xl p-10 flex flex-col items-center gap-8 shadow-2xl">
      <button onClick={onLink} className="w-full max-w-sm bg-primary text-slate-900 font-bold py-4 rounded-xl shadow-xl shadow-primary/30 hover:brightness-110 transition-all text-lg">
        Initiate Plaid Link
      </button>
    </div>
  </div>
);

const UserRow = ({ name, email, role }: any) => (
  <div className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-all">
    <div className="flex items-center gap-4">
      <div className="size-12 rounded-2xl bg-slate-800 border border-white/5 flex items-center justify-center font-black text-primary text-xl">{name[0]}</div>
      <div>
        <p className="text-base font-bold text-white">{name}</p>
        <p className="text-xs text-gray-500 font-medium">{email}</p>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-white/5 text-gray-400 border-white/10">{role}</span>
      <button className="text-gray-600 hover:text-white"><span className="material-symbols-outlined">settings</span></button>
    </div>
  </div>
);

const RuleInput = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</label>
    <input className="rounded-xl border-white/10 bg-slate-900 text-white text-sm focus:border-primary focus:ring-primary w-full px-4 py-3 placeholder:text-gray-700 transition-all outline-none" {...props} />
  </div>
);

const RuleRow = ({ name, sub, calc }: any) => (
  <div className="p-6 flex items-center justify-between group">
    <div>
      <p className="font-bold text-white group-hover:text-primary transition-colors">{name}</p>
      <p className="text-xs text-gray-500 font-medium">{sub}</p>
    </div>
    <div className="text-right">
      <p className="text-sm font-black text-white">{calc}</p>
      <button className="text-[10px] font-bold text-red-400 hover:underline uppercase tracking-widest mt-1">Remove</button>
    </div>
  </div>
);

export default Settings;
