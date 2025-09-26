import { createApiClient } from '../createApiClient';
import { getOrdersEndpoint } from '../endpoints';

interface IOrderResponse {
  id: number;
}

export const createOrderApi = (
  apiClient: ReturnType<typeof createApiClient>,
) => ({
  fetchOrder: async (): Promise<IOrderResponse> => {
    const request = new Request(getOrdersEndpoint());
    return apiClient.fetchHelper<IOrderResponse>(request);
  },
});
