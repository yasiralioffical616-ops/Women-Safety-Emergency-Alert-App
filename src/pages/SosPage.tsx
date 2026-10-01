import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { contactService, sosService } from '../services/safetyService';
import { EmergencyContact, SosAlert } from '../types';
import {
  generateGoogleMapsUrl,
  generateWhatsAppEmergencyUrl,
  generateSmsEmergencyUrl,
  generateTelUrl,
} from '../lib/utils';
import {
  AlertCircle,
  Phone,
  MessageCircle,
  Share2,
  XCircle,
  CheckCircle2,
  Navigation,
  ExternalLink,
  ShieldAlert,
  Copy,
} from 'lucide-react';
import { LeafletMap } from '../components/common/LeafletMap';

export const SosPage: React.FC = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [primaryContact, setPrimaryContact] = useState<EmergencyContact | null>(null);

  // SOS States: 'idle' | 'countdown' | 'locating' | 'active' | 'resolved'
  const [sosState, setSosState] = useState<'idle' | 'countdown' | 'locating' | 'active' | 'resolved'>('idle');
  const [countdown, setCountdown] = useState<number>(5);
  const [activeAlert, setActiveAlert] = useState<SosAlert | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const countdownTimerRef = useRef<any>(null);

  // Load user contacts
  useEffect(() => {
    const load = async () => {
      const list = await contactService.getContacts(user?.id || 'user-demo-id');
      setContacts(list);
      const prim = list.find((c) => c.is_primary) || (list.length > 0 ? list[0] : null);
      setPrimaryContact(prim);
    };
    load();
  }, [user]);

  // Handle countdown trigger
  const handleInitiateSos = () => {
    setGeoError(null);
    setCountdown(5);
    setSosState('countdown');

    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimerRef.current);
          triggerEmergencyDispatch();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCancelCountdown = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    setSosState('idle');
  };

  // Trigger Geolocation and SOS alert creation
  const triggerEmergencyDispatch = () => {
    setSosState('locating');

    if (!navigator.geolocation) {
      // Fallback coordinate if geolocation unsupported
      createAlertWithCoordinates(31.5204, 74.3587, 'Location service unavailable on browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        createAlertWithCoordinates(lat, lng);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGeoError(
          'Location permission was denied or unavailable. Standard city landmark coordinates are being used as fallback.'
        );
        // Fallback default coordinates
        const fallbackLat = 31.5204;
        const fallbackLng = 74.3587;
        setCoords({ lat: fallbackLat, lng: fallbackLng });
        createAlertWithCoordinates(fallbackLat, fallbackLng, 'Fallback coordinates (permission restricted)');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const createAlertWithCoordinates = async (lat: number, lng: number, note?: string) => {
    const alert = await sosService.createAlert(
      user?.id || 'user-demo-id',
      lat,
      lng,
      note,
      user?.full_name,
      user?.phone
    );
    setActiveAlert(alert);
    setCoords({ lat, lng });
    setSosState('active');
  };

  const handleStopAlert = async () => {
    if (activeAlert) {
      await sosService.resolveAlert(activeAlert.id, 'resolved');
    }
    setSosState('resolved');
  };

  const handleCopyLink = () => {
    if (activeAlert) {
      navigator.clipboard.writeText(activeAlert.maps_url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  // Target contact for quick dial
  const targetContact = primaryContact || contacts[0];
  const mapsUrl = activeAlert?.maps_url || (coords ? generateGoogleMapsUrl(coords.lat, coords.lng) : '');

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold mb-3 border border-red-200">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Emergency Distress Protocol</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#173B6C] tracking-tight">
            One-Tap SOS Center
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Dispatches your exact GPS coordinates and distress message to your designated trusted contacts.
          </p>
        </div>

        {/* State: Idle / Ready to Trigger */}
        {sosState === 'idle' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm text-center">
            <div className="py-6 flex flex-col items-center">
              {/* Huge Accessible Touch Button with Pulse Ring */}
              <button
                onClick={handleInitiateSos}
                className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-2xl sm:text-3xl shadow-xl shadow-red-600/30 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all animate-sos-pulse cursor-pointer select-none"
              >
                <AlertCircle className="w-12 h-12" />
                <span>TAP FOR SOS</span>
                <span className="text-[11px] font-normal tracking-wide text-red-100">5s Safety Delay</span>
              </button>

              <p className="text-xs text-slate-500 mt-8 max-w-md">
                Tapping starts a 5-second countdown allowing you to cancel in case of accidental touches.
              </p>
            </div>

            {/* Designated Primary Contact Banner */}
            <div className="mt-6 pt-6 border-t border-slate-100 text-left bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                  Current Primary Contact
                </span>
                <p className="text-sm font-bold text-slate-800">
                  {primaryContact ? primaryContact.full_name : 'No contact saved yet'}
                </p>
                <p className="text-xs text-slate-500">
                  {primaryContact ? primaryContact.phone : 'Add emergency contacts to enable direct notification'}
                </p>
              </div>
              <a
                href="/contacts"
                className="text-xs font-bold text-[#0F766E] hover:underline"
              >
                Change
              </a>
            </div>
          </div>
        )}

        {/* State: Countdown */}
        {sosState === 'countdown' && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-red-500 shadow-xl text-center animate-in zoom-in-95 duration-150">
            <div className="w-28 h-28 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center text-5xl font-black mb-4">
              {countdown}
            </div>

            <h2 className="text-2xl font-black text-red-600 mb-2">
              Activating Emergency Alert in {countdown}s...
            </h2>
            <p className="text-xs text-slate-600 max-w-sm mx-auto mb-8">
              Capturing GPS coordinates and generating instant emergency dispatch links.
            </p>

            <button
              onClick={handleCancelCountdown}
              className="w-full sm:w-64 py-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm shadow transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto"
            >
              <XCircle className="w-5 h-5 text-red-400" />
              <span>Cancel Alert (Accidental)</span>
            </button>
          </div>
        )}

        {/* State: Locating */}
        {sosState === 'locating' && (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm text-center">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Acquiring Precise Geolocation...</h3>
            <p className="text-xs text-slate-500 mt-2">Connecting with GPS satellites and browser sensor.</p>
          </div>
        )}

        {/* State: Active Emergency Alert */}
        {sosState === 'active' && activeAlert && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Alert Status Card */}
            <div className="bg-red-50 border-2 border-red-600 rounded-3xl p-6 sm:p-8 text-slate-900 shadow-md">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-600 text-white rounded-2xl shrink-0">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider mb-2">
                    SOS Activated
                  </div>
                  <h2 className="text-xl font-black text-red-700">
                    Emergency Alert Active
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                    SOS activated. Your selected emergency contacts can be notified with your current location.
                  </p>
                </div>
              </div>

              {geoError && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                  {geoError}
                </div>
              )}

              {/* Coordinates Preview */}
              <div className="mt-5 p-3.5 bg-white rounded-xl border border-red-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <Navigation className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="font-mono text-slate-700 truncate">
                    {coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : 'Location acquired'}
                  </span>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-red-600 hover:text-red-700 flex items-center gap-1 shrink-0 ml-2"
                >
                  <span>Open in Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Quick Dispatch Buttons (WhatsApp, Phone, SMS, Share) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                Immediate Actions for Trusted Contacts
              </h3>

              {targetContact ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* WhatsApp Action */}
                  <a
                    href={generateWhatsAppEmergencyUrl(
                      targetContact.whatsapp_number,
                      mapsUrl,
                      user?.full_name
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-all active:scale-95"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Send SOS via WhatsApp ({targetContact.full_name})</span>
                  </a>

                  {/* Direct Phone Call */}
                  <a
                    href={generateTelUrl(targetContact.phone)}
                    className="p-4 rounded-2xl bg-[#173B6C] hover:bg-[#122e54] text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-all active:scale-95"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call Primary Contact ({targetContact.full_name})</span>
                  </a>

                  {/* SMS Action */}
                  <a
                    href={generateSmsEmergencyUrl(targetContact.phone, mapsUrl)}
                    className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-all active:scale-95"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Send Pre-filled SMS</span>
                  </a>

                  {/* Copy Location Link */}
                  <button
                    onClick={handleCopyLink}
                    className="p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 border border-slate-200"
                  >
                    {copySuccess ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                    <span>{copySuccess ? 'Link Copied to Clipboard!' : 'Copy Location Link'}</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 text-center">
                  You haven't configured trusted contacts yet.{' '}
                  <a href="/contacts" className="font-bold underline">
                    Add trusted contacts now
                  </a>
                </div>
              )}

              {/* Stop Alert Button */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleStopAlert}
                  className="w-full py-3.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4 text-slate-600" />
                  <span>I Am Safe — Stop & Resolve SOS Alert</span>
                </button>
              </div>
            </div>

            {/* Map Preview */}
            {coords && (
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Transmitted Location Pin
                </h4>
                <LeafletMap
                  center={[coords.lat, coords.lng]}
                  zoom={15}
                  markers={[
                    {
                      id: 'sos-active',
                      latitude: coords.lat,
                      longitude: coords.lng,
                      title: 'Distress Location',
                      isSosLocation: true,
                      description: 'Exact coordinates shared with trusted guardians.',
                    },
                  ]}
                  className="h-64 w-full rounded-2xl"
                />
              </div>
            )}
          </div>
        )}

        {/* State: Resolved */}
        {sosState === 'resolved' && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center animate-in zoom-in-95 duration-150">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              SOS Alert Marked Resolved
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto mb-6">
              Distress alert logged as safe in your history. Be sure to inform your trusted contacts that you are secure.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setSosState('idle')}
                className="px-6 py-3 bg-[#173B6C] hover:bg-[#122e54] text-white font-bold text-xs rounded-xl transition"
              >
                Return to Standby Mode
              </button>
              <a
                href="/dashboard"
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
              >
                Go to User Dashboard
              </a>
            </div>
          </div>
        )}

        {/* Mandatory Safety Rule Clarification Box */}
        <div className="mt-10 p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
          <p className="font-bold flex items-center gap-1.5 mb-1 text-amber-950">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Important Operational Transparency</span>
          </p>
          <p>
            Aman Safar does not claim SMS, WhatsApp, or location sharing will work without device support, contacts, internet connectivity, and user permission. SOS alerts are routed to your trusted personal contacts; authorities (police or ambulance) are not automatically guaranteed to respond unless you dial 15 or 115 directly.
          </p>
        </div>
      </div>
    </div>
  );
};
