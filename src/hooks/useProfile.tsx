import { useContext } from 'react';
import { ProfileContext_ } from '../context/ProfileContext';

export const useProfile = () => {
  const context = useContext(ProfileContext_);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};