import {
  EmergencyContact,
  SosAlert,
  LiveLocationSession,
  SafetyCheckin,
  UnsafePlaceReport,
  SafetyTip,
  ContactMessage,
  DashboardStats,
} from '../types';
import { generateGoogleMapsUrl } from '../lib/utils';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Local Storage Keys
const CONTACTS_KEY = 'aman_safar_contacts';
const SOS_KEY = 'aman_safar_sos_alerts';
const LIVE_SESSIONS_KEY = 'aman_safar_live_sessions';
const CHECKINS_KEY = 'aman_safar_checkins';
const REPORTS_KEY = 'aman_safar_unsafe_reports';
const TIPS_KEY = 'aman_safar_safety_tips';
const MESSAGES_KEY = 'aman_safar_contact_messages';

// Seed Initial Safety Tips (English & Urdu for authentic local relevance)
const INITIAL_SAFETY_TIPS: SafetyTip[] = [
  {
    id: 'tip-1',
    title: 'Share Your Live Journey with a Trusted Contact',
    urdu_title: 'سفر شروع کرتے وقت اپنا لائیو مقام کسی قابل اعتماد ساتھی کے ساتھ شیئر کریں',
    content: 'Before boarding a cab, rickshaw, or late bus, activate your live location link and text the vehicle number to your primary contact.',
    urdu_content: 'کسی بھی ٹیکسی یا رکشے میں بیٹھنے سے پہلے لائیو لوکیشن اور گاڑی کا نمبر اپنے فیملی یا قابل اعتماد رابطے کو بھیجیں۔',
    category: 'Travel Safety',
    is_published: true,
    read_time_minutes: 2,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'tip-2',
    title: 'Keep Emergency Shortcuts Ready on Your Lock Screen',
    urdu_title: 'اپنے فون کے ایمرجنسی شارٹ کٹس ہمیشہ تیار رکھیں',
    content: 'Ensure your phone has emergency SOS power button trigger enabled (pressing power 5 times) and keep Aman Safar bookmarked on your home screen.',
    urdu_content: 'اپنے فون میں ایمرجنسی پاور بٹن کا آپشن فعال رکھیں اور امان سفر کو ہوم اسکرین پر محفوظ رکھیں۔',
    category: 'Emergency Preparedness',
    is_published: true,
    read_time_minutes: 3,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'tip-3',
    title: 'Hostel & Campus Curfew Safety Protocols',
    urdu_title: 'یونیورسٹی اور ہاسٹل کے محفوظ اصول',
    content: 'Schedule a safety check-in for expected arrival time. If studying late in the library or laboratory, walk with trusted peers or security escort.',
    urdu_content: 'لیٹ اسٹڈی یا لیب کے بعد ہمیشہ ساتھیوں کے ساتھ گروپ میں نکلیں اور ہاسٹل پہنچنے کے لیے سیفٹی چیک اِن سیٹ کریں۔',
    category: 'University & Hostel',
    is_published: true,
    read_time_minutes: 2,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'tip-4',
    title: 'Public Transport & Ride Hailing Precautions',
    urdu_title: 'پبلک ٹرانسپورٹ اور رائیڈ بکنگ میں احتیاط',
    content: 'Verify the driver matches the profile photo and number plate before entering. Sit near the window or behind the driver where possible, and avoid deep sleep.',
    urdu_content: 'گاڑی میں بیٹھنے سے پہلے نمبر پلیٹ اور ڈرائیور کی شناخت ضرور چیک کریں۔ کھڑکی کے پاس بیٹھیں اور جاگتے رہیں۔',
    category: 'Public Transport',
    is_published: true,
    read_time_minutes: 3,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'tip-5',
    title: 'Digital Privacy: Guard Your Real-Time Routine',
    urdu_title: 'ڈیجیٹل پرائیویسی اور سوشل میڈیا پر احتیاط',
    content: 'Never post real-time flight details, boarding passes, daily gym routes, or live check-ins on open social accounts. Post after leaving.',
    urdu_content: 'سوشل میڈیا پر اپنے روزانہ کے راستے یا لائیو چیک اِن کبھی نہ لگائیں، ہمیشہ وہاں سے روانہ ہونے کے بعد پوسٹ کریں۔',
    category: 'Online Safety',
    is_published: true,
    read_time_minutes: 3,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'tip-6',
    title: 'Immediate First Response in Public Harassment',
    urdu_title: 'عوامی جگہ پر ہراسانی کی صورت میں فوری ردعمل',
    content: 'Attract public attention clearly with a firm voice: "Excuse me, stop doing that." Move quickly towards a well-lit store, campus booth, or crowd.',
    urdu_content: 'اگر کوئی ہراساں کرے تو اونچی اور پر اعتماد آواز میں بات کریں۔ فوری طور پر کسی روشن دکان، کیمپس بوتھ یا ہجوم کی طرف بڑھیں۔',
    category: 'First Response',
    is_published: true,
    read_time_minutes: 4,
    created_at: new Date().toISOString(),
  },
];

