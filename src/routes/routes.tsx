import { lazy } from 'react';

import { Layout } from './Layout';
import { ProtectedRoute } from './ProtectedRoute';

// prettier-ignore
const Home = lazy(() => import('../pages/Home/Home'));
const ExamplePage = lazy(() => import('../pages/Example/Example'));

export const routes = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <Home /> },
          { path: 'example-page', element: <ExamplePage /> },
        ],
      },
    ],
  },
];
