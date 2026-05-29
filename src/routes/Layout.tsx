import { Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

import { useAnalyticsIdentityTracking } from '@/services/analytics/useAnalyticsIdentityTracking';

import Header from 'components/shared/Header';

export const Layout = () => {
  useAnalyticsIdentityTracking();

  return (
    <Flex direction="column">
      <Header />
      <Outlet />
    </Flex>
  );
};
