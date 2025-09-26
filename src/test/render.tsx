import { render } from '@testing-library/react';
import { ReactElement } from 'react';
import { vi } from 'vitest';

import { AppProviders } from '@/AppProviders';
import { ApiProvider } from '@/services/api/ApiProvider';
import { AuthProvider } from '@/services/auth/AuthProvider';
import { CacheProvider } from '@/services/cache/CacheProvider';
import { FeatureFlagsProvider } from '@/services/featureFlags/FeatureFlagsProvider';
import { UiProvider } from '@/services/ui/UiProvider';

import { authState } from './auth';

vi.mock('@auth0/auth0-react', async () => {
  // Re-export the provider for type compatibility if needed, but provide a minimal mock for useAuth0
  return {
    Auth0Provider: ({ children }: { children: React.ReactNode }) => children,
    useAuth0: () => authState,
  };
});

export function renderWithProviders(ui: ReactElement) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AppProviders
      providers={[
        AuthProvider,
        ApiProvider,
        CacheProvider,
        FeatureFlagsProvider,
        UiProvider,
      ]}
    >
      {children}
    </AppProviders>
  );

  return render(ui, { wrapper: Wrapper });
}
