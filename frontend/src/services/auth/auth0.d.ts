import '@auth0/auth0-react';

declare module '@auth0/auth0-react' {
  interface User {
    'https://mrmglobal.com/role': string[];
  }
}
