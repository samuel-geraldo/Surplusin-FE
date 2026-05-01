import { env } from '../../../lib/env/index.js';

const NOMINATIM_SEARCH_URL =
  env.GEOCODING_SEARCH_URL || 'https://nominatim.openstreetmap.org/search';

export function shouldSearchAddress(query) {
  return query.trim().length >= 3;
}

export function buildAddressSearchUrl(query) {
  const url = new URL(NOMINATIM_SEARCH_URL);

  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('limit', '5');
  url.searchParams.set('countrycodes', 'id');
  url.searchParams.set('q', query.trim());

  return url;
}

export function mapNominatimResult(result) {
  return {
    id: result.place_id,
    label: result.display_name,
    center: [Number(result.lon), Number(result.lat)],
  };
}

export async function searchAddresses(query, signal) {
  if (!shouldSearchAddress(query)) {
    return [];
  }

  const response = await fetch(buildAddressSearchUrl(query), {
    headers: {
      Accept: 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    throw new Error('Address search failed');
  }

  const results = await response.json();
  return results.map(mapNominatimResult);
}
