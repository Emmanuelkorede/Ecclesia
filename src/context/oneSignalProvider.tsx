import { useEffect } from 'react';
import OneSignal from 'react-onesignal';
import { useAuth } from '../hooks/useAuth';
import { useActiveOrg } from '../hooks/useActiveOrg';
import { useState } from 'react';


let initialized = false;

export const OneSignalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { activeOrg } = useActiveOrg();
  const [oneSignalReady, setOneSignalReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || initialized) return;
    initialized = true;

    OneSignal.init({
      appId: import.meta.env.VITE_ONESIGNAL_APP_ID,
    }).then(() => setOneSignalReady(true));
  }, []);

  useEffect(() => {
    if (!oneSignalReady || !user) return;
    OneSignal.login(user.id);
  }, [oneSignalReady, user?.id]);

  useEffect(() => {
    if (!oneSignalReady || !activeOrg) return;
    OneSignal.User.addTag('org_id', activeOrg.id);
  }, [oneSignalReady, activeOrg?.id]);

  return <>{children}</>;
};