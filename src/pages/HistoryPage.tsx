import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { sosService } from '../services/safetyService';
import { SosAlert } from '../types';
import { History, AlertCircle, ExternalLink, CheckCircle2, Shield, Calendar } from 'lucide-react';
import { formatDate } from '../lib/utils';

export const HistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<SosAlert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadAlerts = async () => {
    setIsLoading(true);
    const data = await sosService.getUserAlerts(user?.id || 'user-demo-id');
    setAlerts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadAlerts();
  }, [user]);

  const handleResolve = async (id: string) => {
    await sosService.resolveAlert(id, 'resolved');
    await loadAlerts();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0F766E] uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            <span>Incident Audit Log</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#173B6C] tracking-tight">
            Emergency Alert History
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            A secure record of your past SOS alerts, transmitted coordinates, and resolution timestamps.
          </p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500">Loading emergency logs...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Clear Incident Record</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You currently have no emergency alerts recorded. In case of distress, the One-Tap SOS feature will log your coordinates here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:border-slate-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                          alert.status === 'active'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {alert.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        Logged: {formatDate(alert.created_at)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">
                        GPS Coordinates:
                      </span>
                      <span className="text-xs font-mono text-slate-600">
                        {alert.latitude.toFixed(5)}, {alert.longitude.toFixed(5)}
                      </span>
                    </div>

                    {alert.location_address && (
                      <p className="text-xs text-slate-500">{alert.location_address}</p>
                    )}

                    {alert.resolved_at && (
                      <p className="text-[11px] text-emerald-700">
                        Resolved: {formatDate(alert.resolved_at)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={alert.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Map Location</span>
                    </a>

                    {alert.status === 'active' && (
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Resolved</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
