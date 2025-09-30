import { PostHogProvider } from 'posthog-js/react';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  if (window.ENV_CONFIG.keys.posthog_key) {
    return (
      <PostHogProvider
        apiKey={window.ENV_CONFIG.keys.posthog_key}
        options={{
          api_host: window.ENV_CONFIG.keys.posthog_host || '',
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
