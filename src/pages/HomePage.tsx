import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  AlertCircle,
  Users,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  PhoneCall,
  Lock,
  EyeOff,
  BellRing,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1F2937]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F4F1FF]/60 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Tagline kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-xs font-bold text-[#0F766E] mb-6 shadow-sm">
              <Shield className="w-3.5 h-3.5" />
              <span>Aman Safar · Your Safety, One Tap Away</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#173B6C] text-balance leading-tight">
              Feel Safer Wherever You Go
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Aman Safar helps students, working women, and travelers alert trusted contacts and share their live location in urgent situations.
            </p>

            {/* Urdu Subtitle for Cultural Comfort */}
            <p className="mt-3 text-base text-teal-800/90 font-urdu">
              امان سفر — آپ کا تحفظ، قابل اعتماد رابطوں اور فوری لوکیشن شیئرنگ کے ساتھ
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              {user ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0F766E] hover:bg-[#0d655e] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Go to My Safety Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0F766E] hover:bg-[#0d655e] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Create Safety Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              <Link
                to="/sos"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md hover:shadow-red-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <AlertCircle className="w-4 h-4" />
                <span>How SOS Works</span>
              </Link>
            </div>

            {/* Emergency Hotline Ticker */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Immediate Direct Helplines:</span>
              <a href="tel:15" className="hover:text-teal-700 font-bold">Police: 15</a>
              <span>·</span>
              <a href="tel:1043" className="hover:text-teal-700 font-bold">Women Helpline: 1043</a>
              <span>·</span>
              <a href="tel:115" className="hover:text-teal-700 font-bold">Ambulance: 115</a>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Main Feature Cards */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173B6C] tracking-tight">
            Essential Protection Features
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Engineered with privacy and speed in mind. Accessible in seconds when you need it most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              One-Tap SOS Alert
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              A 5-second countdown with instant cancellation prevents accidents, captures your GPS coordinates, and provides one-tap WhatsApp and SMS dispatch to loved ones.
            </p>
            <Link
              to="/sos"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700"
            >
              <span>Explore SOS System</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Trusted Emergency Contacts
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Save up to 5 verified family members, roommates, or colleagues. Mark a primary guardian for rapid direct telephone and WhatsApp links.
            </p>
            <Link
              to="/contacts"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:text-teal-700"
            >
              <span>Manage Contacts</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-[#173B6C]/10 text-[#173B6C] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Live Location Sharing
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Share a secure, time-limited tracking link for 15, 30, or 60 minutes. Your contacts can view your route without viewing any private profile information.
            </p>
            <Link
              to="/live-location"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173B6C] hover:text-blue-800"
            >
              <span>Start Live Sharing</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-[#F4F1FF]/50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173B6C] tracking-tight">
              How Aman Safar Works
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Three simple steps to ensure you are never alone on your journeys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-[#173B6C] text-white flex items-center justify-center font-bold text-sm mb-4">
                1
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Add Trusted Contacts
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add up to five people you trust with their phone and WhatsApp details so they are on standby whenever you travel.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold text-sm mb-4">
                2
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Allow Location Permission
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Allow your browser to access GPS coordinates only when an alert is triggered or during an active live journey session.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm mb-4">
                3
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Tap SOS in Emergency
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                In urgent situations, one tap opens a direct WhatsApp alert, generates a map pin, and dials your primary emergency guardian.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Safety Map Preview */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#173B6C] to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-teal-300 uppercase tracking-widest">
              Community Powered Awareness
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 mb-4">
              Community Safety Map & Unsafe Spot Reports
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed mb-6">
              View anonymous reports of broken streetlights, deserted routes, and harassment incidents. Verified and reviewed by administrators to help women plan safer travel paths.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/community-map"
                className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Open Community Map</span>
              </Link>
              <Link
                to="/report-place"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2"
              >
                <span>Report an Unsafe Place</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy-First Principles */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173B6C] tracking-tight">
              Privacy & Dignity By Design
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              We know personal safety requires strict confidentiality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <EyeOff className="w-6 h-6 text-[#0F766E] mb-3" />
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Zero Public Contact Exposure
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your phone numbers and trusted contacts are strictly confidential and never displayed on public safety maps or directories.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <Lock className="w-6 h-6 text-[#0F766E] mb-3" />
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Temporary Tracking Tokens
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Live location links expire automatically and carry cryptographic random tokens that expose only coordinates, not your personal account.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <Shield className="w-6 h-6 text-[#0F766E] mb-3" />
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Clear Honest Boundaries
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                No false promises of magical police drones. We alert the people who care about you most while giving you instant access to national emergency lines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173B6C] text-center mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          <details className="group bg-white p-5 rounded-2xl border border-slate-200 open:shadow-sm">
            <summary className="font-bold text-sm text-slate-900 cursor-pointer list-none flex justify-between items-center">
              <span>Does the SOS button notify police directly?</span>
              <span className="text-teal-600 transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              No. Aman Safar is a personal community alert tool designed to immediately dispatch your coordinates and distress messages to your designated trusted contacts via WhatsApp and SMS. For official police or medical response, dial 15 or 115 directly.
            </p>
          </details>

          <details className="group bg-white p-5 rounded-2xl border border-slate-200 open:shadow-sm">
            <summary className="font-bold text-sm text-slate-900 cursor-pointer list-none flex justify-between items-center">
              <span>What happens if I accidentally tap SOS?</span>
              <span className="text-teal-600 transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              Every SOS tap triggers a 5-second countdown accompanied by clear vibration and visual feedback, with a prominent "Cancel Alert" button so you can abort accidental presses safely.
            </p>
          </details>

          <details className="group bg-white p-5 rounded-2xl border border-slate-200 open:shadow-sm">
            <summary className="font-bold text-sm text-slate-900 cursor-pointer list-none flex justify-between items-center">
              <span>Can my contacts track me continuously?</span>
              <span className="text-teal-600 transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              No. You have complete control. Live location sharing only runs for the exact duration you select (15, 30, or 60 minutes) and you can stop sharing with a single tap at any moment.
            </p>
          </details>

          <details className="group bg-white p-5 rounded-2xl border border-slate-200 open:shadow-sm">
            <summary className="font-bold text-sm text-slate-900 cursor-pointer list-none flex justify-between items-center">
              <span>Are unsafe location reports anonymous?</span>
              <span className="text-teal-600 transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              Yes. When reporting an area with poor lighting or harassment issues, your name and identity are kept private. Furthermore, all reports are reviewed by moderators before appearing on the public map.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
};
