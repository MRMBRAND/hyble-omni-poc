import { useQuery } from '@tanstack/react-query';

import { useApi } from 'services/api';

export function useFetchOmniEmbedUrlQuery() {
  const api = useApi();

  return useQuery({
    queryKey: ['omni-embed-url'],
    queryFn: () => api.fetchOmniEmbedUrl(),
    retry: 0,
    throwOnError: false,
  });
}
