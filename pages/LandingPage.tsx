import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Toast from '../components/Toast';
import { useStore } from '../store/useStore';

const LandingPage: React.FC = () => {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success'} | null>(null);
  const { token } = useStore();
  const isAuthenticated = !!token || !!localStorage.getItem('payflow_token');

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDemoModal(false);
    setToast({ message: "Request received! Our team will contact you shortly.", type: 'success' });
  };

  return (
    <div className="bg-slate-50 dark:bg-background-dark min-h-screen text-slate-900 dark:text-white selection:bg-primary selection:text-white scroll-smooth transition-colors duration-300">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">PayFlow</h2>
          </div>
          <nav className="hidden lg:flex items-center gap-10">
            <a href="#products" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors">Products</a>
            <a href="#features" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors">Compliance</a>
            <Link to="/pricing" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors">Pricing</Link>
            <a href="#footer" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors">Company</a>
          </nav>
          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <Link to="/dashboard" className="bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:brightness-110 transition-all shadow-lg shadow-primary/20">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-slate-600 dark:text-white hover:text-primary transition-colors">Login</Link>
                <Link to="/signup" className="bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:brightness-110 transition-all shadow-lg shadow-primary/20">
                  Try Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-24 lg:pt-32">
        {/* Hero Section */}
        <section className="relative px-6 flex flex-col items-center text-center overflow-hidden">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.15em] mb-8 border border-primary/20">
            Enterprise-Grade Payroll & Compliance
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 max-w-4xl mx-auto leading-[1.05] text-slate-900 dark:text-white">
            Modern Payroll <br/>
            <span className="text-primary">Built for Trust.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Automate tax filings, streamline direct deposits, and ensure global compliance for your growing workforce.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to={isAuthenticated ? "/dashboard" : "/signup"} className="w-full sm:w-auto bg-primary text-white text-lg font-bold px-10 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform">
              {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
            </Link>
            <button 
              onClick={() => setShowDemoModal(true)}
              className="w-full sm:w-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-lg font-bold px-10 py-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-900 dark:text-white shadow-sm"
            >
              Contact Sales
            </button>
          </div>

          {/* Social Proof Strip */}
          <div className="w-full max-w-5xl mx-auto py-12 border-t border-slate-200 dark:border-slate-800/50 flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale dark:invert-0 transition-all">
            <span className="text-xl font-black tracking-tighter text-slate-400 dark:text-slate-500">TECHCORP</span>
            <span className="text-xl font-black tracking-tighter text-slate-400 dark:text-slate-500">INNOVATE</span>
            <span className="text-xl font-black tracking-tighter text-slate-400 dark:text-slate-500">ACME GLOBAL</span>
            <span className="text-xl font-black tracking-tighter text-slate-400 dark:text-slate-500">STARK INDUSTRIES</span>
            <span className="text-xl font-black tracking-tighter text-slate-400 dark:text-slate-500">VENTURECO</span>
          </div>

          {/* Product Screenshot Container */}
          <div id="products" className="max-w-6xl w-full mx-auto p-2 md:p-4 rounded-2xl bg-slate-200/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-2xl relative overflow-hidden mb-20">
            <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/50 shadow-inner min-h-[400px]">
              {/* Mock Header */}
              <div className="h-12 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center px-4 gap-4">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                  <div className="size-3 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                  <div className="size-3 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                </div>
                <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
              </div>
              {/* Mock Body */}
              <div className="p-6 grid grid-cols-12 gap-6">
                <div className="col-span-3 space-y-4">
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4"></div>
                  <div className="h-10 bg-primary/20 rounded w-full border border-primary/20"></div>
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-2/3"></div>
                </div>
                <div className="col-span-9 space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50"></div>
                    <div className="h-24 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50"></div>
                    <div className="h-24 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50"></div>
                  </div>
                  <div className="h-64 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Compliance Trust Section */}
        <section className="py-24 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 transition-colors">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">Security & Compliance First</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Your payroll data is protected by the highest industry standards.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
                  <span className="material-symbols-outlined text-3xl">verified</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">SOC2 Type II</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Regular third-party audits ensure our internal controls and data protection systems are bulletproof.</p>
              </div>
              <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
                  <span className="material-symbols-outlined text-3xl">lock</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">256-bit Encryption</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">All data is encrypted in transit and at rest using banking-level AES-256 protocols.</p>
              </div>
              <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
                  <span className="material-symbols-outlined text-3xl">assignment_turned_in</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Automated Filing</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Guaranteed compliance with automated tax filings for local, state, and federal regulations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/10 transition-colors">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-16">All the tools to manage <span className="text-primary">Global Payroll.</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16 text-left">
              <FeatureItem icon="bolt" title="Instant Payouts" desc="Deliver funds to your employees' accounts in as little as 2 hours with our DirectPay network." />
              <FeatureItem icon="security" title="Compliance Guard" desc="Stay updated with changing labor laws. Our system alerts you to potential compliance risks." />
              <FeatureItem icon="contact_mail" title="Employee Portal" desc="Give your team self-service access to pay stubs, tax forms, and benefits information." />
              <FeatureItem icon="hub" title="Deep Integrations" desc="Connects seamlessly with QuickBooks, Xero, Slack, and 50+ other business tools." />
              <FeatureItem icon="monitoring" title="Real-time Insights" desc="Analyze labor costs, turnover rates, and budget forecasts with interactive dashboards." />
              <FeatureItem icon="verified_user" title="Auto-Tax Filing" desc="We handle all local, state, and federal tax filings automatically with 100% accuracy guarantee." />
            </div>
          </div>
        </section>

        {/* Ready to Simplify CTA */}
        <section className="py-32">
          <div className="max-w-6xl mx-auto px-6">
            <div className="relative bg-white dark:bg-slate-800/50 rounded-[2.5rem] p-12 lg:p-24 border border-slate-200 dark:border-slate-700 overflow-hidden text-center group shadow-xl transition-colors">
              <div className="relative z-10">
                <h2 className="text-5xl lg:text-7xl font-black mb-8 text-slate-900 dark:text-white">Scale with <span className="text-primary">Confidence.</span></h2>
                <p className="text-slate-600 dark:text-slate-300 text-lg lg:text-xl font-medium mb-12 max-w-2xl mx-auto">
                  Join over 10,000 businesses who trust PayFlow to handle their most critical operations.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link to={isAuthenticated ? "/dashboard" : "/signup"} className="w-full sm:w-auto bg-primary text-white text-lg font-bold px-12 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform">
                    {isAuthenticated ? "Go to Dashboard" : "Start Now"}
                  </Link>
                  <button 
                    onClick={() => setShowDemoModal(true)}
                    className="w-full sm:w-auto bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-lg font-bold px-12 py-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white shadow-sm"
                  >
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-2xl animate-fade-in">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Book a Demo</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">See how PayFlow can transform your business.</p>
            <form onSubmit={handleDemoSubmit} className="space-y-4">
              <div className="flex flex-col gap-2 text-left">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Work Email</label>
                <input required type="email" placeholder="you@company.com" className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-12 px-4 text-slate-900 dark:text-white focus:ring-primary outline-none" />
              </div>
              <div className="flex flex-col gap-2 text-left">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Company Size</label>
                <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-12 px-4 text-slate-900 dark:text-white focus:ring-primary outline-none">
                  <option>1-10 Employees</option>
                  <option>11-50 Employees</option>
                  <option>51-200 Employees</option>
                  <option>200+ Employees</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowDemoModal(false)} className="flex-1 h-12 font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="flex-1 h-12 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:brightness-110">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer id="footer" className="bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 pt-20 pb-10 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6 text-primary">
                <div className="size-6">
                  <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">PayFlow</h2>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-500 max-w-xs leading-relaxed font-medium">
                The modern standard for enterprise payroll and compliance automation. Trusted worldwide.
              </p>
            </div>
            <FooterColumn title="Product" links={['Payroll', 'Tax Filing', 'Benefits', 'Compliance']} to="/pricing" />
            <FooterColumn title="Company" links={['About Us', 'Careers', 'Press', 'Legal']} to="/legal" />
            <FooterColumn title="Resources" links={['Blog', 'Documentation', 'Help Center']} to="/legal" />
            <FooterColumn title="Social" links={['Twitter', 'LinkedIn', 'GitHub']} to="/contact" />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-10 border-t border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
            <p>© 2023 PayFlow Inc. All rights reserved.</p>
            <div className="flex gap-8">
              <Link to="/legal" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/legal" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureItem = ({ icon, title, desc }: any) => (
  <div className="flex flex-col items-start gap-4 group">
    <div className="text-primary flex items-center gap-3">
       <span className="material-symbols-outlined text-2xl font-bold group-hover:scale-110 transition-transform">{icon}</span>
       <h4 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h4>
    </div>
    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{desc}</p>
  </div>
);

const FooterColumn = ({ title, links, to }: any) => (
  <div className="flex flex-col gap-5">
    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">{title}</h5>
    <div className="flex flex-col gap-3">
      {links.map((link: string) => (
        <Link key={link} to={to || "#"} className="text-sm text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-medium">{link}</Link>
      ))}
    </div>
  </div>
);

export default LandingPage;