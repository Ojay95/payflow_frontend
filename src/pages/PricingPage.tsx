
import React from 'react';
import { Link } from 'react-router-dom';

const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-dark text-white font-display">
      <header className="p-8 border-b border-white/5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-primary">
          <div className="size-8"><svg fill="currentColor" viewBox="0 0 48 48"><path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path></svg></div>
          <h2 className="text-white text-xl font-bold">PayFlow</h2>
        </Link>
        <Link to="/signup" className="bg-primary text-slate-900 px-6 py-2 rounded-xl font-bold text-sm shadow-lg">Free Trial</Link>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-black mb-6">Simple, Transparent <span className="text-primary">Pricing</span></h1>
        <p className="text-xl text-slate-400 mb-16 max-w-2xl mx-auto">No hidden fees. Scale your workforce with confidence.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard tier="Starter" price="$19" features={['Up to 5 Employees', 'Automated Disbursements', 'Basic Tax Filings', 'Email Support']} />
          <PricingCard tier="Growth" price="$89" features={['Up to 50 Employees', 'Global Compliance Guard', 'Multi-bank Integration', '24/7 Priority Support']} active />
          <PricingCard tier="Enterprise" price="Custom" features={['Unlimited Employees', 'Dedicated Account Manager', 'Custom API Access', 'On-premise Deployment']} />
        </div>
      </main>
    </div>
  );
};

const PricingCard = ({ tier, price, features, active }: any) => (
  <div className={`p-10 rounded-[2.5rem] border flex flex-col items-center gap-6 transition-all ${active ? 'bg-primary/5 border-primary shadow-2xl shadow-primary/10 scale-105' : 'bg-slate-900 border-white/5'}`}>
    <h3 className="text-xl font-black uppercase tracking-widest text-slate-500">{tier}</h3>
    <div className="flex items-end gap-1">
      <span className="text-5xl font-black">{price}</span>
      {price !== 'Custom' && <span className="text-slate-500 mb-2 font-bold">/mo</span>}
    </div>
    <ul className="w-full space-y-4 my-8">
      {features.map((f: string) => (
        <li key={f} className="flex items-center gap-3 text-sm font-medium text-slate-300">
          <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
          {f}
        </li>
      ))}
    </ul>
    <Link to="/signup" className={`w-full py-4 rounded-2xl font-black text-center transition-all ${active ? 'bg-primary text-slate-900 shadow-xl' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}>
      Choose {tier}
    </Link>
  </div>
);

export default PricingPage;
