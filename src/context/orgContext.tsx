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

// Pulled out of the component so it isn't recreated on every render,
// and so loadMemberships can call it from both the success path and
// the JWT-retry path without duplicating the logic.
async function applyMemberships(
  fetchedMemberships: MembershipWithOrg[],
  persistedActiveOrgId: string | null,
  userId: string,
  setMemberships: (m: MembershipWithOrg[]) => void,
  setActiveOrg: (o: Organization | null) => void,
  setRole: (r: Role | null) => void,
  setLoading: (l: boolean) => void
) {
  setMemberships(fetchedMemberships);

  const matched =
    fetchedMemberships.find((m) => m.org_id === persistedActiveOrgId) ??
    fetchedMemberships[0] ??
    null;

  setActiveOrg(matched?.organization ?? null);
  setRole(matched?.role ?? null);
  setLoading(false);

  if (matched && matched.org_id !== persistedActiveOrgId) {
    await orgService.setActiveOrgId(userId, matched.org_id);
  }
}

export const OrgProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, initialized } = useAuth();

  const [memberships, setMemberships] = useState<MembershipWithOrg[]>([]);
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUserId, setLastUserId] = useState<string | undefined>(undefined);

  const loadMemberships = useCallback(async () => {
    if (!user) {
      setMemberships([]);
      setActiveOrg(null);
      setRole(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [fetchedMemberships, persistedActiveOrgId] = await Promise.all([
        orgService.getMembershipsForUser(user.id),
        orgService.getActiveOrgId(user.id),
      ]);

      await applyMemberships(
        fetchedMemberships,
        persistedActiveOrgId,
        user.id,
        setMemberships,
        setActiveOrg,
        setRole,
        setLoading
      );
    } catch (err: any) {
      // Transient clock-skew/token-timing error, most common on the very
      // first request of the day right after `npm run dev` — wait briefly
      // and retry once before giving up.
      if (err?.code === 'PGRST303') {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const [fetchedMemberships, persistedActiveOrgId] = await Promise.all([
          orgService.getMembershipsForUser(user.id),
          orgService.getActiveOrgId(user.id),
        ]);

        await applyMemberships(
          fetchedMemberships,
          persistedActiveOrgId,
          user.id,
          setMemberships,
          setActiveOrg,
          setRole,
          setLoading
        );
      } else {
        setLoading(false);
        throw err;
      }
    }
  }, [user?.id]);

  // Reset loading synchronously during render when the user identity
  // changes, so no component can ever read a stale "loading: false,
  // role: <old value>" combination during the brief window before the
  // effect below has actually run.
  if (user?.id !== lastUserId) {
    setLastUserId(user?.id);
    setLoading(true);
  }

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