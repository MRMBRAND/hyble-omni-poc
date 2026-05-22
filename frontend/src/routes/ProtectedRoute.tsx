import { useAuth0 } from '@auth0/auth0-react';
import { Outlet } from 'react-router-dom';

import { Spinner } from 'components/lib/Spinner/Spinner';

export const ProtectedRoute = () => {
  const { user, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return <Spinner fullscreen />;
  }

  if (!isLoading && !user) {
    loginWithRedirect();
    return;
  }

  // if (!isLoading && !isAdmin(user)) {
  //   return <Navigate to="unauthorized" />;
  // }

  return <Outlet />;
};
