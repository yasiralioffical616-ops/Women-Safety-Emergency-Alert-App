import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  adminStatsService,
  reportService,
  tipsService,
  sosService,
  liveLocationService,
  messageService,
} from '../services/safetyService';
import {
  DashboardStats,
  UnsafePlaceReport,
  SafetyTip,
  SosAlert,
  LiveLocationSession,
  ContactMessage,
  SafetyTipCategory,
} from '../types';
import {
  ShieldAlert,
  Users,
  AlertCircle,
  MapPin,
  Clock,
  BookOpen,
  MessageSquare,
  Check,
  X,
  Trash2,
  Edit2,
  Plus,
  ExternalLink,
  Search,
  Filter,
  Eye,
} from 'lucide-react';
import { formatDate } from '../lib/utils';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'reports' | 'tips' | 'sos' | 'sessions' | 'messages' | 'overview'>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Data states
  const [reports, setReports] = useState<UnsafePlaceReport[]>([]);
  const [tips, setTips] = useState<SafetyTip[]>([]);
  const [alerts, setAlerts] = useState<SosAlert[]>([]);
  const [sessions, setSessions] = useState<LiveLocationSession[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Tip creation modal
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [editingTip, setEditingTip] = useState<SafetyTip | null>(null);
  const [tipTitle, setTipTitle] = useState('');
  const [tipUrduTitle, setTipUrduTitle] = useState('');
  const [tipContent, setTipContent] = useState('');
  const [tipUrduContent, setTipUrduContent] = useState('');
  const [tipCategory, setTipCategory] = useState<SafetyTipCategory>('Travel Safety');
  const [tipReadTime, setTipReadTime] = useState(2);

  const loadAllAdminData = async () => {
    const [s, rep, t, a, ses, m] = await Promise.all([
      adminStatsService.getStats(),
      reportService.getAllReports(),
      tipsService.getAllTips(),
      sosService.getAllAlerts(),
      liveLocationService.getAllSessions(),
      messageService.getAllMessages(),
    ]);

    setStats(s);
    setReports(rep);
    setTips(t);
    setAlerts(a);
    setSessions(ses);
    setMessages(m);
  };

  useEffect(() => {
    loadAllAdminData();
  }, [user]);

  // Handle report approval/rejection
  const handleApproveReport = async (id: string) => {
    await reportService.updateStatus(id, 'approved');
    await loadAllAdminData();
  };

  const handleRejectReport = async (id: string) => {
    await reportService.updateStatus(id, 'rejected');
    await loadAllAdminData();
  };

  const handleDeleteReport = async (id: string) => {
    if (confirm('Delete this hazard report permanently?')) {
      await reportService.deleteReport(id);
      await loadAllAdminData();
    }
  };

  // Handle safety tips
  const openAddTipModal = () => {
    setEditingTip(null);
    setTipTitle('');
    setTipUrduTitle('');
    setTipContent('');
    setTipUrduContent('');
    setTipCategory('Travel Safety');
    setTipReadTime(2);
    setTipModalOpen(true);
  };

  const openEditTipModal = (t: SafetyTip) => {
    setEditingTip(t);
    setTipTitle(t.title);
    setTipUrduTitle(t.urdu_title || '');
    setTipContent(t.content);
    setTipUrduContent(t.urdu_content || '');
    setTipCategory(t.category);
    setTipReadTime(t.read_time_minutes);
    setTipModalOpen(true);
  };

  const handleSaveTip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTip) {
      await tipsService.updateTip(editingTip.id, {
        title: tipTitle,
        urdu_title: tipUrduTitle,
        content: tipContent,
        urdu_content: tipUrduContent,
        category: tipCategory,
        read_time_minutes: tipReadTime,
      });
    } else {
      await tipsService.addTip({
        title: tipTitle,
        urdu_title: tipUrduTitle,
        content: tipContent,
        urdu_content: tipUrduContent,
        category: tipCategory,
        is_published: true,
        read_time_minutes: tipReadTime,
      });
    }
    setTipModalOpen(false);
    await loadAllAdminData();
  };

  const handleToggleTipPublished = async (t: SafetyTip) => {
    await tipsService.updateTip(t.id, { is_published: !t.is_published });
    await loadAllAdminData();
  };

  const handleDeleteTip = async (id: string) => {
    if (confirm('Delete this safety tip?')) {
      await tipsService.deleteTip(id);
      await loadAllAdminData();
    }
  };

  // Filter lists based on search
  const filteredReports = reports.filter(
    (r) =>
      r.location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTips = tips.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-50 text-[#0F766E] text-xs font-bold mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Aman Safar Administrator Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B6C] tracking-tight">
              Safety Oversight & Moderation
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Verify hazard reports, curate safety tips, and audit active journeys.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl bg-teal-100 text-teal-800 text-xs font-bold uppercase">
              Admin Authenticated
            </span>
          </div>
        </div>

        {/* Dashboard Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider">Registered</span>
              <Users className="w-4 h-4 text-slate-600" />
            </div>
            <span className="text-2xl font-black text-slate-900 font-mono">
              {stats?.totalUsers ?? 28}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Total Users</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider">Distress</span>
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-2xl font-black text-red-600 font-mono">
              {stats?.totalSosAlerts ?? alerts.length}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">SOS Incidents</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider">Active</span>
              <MapPin className="w-4 h-4 text-[#0F766E]" />
            </div>
            <span className="text-2xl font-black text-[#0F766E] font-mono">
              {stats?.activeLocationSessions ?? 0}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Live Broadcasts</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider">Review</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-2xl font-black text-amber-600 font-mono">
              {stats?.pendingUnsafeReports ?? reports.filter((r) => r.status === 'pending').length}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Pending Reports</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider">Guidance</span>
              <BookOpen className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-2xl font-black text-purple-600 font-mono">
              {stats?.approvedTips ?? tips.length}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Active Guides</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider">Inquiries</span>
              <MessageSquare className="w-4 h-4 text-teal-600" />
            </div>
            <span className="text-2xl font-black text-teal-600 font-mono">
              {messages.length}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">User Feedback</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2 scrollbar-none">
          {[
            { id: 'overview', label: 'Dashboard Overview' },
            { id: 'reports', label: `Unsafe Reports (${reports.filter((r) => r.status === 'pending').length} pending)` },
            { id: 'tips', label: `Manage Tips (${tips.length})` },
            { id: 'sos', label: `SOS Incident Logs (${alerts.length})` },
            { id: 'sessions', label: `Live Journeys (${sessions.length})` },
            { id: 'messages', label: `Feedback (${messages.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-[#173B6C] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        {(activeTab === 'reports' || activeTab === 'tips') && (
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search table records..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white"
            />
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">
                Urgent Action Queue: Pending Hazard Reports
              </h3>
              {reports.filter((r) => r.status === 'pending').length === 0 ? (
                <p className="text-xs text-slate-500 py-4">No pending hazard reports awaiting moderation. All clean!</p>
              ) : (
                <div className="space-y-3">
                  {reports
                    .filter((r) => r.status === 'pending')
                    .map((r) => (
                      <div
                        key={r.id}
                        className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-extrabold uppercase text-[10px] px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                              {r.category.replace('_', ' ')}
                            </span>
                            <span className="font-bold text-slate-900">{r.location_name}</span>
                          </div>
                          <p className="text-slate-600 line-clamp-1">{r.description}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleApproveReport(r.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve for Map</span>
                          </button>
                          <button
                            onClick={() => handleRejectReport(r.id)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center gap-1 shadow-xs"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: REPORTS MANAGEMENT */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm overflow-x-auto">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Community Unsafe Place Reports ({filteredReports.length})
            </h3>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Location Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Coordinates</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-800">{r.location_name}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-600 capitalize">
                        {r.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{r.description}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {r.latitude ? `${r.latitude.toFixed(3)}, ${r.longitude?.toFixed(3)}` : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          r.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {r.status !== 'approved' && (
                        <button
                          onClick={() => handleApproveReport(r.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px]"
                        >
                          Approve
                        </button>
                      )}
                      {r.status !== 'rejected' && (
                        <button
                          onClick={() => handleRejectReport(r.id)}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[11px]"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteReport(r.id)}
                        className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded font-bold text-[11px]"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: SAFETY TIPS MANAGEMENT */}
        {activeTab === 'tips' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Safety Guidance Library ({filteredTips.length})
              </h3>
              <button
                onClick={openAddTipModal}
                className="px-4 py-2 bg-[#0F766E] hover:bg-[#0d655e] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Create Safety Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTips.map((tip) => (
                <div
                  key={tip.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold text-[#0F766E] uppercase">
                        {tip.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          tip.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {tip.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 mb-1">{tip.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-3">{tip.content}</p>

                    {tip.urdu_title && (
                      <p className="text-xs text-slate-500 font-urdu text-right border-t border-slate-100 pt-2">
                        {tip.urdu_title}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleToggleTipPublished(tip)}
                      className="text-xs font-semibold text-slate-600 hover:underline"
                    >
                      {tip.is_published ? 'Unpublish' : 'Publish'}
                    </button>
                    <div className="space-x-2">
                      <button
                        onClick={() => openEditTipModal(tip)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTip(tip.id)}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded font-semibold text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SOS INCIDENT LOGS */}
        {activeTab === 'sos' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm overflow-x-auto">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              All SOS Distress Records ({alerts.length})
            </h3>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Coordinates</th>
                  <th className="py-3 px-4">Address / Info</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Map Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {alerts.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-800">{a.user_name || a.user_id}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {a.latitude.toFixed(4)}, {a.longitude.toFixed(4)}
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{a.location_address || 'GPS Fix'}</td>
                    <td className="py-3 px-4 text-slate-500">{formatDate(a.created_at)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          a.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <a
                        href={a.maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0F766E] font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <span>Open Maps</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: SESSIONS */}
        {activeTab === 'sessions' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm overflow-x-auto">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Live Location Tracking Sessions ({sessions.length})
            </h3>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Traveler</th>
                  <th className="py-3 px-4">Token</th>
                  <th className="py-3 px-4">Coordinates</th>
                  <th className="py-3 px-4">Started</th>
                  <th className="py-3 px-4">Expires</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Public Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-800">{s.user_name || s.user_id}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{s.share_token}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {s.latitude.toFixed(4)}, {s.longitude.toFixed(4)}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{formatDate(s.started_at)}</td>
                    <td className="py-3 px-4 text-slate-500">{formatDate(s.expires_at)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          s.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {s.is_active ? 'Active' : 'Ended'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <a
                        href={`/track/${s.share_token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0F766E] font-bold hover:underline"
                      >
                        View Stream
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 6: MESSAGES */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              User Inquiries & Community Feedback ({messages.length})
            </h3>
            {messages.length === 0 ? (
              <p className="text-xs text-slate-500 py-6">No user feedback messages received yet.</p>
            ) : (
              <div className="space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{m.name} ({m.email})</span>
                      <span className="text-slate-400">{formatDate(m.created_at)}</span>
                    </div>
                    <h4 className="text-xs font-bold text-[#173B6C]">{m.subject}</h4>
                    <p className="text-xs text-slate-600">{m.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Safety Tip Modal */}
        {tipModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-150">
              <h2 className="text-xl font-bold text-[#173B6C] mb-4">
                {editingTip ? 'Edit Safety Guide' : 'Add New Safety Guide'}
              </h2>

              <form onSubmit={handleSaveTip} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    English Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={tipTitle}
                    onChange={(e) => setTipTitle(e.target.value)}
                    placeholder="e.g. Traveling via Public Rickshaws"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Urdu Title (اردو عنوان)
                  </label>
                  <input
                    type="text"
                    value={tipUrduTitle}
                    onChange={(e) => setTipUrduTitle(e.target.value)}
                    placeholder="e.g. پبلک رکشوں میں سفر کے احتیاطی تدابیر"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E] font-urdu"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={tipCategory}
                    onChange={(e) => setTipCategory(e.target.value as SafetyTipCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white"
                  >
                    <option value="Travel Safety">Travel Safety</option>
                    <option value="University & Hostel">University & Hostel</option>
                    <option value="Public Transport">Public Transport</option>
                    <option value="Online Safety">Online Safety</option>
                    <option value="Emergency Preparedness">Emergency Preparedness</option>
                    <option value="First Response">First Response</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    English Guidance Content *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={tipContent}
                    onChange={(e) => setTipContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Urdu Guidance Content (اردو مواد)
                  </label>
                  <textarea
                    rows={3}
                    value={tipUrduContent}
                    onChange={(e) => setTipUrduContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E] font-urdu"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setTipModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0d655e] text-white font-bold text-xs shadow"
                  >
                    Save Guide
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
