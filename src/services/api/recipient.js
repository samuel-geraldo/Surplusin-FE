/**
 * Recipient Dashboard API Service
 *
 * Layer ini memisahkan logika pengambilan data dari komponen UI.
 * Menggunakan flag `USE_MOCK` dari environment variable untuk menentukan
 * apakah data diambil dari mock atau dari real API.
 *
 * Ketika backend sudah siap:
 *   1. Set VITE_USE_MOCK_API=false di file .env
 *   2. Pastikan VITE_API_BASE_URL mengarah ke backend yang benar
 *   3. Tidak perlu mengubah komponen UI sama sekali
 *
 * Endpoint backend reference (Surplusin-BE):
 *   GET  /api/penerima/nearby            → donasi terdekat dari lokasi penerima
 *   GET  /api/penerima/data              → data profil penerima (by JWT)
 *   PUT  /api/penerima/me                → update profil penerima (by JWT)
 *   POST /api/klaim/:donasi_id           → klaim sebuah donasi
 *   PUT  /api/klaim/:id                  → update status klaim (on_the_way, arrived, completed)
 *   GET  /api/klaim/penerima/aktif       → klaim aktif milik penerima (handover)
 *   GET  /api/donasi/riwayat-penerima    → riwayat donasi yang sudah selesai
 *   GET  /api/donasi/statistik           → statistik donasi (total_diklaim, total_diterima)
 */

import apiClient from './client';
import { env } from '@/lib/env';

const USE_MOCK = env.USE_MOCK_API;

// ────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────

/** Simulasi network delay untuk mock data (supaya loading state bisa diuji) */
const mockDelay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mapping kategori value FE → label kategori BE.
 * Backend menggunakan label lengkap (e.g. "Makanan Siap Saji"),
 * sedangkan FE menggunakan slug (e.g. "makanan-siap-saji").
 */
const CATEGORY_SLUG_TO_BE = {
  'makanan-siap-saji': 'Makanan Siap Saji',
  'roti-pastry': 'Roti & Pastry',
  'jajanan-kue': 'Jajanan & Kue',
};

// ────────────────────────────────────────────
// Donation Summary
// ────────────────────────────────────────────

/**
 * Mengambil ringkasan donasi untuk penerima yang sedang login.
 *
 * Real API: GET /api/donasi/statistik
 * Response: { total_diklaim: number, total_diterima: number }
 * → di-mapping ke shape { available, claimed } yang dipakai UI.
 *
 * @returns {Promise<{ available: number, claimed: number }>}
 */
export async function getDonationSummary() {
  if (USE_MOCK) {
    await mockDelay(400);
    return mockDonationSummary;
  }

  const { data } = await apiClient.get('/donasi/statistik');
  return {
    available: data.total_diklaim ?? 0,
    claimed: data.total_diterima ?? 0,
  };
}

// ────────────────────────────────────────────
// Donations List (nearby)
// ────────────────────────────────────────────

/**
 * Mengambil daftar donasi yang tersedia di sekitar penerima.
 * Mendukung filter berdasarkan search query dan kategori.
 *
 * Real API: GET /api/penerima/nearby
 * Response: { total_donasi: number, donasi: Array<NearbyDonasi> }
 *
 * NearbyDonasi shape dari BE:
 *   { id, nama, kategori, jumlah, satuan, item_detail, expired_at,
 *     status, penyalur_id, nama_toko, penyalur_latitude, penyalur_longitude,
 *     alamat, jarak_km }
 *
 * → di-mapping ke shape yang dipakai UI component (DonationListCard).
 *
 * @param {string} search - Kata kunci pencarian
 * @param {string} category - Slug kategori ('semua' | 'makanan-siap-saji' | etc.)
 * @returns {Promise<Array>}
 */
export async function getDonations(search = '', category = 'semua') {
  if (USE_MOCK) {
    await mockDelay(400);
    let filtered = [...mockDonations];

    if (category && category !== 'semua') {
      filtered = filtered.filter((item) => item.foodType === category);
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.storeName.toLowerCase().includes(q) ||
          item.foodName.toLowerCase().includes(q),
      );
    }

    return filtered;
  }

  // Real API — ambil semua nearby lalu filter di client
  const { data } = await apiClient.get('/penerima/nearby');
  let donations = (data.donasi ?? []).map(mapNearbyDonasiToUI);

  // Filter kategori di client (BE nearby tidak support filter kategori langsung)
  if (category && category !== 'semua') {
    donations = donations.filter((item) => item.foodType === category);
  }

  // Filter search di client
  if (search && search.trim() !== '') {
    const q = search.toLowerCase();
    donations = donations.filter(
      (item) =>
        item.storeName.toLowerCase().includes(q) ||
        item.foodName.toLowerCase().includes(q),
    );
  }

  return donations;
}

// ────────────────────────────────────────────
// Food Categories
// ────────────────────────────────────────────

