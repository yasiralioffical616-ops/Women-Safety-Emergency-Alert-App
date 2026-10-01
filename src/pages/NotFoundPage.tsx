import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home, AlertCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#173B6C]/10 text-[#173B6C] flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-[#0F766E]" />
        </div>
        <span className="text-4xl font-black text-[#173B6C] block mb-2 font-mono">404</span>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-xs text-slate-500 mb-6">
          The safety resource or tracking destination you requested doesn't exist or may have been moved.
        </p>

        <div className="space-y-2">
          <Link
            to="/"
            className="w-full py-3 rounded-xl bg-[#0F766E] hover:bg-[#0d655e] text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
          >
            <Home className="w-4 h-4" />
            <span>Return to Safety Home</span>
          </Link>

          <Link
            to="/sos"
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Open SOS Emergency Center</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
