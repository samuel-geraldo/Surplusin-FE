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

export function getGoogleAuthUrl() {
  return `${env.API_BASE_URL}/auth/google`;
}

export function getAuthErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback ||
    'Terjadi kesalahan pada server'
  );
}

