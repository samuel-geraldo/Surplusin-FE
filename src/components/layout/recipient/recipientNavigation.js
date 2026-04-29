import { ROUTES } from '@/lib/constants';

export const recipientNavigationItems = [
  {
    label: 'Dashboard Penerima',
    shortLabel: 'Dashboard',
    to: ROUTES.RECIPIENT.DASHBOARD,
    icon: '/menu-icon/Icon-dashboard.svg',
  },
  {
    label: 'Handover Penerima',
    shortLabel: 'Handover',
    to: ROUTES.RECIPIENT.HANDOVER,
    icon: '/menu-icon/Icon-handover.svg',
  },
  {
    label: 'History Penerima',
    shortLabel: 'History',
    to: ROUTES.RECIPIENT.HISTORY,
    icon: '/menu-icon/Icon-history.svg',
  },
  {
    label: 'Profil Penerima',
    shortLabel: 'Profile',
    to: ROUTES.RECIPIENT.PROFILE,
    icon: '/menu-icon/Icon-profile.svg',
  },
];
