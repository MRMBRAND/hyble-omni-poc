import { useAuth0 } from '@auth0/auth0-react';
import { Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

import { Spinner } from 'components/lib/Spinner/Spinner';
import { isAdmin } from 'services/auth/util';

export const ProtectedRoute = () => {
  const { user, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return <Spinner fullscreen />;
  }

  if (!isLoading && !user) {
    loginWithRedirect();
    return;
  }

  if (!isLoading && !isAdmin(user)) {
    return <Flex>You are not permitted to access this app</Flex>;
  }

  return <Outlet />;
};
