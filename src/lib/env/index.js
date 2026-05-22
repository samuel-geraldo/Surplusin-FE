const viteEnv = import.meta.env ?? {};

export const env = {
  API_BASE_URL: viteEnv.VITE_API_BASE_URL || 'http://localhost:3000/api',
  APP_NAME: viteEnv.VITE_APP_NAME || 'SurplusIn',
  MAP_TILE_URLS: viteEnv.VITE_MAP_TILE_URLS || '',
  GEOCODING_SEARCH_URL: viteEnv.VITE_GEOCODING_SEARCH_URL || '',

  // Set ke false ketika backend sudah siap dan deploy
  USE_MOCK_API: viteEnv.VITE_USE_MOCK_API !== 'false',
};
