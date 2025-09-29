import { GenericProviderProps } from '@/AppProviders';

import { useFetchFeatureFlagsQuery } from 'services/cache/queries/useFetchFeatureFlagsQuery';

import { FeatureFlagsContext } from './FeatureFlagsContext';

export function FeatureFlagsProvider({ children }: GenericProviderProps) {
  const { data = [] } = useFetchFeatureFlagsQuery();

  return (
    <FeatureFlagsContext.Provider value={data}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}
