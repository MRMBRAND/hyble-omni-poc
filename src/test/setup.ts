import 'vitest-dom/extend-expect';

import './auth';
import './env';
import { server } from './msw';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});
afterAll(() => server.close());
