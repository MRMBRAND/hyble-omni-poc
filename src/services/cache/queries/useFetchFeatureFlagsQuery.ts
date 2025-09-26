import { useQuery } from '@tanstack/react-query';

import { useApi } from 'services/api';

export function useFetchFeatureFlagsQuery() {
  const api = useApi();

  return useQuery({
    queryKey: ['feature-flags'],
    queryFn: () => api.fetchFeatureFlags(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    retryDelay: 2000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });
}
