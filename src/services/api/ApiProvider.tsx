import { useAuth0 } from '@auth0/auth0-react';
import React, { useMemo } from 'react';

import { createRootApi } from '.';
import { ApiContext } from './ApiContext';

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const { getAccessTokenSilently } = useAuth0();

  const api = useMemo(
    () => createRootApi(getAccessTokenSilently),
    [getAccessTokenSilently],
  );

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}
