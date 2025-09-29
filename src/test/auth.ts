import { CLAIM_ROLE, ROLE_ADMIN } from '@/services/auth/util';

export type TestAuthState = {
  isLoading: boolean;
  user: Record<string, unknown> | null;
  getAccessTokenSilently: () => Promise<string>;
  loginWithRedirect: (options?: unknown) => Promise<void> | void;
  logout: (options?: unknown) => void;
};

// Default to an authenticated test user; individual tests can override via setAuthState
export const authState: TestAuthState = {
  isLoading: false,
  user: { [CLAIM_ROLE]: ROLE_ADMIN },
  getAccessTokenSilently: async () => 'test-access-token',
  loginWithRedirect: () => undefined,
  logout: () => undefined,
};

export function setAuthState(overrides: Partial<TestAuthState>): void {
  Object.assign(authState, overrides);
}
