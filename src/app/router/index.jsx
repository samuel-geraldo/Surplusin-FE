import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { RootLayout } from '@/components/layout/RootLayout';
import { PublicLayout } from '@/components/layout/PublicLayout';
import LandingPage, { LandingNavbarActions } from '@/pages/LandingPage';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            path: ROUTES.HOME,
            element: <LandingPage />,
            handle: {
              publicNavbarActions: <LandingNavbarActions />,
            },
          },
        ],
      },
    ],
  },
]);
