import 'vitest-dom/extend-expect';

import { GenericProviderProps } from '@/AppProviders';

import './auth';
import { authState } from './auth';
import './env';
import { server } from './msw';

vi.mock('@auth0/auth0-react', async () => {
  // Re-export the provider for type compatibility if needed, but provide a minimal mock for useAuth0
  return {
    Auth0Provider: ({ children }: GenericProviderProps) => children,
    useAuth0: () => authState,
  };
});

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});
afterAll(() => server.close());
