import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { App } from 'App';
import { HttpResponse, http } from 'msw';

import { renderWithProviders } from 'test/render';

import { getStatusEndpoint } from './services/api/endpoints';
import { server } from './test/msw';

describe('App', () => {
  beforeEach(() => {
    server.use(
      http.get(getStatusEndpoint(), () => {
        return HttpResponse.json({ success: true });
      }),
    );
  });

  test('renders home page', async () => {
    // arrange

    // act
    renderWithProviders(<App />);

    // assert
    expect(await screen.findByText('Hyble Omni POC')).toBeInTheDocument();
  });
});
