import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { App } from 'App';
import { HttpResponse, http } from 'msw';

import { renderWithProviders } from 'test/render';

import { getStatusEndpoint } from './services/api/endpoints';
import { CLAIM_ROLE, ROLE_ADMIN } from './services/auth/util';
import { setAuthState } from './test/auth';
import { server } from './test/msw';

describe('App', () => {
  beforeEach(() => {
    server.use(
      http.get(getStatusEndpoint(), () => {
        return HttpResponse.json({ success: true });
      }),
    );
  });

  test('renders home page when user is admin', async () => {
    // arrange
    setAuthState({
      user: { [CLAIM_ROLE]: ROLE_ADMIN },
    });

    // act
    renderWithProviders(<App />);

    // assert
    expect(
      await screen.findByText('Toolkit app home page'),
    ).toBeInTheDocument();
  });

  test('renders error message when user is not admin', async () => {
    // arrange
    setAuthState({
      user: { [CLAIM_ROLE]: 'not-an-admin' },
    });

    // act
    renderWithProviders(<App />);

    // assert
    expect(
      await screen.findByText('You are not permitted to access this app'),
    ).toBeInTheDocument();
  });
});