// Seed Initial Community Unsafe Place Reports (Realistic coordinates)
const INITIAL_UNSAFE_REPORTS: UnsafePlaceReport[] = [
  {
    id: 'rep-1',
    location_name: 'Metro Underpass near Metro Gate 3',
    category: 'poor_lighting',
    description: 'Streetlights inside and adjacent to the underpass stairs have been broken for 2 weeks. Walkers advised to use main signal crossing instead after dark.',
    latitude: 31.5204,
    longitude: 74.3587,
    is_anonymous: true,
    status: 'approved',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'rep-2',
    location_name: 'Campus Back Gate Transit Lane',
    category: 'isolated_area',
    description: 'Very quiet deserted stretch between 7:30 PM and 10 PM. No security guard present on evening shifts.',
    latitude: 31.4826,
    longitude: 74.3031,
    is_anonymous: true,
    status: 'approved',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'rep-3',
    location_name: 'Old Canal Service Road Bus Stand',
    category: 'harassment_concern',
    description: 'Groups loitering near unlit tea stall causing discomfort to evening commuters waiting for transit.',
    latitude: 31.5034,
    longitude: 74.3312,
    is_anonymous: false,
    status: 'approved',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'rep-4',
    location_name: 'Railway Crossing Pedestrian Footbridge',
    category: 'road_issue',
    description: 'Broken steps and missing handrail with no overhead illumination during night hours.',
    latitude: 31.5601,
    longitude: 74.3350,
    is_anonymous: true,
    status: 'pending',
    created_at: new Date().toISOString(),
  },
];

