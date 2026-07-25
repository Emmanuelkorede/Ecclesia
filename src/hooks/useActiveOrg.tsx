import { useContext } from 'react';
import { OrgContext_ } from '../context/orgContext';

export const useActiveOrg = () => {
  const context = useContext(OrgContext_);
  if (!context) {
    throw new Error('useActiveOrg must be used within an OrgProvider');
  }
  return context;
};