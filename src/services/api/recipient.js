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

import { mockDonationSummary, mockDonations, MOCK_CATEGORIES } from '@/features/recipient-dashboard/data/mockRecipientDashboardData';

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

export async function getDonations(search = '', category = 'semua') {
  await new Promise((resolve) => setTimeout(resolve, 400));
  let filtered = [...mockDonations];
  
  if (category && category !== 'semua') {
    filtered = filtered.filter(item => item.foodType === category);
  }
  
  if (search && search.trim() !== '') {
    const q = search.toLowerCase();
    filtered = filtered.filter(item => 
      item.storeName.toLowerCase().includes(q) || 
      item.foodName.toLowerCase().includes(q)
    );
  }
  
  return filtered;
}

export async function getFoodCategories() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_CATEGORIES;
}
