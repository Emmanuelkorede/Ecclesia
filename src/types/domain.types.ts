import type { Database } from './database.types';

export type Organization = Database['public']['Tables']['organizations']['Row'];
export type Membership = Database['public']['Tables']['memberships']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];


export type Role = Database['public']['Enums']['user_role'];
export type MembershipStatus = Database['public']['Enums']['membership_status'];

export interface MembershipWithOrg extends Membership {
  organization: Organization;
}