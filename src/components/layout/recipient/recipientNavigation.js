import { ROUTES } from '@/lib/constants';

export const recipientNavigationItems = [
  {
    label: 'Dashboard Penerima',
    shortLabel: 'Dashboard',
    to: ROUTES.RECIPIENT.DASHBOARD,
    icon: '/recipient_retailer icon/menu/Icon-dashboard.svg',
  },
  {
    label: 'Handover Penerima',
    shortLabel: 'Handover',
    to: ROUTES.RECIPIENT.HANDOVER,
    icon: '/recipient_retailer icon/menu/Icon-handover.svg',
  },
  {
    label: 'History Penerima',
    shortLabel: 'History',
    to: ROUTES.RECIPIENT.HISTORY,
    icon: '/recipient_retailer icon/menu/Icon-history.svg',
  },
  {
    label: 'Profil Penerima',
    shortLabel: 'Profile',
    to: ROUTES.RECIPIENT.PROFILE,
    icon: '/recipient_retailer icon/menu/Icon-profile.svg',
  },
];

