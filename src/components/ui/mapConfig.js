import { env } from '../../lib/env/index.js';

export const DEFAULT_MAP_TILE_URLS = [
  'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  'https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
];

function parseTileUrls(value) {
  return value
    ? value.split(',').map((url) => url.trim()).filter(Boolean)
    : DEFAULT_MAP_TILE_URLS;
}

export const MAPCN_LIGHT_STYLE = {
  version: 8,
  sources: {
    base: {
      type: 'raster',
      tiles: parseTileUrls(env.MAP_TILE_URLS),
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    },
  },
  layers: [
    {
      id: 'base',
      type: 'raster',
      source: 'base',
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
