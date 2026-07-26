import React, { createContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as orgService from '../services/orgService';
import type { Organization, MembershipWithOrg, Role } from '../types/domain.types';

interface OrgContextType {
  memberships: MembershipWithOrg[];
  activeOrg: Organization | null;
  role: Role | null;
  loading: boolean;
  switchOrg: (orgId: string) => Promise<void>;
  refreshMemberships: () => Promise<void>;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export const OrgProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, initialized } = useAuth();

  const [memberships, setMemberships] = useState<MembershipWithOrg[]>([]);
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMemberships = useCallback(async () => {
    if (!user) {
      setMemberships([]);
      setActiveOrg(null);
      setRole(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const [fetchedMemberships, persistedActiveOrgId] = await Promise.all([
      orgService.getMembershipsForUser(user.id),
      orgService.getActiveOrgId(user.id),
    ]);

    setMemberships(fetchedMemberships);

    const matched =
      fetchedMemberships.find((m) => m.org_id === persistedActiveOrgId) ??
      fetchedMemberships[0] ??
      null;

    setActiveOrg(matched?.organization ?? null);
    setRole(matched?.role ?? null);
    setLoading(false);

    // If we fell back to the first membership because nothing was
    // persisted yet (or it pointed to a stale/removed org), save it now
    // so it's remembered next time this user logs in.
    if (matched && matched.org_id !== persistedActiveOrgId) {
      await orgService.setActiveOrgId(user.id, matched.org_id);
    }
  }, [user]);

  useEffect(() => {
    if (!initialized) return;
    loadMemberships();
  }, [initialized, loadMemberships]);

  const switchOrg = async (orgId: string) => {
    if (!user) return;
    const target = memberships.find((m) => m.org_id === orgId);
    if (!target) return;

    await orgService.setActiveOrgId(user.id, orgId);
    setActiveOrg(target.organization);
    setRole(target.role);
  };

  return (
    <OrgContext.Provider
      value={{ memberships, activeOrg, role, loading, switchOrg, refreshMemberships: loadMemberships }}
    >
      {children}
    </OrgContext.Provider>
  );
};

export const OrgContext_ = OrgContext;