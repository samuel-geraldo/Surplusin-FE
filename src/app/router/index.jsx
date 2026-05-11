import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { RootLayout } from '@/components/layout/RootLayout';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { RecipientLayout } from '@/components/layout/recipient/RecipientLayout';
import RecipientDashboardPage from '@/pages/recipient-dashboard/RecipientDashboardPage';
import RecipientHandoverPage from '@/pages/recipient-dashboard/RecipientHandoverPage';
import RecipientHistoryPage from '@/pages/recipient-dashboard/RecipientHistoryPage';
import RecipientProfilePage from '@/pages/recipient-dashboard/RecipientProfilePage';
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
        path: ROUTES.RECIPIENT.ROOT,
        element: <RecipientLayout />,
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.RECIPIENT.DASHBOARD} replace />,
          },
          {
            path: 'dashboard',
            element: <RecipientDashboardPage />,
            handle: {
              pageTitle: 'Recipients Dashboard',
            },
          },
          {
            path: 'handover',
            element: <RecipientHandoverPage />,
            handle: {
              pageTitle: 'Detail Penjemputan',
            },
          },
          {
            path: 'history',
            element: <RecipientHistoryPage />,
            handle: {
              pageTitle: 'Riwayat Penerima',
            },
          },
          {
            path: 'profile',
            element: <RecipientProfilePage />,
            handle: {
              pageTitle: 'Profil Instansi',
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
