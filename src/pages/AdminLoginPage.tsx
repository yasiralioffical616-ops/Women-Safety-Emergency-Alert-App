import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login, loginAsDemoAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@amansafar.org');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.error || 'Invalid admin credentials.');
    }
  };

  const handleInstantDemoAdmin = () => {
    loginAsDemoAdmin();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#173B6C] text-teal-300 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-[#173B6C]">Admin Control Portal</h1>
          <p className="text-xs text-slate-500 mt-1">
            Safety moderation, tip curation, and community hazard review desk.
          </p>
        </div>

        {/* 1-Click Demo Admin Button */}
        <div className="mb-6 p-4 bg-[#F4F1FF] border border-purple-200/80 rounded-2xl text-center">
          <span className="text-[11px] font-bold text-[#173B6C] block mb-2 uppercase tracking-wider">
            Reviewer Demo Access
          </span>
          <button
            type="button"
            onClick={handleInstantDemoAdmin}
            className="w-full py-2.5 px-4 bg-[#173B6C] hover:bg-[#122e54] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition active:scale-95"
          >
            <ShieldCheck className="w-4 h-4 text-teal-300" />
            <span>Sign In As Demo Admin</span>
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@amansafar.org"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Admin Password</label>
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
            className="w-full py-3.5 rounded-xl bg-[#173B6C] hover:bg-[#122e54] disabled:bg-slate-300 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Enter Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
          Not an administrator?{' '}
          <Link to="/login" className="text-[#0F766E] font-bold hover:underline">
            Go to User Login
          </Link>
        </div>
      </div>
    </div>
  );
};
