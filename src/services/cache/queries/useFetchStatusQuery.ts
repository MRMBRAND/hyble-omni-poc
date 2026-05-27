import { useQuery } from '@tanstack/react-query';

import { useApi } from 'services/api';

export function useFetchStatusQuery() {
  const api = useApi();

  return useQuery({
    queryKey: ['status'],
    queryFn: () => api.fetchStatus(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}
