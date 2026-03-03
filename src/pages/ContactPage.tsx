
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Toast from '../components/Toast.tsx';

const ContactPage: React.FC = () => {
  const [toast, setToast] = useState<{message: string, type: 'success'} | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToast({ message: "Message sent! We'll be in touch within 24 hours.", type: 'success' });
  };

  return (
    <div className="min-h-screen bg-background-dark text-white font-display">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <header className="p-8 border-b border-white/5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-primary">
          <div className="size-8"><svg fill="currentColor" viewBox="0 0 48 48"><path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path></svg></div>
          <h2 className="text-white text-xl font-bold">PayFlow</h2>
        </Link>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h1 className="text-6xl font-black mb-6">Talk to our <span className="text-primary">experts.</span></h1>
          <p className="text-xl text-slate-400 mb-12">Whether you need help with a complex disbursement or want to scale your team globally, we're here to help.</p>
          
          <div className="space-y-8">
            <ContactInfo icon="mail" title="Email Us" value="support@payflow.com" />
            <ContactInfo icon="call" title="Call Us" value="+1 (555) 000-0000" />
            <ContactInfo icon="location_on" title="Visit Us" value="789 Fintech Plaza, San Francisco" />
          </div>
        </div>

        <div className="bg-slate-900 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Input label="First Name" />
              <Input label="Last Name" />
            </div>
            <Input label="Work Email" type="email" />
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Message</label>
              <textarea className="bg-slate-800 border-white/10 rounded-2xl p-4 h-32 focus:ring-primary text-white outline-none" placeholder="How can we help?"></textarea>
            </div>
            <button className="w-full h-14 bg-primary text-slate-900 font-bold rounded-2xl shadow-lg hover:brightness-110 transition-all">
              Send Message
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

const Input = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</label>
    <input className="h-12 bg-slate-800 border-white/10 rounded-xl px-4 text-white focus:ring-primary outline-none" {...props} />
  </div>
);

const ContactInfo = ({ icon, title, value }: any) => (
  <div className="flex items-center gap-6">
    <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div>
      <p className="text-sm font-black text-white">{title}</p>
      <p className="text-slate-400">{value}</p>
    </div>
  </div>
);

export default ContactPage;
