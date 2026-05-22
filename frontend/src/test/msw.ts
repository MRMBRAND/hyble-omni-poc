import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';

import {
  getLocalFeatureFlagsEndpoint,
  getRemoteFeatureFlagsEndpoint,
} from '@/services/api/endpoints';

// probably not too many - best not to couple the tests through shared data
export const defaultHandlers = [
  http.get(getRemoteFeatureFlagsEndpoint(), () => {
    return HttpResponse.json([]);
  }),
  http.get(getLocalFeatureFlagsEndpoint(), () => {
    return HttpResponse.json([]);
  }),
];

const server = setupServer(...defaultHandlers);

export { server };
