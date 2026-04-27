import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { RootLayout } from '@/components/layout/RootLayout';
import { PublicLayout } from '@/components/layout/PublicLayout';
import HomePage from '@/pages/HomePage';
import RecipientDashboardPage from '@/pages/recipient-dashboard/RecipientDashboardPage';
import RecipientHandoverPage from '@/pages/recipient-dashboard/RecipientHandoverPage';
import RecipientHistoryPage from '@/pages/recipient-dashboard/RecipientHistoryPage';
import RecipientProfilePage from '@/pages/recipient-dashboard/RecipientProfilePage';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            path: ROUTES.HOME,
            element: <HomePage />,
          },
        ],
      },
      {
        path: ROUTES.RECIPIENT_DASHBOARD,
        element: <RecipientDashboardPage />,
      },
      {
        path: ROUTES.RECIPIENT_HANDOVER,
        element: <RecipientHandoverPage />,
      },
      {
        path: ROUTES.RECIPIENT_HISTORY,
        element: <RecipientHistoryPage />,
      },
      {
        path: ROUTES.RECIPIENT_PROFILE,
        element: <RecipientProfilePage />,
      },
    ],
  },
]);
