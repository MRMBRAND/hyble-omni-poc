import { useAuth0 } from '@auth0/auth0-react';
import { usePostHog } from 'posthog-js/react';
import { useEffect, useRef } from 'react';

export function useAnalyticsIdentityTracking() {
  const posthog = usePostHog();
  const { user } = useAuth0();
  const identifiedRef = useRef(false);

  useEffect(() => {
    if (user && posthog && !identifiedRef.current) {
      posthog.identify(user.sub, {
        email: user.email || '',
        name: user.name || '',
      });
      identifiedRef.current = true;
    }
  }, [user, posthog]);
}
