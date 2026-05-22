import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { RootLayout } from '@/components/layout/RootLayout';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { RecipientLayout } from '@/components/layout/recipient/RecipientLayout';
import { RetailerLayout } from '@/components/layout/retailer/RetailerLayout';
import RecipientDashboardPage from '@/pages/recipient-dashboard/RecipientDashboardPage';
import RecipientHandoverPage from '@/pages/recipient-dashboard/RecipientHandoverPage';
import RecipientHistoryPage from '@/pages/recipient-dashboard/RecipientHistoryPage';
import RecipientProfilePage from '@/pages/recipient-dashboard/RecipientProfilePage';
import RetailerDashboardPage from '@/pages/retailer-dashboard/RetailerDashboardPage';
import RetailerHandoverPage from '@/pages/retailer-dashboard/RetailerHandoverPage';
import RetailerHistoryPage from '@/pages/retailer-dashboard/RetailerHistoryPage';
import RetailerProfilePage from '@/pages/retailer-dashboard/RetailerProfilePage';
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
        path: ROUTES.RETAILER.ROOT,
        element: <RetailerLayout />,
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.RETAILER.DASHBOARD} replace />,
          },
          {
            path: 'dashboard',
            element: <RetailerDashboardPage />,
            handle: {
              pageTitle: 'Retailer Dashboard',
            },
          },
          {
            path: 'handover',
            element: <RetailerHandoverPage />,
            handle: {
              pageTitle: 'Detail Penyerahan',
            },
          },
          {
            path: 'history',
            element: <RetailerHistoryPage />,
            handle: {
              pageTitle: 'Riwayat Penyerahan',
            },
          },
          {
            path: 'profile',
            element: <RetailerProfilePage />,
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
