import { useContext } from 'react';
import { AuthContext_ } from '../context/authContext';
import * as authService from '../services/authService';

export const useAuth = () => {
  const context = useContext(AuthContext_);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return {
    ...context,
    isAuthenticated: !!context.user, 
    signUp: authService.signUp,
    signIn: authService.signInWithPassword,
    signInWithGoogle: authService.signInWithGoogle,
    signOut: authService.signOut,
  };
};