import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportService } from '../services/safetyService';
import { UnsafePlaceReport, UnsafeCategory } from '../types';
import { LeafletMap } from '../components/common/LeafletMap';
import {
  MapPin,
  Filter,
  AlertTriangle,
  Plus,
  Shield,
  Layers,
  Info,
} from 'lucide-react';
import { formatDate } from '../lib/utils';

export const CommunityMapPage: React.FC = () => {
  const [reports, setReports] = useState<UnsafePlaceReport[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true);
      const data = await reportService.getApprovedReports();
      setReports(data);
      setIsLoading(false);
    };
    loadReports();
  }, []);

  const filteredReports = reports.filter((r) => {
    if (selectedFilter === 'all') return true;
    return r.category === selectedFilter;
  });

  const mapMarkers = filteredReports
    .filter((r) => r.latitude && r.longitude)
    .map((r) => ({
      id: r.id,
      latitude: r.latitude!,
      longitude: r.longitude!,
      title: r.location_name,
      category: r.category,
      description: r.description,
    }));

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0F766E] uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" />
              <span>Public Safety Radar</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#173B6C] tracking-tight">
              Community Safety Map
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Crowdsourced hazard pins and safety advisories approved by moderators.
            </p>
          </div>

          <Link
            to="/report-place"
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition active:scale-95 shrink-0 self-start md:self-auto min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Report Unsafe Spot</span>
          </Link>
        </div>

        {/* Mandatory Transparency Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Advisory Notice</span>
            <span>
              Community-reported information — use caution and verify locally. Aman Safar does not label any route as officially safe or guaranteed free of risk.
            </span>
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 mr-2 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter by:
          </span>
          {[
            { id: 'all', label: 'All Hazards' },
            { id: 'poor_lighting', label: 'Poor Lighting' },
            { id: 'harassment_concern', label: 'Harassment Concern' },
            { id: 'isolated_area', label: 'Deserted / Isolated' },
            { id: 'road_issue', label: 'Road Issue' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                selectedFilter === cat.id
                  ? 'bg-[#173B6C] text-white border-[#173B6C] shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Main Grid: Interactive Map & Report List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Column (2 cols on large screen) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
              <span className="font-bold text-slate-800">
                Displaying {filteredReports.length} Approved Safety Advisories
              </span>
              <span>Click any pin to inspect details</span>
            </div>

            <LeafletMap
              center={[31.5204, 74.3587]}
              zoom={13}
              markers={mapMarkers}
              className="h-[460px] w-full rounded-2xl"
            />
          </div>

          {/* List Column */}
          <div className="space-y-3 lg:max-h-[530px] lg:overflow-y-auto pr-1">
            <h3 className="text-sm font-bold text-slate-800 px-1">
              Active Community Reports
            </h3>

            {filteredReports.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
                <p className="text-xs text-slate-500">No reports matching this category.</p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        report.category === 'poor_lighting'
                          ? 'bg-amber-100 text-amber-800'
                          : report.category === 'harassment_concern'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {report.category.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatDate(report.created_at)}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mb-1">
                    {report.location_name}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {report.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{report.is_anonymous ? 'Anonymous Community Report' : 'Verified Contributor'}</span>
                    <span className="text-teal-700 font-semibold">Moderator Verified</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