// Seed Sample Contacts for user
const INITIAL_CONTACTS: EmergencyContact[] = [
  {
    id: 'cont-1',
    user_id: 'user-demo-id',
    full_name: 'Ayesha Khan (Sister)',
    relationship: 'Sister',
    phone: '+92 300 1234567',
    whatsapp_number: '+923001234567',
    email: 'ayesha.khan@example.com',
    is_primary: true,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'cont-2',
    user_id: 'user-demo-id',
    full_name: 'Farah Ahmed (Mother)',
    relationship: 'Mother',
    phone: '+92 321 9876543',
    whatsapp_number: '+923219876543',
    email: 'farah.ahmed@example.com',
    is_primary: false,
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    id: 'cont-3',
    user_id: 'user-demo-id',
    full_name: 'Zainab Malik (Hostel Roommate)',
    relationship: 'Roommate',
    phone: '+92 333 4567890',
    whatsapp_number: '+923334567890',
    email: 'zainab.malik@university.edu',
    is_primary: false,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
];

// Helper to get from Local Storage with default
function getStored<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

// -------------------------------------------------------------
// Emergency Contacts Service
// -------------------------------------------------------------
export const contactService = {
  getContacts: async (userId: string): Promise<EmergencyContact[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('emergency_contacts')
          .select('*')
          .eq('user_id', userId)
          .order('is_primary', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase query failed, using local store:', err);
      }
    }
    const all = getStored<EmergencyContact[]>(CONTACTS_KEY, INITIAL_CONTACTS);
    return all.filter((c) => c.user_id === userId || userId === 'user-demo-id');
  },

  addContact: async (
    userId: string,
    contact: Omit<EmergencyContact, 'id' | 'user_id' | 'created_at'>
  ): Promise<EmergencyContact> => {
    const newContact: EmergencyContact = {
      ...contact,
      id: 'cont-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      user_id: userId,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('emergency_contacts')
          .insert([newContact])
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase insert failed, storing locally:', err);
      }
    }

    const contacts = getStored<EmergencyContact[]>(CONTACTS_KEY, INITIAL_CONTACTS);
    // If new contact is primary, unset previous primary
    let updated = contacts;
    if (newContact.is_primary) {
      updated = updated.map((c) => (c.user_id === userId ? { ...c, is_primary: false } : c));
    }
    updated.push(newContact);
    setStored(CONTACTS_KEY, updated);
    return newContact;
  },

  updateContact: async (
    contactId: string,
    updates: Partial<Omit<EmergencyContact, 'id' | 'user_id' | 'created_at'>>
  ): Promise<EmergencyContact | null> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('emergency_contacts')
          .update(updates)
          .eq('id', contactId)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase update failed:', err);
      }
    }

    const contacts = getStored<EmergencyContact[]>(CONTACTS_KEY, INITIAL_CONTACTS);
    let target = contacts.find((c) => c.id === contactId);
    if (!target) return null;

    let updated = contacts;
    if (updates.is_primary) {
      updated = updated.map((c) =>
        c.user_id === target!.user_id ? { ...c, is_primary: c.id === contactId } : c
      );
    }

    updated = updated.map((c) => {
      if (c.id === contactId) {
        target = { ...c, ...updates };
        return target;
      }
      return c;
    });

    setStored(CONTACTS_KEY, updated);
    return target;
  },

  deleteContact: async (contactId: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('emergency_contacts')
          .delete()
          .eq('id', contactId);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase delete failed:', err);
      }
    }

    const contacts = getStored<EmergencyContact[]>(CONTACTS_KEY, INITIAL_CONTACTS);
    const filtered = contacts.filter((c) => c.id !== contactId);
    setStored(CONTACTS_KEY, filtered);
    return true;
  },
};

// -------------------------------------------------------------
// SOS Alerts Service
// -------------------------------------------------------------
export const sosService = {
  createAlert: async (
    userId: string,
    latitude: number,
    longitude: number,
    address?: string,
    userName?: string,
    userPhone?: string
  ): Promise<SosAlert> => {
    const maps_url = generateGoogleMapsUrl(latitude, longitude);
    const alert: SosAlert = {
      id: 'sos-' + Date.now().toString(36),
      user_id: userId,
      user_name: userName || 'Aman Safar User',
      user_phone: userPhone || '',
      latitude,
      longitude,
      location_address: address || `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`,
      maps_url,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('sos_alerts').insert([alert]).select().single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase insert failed for SOS:', err);
      }
    }

    const alerts = getStored<SosAlert[]>(SOS_KEY, []);
    alerts.unshift(alert);
    setStored(SOS_KEY, alerts);
    return alert;
  },

  resolveAlert: async (alertId: string, status: 'resolved' | 'cancelled' = 'resolved'): Promise<boolean> => {
    const resolved_at = new Date().toISOString();
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('sos_alerts')
          .update({ status, resolved_at })
          .eq('id', alertId);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase update failed:', err);
      }
    }

    const alerts = getStored<SosAlert[]>(SOS_KEY, []);
    const updated = alerts.map((a) =>
      a.id === alertId ? { ...a, status, resolved_at } : a
    );
    setStored(SOS_KEY, updated);
    return true;
  },

  getUserAlerts: async (userId: string): Promise<SosAlert[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('sos_alerts')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase query failed:', err);
      }
    }

    const alerts = getStored<SosAlert[]>(SOS_KEY, []);
    return alerts.filter((a) => a.user_id === userId || userId === 'user-demo-id');
  },

  getAllAlerts: async (): Promise<SosAlert[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('sos_alerts')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase query failed:', err);
      }
    }
    return getStored<SosAlert[]>(SOS_KEY, []);
  },
};

