import { useQuery } from '@tanstack/react-query';

import { useApi } from 'services/api';

export function useFetchStatusQuery() {
  const api = useApi();

  return useQuery({
    queryKey: ['status'],
    queryFn: () => api.fetchStatus(),
  });
}
