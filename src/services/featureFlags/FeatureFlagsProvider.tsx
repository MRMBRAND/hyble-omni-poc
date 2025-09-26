import { useFetchFeatureFlagsQuery } from 'services/cache/queries/useFetchFeatureFlagsQuery';

import { FeatureFlagsContext } from './FeatureFlagsContext';

export function FeatureFlagsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data = [] } = useFetchFeatureFlagsQuery();

  return (
    <FeatureFlagsContext.Provider value={data}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}
