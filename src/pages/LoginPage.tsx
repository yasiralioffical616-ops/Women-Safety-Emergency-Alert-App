import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, AlertCircle, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemoUser, loginAsDemoAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      if (email.toLowerCase().includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(res.error || 'Invalid credentials.');
    }
  };

  const handleDemoUser = () => {
    loginAsDemoUser();
    navigate('/dashboard');
  };

  const handleDemoAdmin = () => {
    loginAsDemoAdmin();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#173B6C] text-white flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6 text-teal-300" />
          </div>
          <h1 className="text-2xl font-black text-[#173B6C]">Sign In to Aman Safar</h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your trusted contacts, live tracking, and emergency center.
          </p>
        </div>

        {/* 1-Click Instant Demo Credentials for effortless reviewer access */}
        <div className="mb-6 p-3.5 bg-[#F4F1FF] border border-purple-200/80 rounded-2xl">
          <span className="text-[11px] font-bold text-[#173B6C] block mb-2 text-center uppercase tracking-wider">
            One-Click Instant Access (Reviewer Mode)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoUser}
              className="py-2 px-3 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>Demo User</span>
            </button>
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="py-2 px-3 bg-[#173B6C] hover:bg-[#122e54] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#0F766E] hover:bg-[#0d655e] disabled:bg-slate-300 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
          Need an account?{' '}
          <Link to="/register" className="text-[#0F766E] font-bold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
