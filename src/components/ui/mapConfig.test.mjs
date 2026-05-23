import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  DEFAULT_MAP_TILE_URLS,
  MAPCN_LIGHT_STYLE,
  MAPCN_LIGHT_STYLES,
  getMapStyleForTheme,
} from './mapConfig.js';

describe('mapcn map config', () => {
  it('uses the default raster tile style for every theme', () => {
    assert.deepEqual(DEFAULT_MAP_TILE_URLS, [
      'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      'https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    ]);
    assert.equal(MAPCN_LIGHT_STYLE.version, 8);
    assert.deepEqual(MAPCN_LIGHT_STYLE.sources.base.tiles, DEFAULT_MAP_TILE_URLS);
    assert.equal(MAPCN_LIGHT_STYLES.light, MAPCN_LIGHT_STYLE);
    assert.equal(MAPCN_LIGHT_STYLES.dark, MAPCN_LIGHT_STYLE);
    assert.equal(getMapStyleForTheme('light'), MAPCN_LIGHT_STYLE);
    assert.equal(getMapStyleForTheme('dark'), MAPCN_LIGHT_STYLE);
  });
});
