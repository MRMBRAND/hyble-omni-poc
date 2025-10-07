import { createFeatureFlagsApi } from './apis/featureFlagsApi';
import { createOrderApi } from './apis/orderApi';
import { createStatusApi } from './apis/statusApi';
import { createApiClient } from './createApiClient';

export function createRootApi(getAccessTokenSilently: () => Promise<string>) {
  const apiClient = createApiClient(getAccessTokenSilently);

  return {
    ...createFeatureFlagsApi(apiClient),
    ...createStatusApi(apiClient),
    ...createOrderApi(apiClient),
    // ... add more domain APIs here
  };
}
