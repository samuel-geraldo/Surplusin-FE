/**
 * Mock data untuk Recipient Dashboard.
 *
 * Shape data ini HARUS konsisten dengan response API dari Backend Team.
 * Ketika API sudah siap, cukup ganti fungsi di `src/services/api/recipient.js`
 * agar fetch dari endpoint nyata – komponen UI tidak perlu diubah sama sekali.
 */

/**
 * @typedef {Object} DonationSummary
 * @property {number} available  - Jumlah donasi yang tersedia di sekitar penerima
 * @property {number} claimed    - Jumlah donasi yang telah diklaim oleh penerima ini
 */

/** @type {DonationSummary} */
export const mockDonationSummary = {
  available: 15,
  claimed: 2,
};

export const MOCK_CATEGORIES = [
  { value: 'semua', label: 'Semua' },
  { value: 'makanan-siap-saji', label: 'Makanan Siap Saji' },
  { value: 'roti-pastry', label: 'Roti & Pastry' },
  { value: 'jajanan-kue', label: 'Jajanan & Kue' },
];

export const mockDonations = [
  {
    id: '1',
    storeName: 'Bakery Enak',
    foodType: 'roti-pastry',
    categoryLabel: 'Roti & Pastry',
    foodName: 'Roti Sisa Hari Ini',
    distance: '1.2 km',
    portion: '15 Porsi',
    expiry: '2 jam',
  },
  {
    id: '2',
    storeName: 'Warteg Berkah',
    foodType: 'makanan-siap-saji',
    categoryLabel: 'Makanan Siap Saji',
    foodName: 'Nasi Rames',
    distance: '0.8 km',
    portion: '8 Porsi',
    expiry: '45 mnt',
  },
  {
    id: '3',
    storeName: 'Kue Basah Ibu Tini',
    foodType: 'jajanan-kue',
    categoryLabel: 'Jajanan & Kue',
    foodName: 'Kue Lapis Legit',
    distance: '2.5 km',
    portion: '12 Pcs',
    expiry: '4 jam',
  },
];
