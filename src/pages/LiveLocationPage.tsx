import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { liveLocationService } from '../services/safetyService';
import { LiveLocationSession } from '../types';
import {
  MapPin,
  Play,
  Square,
  Clock,
  Share2,
  Copy,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Shield,
  MessageCircle,
} from 'lucide-react';
import { LeafletMap } from '../components/common/LeafletMap';

export const LiveLocationPage: React.FC = () => {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<LiveLocationSession | null>(null);
  const [duration, setDuration] = useState<number>(30); // 15, 30, 60 minutes
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: 31.5204,
    lng: 74.3587,
  });
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  const watchIdRef = useRef<number | null>(null);

  // Check for existing active session
  useEffect(() => {
    const loadSession = async () => {
      const session = await liveLocationService.getActiveSession(user?.id || 'user-demo-id');
      if (session) {
        setActiveSession(session);
        setCurrentCoords({ lat: session.latitude, lng: session.longitude });
      }
    };
    loadSession();
  }, [user]);

  // Handle countdown timer for active session
  useEffect(() => {
    if (!activeSession) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expires = new Date(activeSession.expires_at).getTime();
      const diff = expires - now;

      if (diff <= 0) {
        clearInterval(interval);
        handleStopSharing();
        setTimeLeft('Expired');
      } else {
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${mins}m ${secs < 10 ? '0' : ''}${secs}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession]);

  // Periodic location updater when active
  useEffect(() => {
    if (activeSession && navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCurrentCoords({ lat, lng });
          liveLocationService.updateCoordinates(activeSession.id, lat, lng);
        },
        (err) => {
          console.warn('Geolocation watch error:', err);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
      );
    }

    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [activeSession]);

  const handleStartSharing = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      startWithCoords(31.5204, 74.3587);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        startWithCoords(lat, lng);
      },
      () => {
        // Fallback default coordinates
        startWithCoords(31.5204, 74.3587);
      },
      { timeout: 8000 }
    );
  };

  const startWithCoords = async (lat: number, lng: number) => {
    const session = await liveLocationService.startSession(
      user?.id || 'user-demo-id',
      lat,
      lng,
      duration,
      user?.full_name
    );
    setActiveSession(session);
    setCurrentCoords({ lat, lng });
    setIsLocating(false);
  };

  const handleStopSharing = async () => {
    if (activeSession) {
      await liveLocationService.stopSession(activeSession.id);
      setActiveSession(null);
    }
  };

  const trackingUrl = activeSession
    ? `${window.location.origin}/track/${activeSession.share_token}`
    : '';

  const handleCopyLink = () => {
    if (trackingUrl) {
      navigator.clipboard.writeText(trackingUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0F766E] uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>Time-Limited Journey Guardian</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#173B6C] tracking-tight">
            Live Location Sharing
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Share an encrypted, temporary tracking link with friends or family. They can follow your path in real time without viewing your private profile.
          </p>
        </div>

        {/* Active Session Status */}
        {activeSession ? (
          <div className="space-y-6">
            <div className="bg-teal-50 border-2 border-[#0F766E] rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center animate-pulse">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-xs font-extrabold text-teal-800 uppercase tracking-wider">
                        Live Tracking Active
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      Journey Protected ({activeSession.duration_minutes} min session)
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-white px-4 py-2 rounded-xl border border-teal-200 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Expires In
                    </span>
                    <span className="font-mono text-base font-extrabold text-teal-800">
                      {timeLeft || 'Calculating...'}
                    </span>
                  </div>

                  <button
                    onClick={handleStopSharing}
                    className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition active:scale-95"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>Stop Sharing</span>
                  </button>
                </div>
              </div>

              {/* Shareable Link Box */}
              <div className="mt-6 pt-6 border-t border-teal-200/70">
                <span className="text-xs font-bold text-teal-900 block mb-2">
                  Share Your Secure Tracking Link:
                </span>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={trackingUrl}
                    className="flex-1 bg-white px-4 py-2.5 rounded-xl border border-teal-300 text-xs font-mono text-slate-700 select-all"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyLink}
                      className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-teal-300 flex items-center justify-center gap-1.5 transition active:scale-95 shrink-0"
                    >
                      {copySuccess ? <CheckCircle2 className="w-4 h-4 text-teal-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copySuccess ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `Hi, I'm sharing my live journey location with you via Aman Safar: ${trackingUrl}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95 shrink-0"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Link</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Leaflet Map Display */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0F766E]" />
                  <span>Real-Time Map Position</span>
                </h4>
                <a
                  href={`/track/${activeSession.share_token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#0F766E] hover:underline flex items-center gap-1"
                >
                  <span>Preview Public Viewer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <LeafletMap
                center={[currentCoords.lat, currentCoords.lng]}
                zoom={15}
                markers={[
                  {
                    id: 'live-user',
                    latitude: currentCoords.lat,
                    longitude: currentCoords.lng,
                    title: 'Current Position',
                    isUserLocation: true,
                    description: 'Your real-time journey coordinate.',
                  },
                ]}
                className="h-80 w-full rounded-2xl"
              />
            </div>
          </div>
        ) : (
          /* Start New Session Form */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Start a New Live Sharing Session
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Choose how long you want the tracking link to remain active. Once expired, access is revoked automatically.
            </p>

            {/* Duration Selector */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Sharing Duration
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[15, 30, 60].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`py-3.5 px-4 rounded-2xl text-center font-bold text-xs transition border flex flex-col items-center justify-center gap-1 min-h-[56px] ${
                      duration === d
                        ? 'bg-[#173B6C] text-white border-[#173B6C] shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>{d} Minutes</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartSharing}
              disabled={isLocating}
              className="w-full py-4 rounded-2xl bg-[#0F766E] hover:bg-[#0d655e] disabled:bg-slate-300 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {isLocating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Obtaining Geolocation...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Live Journey Sharing ({duration} min)</span>
                </>
              )}
            </button>

            {/* Privacy & Permission Notice */}
            <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#0F766E] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800 mb-0.5">Privacy First Guarantee</p>
                <p>
                  The public tracking link contains a unique encrypted token that only displays your geographic coordinate and the expiration countdown. Your user email, profile name, and personal contacts are strictly withheld from viewers.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
