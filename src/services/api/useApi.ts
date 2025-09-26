import { useContext } from 'react';

import { ApiContext } from './ApiContext';

export const useApi = () => {
  const api = useContext(ApiContext);

  if (!api) throw new Error('useApi must be used within ApiProvider');

  return api;
};
