import React, { createContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as profileService from '../services/profileServices';
import type { Database } from '../types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  isComplete: boolean;
  refreshProfile: () => Promise<void>;
}

 const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, initialized } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUserId, setLastUserId] = useState<string | undefined>(undefined);

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

  // Synchronous reset: the moment the user identity changes, mark loading
  // true DURING RENDER (not in an effect), so no other component ever sees
  // a stale "not loading" state for the wrong user. This is what closes
  // the race condition described in bug #1 too.
  if (user?.id !== lastUserId) {
    setLastUserId(user?.id);
    setLoading(true);
  }

  useEffect(() => {
    if (!initialized) return;
    loadProfile();
  }, [initialized, loadProfile]);

  const isComplete = profile ? profileService.isProfileComplete(profile) : false;

  return (
    <ProfileContext.Provider value={{ profile, loading, isComplete, refreshProfile: loadProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const ProfileContext_ = ProfileContext