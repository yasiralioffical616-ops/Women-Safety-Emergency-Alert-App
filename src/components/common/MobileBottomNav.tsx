import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, AlertCircle, LayoutDashboard, Shield } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-4 items-center h-14 max-w-md mx-auto">
        {/* Tab 1: Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            isActive('/') ? 'text-[#0F766E]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Home</span>
        </Link>

        {/* Tab 2: Community Safety Map */}
        <Link
          to="/community-map"
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            isActive('/community-map') ? 'text-[#0F766E]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Map</span>
        </Link>

        {/* Tab 3: SOS Emergency Center (Elevated Focal Point) */}
        <Link
          to="/sos"
          className="flex flex-col items-center justify-center -mt-4 group min-h-[44px] min-w-[44px]"
        >
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30 group-active:scale-95 transition-transform animate-pulse border-2 border-white">
            <AlertCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-red-600 mt-0.5">SOS</span>
        </Link>

        {/* Tab 4: Dashboard */}
        <Link
          to="/dashboard"
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            isActive('/dashboard') ? 'text-[#0F766E]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Dashboard</span>
        </Link>
      </div>
    </nav>
  );
};
