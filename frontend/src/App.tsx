import { Suspense } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Spinner } from 'components/lib/Spinner/Spinner';
import { routes } from 'routes/routes';

export function App() {
  return (
    <Suspense fallback={<Spinner fullscreen />}>
      <RouterProvider router={createBrowserRouter(routes)} />
    </Suspense>
  );
}
