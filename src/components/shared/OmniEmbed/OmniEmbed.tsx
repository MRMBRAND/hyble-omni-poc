import { usePostHog } from 'posthog-js/react';
import { useEffect, useRef, useState } from 'react';

import {
  AnalyticsEvents,
  OMNI_EVENT_MAP,
} from '@/services/analytics/AnalyticsEvents';

interface OmniEmbedProps {
  url: string;
  allowMicrophone?: boolean;
  fireOpenedEvent?: boolean;
}

export function OmniEmbed({
  url,
  allowMicrophone,
  fireOpenedEvent,
}: OmniEmbedProps) {
  const posthog = usePostHog();
  const posthogRef = useRef(posthog);
  const [height, setHeight] = useState<string | number>('100%');

  useEffect(() => {
    posthogRef.current = posthog;
  }, [posthog]);

  useEffect(() => {
    if (fireOpenedEvent) {
      posthog?.capture(AnalyticsEvents.OMNI_DASHBOARD_OPENED);
    }
  }, [fireOpenedEvent, posthog]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const urlOrigin = new URL(url).origin;
      if (event.origin !== urlOrigin) return;

      if (event.data?.name === 'size' && event.data.payload?.height) {
        setHeight(`${event.data.payload.height}px`);
      }

      const posthogEventName = OMNI_EVENT_MAP[event.data?.name];
      if (posthogEventName) {
        posthogRef.current?.capture(posthogEventName, event.data.payload ?? {});
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [url]);

  return (
    <iframe
      src={url}
      width="100%"
      height={height}
      allow={
        allowMicrophone ? 'clipboard-write; microphone' : 'clipboard-write'
      }
      frameBorder="0"
      style={{ display: 'block', flexGrow: 1 }}
    />
  );
}
