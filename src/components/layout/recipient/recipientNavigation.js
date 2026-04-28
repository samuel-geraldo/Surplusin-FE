import {
  History,
  HandHelping,
  LayoutGrid,
  UserRound,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export const recipientNavigationItems = [
  {
    label: 'Dashboard Penerima',
    shortLabel: 'Dashboard',
    to: ROUTES.RECIPIENT.DASHBOARD,
    icon: LayoutGrid,
  },
  {
    label: 'Handover Penerima',
    shortLabel: 'Handover',
    to: ROUTES.RECIPIENT.HANDOVER,
    icon: HandHelping,
  },
  {
    label: 'History Penerima',
    shortLabel: 'History',
    to: ROUTES.RECIPIENT.HISTORY,
    icon: History,
  },
  {
    label: 'Profil Penerima',
    shortLabel: 'Profile',
    to: ROUTES.RECIPIENT.PROFILE,
    icon: UserRound,
  },
];
