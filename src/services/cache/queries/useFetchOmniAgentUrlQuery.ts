import { useQuery } from '@tanstack/react-query';

import { useApi } from 'services/api';

export function useFetchOmniAgentUrlQuery(enabled: boolean) {
  const api = useApi();

  return useQuery({
    queryKey: ['omni-agent-url'],
    queryFn: () => api.fetchOmniAgentUrl(),
    enabled,
    retry: 0,
    throwOnError: false,
  });
}
