import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  contactService,
  sosService,
  liveLocationService,
  checkinService,
  tipsService,
} from '../services/safetyService';
import {
  EmergencyContact,
  SosAlert,
  LiveLocationSession,
  SafetyCheckin,
  SafetyTip,
} from '../types';
import {
  AlertCircle,
  Users,
  MapPin,
  Clock,
  BookOpen,
  Navigation,
  Shield,
  ArrowRight,
  Plus,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { formatDate } from '../lib/utils';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [activeSession, setActiveSession] = useState<LiveLocationSession | null>(null);
  const [checkins, setCheckins] = useState<SafetyCheckin[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<SosAlert[]>([]);
  const [featuredTips, setFeaturedTips] = useState<SafetyTip[]>([]);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState<boolean>(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      const uid = user?.id || 'user-demo-id';
      const [cList, session, chkList, alerts, tips] = await Promise.all([
        contactService.getContacts(uid),
        liveLocationService.getActiveSession(uid),
        checkinService.getUserCheckins(uid),
        sosService.getUserAlerts(uid),
        tipsService.getPublishedTips(),
      ]);

      setContacts(cList);
      setActiveSession(session);
      setCheckins(chkList);
      setRecentAlerts(alerts.slice(0, 3));
      setFeaturedTips(tips.slice(0, 2));
    };

    loadDashboardData();
  }, [user]);

  const handleFetchCurrentLocation = () => {
    setLocating(true);
    if (!navigator.geolocation) {
      setUserCoords({ lat: 31.5204, lng: 74.3587 });
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setUserCoords({ lat: 31.5204, lng: 74.3587 });
        setLocating(false);
      },
      { timeout: 6000 }
    );
  };

  const nextPendingCheckin = checkins.find((c) => c.status === 'pending');

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-50 text-[#0F766E] text-xs font-bold mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>Aman Safar Safety Command</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B6C] tracking-tight">
              Welcome back, {user?.full_name?.split(' ')[0] || 'Friend'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Your personal safety network is ready. All emergency shortcuts are on standby.
            </p>
          </div>

          {/* Large SOS Action Banner Button */}
          <Link
            to="/sos"
            className="px-6 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-red-600/25 flex items-center justify-center gap-3 transition-transform active:scale-95 group shrink-0 min-h-[52px]"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <span>ONE-TAP SOS EMERGENCY</span>
          </Link>
        </div>

        {/* Quick Action Grid */}
        <div>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Quick Safety Actions
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/live-location"
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-teal-500/50 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0F766E] transition-colors">
                Share Live Location
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Time-limited tracking token for journeys
              </p>
            </Link>

            <Link
              to="/contacts"
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-teal-500/50 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#173B6C]/10 text-[#173B6C] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#173B6C] transition-colors">
                Trusted Contacts ({contacts.length}/5)
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Manage emergency circle & primary guardian
              </p>
            </Link>

            <Link
              to="/checkin"
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-teal-500/50 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                Safety Check-In
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Schedule arrival timers & mark safe
              </p>
            </Link>

            <Link
              to="/safety-tips"
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-teal-500/50 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Safety Guides & Tips
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Hostel, travel, and public transit protocols
              </p>
            </Link>
          </div>
        </div>

        {/* Status Monitoring Cards (Location card, Live sharing status, Next check-in) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: GPS Sensor Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-bold uppercase tracking-wider text-[10px]">
                  GPS Location Sensor
                </span>
                <Navigation className="w-4 h-4 text-[#0F766E]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Current Position
              </h3>
              <p className="text-xs text-slate-500">
                {userCoords
                  ? `Lat: ${userCoords.lat.toFixed(5)}, Lng: ${userCoords.lng.toFixed(5)}`
                  : 'Coordinates not yet queried. Tap to verify sensor.'}
              </p>
            </div>

            <button
              onClick={handleFetchCurrentLocation}
              disabled={locating}
              className="mt-4 w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{locating ? 'Querying GPS...' : 'Check My Location'}</span>
            </button>
          </div>

          {/* Card 2: Live Location Sharing Status */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-bold uppercase tracking-wider text-[10px]">
                  Live Journey Broadcast
                </span>
                <MapPin className="w-4 h-4 text-[#0F766E]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {activeSession ? 'Session Active' : 'No Active Broadcast'}
              </h3>
              <p className="text-xs text-slate-500">
                {activeSession
                  ? `Expires: ${formatDate(activeSession.expires_at)}`
                  : 'Broadcast a time-limited route link during transit.'}
              </p>
            </div>

            <Link
              to="/live-location"
              className={`mt-4 w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 ${
                activeSession
                  ? 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <span>{activeSession ? 'View Live Broadcast' : 'Start Journey Broadcast'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Next Scheduled Check-In */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-bold uppercase tracking-wider text-[10px]">
                  Scheduled Check-In
                </span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {nextPendingCheckin ? nextPendingCheckin.title : 'No Pending Check-In'}
              </h3>
              <p className="text-xs text-slate-500">
                {nextPendingCheckin
                  ? `Expected: ${formatDate(nextPendingCheckin.expected_time)}`
                  : 'Heading out? Set a timer for safe arrival.'}
              </p>
            </div>

            <Link
              to="/checkin"
              className="mt-4 w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <span>{nextPendingCheckin ? 'Manage Check-In' : 'Schedule New Check-In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Two-Column Area: Recent Alerts & Safety Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent SOS Alerts */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Recent SOS Logs</h3>
              <Link to="/history" className="text-xs font-bold text-[#0F766E] hover:underline">
                View All History
              </Link>
            </div>

            {recentAlerts.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No past emergency alerts on record.
              </div>
            ) : (
              <div className="space-y-3">
                {recentAlerts.map((a) => (
                  <div
                    key={a.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded ${
                            a.status === 'active'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {a.status}
                        </span>
                        <span className="text-slate-500 font-medium">
                          {formatDate(a.created_at)}
                        </span>
                      </div>
                      <p className="text-slate-700 font-mono text-[11px] mt-1">
                        {a.latitude.toFixed(4)}, {a.longitude.toFixed(4)}
                      </p>
                    </div>

                    <a
                      href={a.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Safety Tips */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Featured Safety Guidance</h3>
              <Link to="/safety-tips" className="text-xs font-bold text-[#0F766E] hover:underline">
                Browse All Guides
              </Link>
            </div>

            <div className="space-y-3">
              {featuredTips.map((tip) => (
                <div
                  key={tip.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="font-bold text-[#0F766E] uppercase">{tip.category}</span>
                    <span>{tip.read_time_minutes} min read</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">{tip.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {tip.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
