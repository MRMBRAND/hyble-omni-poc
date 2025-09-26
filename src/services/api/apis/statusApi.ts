import { createApiClient } from '../createApiClient';
import { getStatusEndpoint } from '../endpoints';

interface IStatusResponse {
  success: boolean;
}

export const createStatusApi = (
  apiClient: ReturnType<typeof createApiClient>,
) => ({
  fetchStatus: async (): Promise<IStatusResponse> => {
    const request = new Request(getStatusEndpoint());
    return apiClient.fetchHelper<IStatusResponse>(request);
  },
});
