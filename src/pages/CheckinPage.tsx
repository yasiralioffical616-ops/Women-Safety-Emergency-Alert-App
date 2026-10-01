import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { checkinService, contactService } from '../services/safetyService';
import { SafetyCheckin, EmergencyContact } from '../types';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Phone,
  MessageCircle,
  Shield,
  Calendar,
  User,
  X,
} from 'lucide-react';
import { formatDate, formatTimeOnly, generateTelUrl, generateWhatsAppEmergencyUrl } from '../lib/utils';

export const CheckinPage: React.FC = () => {
  const { user } = useAuth();
  const [checkins, setCheckins] = useState<SafetyCheckin[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Form State
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [minutesFromNow, setMinutesFromNow] = useState(30);
  const [selectedContactId, setSelectedContactId] = useState('');

  const loadData = async () => {
    const list = await checkinService.getUserCheckins(user?.id || 'user-demo-id');
    setCheckins(list);
    const conts = await contactService.getContacts(user?.id || 'user-demo-id');
    setContacts(conts);
    if (conts.length > 0) {
      const prim = conts.find((c) => c.is_primary) || conts[0];
      setSelectedContactId(prim.id);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 20000);
    return () => clearInterval(interval);
  }, [user]);

  const handleCreateCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const expectedDate = new Date(Date.now() + minutesFromNow * 60000);
    const selectedContact = contacts.find((c) => c.id === selectedContactId);

    await checkinService.createCheckin(
      user?.id || 'user-demo-id',
      title.trim(),
      expectedDate.toISOString(),
      selectedContactId,
      selectedContact?.full_name,
      note.trim() || undefined
    );

    setTitle('');
    setNote('');
    setModalOpen(false);
    await loadData();
  };

  const handleMarkSafe = async (id: string) => {
    await checkinService.markSafe(id);
    await loadData();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0F766E] uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4" />
              <span>Peace of Mind Protocol</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#173B6C] tracking-tight">
              Safety Check-In Schedule
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Set a timer for when you expect to arrive safely. Tap "I Am Safe" when you arrive.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0d655e] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition active:scale-95 shrink-0 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Scheduled Check-In</span>
          </button>
        </div>

        {/* Check-ins List */}
        {checkins.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Active Check-Ins</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
              Heading out for a late bus, cab ride, or study session? Schedule an expected arrival check-in to keep yourself and your guardians reassured.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="px-6 py-2.5 rounded-xl bg-[#0F766E] text-white font-bold text-xs shadow hover:bg-teal-700"
            >
              Set First Check-In
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {checkins.map((chk) => {
              const isPending = chk.status === 'pending';
              const isSafe = chk.status === 'safe';
              const isMissed = chk.status === 'missed';

              return (
                <div
                  key={chk.id}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all ${
                    isPending
                      ? 'border-[#0F766E] shadow-sm ring-1 ring-teal-500/20'
                      : isMissed
                      ? 'border-red-400 bg-red-50/20'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                            isPending
                              ? 'bg-amber-100 text-amber-800'
                              : isSafe
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {isPending ? 'Pending Check-In' : isSafe ? 'Marked Safe' : 'Time Missed'}
                        </span>
                        <span className="text-xs text-slate-400">
                          Expected: {formatDate(chk.expected_time)}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{chk.title}</h3>
                      {chk.note && (
                        <p className="text-xs text-slate-500 leading-relaxed italic">
                          "{chk.note}"
                        </p>
                      )}

                      {chk.contact_name && (
                        <p className="text-xs text-slate-600 flex items-center gap-1.5 pt-1">
                          <User className="w-3.5 h-3.5 text-teal-600" />
                          <span>Designated Guardian: {chk.contact_name}</span>
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isPending && (
                        <button
                          onClick={() => handleMarkSafe(chk.id)}
                          className="px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0d655e] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition active:scale-95 min-h-[44px]"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>I Am Safe</span>
                        </button>
                      )}

                      {isMissed && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleMarkSafe(chk.id)}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition"
                          >
                            Mark Safe Now
                          </button>
                          <a
                            href="/contacts"
                            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition flex items-center gap-1"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Contact Guardian</span>
                          </a>
                        </div>
                      )}

                      {isSafe && (
                        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Safe arrival recorded</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal to Create Check-In */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-150">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-[#173B6C] mb-1">
                Create Safety Check-In
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Tell us when you expect to reach your destination. If you don't mark safe, you will see a prominent reminder.
              </p>

              <form onSubmit={handleCreateCheckin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Check-In Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Reached hostel after lab study"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Expected Arrival Time (From Now) *
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[15, 30, 45, 60].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setMinutesFromNow(mins)}
                        className={`py-2 px-2 text-xs font-bold rounded-xl border transition ${
                          minutesFromNow === mins
                            ? 'bg-[#173B6C] text-white border-[#173B6C]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {mins} Mins
                      </button>
                    ))}
                  </div>
                </div>

                {contacts.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Designate Trusted Guardian to Notify
                    </label>
                    <select
                      value={selectedContactId}
                      onChange={(e) => setSelectedContactId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white"
                    >
                      {contacts.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.full_name} ({c.relationship})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Optional Note / Travel Details
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Taking White Cab LE-820 from campus gate 2"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0d655e] text-white font-bold text-xs shadow"
                  >
                    Schedule Check-In
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Operating Disclaimer */}
        <div className="mt-10 p-4 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-500 leading-relaxed">
          <p className="font-bold text-slate-700 mb-1">Safety Notice on Scheduled Check-Ins</p>
          <p>
            Aman Safar check-in timers function inside your active browser session and local state. Do not rely on background automated cellular SMS dispatch if your device loses network or battery power.
          </p>
        </div>
      </div>
    </div>
  );
};
