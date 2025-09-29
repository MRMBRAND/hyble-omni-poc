import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { GenericProviderProps } from '@/AppProviders';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { throwOnError: true },
  },
});

export function CacheProvider({ children }: GenericProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