/**
 * Mengambil daftar kategori makanan untuk filter dropdown.
 *
 * Saat ini kategori bersifat static (sesuai enum di BE schema).
 * Jika nantinya BE menyediakan endpoint dynamic categories, tinggal
 * ganti body fungsi ini.
 *
 * @returns {Promise<Array<{ value: string, label: string }>>}
 */
export async function getFoodCategories() {
  if (USE_MOCK) {
    await mockDelay(200);
  }
  // Kategori bersifat static di BE (enum), jadi kita return constant
  return MOCK_CATEGORIES;
}

// ────────────────────────────────────────────
// Claim Donation
// ────────────────────────────────────────────

export async function claimDonation(donasiId) {
  if (USE_MOCK) {
    await mockDelay(500);
    // Note: Frontend writes to localStorage directly in DonationListCard for mock flow
    return { id: Date.now(), donasi_id: donasiId, status: 'claimed' };
  }

  const { data } = await apiClient.post(`/klaim/${donasiId}`);
  return data;
}

// ────────────────────────────────────────────
// Active Handovers (Donasi Sedang Dijemput)
// ────────────────────────────────────────────

/**
 * Mengambil daftar donasi yang sedang dalam proses penjemputan.
 *
 * Real API: GET /api/klaim/penerima/aktif
 * Response: Array<{ klaim_id, status, penyalur, nama_donasi, jumlah,
 *                    satuan, claimed_at, alamat_penyalur,
 *                    latitude_penyalur, longitude_penyalur }>
 *
 * @returns {Promise<Array>}
 */
