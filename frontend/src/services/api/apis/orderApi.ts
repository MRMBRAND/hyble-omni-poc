import { createApiClient } from '../createApiClient';
import { getOrdersEndpoint } from '../endpoints';

interface IOrderResponse {
  id: number;
}

export function createOrderApi(apiClient: ReturnType<typeof createApiClient>) {
  return {
    fetchOrder: async (): Promise<IOrderResponse> => {
      const request = new Request(getOrdersEndpoint());
      return apiClient.fetchHelper<IOrderResponse>(request);
    },
  };
}
