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
    const data = await profileService.getProfile(user.id);
    setProfile(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!initialized) return;
    loadProfile();
  }, [initialized, loadProfile]);

  const isComplete = profile ? profileService.isProfileComplete(profile) : false;

  return { profile, loading, isComplete, refreshProfile: loadProfile };
}