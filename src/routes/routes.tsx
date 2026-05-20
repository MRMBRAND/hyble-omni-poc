import { lazy } from 'react';

import { Layout } from './Layout';
import { ProtectedRoute } from './ProtectedRoute';

// prettier-ignore
const Analytics = lazy(() => import('../pages/Analytics/Analytics'));
const Unauthorized = lazy(() => import('../pages/Unauthorized/Unauthorized'));

export const routes = [
  {
    element: <Layout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [{ index: true, element: <Analytics /> }],
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
