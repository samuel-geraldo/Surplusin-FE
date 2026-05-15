import { env } from '../../lib/env/index.js';

export const DEFAULT_MAPCN_STYLE_URL = 'https://tiles.openfreemap.org/styles/bright';

export const MAPCN_LIGHT_STYLE = env.MAP_TILE_URLS || DEFAULT_MAPCN_STYLE_URL;

export const MAPCN_LIGHT_STYLES = {
  light: MAPCN_LIGHT_STYLE,
  dark: MAPCN_LIGHT_STYLE,
};

export function getMapStyleForTheme(theme = 'light', styles = MAPCN_LIGHT_STYLES) {
  return theme === 'dark' ? styles.dark : styles.light;
}
