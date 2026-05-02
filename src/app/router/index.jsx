import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { RootLayout } from '@/components/layout/RootLayout';
import { PublicLayout } from '@/components/layout/PublicLayout';
import LandingPage, { LandingNavbarActions } from '@/pages/LandingPage';
import AuthPage from '@/pages/AuthPage';
import FaqPage from '@/pages/FaqPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsPage from '@/pages/TermsPage';

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
          {
            path: ROUTES.FAQ,
            element: <FaqPage />,
            handle: {
              publicNavbarTall: true,
            },
          },
          {
            path: ROUTES.PRIVACY,
            element: <PrivacyPolicyPage />,
            handle: {
              publicNavbarTall: true,
            },
          },
          {
            path: ROUTES.TERMS,
            element: <TermsPage />,
            handle: {
              publicNavbarTall: true,
            },
          },
        ],
      },
      {
        path: ROUTES.AUTH,
        element: <AuthPage />,
      },
    ],
  },
]);
