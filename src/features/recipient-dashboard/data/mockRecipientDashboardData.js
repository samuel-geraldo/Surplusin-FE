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
