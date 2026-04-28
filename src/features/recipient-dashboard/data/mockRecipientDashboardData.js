import { ROUTES } from '@/lib/constants';

export const recipientSummaryCards = [
  {
    id: 'available-donation',
    title: '15 Donasi',
    subtitle: 'Tersedia di sekitarmu',
    accent: 'blue',
    icon: 'package',
  },
  {
    id: 'claimed-donation',
    title: '2 Donasi',
    subtitle: 'Telah diklaim',
    accent: 'orange',
    icon: 'truck',
  },
];

export const donationFoodTypeOptions = [
  { value: 'all', label: 'Semua' },
  { value: 'meal', label: 'Makanan Siap Saji' },
  { value: 'snack', label: 'Jajanan & Kue' },
];

export const availableDonations = [
  {
    id: 'don-1',
    storeName: 'Warteg Kharisma Bahari',
    menuDescription: 'Nasi Kotak + Ayam Goreng',
    quantity: '15 Porsi',
    distance: '0.9 km',
    expiresIn: '3 jam',
    category: 'Makanan Siap Saji',
    categoryKey: 'meal',
    status: 'available',
    mapsUrl: 'https://maps.google.com/?q=Kebayoran+Lama+Jakarta',
  },
  {
    id: 'don-2',
    storeName: 'Jajanan Murah Meriah',
    menuDescription: 'Kue apa aja yang penting enak',
    quantity: '12 Pcs',
    distance: '1.2 km',
    expiresIn: '5 jam',
    category: 'Jajanan & Kue',
    categoryKey: 'snack',
    status: 'in_transit',
    mapsUrl: 'https://maps.google.com/?q=Pasar+Minggu+Jakarta',
  },
  {
    id: 'don-3',
    storeName: 'Warteg Kharisma Bahari',
    menuDescription: 'Nasi Kotak + Ayam Goreng',
    quantity: '15 Porsi',
    distance: '0.9 km',
    expiresIn: '3 jam',
    category: 'Makanan Siap Saji',
    categoryKey: 'meal',
    status: 'received',
    mapsUrl: 'https://maps.google.com/?q=Kebayoran+Lama+Jakarta',
  },
  {
    id: 'don-4',
    storeName: 'Jajanan Murah Meriah',
    menuDescription: 'Kue apa aja yang penting enak',
    quantity: '12 Pcs',
    distance: '1.2 km',
    expiresIn: '5 jam',
    category: 'Jajanan & Kue',
    categoryKey: 'snack',
    status: 'available',
    mapsUrl: 'https://maps.google.com/?q=Pasar+Minggu+Jakarta',
  },
];

export const handoverNotifications = [
  { id: 'notif-1', title: 'Tips!', body: 'Jangan lupa bawa tas belanja sendiri untuk mengurangi plastik.' },
  { id: 'notif-2', title: 'Tips!', body: 'Pastikan lokasi penjemputan sesuai titik yang diberikan mitra.' },
  { id: 'notif-3', title: 'Tips!', body: 'Konfirmasi status donation saat sudah diterima di lokasi.' },
];

export const handoverDonationItems = ['Nasi Box', 'Ayam Bakar', 'Kerupuk Udang', 'Sayur Lodeh'];

export const recipientHistorySummary = [
  { id: 'helped', title: '70 Orang', subtitle: 'Terbantu', accent: 'blue', icon: 'users' },
  { id: 'received', title: '30 Donasi', subtitle: 'Telah diterima', accent: 'green', icon: 'heart' },
  { id: 'stores', title: '6 Toko', subtitle: 'Mengirimkan Donasi', accent: 'orange', icon: 'store' },
];

export const recipientDonationHistory = [
  {
    id: 1,
    storeName: 'Toko Pak Haji Andra',
    locationAndMenu: 'Tebet - Nasi Box',
    portions: '60 Porsi',
    dateAndCount: '23 April 2026 - 8 Donasi',
  },
  {
    id: 2,
    storeName: 'Warung Bu Neni',
    locationAndMenu: 'Pasar Minggu - Nasi Ayam & Sayur',
    portions: '30 Porsi',
    dateAndCount: '21 April 2026 - 10 Donasi',
  },
  {
    id: 3,
    storeName: 'Restoran Manado',
    locationAndMenu: 'Tebet - Paket Nasi Ikan Manado',
    portions: '65 Porsi',
    dateAndCount: '15 April 2026 - 8 Donasi',
  },
  {
    id: 4,
    storeName: 'Kedai Arsiki',
    locationAndMenu: 'Setiabudi - Roti',
    portions: '10 Porsi',
    dateAndCount: '30 Maret 2026 - 2 Donasi',
  },
];

export const recipientSidebarItems = [
  { id: 'dashboard', label: 'Dashboard', to: ROUTES.RECIPIENT_DASHBOARD },
  { id: 'handover', label: 'Handover', to: ROUTES.RECIPIENT_HANDOVER },
  { id: 'history', label: 'Riwayat', to: ROUTES.RECIPIENT_HISTORY },
  { id: 'profile', label: 'Profil', to: ROUTES.RECIPIENT_PROFILE },
];
