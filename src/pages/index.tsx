import { lazy, Suspense } from 'react';
import { ROUTES } from '../constants';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
const InvoicePage = lazy(() => import('pages/Invoice'));
const LoginPage = lazy(() => import('pages/Login'));

const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: (
      <Suspense fallback={null}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.INVOICE,
    element: (
      <Suspense fallback={null}>
        <InvoicePage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.HOME,
    element: <Navigate to={ROUTES.LOGIN} />,
  },
]);

function App(): JSX.Element {
  return <RouterProvider router={router} />;
}

export default App;
