import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/safetyService';
import { UnsafeCategory } from '../types';
import { LeafletMap } from '../components/common/LeafletMap';
import {
  AlertTriangle,
  MapPin,
  Shield,
  EyeOff,
  CheckCircle2,
  Navigation,
  Info,
} from 'lucide-react';

export const ReportPlacePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [locationName, setLocationName] = useState('');
  const [category, setCategory] = useState<UnsafeCategory>('poor_lighting');
  const [description, setDescription] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 31.5204,
    lng: 74.3587,
  });
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const handleGetLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 7000 }
    );
  };

  const handleMapClick = (lat: number, lng: number) => {
    setCoords({ lat, lng });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName.trim() || !description.trim()) return;

    setIsSubmitting(true);
    await reportService.submitReport({
      user_id: user?.id,
      location_name: locationName.trim(),
      category,
      description: description.trim(),
      latitude: coords.lat,
      longitude: coords.lng,
      is_anonymous: isAnonymous,
    });
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Community Hazard Awareness</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#173B6C] tracking-tight">
            Report an Unsafe Place
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Help other women stay aware. All reports are confidential and reviewed by moderators before appearing on the public safety map.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center shadow-sm animate-in zoom-in-95 duration-150">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Report Received Securely</h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6">
              Thank you for keeping our community safe. Your report has been submitted to the moderation desk. Once approved, the hazard pin will appear anonymously on the Community Safety Map.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setLocationName('');
                  setDescription('');
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Submit Another Report
              </button>
              <button
                onClick={() => navigate('/community-map')}
                className="px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0d655e] text-white font-bold text-xs shadow"
              >
                View Community Map
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Location / Landmark Name *
                </label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Underpass near Metro Gate 3, Canal Service Road"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Hazard Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as UnsafeCategory)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white"
                >
                  <option value="poor_lighting">Poor Lighting / Broken Streetlights</option>
                  <option value="harassment_concern">Harassment Concern / Loitering</option>
                  <option value="isolated_area">Deserted / Isolated Stretch</option>
                  <option value="road_issue">Road Hazard / Obstructed Path</option>
                  <option value="other">Other Safety Concern</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue (e.g. Lights broken for 2 weeks, no guards on duty between 8 PM and 11 PM)."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
              </div>

              {/* Map Coordinate Picker */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Pin Location on Map (Click map or use GPS)
                  </label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="text-xs font-bold text-[#0F766E] hover:underline flex items-center gap-1"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{isLocating ? 'Locating...' : 'Use My GPS'}</span>
                  </button>
                </div>
                <LeafletMap
                  center={[coords.lat, coords.lng]}
                  zoom={14}
                  onLocationSelect={handleMapClick}
                  markers={[
                    {
                      id: 'selected-hazard',
                      latitude: coords.lat,
                      longitude: coords.lng,
                      title: 'Selected Hazard Spot',
                      category,
                    },
                  ]}
                  className="h-56 w-full rounded-2xl"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Selected coordinates: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                </p>
              </div>

              {/* Anonymous Toggle */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <EyeOff className="w-4 h-4 text-slate-500" />
                  <div>
                    <label htmlFor="anon" className="text-xs font-bold text-slate-800 block cursor-pointer">
                      Submit Anonymously
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Your identity and phone number will never be shown publicly.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  id="anon"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 text-[#0F766E] rounded focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-[#0F766E] hover:bg-[#0d655e] disabled:bg-slate-300 text-white font-bold text-sm shadow transition active:scale-95 flex items-center justify-center gap-2 min-h-[44px]"
              >
                {isSubmitting ? (
                  <span>Submitting to Moderation Desk...</span>
                ) : (
                  <span>Submit Safety Report</span>
                )}
              </button>
            </form>

            <div className="pt-2 flex items-start gap-2 text-xs text-slate-400">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Community-reported information helps travelers exercise caution and verify conditions locally.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
