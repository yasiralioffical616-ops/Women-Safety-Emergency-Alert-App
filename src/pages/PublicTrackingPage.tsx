import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { liveLocationService } from '../services/safetyService';
import { LiveLocationSession } from '../types';
import { LeafletMap } from '../components/common/LeafletMap';
import { Shield, Clock, MapPin, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { formatDate, generateGoogleMapsUrl } from '../lib/utils';

export const PublicTrackingPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [session, setSession] = useState<LiveLocationSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  const fetchSession = async () => {
    if (!token) return;
    const data = await liveLocationService.getSessionByToken(token);
    setSession(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSession();
    // Auto poll every 10 seconds while open
    const interval = setInterval(() => {
      fetchSession();
    }, 10000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (!session) return;
    const updateCountdown = () => {
      const now = new Date().getTime();
      const expires = new Date(session.expires_at).getTime();
      const diff = expires - now;

      if (diff <= 0 || !session.is_active) {
        setTimeLeft('Expired');
      } else {
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${mins}m ${secs < 10 ? '0' : ''}${secs}s`);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [session]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSession();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-sm">
          <div className="w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">Verifying Tracking Token...</h3>
          <p className="text-xs text-slate-500 mt-1">Connecting to live location stream.</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Tracking Session Not Found</h2>
          <p className="text-xs text-slate-500 mb-6">
            This tracking link may have expired or is invalid. Journey links expire automatically after their scheduled duration to protect traveler privacy.
          </p>
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-[#173B6C] text-white font-bold text-xs shadow inline-block"
          >
            Visit Aman Safar
          </Link>
        </div>
      </div>
    );
  }

  const isExpired = !session.is_active || new Date(session.expires_at).getTime() < new Date().getTime();
  const mapsUrl = generateGoogleMapsUrl(session.latitude, session.longitude);

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Top Trust Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
                  isExpired ? 'bg-slate-400' : 'bg-[#0F766E]'
                }`}
              >
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isExpired ? 'bg-slate-400' : 'bg-emerald-500 animate-ping'
                    }`}
                  />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {isExpired ? 'Session Expired' : 'Active Live Journey'}
                  </span>
                </div>
                <h1 className="text-xl font-black text-[#173B6C]">
                  {session.user_name || 'Aman Safar Traveler'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Status
                </span>
                <span
                  className={`font-mono text-xs font-bold ${
                    isExpired ? 'text-red-600' : 'text-[#0F766E]'
                  }`}
                >
                  {isExpired ? 'Ended' : `Expires: ${timeLeft}`}
                </span>
              </div>

              <button
                onClick={handleRefresh}
                title="Refresh location"
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Timestamp and coordinates summary */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Started: {formatDate(session.started_at)}</span>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0F766E] font-bold hover:underline flex items-center gap-1"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Leaflet Map Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-6">
          <LeafletMap
            center={[session.latitude, session.longitude]}
            zoom={15}
            markers={[
              {
                id: 'shared-live-pin',
                latitude: session.latitude,
                longitude: session.longitude,
                title: 'Traveler Current Position',
                isUserLocation: !isExpired,
                description: `Coordinates: ${session.latitude.toFixed(5)}, ${session.longitude.toFixed(5)}`,
              },
            ]}
            className="h-96 w-full rounded-2xl"
          />
        </div>

        {/* Privacy & Safety Transparency */}
        <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200/60 text-xs text-teal-900 leading-relaxed flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#0F766E] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Secure Transient Sharing</span>
            <span>
              This tracking session is temporary. To protect the user's privacy, personal contact lists, email addresses, and journey logs are never exposed through this shared view.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
