import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import { Employee, Cadre } from '../types';
import Toast from '../components/Toast';

const EmployeeListing: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [cadres, setCadres] = useState<Cadre[]>([]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    cadre_id: '',
    full_name: '',
    email: '',
    bank_code: '', // Production uses codes (e.g., '044') instead of names
    bank_account_number: '',
    account_name_preview: '' // Resolved via backend verification
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch real data from /v1/employees and /v1/cadres
  const fetchData = async () => {
    setLoading(true);
    const [empRes, cadreRes] = await Promise.all([
      api.employees.getAll(),
      api.cadres.getAll()
    ]);

    if (empRes.success) setEmployees(empRes.data || []);
    if (cadreRes.success) {
      setCadres(cadreRes.data || []);
      if (cadreRes.data?.length > 0) {
        setFormData(f => ({...f, cadre_id: cadreRes.data[0].id}));
      }
    }
    setLoading(false);
  };

  /**
   * Real-Time Account Verification:
   * Interfaces with /v1/employees/verify-account to ensure bank details are valid
   * before allowing submission.
   */
  useEffect(() => {
    const verifyAccount = async () => {
      if (formData.bank_account_number.length === 10 && formData.bank_code) {
        setVerifying(true);
        const res = await api.employees.verifyBank({
          account_number: formData.bank_account_number,
          bank_code: formData.bank_code
        });

        if (res.success && res.data) {
          setFormData(prev => ({ ...prev, account_name_preview: res.data.account_name }));
        } else {
          setFormData(prev => ({ ...prev, account_name_preview: 'Verification Failed' }));
        }
        setVerifying(false);
      }
    };

    const timer = setTimeout(verifyAccount, 500);
    return () => clearTimeout(timer);
  }, [formData.bank_account_number, formData.bank_code]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.account_name_preview || formData.account_name_preview === 'Verification Failed') {
      setToast({ message: "Please provide valid bank details.", type: 'error' });
      return;
    }

    setLoading(true);
    const res = await api.employees.create({
      ...formData,
      cadre_id: formData.cadre_id // Backend expects string/ID
    });

    if (res.success) {
      setIsModalOpen(false);
      setToast({ message: "Employee onboarded and verified successfully!", type: 'success' });
      fetchData();
      setFormData({ cadre_id: cadres[0]?.id || '', full_name: '', email: '', bank_code: '', bank_account_number: '', account_name_preview: '' });
    } else {
      setToast({ message: res.error || 'Failed to onboard employee.', type: 'error' });
    }
    setLoading(false);
  };

  const downloadSampleCSV = () => {
    const headers = "full_name,email,bank_code,bank_account_number,cadre_id\n";
    const sampleData = "John Doe,john@example.com,044,1234567890,cadre_uuid_here";
    const blob = new Blob([headers + sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payflow_onboarding_template.csv';
    a.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBulkLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());

      let successCount = 0;
      let errorCount = 0;

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',');
        if (row.length < 5) continue;

        const res = await api.employees.create({
          full_name: row[0].trim(),
          email: row[1].trim(),
          bank_code: row[2].trim(),
          bank_account_number: row[3].trim(),
          cadre_id: row[4].trim()
        });
        if (res.success) successCount++; else errorCount++;
      }

      setToast({
        message: `Bulk Onboarding: ${successCount} successful, ${errorCount} failed.`,
        type: successCount > 0 ? 'success' : 'error'
      });
      fetchData();
      setBulkLoading(false);
    };
    reader.readAsText(file);
  };

  return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 pb-24">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">Workforce</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Manage your team and production-ready disbursement details.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="flex flex-col items-center gap-1">
              <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={bulkLoading}
                  className="w-full sm:w-auto rounded-xl h-11 px-6 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-black shadow-sm hover:bg-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">upload_file</span>
                {bulkLoading ? 'Processing...' : 'Bulk Import'}
              </button>
              <button onClick={downloadSampleCSV} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Template</button>
              <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileUpload} />
            </div>
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto rounded-xl h-11 px-6 bg-primary text-white text-sm font-black shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              Add Employee
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-sm transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50">
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Employee</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Disbursement Channel</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Cadre Assignment</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {loading ? (
                  <tr><td colSpan={3} className="px-6 py-12 text-center"><div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
              ) : employees.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-500 font-medium">No workforce records found.</td></tr>
              ) : (
                  employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-primary/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center overflow-hidden">
                              {emp.avatar ? (
                                  <img src={emp.avatar} alt="" className="size-full object-cover" />
                              ) : (
                                  <span className="text-sm font-black text-primary uppercase">{emp.full_name?.[0]}</span>
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{emp.full_name}</span>
                              <span className="text-xs text-slate-500 truncate">{emp.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{emp.bank_name || 'Generic Bank'}</span>
                            <span className="text-[11px] text-slate-500 font-mono">{emp.bank_account_number}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                      <span className="inline-block bg-primary/5 text-primary text-[10px] font-black px-3 py-1 rounded-full border border-primary/10">
                        {cadres.find(c => c.id === emp.cadre_id)?.name || 'Standard'}
                      </span>
                        </td>
                      </tr>
                  ))
              )}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md">
              <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Secure Onboarding</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <form onSubmit={handleCreate} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormGroup label="Legal Full Name" value={formData.full_name} onChange={(e:any)=>setFormData({...formData, full_name: e.target.value})} placeholder="Jane Smith" />
                    <FormGroup label="Work Email" value={formData.email} onChange={(e:any)=>setFormData({...formData, email: e.target.value})} placeholder="jane@company.com" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Salary Cadre</label>
                    <select
                        className="h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white px-4 focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                        value={formData.cadre_id}
                        onChange={(e)=>setFormData({...formData, cadre_id: e.target.value})}
                    >
                      {cadres.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50 space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-black text-primary uppercase tracking-widest">Bank Verification</p>
                      {verifying && <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Financial Institution</label>
                        <select
                            className="h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white px-4 focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                            value={formData.bank_code}
                            onChange={(e)=>setFormData({...formData, bank_code: e.target.value})}
                            required
                        >
                          <option value="">Select Bank</option>
                          <option value="044">Access Bank</option>
                          <option value="058">GTBank</option>
                          <option value="011">First Bank</option>
                          <option value="033">United Bank for Africa</option>
                        </select>
                      </div>
                      <FormGroup label="Account Number" value={formData.bank_account_number} onChange={(e:any)=>setFormData({...formData, bank_account_number: e.target.value})} placeholder="10 Digits" maxLength={10} />
                    </div>
                    {formData.account_name_preview && (
                        <div className={`p-3 rounded-lg text-[11px] font-bold ${formData.account_name_preview === 'Verification Failed' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                          {formData.account_name_preview === 'Verification Failed' ? 'Verification Failed: Please check account/bank code.' : `Account Verified: ${formData.account_name_preview}`}
                        </div>
                    )}
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row gap-4">
                    <button type="button" onClick={()=>setIsModalOpen(false)} className="h-12 font-bold text-slate-400 hover:text-slate-900 transition-colors order-2 sm:order-1">Cancel</button>
                    <button type="submit" disabled={loading || verifying} className="h-12 flex-1 bg-primary text-white rounded-xl font-black flex justify-center items-center shadow-lg order-1 sm:order-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50">
                      {loading ? 'Submitting...' : 'Onboard Employee'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  );
};

const FormGroup = ({ label, ...props }: any) => (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <input className="h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white px-4 text-sm focus:ring-2 focus:ring-primary/40 transition-all outline-none" {...props} required />
    </div>
);

export default EmployeeListing;