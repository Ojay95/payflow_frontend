
import React, { useState } from 'react';
import Navigation from '../components/Navigation';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState({
    name: 'Maria Rodriguez',
    email: 'maria.r@innovate.com',
    role: 'Payroll Administrator',
    company: 'Innovate Tech Ltd'
  });

  return (
    <div className="min-h-screen bg-background-dark">
      <Navigation />
      <main className="max-w-[800px] mx-auto p-8">
        <h1 className="text-white text-3xl font-black mb-8">Account Settings</h1>
        
        <div className="space-y-8">
          <section className="bg-slate-900 border border-white/5 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-primary text-xs font-black uppercase tracking-widest mb-6">Personal Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <ProfileField label="Full Name" value={profile.name} />
              <ProfileField label="Email Address" value={profile.email} />
              <ProfileField label="Job Role" value={profile.role} />
              <ProfileField label="Organization" value={profile.company} />
            </div>
            <button className="mt-8 bg-white/5 border border-white/10 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-white/10 transition-all">
              Update Profile
            </button>
          </section>

          <section className="bg-slate-900 border border-white/5 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-red-400 text-xs font-black uppercase tracking-widest mb-6">Security & Authentication</h2>
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-white/5">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-green-400">verified_user</span>
                <div>
                  <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-500">Active via Google Authenticator</p>
                </div>
              </div>
              <button className="text-primary text-xs font-black uppercase hover:underline">Manage</button>
            </div>
            <button className="mt-6 text-red-400 text-xs font-black uppercase tracking-widest hover:underline">Sign out from all devices</button>
          </section>
        </div>
      </main>
    </div>
  );
};

const ProfileField = ({ label, value }: any) => (
  <div className="flex flex-col gap-1.5">
    <p className="text-xs font-bold text-slate-500 uppercase">{label}</p>
    <p className="text-white font-medium">{value}</p>
  </div>
);

export default ProfilePage;
