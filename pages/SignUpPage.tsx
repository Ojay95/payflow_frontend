import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '../api';
import Toast from '../components/Toast';

const signUpSchema = z.object({
  business_name: z.string().min(2, 'Business name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rc_number: z.string().min(5, 'RC Number is required'),
  incorporation_date: z.string().min(1, 'Date is required'),
  director_bvn: z.string().length(11, 'BVN must be exactly 11 digits'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const { register, handleSubmit, trigger, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur'
  });

  const onContinue = async () => {
    const isValid = await trigger(['business_name', 'email', 'password']);
    if (isValid) setStep(2);
  };

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    const res = await api.auth.register(data);

    if (res.success) {
      setToast({ message: "Registration successful! Proceeding to verification.", type: 'success' });
      setTimeout(() => navigate('/verify-email'), 1500);
    } else {
      setToast({ message: res.error || 'Registration failed.', type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background-dark flex flex-col font-display text-slate-900 dark:text-white transition-colors duration-300">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 px-6 md:px-10 py-3 bg-white/50 dark:bg-indigo-dark/50 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-4 text-primary">
          <div className="size-6"><svg fill="currentColor" viewBox="0 0 48 48"><path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path></svg></div>
          <h2 className="text-slate-900 dark:text-white text-xl font-bold">PayFlow</h2>
        </Link>
        <Link to="/login" className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg hover:brightness-110 transition-all">Login</Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[520px] bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 p-8 rounded-2xl backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 bg-primary transition-all duration-500" style={{ width: `${(step / 2) * 100}%` }}></div>
          
          <div className="text-center mb-8">
            <h1 className="text-slate-900 dark:text-white text-[32px] font-bold pb-2">{step === 1 ? 'Start Free Trial' : 'Compliance Setup'}</h1>
            <p className="text-slate-500 dark:text-white/60 text-sm">{step === 1 ? 'Enter your account details.' : 'Required for regulatory compliance.'}</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {step === 1 ? (
              <div className="space-y-4">
                <FormGroup label="Business Name" error={errors.business_name?.message}>
                  <input {...register('business_name')} placeholder="TechCorp Solutions" className="form-input-custom" />
                </FormGroup>
                <FormGroup label="Admin Email" error={errors.email?.message}>
                  <input {...register('email')} placeholder="admin@techcorp.com" type="email" className="form-input-custom" />
                </FormGroup>
                <FormGroup label="Password" error={errors.password?.message}>
                  <input {...register('password')} placeholder="••••••••" type="password" className="form-input-custom" />
                </FormGroup>
                <button type="button" onClick={onContinue} className="btn-primary-form">Continue</button>
              </div>
            ) : (
              <div className="space-y-4">
                <FormGroup label="RC Number" error={errors.rc_number?.message}>
                  <input {...register('rc_number')} placeholder="RC1234567" className="form-input-custom" />
                </FormGroup>
                <FormGroup label="Date of Incorporation" error={errors.incorporation_date?.message}>
                  <input {...register('incorporation_date')} type="date" className="form-input-custom" />
                </FormGroup>
                <FormGroup label="Director BVN" error={errors.director_bvn?.message}>
                  <input {...register('director_bvn')} placeholder="11-digit BVN" maxLength={11} className="form-input-custom" />
                </FormGroup>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 h-14 font-bold text-slate-500">Back</button>
                  <button type="submit" disabled={loading} className="btn-primary-form flex-1">
                    {loading ? <div className="size-5 border-2 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin"></div> : 'Complete Registration'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>
      
      <style>{`
        .form-input-custom {
          width: 100%;
          height: 3.5rem;
          border-radius: 0.75rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #0f172a;
          padding: 0 1rem;
          outline: none;
          transition: all 0.2s;
        }
        .dark .form-input-custom {
          background: rgba(15, 23, 42, 0.5);
          border-color: rgba(255, 255, 255, 0.1);
          color: white;
        }
        .form-input-custom:focus {
          border-color: #2563EB;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }
        .btn-primary-form {
          width: 100%;
          height: 3.5rem;
          background: #2563EB;
          color: #ffffff;
          font-weight: 800;
          border-radius: 0.75rem;
          transition: all 0.2s;
        }
        .btn-primary-form:hover {
          filter: brightness(1.1);
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.3);
        }
      `}</style>
    </div>
  );
};

const FormGroup = ({ label, children, error }: any) => (
  <div className="flex flex-col gap-1.5">
    <p className="text-slate-500 dark:text-white text-xs font-bold uppercase tracking-widest ml-1">{label}</p>
    {children}
    {error && <span className="text-red-500 text-[10px] font-bold ml-1 uppercase">{error}</span>}
  </div>
);

export default SignUpPage;