// -------------------------------------------------------------
// Live Location Sessions Service
// -------------------------------------------------------------
export const liveLocationService = {
  startSession: async (
    userId: string,
    latitude: number,
    longitude: number,
    durationMinutes: number = 30,
    userName?: string
  ): Promise<LiveLocationSession> => {
    const started = new Date();
    const expires = new Date(started.getTime() + durationMinutes * 60000);
    // Generate clean URL-safe unique token
    const share_token = 'track_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);

    const session: LiveLocationSession = {
      id: 'loc-' + Date.now().toString(36),
      user_id: userId,
      user_name: userName || 'Aman Safar Traveler',
      share_token,
      latitude,
      longitude,
      started_at: started.toISOString(),
      expires_at: expires.toISOString(),
      is_active: true,
      duration_minutes: durationMinutes,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('live_location_sessions')
          .insert([session])
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase insert failed for live location:', err);
      }
    }

    const sessions = getStored<LiveLocationSession[]>(LIVE_SESSIONS_KEY, []);
    // Deactivate previous active sessions for this user
    const updated = sessions.map((s) => (s.user_id === userId ? { ...s, is_active: false } : s));
    updated.unshift(session);
    setStored(LIVE_SESSIONS_KEY, updated);
    return session;
  },

  updateCoordinates: async (sessionId: string, latitude: number, longitude: number): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('live_location_sessions')
          .update({ latitude, longitude })
          .eq('id', sessionId);
      } catch (err) {
        console.warn('Supabase location update error:', err);
      }
    }

    const sessions = getStored<LiveLocationSession[]>(LIVE_SESSIONS_KEY, []);
    const updated = sessions.map((s) => (s.id === sessionId ? { ...s, latitude, longitude } : s));
    setStored(LIVE_SESSIONS_KEY, updated);
    return true;
  },

  stopSession: async (sessionId: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('live_location_sessions')
          .update({ is_active: false })
          .eq('id', sessionId);
      } catch (err) {
        console.warn('Supabase stop location error:', err);
      }
    }

    const sessions = getStored<LiveLocationSession[]>(LIVE_SESSIONS_KEY, []);
    const updated = sessions.map((s) => (s.id === sessionId ? { ...s, is_active: false } : s));
    setStored(LIVE_SESSIONS_KEY, updated);
    return true;
  },

  getActiveSession: async (userId: string): Promise<LiveLocationSession | null> => {
    const now = new Date().toISOString();
    const sessions = getStored<LiveLocationSession[]>(LIVE_SESSIONS_KEY, []);
    const found = sessions.find(
      (s) => (s.user_id === userId || userId === 'user-demo-id') && s.is_active && s.expires_at > now
    );
    return found || null;
  },

  getSessionByToken: async (token: string): Promise<LiveLocationSession | null> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('live_location_sessions')
          .select('*')
          .eq('share_token', token)
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase token fetch error:', err);
      }
    }

    const sessions = getStored<LiveLocationSession[]>(LIVE_SESSIONS_KEY, []);
    const found = sessions.find((s) => s.share_token === token);
    return found || null;
  },

  getAllSessions: async (): Promise<LiveLocationSession[]> => {
    return getStored<LiveLocationSession[]>(LIVE_SESSIONS_KEY, []);
  },
};

