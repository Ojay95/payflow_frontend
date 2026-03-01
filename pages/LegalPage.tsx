
import React from 'react';
import { Link } from 'react-router-dom';

const LegalPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-dark text-slate-300 font-display">
      <header className="p-8 border-b border-white/5 flex items-center justify-between bg-indigo-dark/30">
        <Link to="/" className="flex items-center gap-3 text-primary">
          <div className="size-8"><svg fill="currentColor" viewBox="0 0 48 48"><path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path></svg></div>
          <h2 className="text-white text-xl font-bold">PayFlow</h2>
        </Link>
        <Link to="/contact" className="text-primary text-sm font-bold hover:underline">Support</Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-black text-white mb-10">Legal & Compliance</h1>
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Privacy Policy</h2>
            <p className="leading-relaxed mb-4">
              Your privacy is critically important to us. At PayFlow, we have a few fundamental principles:
              We don’t ask you for personal information unless we truly need it. We don’t share your personal 
              information with anyone except to comply with the law, develop our products, or protect our rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Terms of Service</h2>
            <p className="leading-relaxed mb-4">
              By accessing the website at payflow.com, you are agreeing to be bound by these terms of service, 
              all applicable laws and regulations, and agree that you are responsible for compliance with any 
              applicable local laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Security Standards</h2>
            <p className="leading-relaxed mb-4">
              PayFlow uses industry-standard 256-bit encryption for all data at rest and in transit. 
              We are SOC2 Type II compliant and perform regular third-party security audits to ensure 
              your financial data remains secure.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LegalPage;
