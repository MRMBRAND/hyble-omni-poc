import { useQuery } from '@tanstack/react-query';

import { useApi } from 'services/api';

export function useFetchOmniEmbedUrlQuery() {
  const api = useApi();

  return useQuery({
    queryKey: ['omni-embed-url'],
    queryFn: () => api.fetchOmniEmbedUrl(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 0,
    throwOnError: false,
  });
}