// -------------------------------------------------------------
// Safety Check-ins Service
// -------------------------------------------------------------
export const checkinService = {
  createCheckin: async (
    userId: string,
    title: string,
    expectedTimeIso: string,
    contactId?: string,
    contactName?: string,
    note?: string
  ): Promise<SafetyCheckin> => {
    const checkin: SafetyCheckin = {
      id: 'chk-' + Date.now().toString(36),
      user_id: userId,
      contact_id: contactId,
      contact_name: contactName,
      title,
      note,
      expected_time: expectedTimeIso,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('safety_checkins')
          .insert([checkin])
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase checkin insert failed:', err);
      }
    }

    const checkins = getStored<SafetyCheckin[]>(CHECKINS_KEY, []);
    checkins.unshift(checkin);
    setStored(CHECKINS_KEY, checkins);
    return checkin;
  },

  markSafe: async (checkinId: string): Promise<boolean> => {
    const completed_at = new Date().toISOString();
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('safety_checkins')
          .update({ status: 'safe', completed_at })
          .eq('id', checkinId);
      } catch (err) {
        console.warn('Supabase mark safe failed:', err);
      }
    }

    const checkins = getStored<SafetyCheckin[]>(CHECKINS_KEY, []);
    const updated = checkins.map((c) =>
      c.id === checkinId ? { ...c, status: 'safe' as const, completed_at } : c
    );
    setStored(CHECKINS_KEY, updated);
    return true;
  },

  getUserCheckins: async (userId: string): Promise<SafetyCheckin[]> => {
    const checkins = getStored<SafetyCheckin[]>(CHECKINS_KEY, []);
    const now = new Date();
    // Evaluate if any pending checkin is past its expected time without being marked safe
    const updated = checkins.map((c) => {
      if (c.status === 'pending' && new Date(c.expected_time) < now) {
        return { ...c, status: 'missed' as const };
      }
      return c;
    });
    setStored(CHECKINS_KEY, updated);
    return updated.filter((c) => c.user_id === userId || userId === 'user-demo-id');
  },
};

// -------------------------------------------------------------
// Unsafe Place Reports Service
// -------------------------------------------------------------
export const reportService = {
  submitReport: async (
    report: Omit<UnsafePlaceReport, 'id' | 'status' | 'created_at'>
  ): Promise<UnsafePlaceReport> => {
    const newReport: UnsafePlaceReport = {
      ...report,
      id: 'rep-' + Date.now().toString(36),
      status: 'pending', // Requires admin review for community safety integrity
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('unsafe_place_reports')
          .insert([newReport])
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase report insert error:', err);
      }
    }

    const reports = getStored<UnsafePlaceReport[]>(REPORTS_KEY, INITIAL_UNSAFE_REPORTS);
    reports.unshift(newReport);
    setStored(REPORTS_KEY, reports);
    return newReport;
  },

  getApprovedReports: async (): Promise<UnsafePlaceReport[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('unsafe_place_reports')
          .select('*')
          .eq('status', 'approved');
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase approved reports fetch error:', err);
      }
    }
    const reports = getStored<UnsafePlaceReport[]>(REPORTS_KEY, INITIAL_UNSAFE_REPORTS);
    return reports.filter((r) => r.status === 'approved');
  },

  getAllReports: async (): Promise<UnsafePlaceReport[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('unsafe_place_reports')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase all reports fetch error:', err);
      }
    }
    return getStored<UnsafePlaceReport[]>(REPORTS_KEY, INITIAL_UNSAFE_REPORTS);
  },

  updateStatus: async (reportId: string, status: 'approved' | 'rejected'): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('unsafe_place_reports')
          .update({ status })
          .eq('id', reportId);
      } catch (err) {
        console.warn('Supabase status update error:', err);
      }
    }

    const reports = getStored<UnsafePlaceReport[]>(REPORTS_KEY, INITIAL_UNSAFE_REPORTS);
    const updated = reports.map((r) => (r.id === reportId ? { ...r, status } : r));
    setStored(REPORTS_KEY, updated);
    return true;
  },

  deleteReport: async (reportId: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('unsafe_place_reports').delete().eq('id', reportId);
      } catch (err) {
        console.warn('Supabase report delete error:', err);
      }
    }

    const reports = getStored<UnsafePlaceReport[]>(REPORTS_KEY, INITIAL_UNSAFE_REPORTS);
    setStored(
      REPORTS_KEY,
      reports.filter((r) => r.id !== reportId)
    );
    return true;
  },
};

