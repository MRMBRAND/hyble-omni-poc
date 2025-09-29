import { render } from '@testing-library/react';
import { ReactElement } from 'react';

import { AppProviders } from '@/AppProviders';
import { ApiProvider } from '@/services/api/ApiProvider';
import { AuthProvider } from '@/services/auth/AuthProvider';
import { CacheProvider } from '@/services/cache/CacheProvider';
import { FeatureFlagsProvider } from '@/services/featureFlags/FeatureFlagsProvider';
import { UiProvider } from '@/services/ui/UiProvider';

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
