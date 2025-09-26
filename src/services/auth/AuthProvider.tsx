import { Auth0Provider } from '@auth0/auth0-react';

export const AuthProvider = ({ children }) => {
  return (
    <Auth0Provider
      clientId={window.ENV_CONFIG.auth0.clientId}
      domain={window.ENV_CONFIG.auth0.domain}
      authorizationParams={{
        audience: window.ENV_CONFIG.auth0.audience,
        redirect_uri: window.location.origin,
      }}
      cacheLocation={'memory'}
    >
      {children}
    </Auth0Provider>
  );
};
