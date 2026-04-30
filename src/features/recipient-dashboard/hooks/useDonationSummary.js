import { useState, useEffect } from 'react';
import { getDonationSummary } from '@/services/api/recipient';

/**
 * Hook untuk mengambil data ringkasan donasi recipient.
 *
 * Mengembalikan { data, isLoading, error } — pola yang sama
 * yang akan digunakan setelah migrasi ke API nyata.
 *
 * @returns {{ data: import('@/features/recipient-dashboard/data/mockRecipientDashboardData').DonationSummary | null, isLoading: boolean, error: string | null }}
 */
export function useDonationSummary() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getDonationSummary();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err?.message ?? 'Gagal memuat data');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  return { data, isLoading, error };
}
