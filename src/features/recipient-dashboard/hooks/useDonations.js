import { useState, useEffect } from 'react';
import { getDonations, getFoodCategories } from '@/services/api/recipient';

export function useDonations() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('semua');

  useEffect(() => {
    let cancelled = false;
    
    async function fetchCategories() {
      try {
        const result = await getFoodCategories();
        if (!cancelled) setCategories(result);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCategories();
    
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getDonations(search, category);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err?.message ?? 'Gagal memuat daftar donasi');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    // Simple debounce can be added here if needed, 
    // but for mock data we can just fetch immediately
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => { 
      cancelled = true; 
      clearTimeout(timeoutId);
    };
  }, [search, category]);

  return { 
    data, isLoading, error, 
    search, setSearch, 
    category, setCategory, 
    categories 
  };
}
