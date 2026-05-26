import { createApiClient } from '../createApiClient';
import { getOmniAgentUrlEndpoint, getOmniEmbedUrlEndpoint } from '../endpoints';

interface IOmniEmbedUrlResponse {
  url: string;
}

export function createAnalyticsApi(
  apiClient: ReturnType<typeof createApiClient>,
) {
  return {
    fetchOmniEmbedUrl: async (): Promise<IOmniEmbedUrlResponse> => {
      const request = new Request(getOmniEmbedUrlEndpoint());
      return apiClient.fetchHelper<IOmniEmbedUrlResponse>(request);
    },
    fetchOmniAgentUrl: async (): Promise<IOmniEmbedUrlResponse> => {
      const request = new Request(getOmniAgentUrlEndpoint());
      return apiClient.fetchHelper<IOmniEmbedUrlResponse>(request);
    },
  };
}
