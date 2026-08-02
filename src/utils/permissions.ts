import type { Role } from '../types/domain.types';

export function isSuperAdmin(role: Role | null): boolean {
  return role === 'super_admin';
}

export function isSubAdmin(role: Role | null): boolean {
  return role === 'sub_admin';
}

export function isAdmin(role: Role | null): boolean {
  return role === 'super_admin' || role === 'sub_admin';
}

export function isMember(role: Role | null): boolean {
  return role === 'member';
}

export function canManageBilling(role: Role | null): boolean {
  return isSuperAdmin(role);
}

export function canManageOrgSettings(role: Role | null): boolean {
  return isSuperAdmin(role);
}

export function canAssignRoles(role: Role | null): boolean {
  return isSuperAdmin(role);
}

export function canManageEvents(role: Role | null): boolean {
  return isAdmin(role);
}

export function canManageGroups(role: Role | null): boolean {
  return isAdmin(role);
}

export function canSendAnnouncements(role: Role | null): boolean {
  return isAdmin(role);
}

export function canRunAttendanceSessions(role: Role | null): boolean {
  return isAdmin(role);
}

export function canViewAnalytics(role: Role | null): boolean {
  return isAdmin(role);
}

export function canUseAIOutreach(role: Role | null): boolean {
  return isAdmin(role);
}