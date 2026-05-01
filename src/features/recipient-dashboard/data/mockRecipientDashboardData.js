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
  claimed: 3,
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
  {
    id: '4',
    storeName: 'Rumah Makan Padang Raya',
    foodType: 'makanan-siap-saji',
    categoryLabel: 'Makanan Siap Saji',
    foodName: 'Rendang & Nasi Putih',
    distance: '1.5 km',
    portion: '10 Porsi',
    expiry: '1 jam',
  },
  {
    id: '5',
    storeName: 'Panaderia Artisan',
    foodType: 'roti-pastry',
    categoryLabel: 'Roti & Pastry',
    foodName: 'Croissant Almond',
    distance: '3.1 km',
    portion: '20 Pcs',
    expiry: '3 jam',
  },
  {
    id: '6',
    storeName: 'Toko Kue Manis',
    foodType: 'jajanan-kue',
    categoryLabel: 'Jajanan & Kue',
    foodName: 'Onde-onde & Klepon',
    distance: '1.8 km',
    portion: '30 Pcs',
    expiry: '2 jam',
  },
  {
    id: '7',
    storeName: 'Kantin Pabrik Sinar',
    foodType: 'makanan-siap-saji',
    categoryLabel: 'Makanan Siap Saji',
    foodName: 'Mie Goreng Spesial',
    distance: '0.5 km',
    portion: '20 Porsi',
    expiry: '30 mnt',
  },
  {
    id: '8',
    storeName: 'Roti Gandum Sehat',
    foodType: 'roti-pastry',
    categoryLabel: 'Roti & Pastry',
    foodName: 'Roti Gandum Multigrain',
    distance: '4.2 km',
    portion: '25 Pcs',
    expiry: '5 jam',
  },
  {
    id: '9',
    storeName: 'Pasar Jajan Bu Sri',
    foodType: 'jajanan-kue',
    categoryLabel: 'Jajanan & Kue',
    foodName: 'Bika Ambon & Lemper',
    distance: '2.0 km',
    portion: '18 Pcs',
    expiry: '3 jam',
  },
  {
    id: '10',
    storeName: 'Catering Aneka Rasa',
    foodType: 'makanan-siap-saji',
    categoryLabel: 'Makanan Siap Saji',
    foodName: 'Nasi Kotak Ayam Bakar',
    distance: '2.3 km',
    portion: '15 Kotak',
    expiry: '1.5 jam',
  },
  {
    id: '11',
    storeName: 'Le Petit Boulanger',
    foodType: 'roti-pastry',
    categoryLabel: 'Roti & Pastry',
    foodName: 'Danish Pastry & Éclair',
    distance: '3.8 km',
    portion: '14 Pcs',
    expiry: '4 jam',
  },
  {
    id: '12',
    storeName: 'Dapur Nenek Molek',
    foodType: 'jajanan-kue',
    categoryLabel: 'Jajanan & Kue',
    foodName: 'Getuk Lindri & Cenil',
    distance: '1.1 km',
    portion: '24 Pcs',
    expiry: '2.5 jam',
  },
  {
    id: '13',
    storeName: 'Restoran Soto Lamongan',
    foodType: 'makanan-siap-saji',
    categoryLabel: 'Makanan Siap Saji',
    foodName: 'Soto Ayam & Lontong',
    distance: '1.6 km',
    portion: '12 Porsi',
    expiry: '1 jam',
  },
  {
    id: '14',
    storeName: 'Breadtalk Sisa Malam',
    foodType: 'roti-pastry',
    categoryLabel: 'Roti & Pastry',
    foodName: 'Roti Kasur Keju',
    distance: '0.9 km',
    portion: '30 Pcs',
    expiry: '6 jam',
  },
  {
    id: '15',
    storeName: 'Jajan Pasar Mbak Yem',
    foodType: 'jajanan-kue',
    categoryLabel: 'Jajanan & Kue',
    foodName: 'Putu Ayu & Nagasari',
    distance: '3.5 km',
    portion: '16 Pcs',
    expiry: '2 jam',
  },
];