export async function getActiveHandovers() {
  if (USE_MOCK) {
    await mockDelay(300);
    try {
      const stored = localStorage.getItem('surplusin_claimed_donations');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  const { data } = await apiClient.get('/klaim/penerima/aktif');
  return (Array.isArray(data) ? data : []).map(mapActiveHandoverToUI);
}

// ────────────────────────────────────────────
// Update Claim Status
// ────────────────────────────────────────────

/**
 * Update status klaim (tracking penjemputan).
 *
 * Real API: PUT /api/klaim/:id
 * Body: { status: 'on_the_way' | 'arrived' | 'completed' }
 *
 * @param {string|number} klaimId - ID klaim
 * @param {'on_the_way'|'arrived'|'completed'} status - Status baru
 * @returns {Promise<Object>} updated klaim
 */
export async function updateClaimStatus(klaimId, status) {
  if (USE_MOCK) {
    await mockDelay(300);
    return { id: klaimId, status };
  }

  const { data } = await apiClient.put(`/klaim/${klaimId}`, { status });
  return data;
}

// ────────────────────────────────────────────
// Recipient Profile
// ────────────────────────────────────────────

/**
 * Mengambil data profil penerima berdasarkan JWT token.
 *
 * Real API: GET /api/penerima/data
 * Response: [{ nama_instansi, kategori, nomor_whatsapp, alamat,
 *              latitude, longitude, patokan }]
 *
 * @returns {Promise<Object>} data penerima
 */
export async function getRecipientProfile() {
  if (USE_MOCK) {
    await mockDelay(300);
    return {
      id: 1, // Fallback ID for testing updates
      nama_instansi: 'Panti Asuhan Kasih Ibu',
      kategori: 'Panti Asuhan',
      nomor_whatsapp: '081234567890',
      alamat: 'Jl. Kebaikan No. 10, Jakarta Selatan',
      latitude: -6.2088,
      longitude: 106.8456,
      patokan: 'Sebelah minimarket, pintu warna biru',
    };
  }

  const { data } = await apiClient.get('/penerima/data');
  // BE returns array, ambil elemen pertama
  return Array.isArray(data) ? data[0] : data;
}

/**
 * Memperbarui data profil penerima.
 *
 * Real API: PUT /api/penerima/me (JWT-based, tidak perlu ID)
 *
 * @param {Object} payload - Data profile (nama_instansi, kategori, dll)
 * @returns {Promise<Object>} updated profil
 */
export async function updateRecipientProfile(payload) {
  if (USE_MOCK) {
    await mockDelay(500);
    return { ...payload };
  }

  const { data } = await apiClient.put('/penerima/me', payload);
  return data;
}

// ────────────────────────────────────────────
// Donation History
// ────────────────────────────────────────────

/**
 * Mengambil riwayat donasi yang sudah selesai (completed).
 *
 * Real API: GET /api/donasi/riwayat-penerima
 * Response: Array<{ nama_toko, alamat, nama_donasi, total_porsi,
 *                    jumlah_donasi, terakhir }>
 *
 * @returns {Promise<Array>}
 */
export async function getDonationHistory() {
  if (USE_MOCK) {
    await mockDelay(400);
    return [];
  }

  const { data } = await apiClient.get('/donasi/riwayat-penerima');
  return (Array.isArray(data) ? data : []).map(mapHistoryToUI);
}

// ────────────────────────────────────────────
// Data Mapper: BE → FE UI Shape
// ────────────────────────────────────────────

/**
 * Maps a single nearby donasi object dari BE ke shape yang dipakai
 * oleh DonationListCard component.
 *
 * BE Shape → FE Shape mapping:
 *   nama_toko        → storeName
 *   nama             → foodName
 *   kategori         → categoryLabel + foodType (slug)
 *   jumlah + satuan  → portion (e.g. "10 Porsi")
 *   jarak_km         → distance (e.g. "1.2 km")
 *   expired_at       → expiry (human-readable)
 *   alamat           → alamat (patokan)
 *   item_detail      → items (parsed dari string)
 */
function mapNearbyDonasiToUI(donasi) {
  const categorySlug = Object.entries(CATEGORY_SLUG_TO_BE).find(
    ([, label]) => label === donasi.kategori,
  )?.[0] ?? 'makanan-siap-saji';

  return {
    id: String(donasi.id),
    storeName: donasi.nama_toko,
    foodType: categorySlug,
    categoryLabel: donasi.kategori,
    foodName: donasi.nama,
    distance: `${donasi.jarak_km.toFixed(1)} km`,
    portion: `${donasi.jumlah} ${donasi.satuan}`,
    expiry: formatExpiry(donasi.expired_at),
    patokan: donasi.alamat ?? '',
    lat: parseFloat(donasi.penyalur_latitude),
    lng: parseFloat(donasi.penyalur_longitude),
    items: parseItemDetail(donasi.item_detail),
    estimasi: estimatePickupTime(donasi.jarak_km),
  };
}

/**
 * Format expired_at timestamp ke human-readable string.
 * Contoh: "2 jam", "45 mnt", "Kadaluwarsa"
 */
function formatExpiry(expiredAt) {
  const diff = new Date(expiredAt).getTime() - Date.now();
  if (diff <= 0) return 'Kadaluwarsa';

  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} mnt`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours} jam`;
  return `${hours} jam ${remainingMinutes} mnt`;
}

/**
 * Parse item_detail string dari BE ke array.
 * BE menyimpan sebagai text, bisa comma-separated atau newline-separated.
 */
function parseItemDetail(itemDetail) {
  if (!itemDetail) return [];
  return itemDetail
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Estimasi waktu penjemputan berdasarkan jarak.
 * Asumsi kecepatan rata-rata 20 km/jam (kondisi kota).
 */
function estimatePickupTime(distanceKm) {
  const minutes = Math.ceil((distanceKm / 20) * 60);
  if (minutes < 5) return '5 menit';
  return `${Math.ceil(minutes / 5) * 5} menit`;
}

/**
 * Maps a single active handover/klaim object from BE to shape
 * expected by RecipientHandoverPage component.
 *
 * BE Shape → FE Shape mapping:
 *   klaim_id            → id
 *   penyalur             → storeName
 *   nama_donasi          → foodName
 *   jumlah + satuan      → portion
 *   status               → status
 *   alamat_penyalur      → patokan
 *   latitude_penyalur    → lat
 *   longitude_penyalur   → lng
 *   claimed_at           → expiry (for display)
 */
function mapActiveHandoverToUI(klaim) {
  return {
    id: klaim.klaim_id,
    storeName: klaim.penyalur || 'Toko Mitra',
    foodName: klaim.nama_donasi || 'Donasi',
    portion: `${klaim.jumlah ?? ''} ${klaim.satuan ?? ''}`.trim() || '-',
    status: klaim.status || 'claimed',
    patokan: klaim.alamat_penyalur || '-',
    lat: klaim.latitude_penyalur ? parseFloat(klaim.latitude_penyalur) : null,
    lng: klaim.longitude_penyalur ? parseFloat(klaim.longitude_penyalur) : null,
    expiry: klaim.claimed_at ? new Date(klaim.claimed_at).toLocaleString('id-ID') : '-',
    items: [], // BE doesn't return item_detail for active handovers
  };
}

/**
 * Maps a single riwayat donasi object from BE to shape
 * expected by RecipientHistoryPage component.
 *
 * BE Shape → FE Shape mapping:
 *   nama_toko      → storeName
 *   alamat          → location
 *   nama_donasi     → foodName
 *   total_porsi     → portion (e.g. "60 Porsi")
 *   jumlah_donasi   → donationCount
 *   terakhir        → date (formatted to locale string)
 */
function mapHistoryToUI(item, index) {
  return {
    id: `history-${index}`,
    storeName: item.nama_toko || '-',
    location: item.alamat || '-',
    foodName: item.nama_donasi || '-',
    portion: item.total_porsi ? `${item.total_porsi} Porsi` : '-',
    donationCount: item.jumlah_donasi || 0,
    date: item.terakhir
      ? new Date(item.terakhir).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : '-',
  };
}
