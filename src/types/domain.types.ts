import type { Database } from './database.types';

export type Organization = Database['public']['Tables']['organizations']['Row'];
export type Membership = Database['public']['Tables']['memberships']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];

export type Role = Database['public']['Enums']['user_role'];
export type MembershipStatus = Database['public']['Enums']['membership_status'];
export type SubscriptionStatus = Database['public']['Enums']['subscription_status'];

// Now pulled from the real Postgres enum you just created, instead of
// being hand-typed only in planLimits.ts — if you ever add a 4th tier
// in the database, this updates automatically on next type generation.
export type PlanTier = Database['public']['Enums']['plan_tier'];

export interface MembershipWithOrg extends Membership {
  organization: Organization;
}