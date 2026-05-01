import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  MAPCN_LIGHT_STYLE,
  MAPCN_LIGHT_STYLES,
  getMapStyleForTheme,
} from './mapConfig.js';

describe('mapcn map config', () => {
  it('forces light map style for every theme', () => {
    assert.equal(MAPCN_LIGHT_STYLE.version, 8);
    assert.equal(MAPCN_LIGHT_STYLE.sources.carto.type, 'raster');
    assert.equal(MAPCN_LIGHT_STYLE.layers[0].source, 'carto');
    assert.equal(MAPCN_LIGHT_STYLES.light, MAPCN_LIGHT_STYLE);
    assert.equal(MAPCN_LIGHT_STYLES.dark, MAPCN_LIGHT_STYLE);
    assert.equal(getMapStyleForTheme('light'), MAPCN_LIGHT_STYLE);
    assert.equal(getMapStyleForTheme('dark'), MAPCN_LIGHT_STYLE);
  });
});
