import { env } from '../../lib/env/index.js';

const DEFAULT_TILE_URLS = [
  'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  'https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
];

function getTileUrls() {
  return env.MAP_TILE_URLS
    ? env.MAP_TILE_URLS.split(',').map((url) => url.trim()).filter(Boolean)
    : DEFAULT_TILE_URLS;
}

export const MAPCN_LIGHT_STYLE = {
  version: 8,
  sources: {
    carto: {
      type: 'raster',
      tiles: getTileUrls(),
      tileSize: 256,
      attribution: '© OpenStreetMap contributors © CARTO',
    },
  },
  layers: [
    {
      id: 'carto',
      type: 'raster',
      source: 'carto',
    },
  ],
};

export const MAPCN_LIGHT_STYLES = {
  light: MAPCN_LIGHT_STYLE,
  dark: MAPCN_LIGHT_STYLE,
};

export function getMapStyleForTheme(theme = 'light', styles = MAPCN_LIGHT_STYLES) {
  return theme === 'dark' ? styles.dark : styles.light;
}
