import { useEffect, useState } from 'react';
import OneSignal from 'react-onesignal';
import { useAuth } from '../hooks/useAuth';
import { useActiveOrg } from '../hooks/useActiveOrg';

let initializedOnceGlobally = false;

export const OneSignalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, initialized } = useAuth();
  const { activeOrg } = useActiveOrg();
  const [oneSignalReady, setOneSignalReady] = useState(false);

  useEffect(() => {
    // Only initialize OneSignal once we actually have a logged-in user —
    // never on the public landing/pricing/auth pages.
    if (!initialized || !user || initializedOnceGlobally) return;
    initializedOnceGlobally = true;

    OneSignal.init({
      appId: import.meta.env.VITE_ONESIGNAL_APP_ID,
    }).then(() => setOneSignalReady(true));
  }, [initialized, user]);

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