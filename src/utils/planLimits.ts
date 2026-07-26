import type { PlanTier } from '../types/domain.types';

interface PlanLimits {
  maxMembers: number | null;
  maxGroups: number | null;
  maxEventsPerMonth: number | null;
  aiOutreachDraftsPerMonth: number | null;
  attendanceMethods: ('code' | 'qr' | 'manual')[];
  pushNotifications: boolean;
  smsWhatsappOutreach: boolean;
  analyticsLevel: 'basic' | 'advanced' | 'full';
  csvExport: boolean;
  pdfExport: boolean;
}

const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  free: {
    maxMembers: 20,
    maxGroups: 2,
    maxEventsPerMonth: 4,
    aiOutreachDraftsPerMonth: 5,
    attendanceMethods: ['code', 'manual'],
    pushNotifications: false,
    smsWhatsappOutreach: false,
    analyticsLevel: 'basic',
    csvExport: false,
    pdfExport: false,
  },
  growth: {
    maxMembers: 150,
    maxGroups: 10,
    maxEventsPerMonth: 20,
    aiOutreachDraftsPerMonth: 100,
    attendanceMethods: ['code', 'qr', 'manual'],
    pushNotifications: true,
    smsWhatsappOutreach: false,
    analyticsLevel: 'advanced',
    csvExport: true,
    pdfExport: false,
  },
  enterprise: {
    maxMembers: null,
    maxGroups: null,
    maxEventsPerMonth: null,
    aiOutreachDraftsPerMonth: null,
    attendanceMethods: ['code', 'qr', 'manual'],
    pushNotifications: true,
    smsWhatsappOutreach: true,
    analyticsLevel: 'full',
    csvExport: true,
    pdfExport: true,
  },
};

export function getPlanLimits(plan: PlanTier): PlanLimits {
  return PLAN_LIMITS[plan];
}

export function isAtMemberLimit(plan: PlanTier, currentCount: number): boolean {
  const limit = PLAN_LIMITS[plan].maxMembers;
  return limit !== null && currentCount >= limit;
}

export function isAtGroupLimit(plan: PlanTier, currentCount: number): boolean {
  const limit = PLAN_LIMITS[plan].maxGroups;
  return limit !== null && currentCount >= limit;
}

export function isAtMonthlyEventLimit(plan: PlanTier, currentCountThisMonth: number): boolean {
  const limit = PLAN_LIMITS[plan].maxEventsPerMonth;
  return limit !== null && currentCountThisMonth >= limit;
}

export function isAtAIOutreachLimit(plan: PlanTier, draftsUsedThisMonth: number): boolean {
  const limit = PLAN_LIMITS[plan].aiOutreachDraftsPerMonth;
  return limit !== null && draftsUsedThisMonth >= limit;
}

export function canUseAttendanceMethod(plan: PlanTier, method: 'code' | 'qr' | 'manual'): boolean {
  return PLAN_LIMITS[plan].attendanceMethods.includes(method);
}



export function getEffectivePlanForLimits(
  currentPlan: 'free' | 'growth' | 'enterprise',
  isExpired: boolean
): 'free' | 'growth' | 'enterprise' {
  return isExpired ? 'free' : currentPlan;
}