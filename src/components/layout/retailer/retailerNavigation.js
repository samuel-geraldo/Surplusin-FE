import { ROUTES } from '@/lib/constants';

export const retailerNavigationItems = [
  {
    label: 'Dashboard Retailer',
    shortLabel: 'Dashboard',
    to: ROUTES.RETAILER.DASHBOARD,
    icon: '/recipient_retailer icon/menu/Icon-dashboard.svg',
  },
  {
    label: 'Handover Retailer',
    shortLabel: 'Handover',
    to: ROUTES.RETAILER.HANDOVER,
    icon: '/recipient_retailer icon/menu/Icon-handover.svg',
  },
  {
    label: 'History Retailer',
    shortLabel: 'History',
    to: ROUTES.RETAILER.HISTORY,
    icon: '/recipient_retailer icon/menu/Icon-history.svg',
  },
  {
    label: 'Profil Retailer',
    shortLabel: 'Profile',
    to: ROUTES.RETAILER.PROFILE,
    icon: '/recipient_retailer icon/menu/Icon-profile.svg',
  },
];
