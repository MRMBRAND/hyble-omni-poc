import ReactDOM from 'react-dom/client';

import { AgentPanelProvider } from '@/services/agent/AgentPanelContext';
import { AnalyticsProvider } from '@/services/analytics/AnalyticsProvider';
import { ApiProvider } from '@/services/api/ApiProvider';
import { AuthProvider } from '@/services/auth/AuthProvider';
import { CacheProvider } from '@/services/cache/CacheProvider';
import { FeatureFlagsProvider } from '@/services/featureFlags/FeatureFlagsProvider';
import { UiProvider } from '@/services/ui/UiProvider';

import { App } from './App';
import { AppProviders } from './AppProviders';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <AppProviders
    providers={[
      AnalyticsProvider,
      AuthProvider,
      ApiProvider,
      CacheProvider,
      FeatureFlagsProvider,
      AgentPanelProvider,
      UiProvider,
    ]}
  >
    <App />
  </AppProviders>,
);
