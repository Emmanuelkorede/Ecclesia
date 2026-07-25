import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {type AuthContextType  ,type AuthSession ,type AuthUser} from '../types/auth.types';

 const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initialized, setInitialized] = useState(false) // has the first check run?


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setInitialized(true);
    });

    
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setInitialized(true);
    });

    // Cleanup: unsubscribe when the provider unmounts (app closes/reloads)
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  const value: AuthContextType = { user, session, initialized }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthContext_ = AuthContext ; 