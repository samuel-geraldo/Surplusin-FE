import { env } from '@/lib/env';
import { apiClient } from '@/services/api';

export async function registerUser(payload) {
  const response = await apiClient.post('/auth/register', payload);
  return response.data;
}

export async function loginUser(payload) {
  const response = await apiClient.post('/auth/login', payload);
  return response.data;
}

export async function logoutUser() {
  const response = await apiClient.post('/auth/logout');
  return response.data;
}

export async function createRoleProfile({ role, userId, profileData }) {
  const isRetailer = role === 'penyalur' || role === 'retailer';
  const response = await apiClient.post(isRetailer ? '/penyalur' : '/penerima', {
    [isRetailer ? 'nama_toko' : 'nama_instansi']: profileData.name.trim(),
    kategori: mapProfileCategory(profileData.category, isRetailer),
    nomor_whatsapp: profileData.whatsapp?.trim() || '-',
    alamat: profileData.address?.trim() || '-',
    latitude: Number(profileData.latitude ?? -6.2088),
    longitude: Number(profileData.longitude ?? 106.8456),
    user_id: Number(userId),
  });

  return response.data;
}

function mapProfileCategory(category, isRetailer) {
  if (isRetailer) {
    if (category === 'restoran') return 'Makanan Siap Saji';
    if (category === 'warung') return 'Jajanan & Kue';
    return 'Roti & Pastry';
  }

  if (category === 'yayasan') return 'Yayasan Sosial';
  if (category === 'lainnya') return 'Lainnya';
  return 'Yayasan Sosial';
}

const GOOGLE_ROLE_MAP = {
  retailer: 'penyalur',
  recipients: 'penerima',
  penyalur: 'penyalur',
  penerima: 'penerima',
};

export function getGoogleAuthUrl(role) {
  const backendRole = GOOGLE_ROLE_MAP[role];

  if (!backendRole) {
    throw new Error('Role tidak valid');
  }

  const url = new URL(`${env.API_BASE_URL}/auth/google`);
  url.searchParams.set('role', backendRole);
  return url.toString();
}

export function getAuthErrorMessage(error, fallback) {
  return (
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    fallback ||
    'Terjadi kesalahan pada server'
  );
}
