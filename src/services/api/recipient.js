/**
 * Recipient Dashboard API Service
 *
 * Layer ini memisahkan logika pengambilan data dari komponen UI.
 * Saat ini menggunakan mock data. Ketika Backend Team sudah mengirim
 * endpoint-nya, ganti implementasi di fungsi-fungsi di bawah ini —
 * komponen yang menggunakannya TIDAK perlu diubah sama sekali.
 *
 * Contoh migrasi ke API nyata:
 *   import apiClient from '@/services/api/client';
 *   export async function getDonationSummary() {
 *     const { data } = await apiClient.get('/recipient/donations/summary');
 *     return data;
 *   }
 */

import { mockDonationSummary } from '@/features/recipient-dashboard/data/mockRecipientDashboardData';

/**
 * Mengambil ringkasan donasi untuk penerima yang sedang login.
 *
 * @returns {Promise<import('@/features/recipient-dashboard/data/mockRecipientDashboardData').DonationSummary>}
 *
 * TODO: Ganti body fungsi ini dengan pemanggilan API nyata ketika endpoint tersedia:
 *   const { data } = await apiClient.get('/recipient/donations/summary');
 *   return data;
 */
export async function getDonationSummary() {
  // Simulasi network delay supaya loading state bisa diuji
  await new Promise((resolve) => setTimeout(resolve, 400));
  return mockDonationSummary;
}
