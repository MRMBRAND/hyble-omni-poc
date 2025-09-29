import { useAuth0 } from '@auth0/auth0-react';
import { useMemo } from 'react';

import { GenericProviderProps } from '@/AppProviders';

import { createRootApi } from '.';
import { ApiContext } from './ApiContext';

export function ApiProvider({ children }: GenericProviderProps) {
  const { getAccessTokenSilently } = useAuth0();

  const api = useMemo(
    () => createRootApi(getAccessTokenSilently),
    [getAccessTokenSilently],
  );

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}
