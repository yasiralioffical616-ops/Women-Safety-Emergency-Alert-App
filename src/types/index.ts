export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  city?: string;
  created_at: string;
  updated_at?: string;
}

export interface EmergencyContact {
  id: string;
  user_id: string;
  full_name: string;
  relationship: string;
  phone: string;
  whatsapp_number: string;
  email?: string;
  is_primary: boolean;
  created_at: string;
}

export type SosAlertStatus = 'active' | 'resolved' | 'cancelled';

export interface SosAlert {
  id: string;
  user_id: string;
  user_name?: string;
  user_phone?: string;
  latitude: number;
  longitude: number;
  location_address?: string;
  maps_url: string;
  status: SosAlertStatus;
  created_at: string;
  resolved_at?: string;
}

export interface LiveLocationSession {
  id: string;
  user_id: string;
  user_name?: string;
  share_token: string;
  latitude: number;
  longitude: number;
  started_at: string;
  expires_at: string;
  is_active: boolean;
  duration_minutes: number;
}

export type CheckinStatus = 'pending' | 'safe' | 'missed';

export interface SafetyCheckin {
  id: string;
  user_id: string;
  contact_id?: string;
  contact_name?: string;
  title: string;
  note?: string;
  expected_time: string;
  status: CheckinStatus;
  completed_at?: string;
  created_at: string;
}

export type UnsafeCategory =
  | 'poor_lighting'
  | 'harassment_concern'
  | 'isolated_area'
  | 'road_issue'
  | 'other';

export type ReportStatus = 'pending' | 'approved' | 'rejected';

export interface UnsafePlaceReport {
  id: string;
  user_id?: string;
  location_name: string;
  category: UnsafeCategory;
  description: string;
  latitude?: number;
  longitude?: number;
  is_anonymous: boolean;
  status: ReportStatus;
  created_at: string;
}

export type SafetyTipCategory =
  | 'Travel Safety'
  | 'University & Hostel'
  | 'Public Transport'
  | 'Online Safety'
  | 'Emergency Preparedness'
  | 'First Response';

export interface SafetyTip {
  id: string;
  title: string;
  urdu_title?: string;
  content: string;
  urdu_content?: string;
  category: SafetyTipCategory;
  image_url?: string;
  is_published: boolean;
  read_time_minutes: number;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'archived';
  created_at: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalSosAlerts: number;
  activeLocationSessions: number;
  pendingUnsafeReports: number;
  approvedTips: number;
  recentMessagesCount: number;
}
