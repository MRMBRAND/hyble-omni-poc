import ReactDOM from 'react-dom/client';

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

/*
todo:
local feature flags
readme with architecture guide
-> "it's not clear where to put this new code" -> lets discuss and define arch/patterns
finish sample tests
*/

root.render(
  <AppProviders
    providers={[
      AuthProvider,
      ApiProvider,
      CacheProvider,
      FeatureFlagsProvider,
      UiProvider,
    ]}
  >
    <App />
  </AppProviders>,
);
