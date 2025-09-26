import { Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

import Header from 'components/shared/Header';

export const Layout = () => {
  return (
    <Flex direction="column">
      <Header />
      <Outlet />
    </Flex>
  );
};
