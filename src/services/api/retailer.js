import { apiClient } from '@/services/api';

export function getRetailerErrorMessage(error, fallback = 'Terjadi kesalahan. Coba lagi.') {
  const rawMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    '';

  if (/failed query|select\s+"|from\s+"|params:/i.test(rawMessage)) {
    return 'Data profil retailer belum lengkap atau belum ditemukan. Lengkapi profil retailer dulu.';
  }

  if (/penyalur not found/i.test(rawMessage)) {
    return 'Data profil retailer belum lengkap. Lengkapi profil retailer dulu.';
  }

  return rawMessage || fallback;
}

export async function getRetailerDonations() {
  const response = await apiClient.get('/donasi/penyalur-login');
  return response.data;
}

export async function createRetailerDonation(payload) {
  const response = await apiClient.post('/donasi/tambah', payload);
  return response.data;
}

export async function deleteRetailerDonation(id) {
  const response = await apiClient.delete(`/donasi/${id}`);
  return response.data;
}

export async function getRetailerActiveClaims() {
  const response = await apiClient.get('/klaim/penyalur/aktif');
  return (Array.isArray(response.data) ? response.data : []).map((claim) => ({
    id: claim.klaim_id ?? claim.id,
    status: claim.status,
    nama_instansi: claim.nama_penerima ?? claim.nama_instansi ?? '-',
    nama_donasi: claim.nama_donasi ?? '-',
    jumlah: claim.jumlah ?? 0,
    satuan: claim.satuan ?? '',
    claimed_at: claim.claimed_at,
    alamat: claim.alamat_penerima ?? claim.alamat ?? '',
    latitude: claim.latitude_penerima,
    longitude: claim.longitude_penerima,
    nomor_whatsapp: claim.nomor_whatsapp_penerima ?? '',
    item_detail: claim.item_detail ?? '',
  }));
}

export async function getRetailerProfile() {
  const response = await apiClient.get('/penyalur/data');
  const data = response.data;

  return {
    storeName: data?.nama_toko ?? '',
    category: data?.kategori ?? '',
    whatsapp: data?.nomor_whatsapp ?? '',
    address: data?.alamat ?? '',
    landmark: data?.patokan ?? '',
    latitude: Number(data?.latitude ?? -6.2088),
    longitude: Number(data?.longitude ?? 106.8456),
  };
}

export async function updateRetailerProfile(profile) {
  const response = await apiClient.put('/penyalur/me', {
    nama_toko: profile.storeName,
    kategori: profile.category,
    nomor_whatsapp: profile.whatsapp,
    alamat: profile.address,
    patokan: profile.landmark || undefined,
    latitude: profile.latitude,
    longitude: profile.longitude,
  });

  return response.data;
}

export async function getRetailerHistory() {
  const response = await apiClient.get('/donasi/riwayat-penyerahan');
  return Array.isArray(response.data) ? response.data : [];
}