// -------------------------------------------------------------
// Safety Tips Service
// -------------------------------------------------------------
export const tipsService = {
  getPublishedTips: async (category?: string, search?: string): Promise<SafetyTip[]> => {
    const tips = getStored<SafetyTip[]>(TIPS_KEY, INITIAL_SAFETY_TIPS);
    return tips.filter((tip) => {
      if (!tip.is_published) return false;
      if (category && category !== 'All' && tip.category !== category) return false;
      if (search && search.trim()) {
        const q = search.toLowerCase();
        const matchesEn = tip.title.toLowerCase().includes(q) || tip.content.toLowerCase().includes(q);
        const matchesUr =
          (tip.urdu_title && tip.urdu_title.includes(q)) ||
          (tip.urdu_content && tip.urdu_content.includes(q));
        return matchesEn || matchesUr;
      }
      return true;
    });
  },

  getAllTips: async (): Promise<SafetyTip[]> => {
    return getStored<SafetyTip[]>(TIPS_KEY, INITIAL_SAFETY_TIPS);
  },

  addTip: async (tip: Omit<SafetyTip, 'id' | 'created_at'>): Promise<SafetyTip> => {
    const newTip: SafetyTip = {
      ...tip,
      id: 'tip-' + Date.now().toString(36),
      created_at: new Date().toISOString(),
    };
    const tips = getStored<SafetyTip[]>(TIPS_KEY, INITIAL_SAFETY_TIPS);
    tips.unshift(newTip);
    setStored(TIPS_KEY, tips);
    return newTip;
  },

  updateTip: async (tipId: string, updates: Partial<SafetyTip>): Promise<SafetyTip | null> => {
    const tips = getStored<SafetyTip[]>(TIPS_KEY, INITIAL_SAFETY_TIPS);
    let target: SafetyTip | null = null;
    const updated = tips.map((t) => {
      if (t.id === tipId) {
        target = { ...t, ...updates };
        return target;
      }
      return t;
    });
    setStored(TIPS_KEY, updated);
    return target;
  },

  deleteTip: async (tipId: string): Promise<boolean> => {
    const tips = getStored<SafetyTip[]>(TIPS_KEY, INITIAL_SAFETY_TIPS);
    setStored(
      TIPS_KEY,
      tips.filter((t) => t.id !== tipId)
    );
    return true;
  },
};

// -------------------------------------------------------------
// Contact Messages Service
// -------------------------------------------------------------
export const messageService = {
  submitMessage: async (name: string, email: string, subject: string, message: string): Promise<ContactMessage> => {
    const msg: ContactMessage = {
      id: 'msg-' + Date.now().toString(36),
      name,
      email,
      subject,
      message,
      status: 'new',
      created_at: new Date().toISOString(),
    };
    const messages = getStored<ContactMessage[]>(MESSAGES_KEY, []);
    messages.unshift(msg);
    setStored(MESSAGES_KEY, messages);
    return msg;
  },

  getAllMessages: async (): Promise<ContactMessage[]> => {
    return getStored<ContactMessage[]>(MESSAGES_KEY, []);
  },

  updateMessageStatus: async (id: string, status: 'new' | 'read' | 'archived'): Promise<boolean> => {
    const messages = getStored<ContactMessage[]>(MESSAGES_KEY, []);
    const updated = messages.map((m) => (m.id === id ? { ...m, status } : m));
    setStored(MESSAGES_KEY, updated);
    return true;
  },
};

// -------------------------------------------------------------
// Admin Stats Service
// -------------------------------------------------------------
export const adminStatsService = {
  getStats: async (): Promise<DashboardStats> => {
    const alerts = getStored<SosAlert[]>(SOS_KEY, []);
    const sessions = getStored<LiveLocationSession[]>(LIVE_SESSIONS_KEY, []);
    const now = new Date().toISOString();
    const activeSessions = sessions.filter((s) => s.is_active && s.expires_at > now).length;
    const reports = getStored<UnsafePlaceReport[]>(REPORTS_KEY, INITIAL_UNSAFE_REPORTS);
    const pendingReports = reports.filter((r) => r.status === 'pending').length;
    const tips = getStored<SafetyTip[]>(TIPS_KEY, INITIAL_SAFETY_TIPS);
    const approvedTips = tips.filter((t) => t.is_published).length;
    const messages = getStored<ContactMessage[]>(MESSAGES_KEY, []);
    const newMessages = messages.filter((m) => m.status === 'new').length;

    return {
      totalUsers: 28, // seeded realistic user base
      totalSosAlerts: alerts.length,
      activeLocationSessions: activeSessions,
      pendingUnsafeReports: pendingReports,
      approvedTips,
      recentMessagesCount: newMessages,
    };
  },
};
