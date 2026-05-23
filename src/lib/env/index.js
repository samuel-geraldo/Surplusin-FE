const viteEnv = import.meta.env ?? {};

export const env = {
  API_BASE_URL: viteEnv.VITE_API_BASE_URL || 'https://surplusin-be-h4yi.vercel.app/api',
  APP_NAME: viteEnv.VITE_APP_NAME || 'SurplusIn',
  MAP_TILE_URLS: viteEnv.VITE_MAP_TILE_URLS || '',
  GEOCODING_SEARCH_URL: viteEnv.VITE_GEOCODING_SEARCH_URL || '',
  GOOGLE_MAPS_API_KEY: viteEnv.VITE_GOOGLE_MAPS_API_KEY || '',
};
