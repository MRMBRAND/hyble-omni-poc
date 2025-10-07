import { PostHogProvider } from 'posthog-js/react';

import { GenericProviderProps } from '@/AppProviders';

export function AnalyticsProvider({ children }: GenericProviderProps) {
  if (window.ENV_CONFIG.keys.posthogKey) {
    return (
      <PostHogProvider
        apiKey={window.ENV_CONFIG.keys.posthogKey}
        options={{
          api_host: window.ENV_CONFIG.keys.posthogHost,
          debug: false,
          persistence: 'memory',
        }}
      >
        {children}
      </PostHogProvider>
    );
  }

  return children;
}
