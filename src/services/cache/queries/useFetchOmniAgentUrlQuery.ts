import { useQuery } from '@tanstack/react-query';

import { useApi } from 'services/api';

export function useFetchOmniAgentUrlQuery(enabled: boolean) {
  const api = useApi();

  return useQuery({
    queryKey: ['omni-agent-url'],
    queryFn: () => api.fetchOmniAgentUrl(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled,
    retry: 0,
    throwOnError: false,
  });
}
