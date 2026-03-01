import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import Toast from '../components/Toast';

const EmployeeListing: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [cadres, setCadres] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    cadre_id: 0,
    full_name: '',
    email: '',
    bank_name: '',
    bank_account_number: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [empRes, cadreRes] = await Promise.all([
      api.employees.getAll(),
      api.cadres.getAll()
    ]);
    if (empRes.success) setEmployees(empRes.data || []);
    if (cadreRes.success) {
      setCadres(cadreRes.data || []);
      if (cadreRes.data?.length > 0) setFormData(f => ({...f, cadre_id: cadreRes.data[0].id}));
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await api.employees.create(formData);
    if (res.success) {
      setIsModalOpen(false);
      setToast({ message: "Employee onboarded successfully!", type: 'success' });
      fetchData();
    } else {
      setToast({ message: res.error || 'Failed to onboard employee.', type: 'error' });
    }
    setLoading(false);
  };

  const downloadSampleCSV = () => {
    const headers = "full_name,email,bank_name,bank_account_number,cadre_id\n";
    const sampleData = "John Doe,john@example.com,Access Bank,1234567890,1\nJane Smith,jane@example.com,GT Bank,0987654321,2";
    const blob = new Blob([headers + sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'payflow_employee_template.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBulkLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      
      let successCount = 0;
      let errorCount = 0;

      // Skip header, process rows
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',');
        if (row.length < 5 || !row[1]) continue; // Skip empty/invalid rows

        const employeeData = {
          full_name: row[0].trim(),
          email: row[1].trim(),
          bank_name: row[2].trim(),
          bank_account_number: row[3].trim(),
          cadre_id: parseInt(row[4].trim()) || (cadres[0]?.id || 1)
        };

        const res = await api.employees.create(employeeData);
        if (res.success) successCount++;
        else errorCount++;
      }

      setToast({ 
        message: `Processed ${successCount + errorCount} rows. ${successCount} successful, ${errorCount} failed.`, 
        type: successCount > 0 ? 'success' : 'error' 
      });
      fetchData();
      setBulkLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 dark:text-white text-3xl font-black">Workforce</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">Comprehensive employee management and cadre assignment.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex flex-col items-center gap-1">
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={bulkLoading}
              className="w-full sm:w-auto rounded-xl h-11 px-6 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-black shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {bulkLoading ? (
                <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="material-symbols-outlined text-[20px]">upload_file</span>
              )}
              {bulkLoading ? 'Processing...' : 'Upload CSV'}
            </button>
            <button 
              onClick={downloadSampleCSV}
              className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
            >
              Download Template
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".csv" 
              onChange={handleFileUpload} 
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto rounded-xl h-11 px-6 bg-primary text-white text-sm font-black shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            Add Employee
          </button>
        </div>
      </div>

      {/* High-Density Table View */}
      <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-xl transition-colors">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50">
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Employee</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Bank Details</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Cadre ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {employees.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-500 font-medium">No employees found.</td></tr>
            ) : (
              employees.map((emp, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-primary/[0.02] transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center overflow-hidden">
                        {emp.avatar ? (
                          <img src={emp.avatar} alt="" className="size-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-primary">{emp.full_name?.[0] || emp.name?.[0]}</span>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{emp.full_name || emp.name}</span>
                        <span className="text-xs text-slate-500 truncate">{emp.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{emp.bank_name || 'N/A'}</span>
                      <span className="text-[10px] text-slate-500 font-mono tracking-tighter">{emp.bank_account_number || '••••••••••'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-right font-black text-slate-900 dark:text-white text-sm">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                      #{emp.cadre_id || '0'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden space-y-4">
        {employees.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-medium border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50">No employees found.</div>
        ) : (
          employees.map((emp, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-4 flex items-center justify-between shadow-sm transition-colors">
              <div className="flex items-center gap-4 min-w-0">
                <div className="size-11 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center overflow-hidden">
                   <span className="text-sm font-bold text-primary">{emp.full_name?.[0] || emp.name?.[0]}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{emp.full_name || emp.name}</span>
                  <span className="text-xs text-slate-500 truncate">{emp.email}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Cadre</p>
                <p className="text-sm font-black text-primary">#{emp.cadre_id || '0'}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh] transition-colors animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Onboard Employee</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormGroup label="Full Name" value={formData.full_name} onChange={(e:any)=>setFormData({...formData, full_name: e.target.value})} placeholder="Jane Doe" />
                <FormGroup label="Email Address" value={formData.email} onChange={(e:any)=>setFormData({...formData, email: e.target.value})} placeholder="jane@innovate.com" />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Select Cadre Structure</label>
                <select 
                  className="h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white px-4 focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all"
                  value={formData.cadre_id}
                  onChange={(e)=>setFormData({...formData, cadre_id: parseInt(e.target.value)})}
                >
                  {cadres.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50 space-y-4">
                <p className="text-xs font-black text-primary uppercase tracking-widest">Banking Credentials</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormGroup label="Bank Name" value={formData.bank_name} onChange={(e:any)=>setFormData({...formData, bank_name: e.target.value})} placeholder="Access Bank" />
                  <FormGroup label="Account Number" value={formData.bank_account_number} onChange={(e:any)=>setFormData({...formData, bank_account_number: e.target.value})} placeholder="1234567890" maxLength={10} />
                </div>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row gap-4">
                <button type="button" onClick={()=>setIsModalOpen(false)} className="h-12 font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors order-2 sm:order-1">Cancel</button>
                <button type="submit" disabled={loading} className="h-12 flex-1 bg-primary text-white rounded-xl font-black flex justify-center items-center shadow-lg order-1 sm:order-2 hover:brightness-110 active:scale-95 transition-all">
                  {loading ? <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Confirm Onboarding'}
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
    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input className="h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white px-4 text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all outline-none" {...props} required />
  </div>
);

export default EmployeeListing;