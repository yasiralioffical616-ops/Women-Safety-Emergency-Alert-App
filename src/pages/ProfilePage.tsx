import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Shield, Check, Save, LogOut } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || '');
  const [highAccuracyGps, setHighAccuracyGps] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      full_name: fullName,
      phone,
      city,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0F766E] uppercase tracking-wider mb-1">
            <User className="w-4 h-4" />
            <span>Account & Preferences</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#173B6C] tracking-tight">
            User Profile & Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your personal traveler details and sensor configuration.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Identity Header */}
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-[#173B6C] text-white flex items-center justify-center text-2xl font-black">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{user?.full_name}</h2>
                <span className="bg-teal-100 text-[#0F766E] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  {user?.role || 'user'}
                </span>
              </div>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3.5 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Profile settings successfully saved.</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Registered Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Email serves as your primary security identity.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Mobile Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 0000000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  City / Base Region
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lahore"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
              </div>
            </div>

            {/* Application Preferences */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Emergency Preferences
              </h3>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    High Accuracy GPS Mode
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Requests maximum precision from mobile satellite sensors.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={highAccuracyGps}
                  onChange={(e) => setHighAccuracyGps(e.target.checked)}
                  className="w-4 h-4 text-[#0F766E] rounded focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Emergency Countdown Audio Cue
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Emits a distinct countdown beep before SOS dispatch.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={soundAlerts}
                  onChange={(e) => setSoundAlerts(e.target.checked)}
                  className="w-4 h-4 text-[#0F766E] rounded focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Storage Mode Status
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {isSupabaseConfigured
                      ? 'Connected to Live Supabase Database with Row Level Security'
                      : 'Resilient Local Storage Fallback Mode (Full Offline Support)'}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    isSupabaseConfigured
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-teal-100 text-teal-800'
                  }`}
                >
                  {isSupabaseConfigured ? 'Supabase Live' : 'Active Local'}
                </span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between gap-4">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0d655e] text-white font-bold text-xs shadow flex items-center gap-2 transition active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>

              <button
                type="button"
                onClick={logout}
                className="px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
