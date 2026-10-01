import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Phone, AlertTriangle, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#173B6C] text-white pt-12 pb-24 lg:pb-12 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Safety Disclaimer Banner */}
        <div className="bg-[#0F766E]/40 border border-teal-500/30 rounded-2xl p-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">
              Important Safety Notice
            </h4>
            <p className="text-xs text-teal-100/90 leading-relaxed mt-1">
              Aman Safar is a personal community support and alert platform. The SOS feature alerts your selected trusted emergency contacts and shares your location link when internet and device location permissions are active. It does not replace or guarantee immediate emergency services, police, or ambulance response.
            </p>
          </div>
        </div>

        {/* Emergency Helpline Quick-Access Bar */}
        <div className="bg-slate-900/60 rounded-2xl p-4 sm:p-5 mb-10 border border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <Phone className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
              Emergency Direct Helplines (Dial Free)
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <a
              href="tel:15"
              className="bg-white/5 hover:bg-white/10 p-2.5 rounded-xl transition border border-white/10 group"
            >
              <span className="block text-lg font-bold text-white group-hover:text-teal-300">15</span>
              <span className="text-[11px] text-slate-300">Police Emergency</span>
            </a>
            <a
              href="tel:1043"
              className="bg-white/5 hover:bg-white/10 p-2.5 rounded-xl transition border border-white/10 group"
            >
              <span className="block text-lg font-bold text-teal-300">1043</span>
              <span className="text-[11px] text-slate-300">Women Protection</span>
            </a>
            <a
              href="tel:115"
              className="bg-white/5 hover:bg-white/10 p-2.5 rounded-xl transition border border-white/10 group"
            >
              <span className="block text-lg font-bold text-white group-hover:text-teal-300">115</span>
              <span className="text-[11px] text-slate-300">Ambulance (Edhi)</span>
            </a>
            <a
              href="tel:130"
              className="bg-white/5 hover:bg-white/10 p-2.5 rounded-xl transition border border-white/10 group"
            >
              <span className="block text-lg font-bold text-white group-hover:text-teal-300">130</span>
              <span className="text-[11px] text-slate-300">Motorway Police</span>
            </a>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-700/60">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white">Aman Safar</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your Safety, One Tap Away. Designed for students, working women, travelers, and families seeking peace of mind.
            </p>
            <p className="text-xs text-teal-300/80 font-urdu pt-1">
              امان سفر — آپ کا تحفظ، ایک کلک کی دوری پر
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold text-teal-300 uppercase tracking-wider mb-3">
              Safety Tools
            </h5>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link to="/sos" className="hover:text-white transition">One-Tap SOS Emergency</Link>
              </li>
              <li>
                <Link to="/contacts" className="hover:text-white transition">Trusted Contacts Hub</Link>
              </li>
              <li>
                <Link to="/live-location" className="hover:text-white transition">Live Journey Location</Link>
              </li>
              <li>
                <Link to="/checkin" className="hover:text-white transition">Safety Check-In Schedule</Link>
              </li>
              <li>
                <Link to="/community-map" className="hover:text-white transition">Community Safety Map</Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-teal-300 uppercase tracking-wider mb-3">
              Knowledge & Community
            </h5>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link to="/safety-tips" className="hover:text-white transition">Safety Tips Library</Link>
              </li>
              <li>
                <Link to="/report-place" className="hover:text-white transition">Report Unsafe Spot</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">Contact & Feedback</Link>
              </li>
              <li>
                <Link to="/admin-login" className="hover:text-white transition text-slate-400">Admin Portal</Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-teal-300 uppercase tracking-wider mb-3">
              Legal & Privacy
            </h5>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-white transition">Safety Disclaimer & Terms</Link>
              </li>
              <li>
                <span className="text-slate-400">Zero phone leak policy</span>
              </li>
              <li>
                <span className="text-slate-400">Temporary tracking tokens</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Aman Safar Platform. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Built with care for women's peace of mind</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
