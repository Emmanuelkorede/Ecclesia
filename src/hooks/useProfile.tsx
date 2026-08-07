import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import * as profileService from '../services/profileServices';
import type { Database } from '../types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function useProfile() {
  const { user, initialized } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await profileService.getProfile(user.id);
      setProfile(data);
    } catch (err: any) {
      // Transient clock-skew/token-timing error right after signup —
      // wait briefly and retry once before giving up.
      if (err?.code === 'PGRST303') {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const retryData = await profileService.getProfile(user.id);
        setProfile(retryData);
      } else {
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!initialized) return;
    loadProfile();
  }, [initialized, loadProfile]);

  const isComplete = profile ? profileService.isProfileComplete(profile) : false;

  return { profile, loading, isComplete, refreshProfile: loadProfile };
}