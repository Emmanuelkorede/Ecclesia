

export type Role = 'super_admin' | 'sub_admin' | 'member';

export type MembershipStatus = 'pending' | 'active' | 'suspended';

export type SubscriptionStatus = 'pending' | 'active' | 'rejected' | 'expired';

export type InviteStatus = 'pending' | 'accepted' | 'expired';

export type SessionStatus = 'active' | 'closed';

export type CheckInMethod = 'code' | 'qr' | 'manual';

export type OutreachStatus = 'draft' | 'sent' | 'failed';

export type OutreachChannel = 'whatsapp' | 'sms';

export type PlanTier = 'free' | 'growth' | 'enterprise';



export interface Organization {
  id: string;
  name: string;
  church_code: string;
  slug: string;
  logo_url: string | null;
  address: string | null;
  timezone: string;
  current_plan: PlanTier;
  subscription_status: SubscriptionStatus;
  plan_expires_at: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  active_org_id: string | null;
  is_platform_superadmin: boolean;
  created_at: string;
}

export interface Membership {
  id: string;
  user_id: string;
  org_id: string;
  role: Role;
  status: MembershipStatus;
  tags: string[];
  joined_at: string;
}

export interface Group {
  id: string;
  org_id: string;
  name: string;
  description: string | null;
  leader_id: string | null;
  created_at: string;
}

export interface EventItem {
  id: string;
  org_id: string;
  group_id: string | null;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  is_mandatory: boolean;
  created_at: string;
}

export interface AttendanceSession {
  id: string;
  event_id: string;
  passcode: string;
  qr_token: string;
  method_allowed: CheckInMethod[];
  expires_at: string;
  status: SessionStatus;
  created_by: string | null;
  created_at: string;
}

export interface AttendanceLog {
  id: string;
  session_id: string;
  user_id: string;
  check_in_method: CheckInMethod;
  checked_in_by: string | null;
  timestamp: string;
}


export interface MembershipWithOrg extends Membership {
  organization: Organization;
}