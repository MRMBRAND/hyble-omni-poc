import { lazy } from 'react';

import { Layout } from './Layout';
import { ProtectedRoute } from './ProtectedRoute';

// prettier-ignore
const Home = lazy(() => import('../pages/Home/Home'));
const Unauthorized = lazy(() => import('../pages/Unauthorized/Unauthorized'));

export const routes = [
  {
    element: <Layout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [{ index: true, element: <Home /> }],
      },
    ],
  },
  {
    element: <Layout />,
    children: [
      {
        path: '/unauthorized',
        element: <Unauthorized />,
      },
    ],
  },
];
