import { createContext } from 'react';

import { createRootApi } from './rootApi';

export const ApiContext = createContext<ReturnType<
  typeof createRootApi
> | null>(null);
