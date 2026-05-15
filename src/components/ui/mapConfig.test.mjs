import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  DEFAULT_MAPCN_STYLE_URL,
  MAPCN_LIGHT_STYLE,
  MAPCN_LIGHT_STYLES,
  getMapStyleForTheme,
} from './mapConfig.js';

describe('mapcn map config', () => {
  it('uses the mapcn default style URL for every theme', () => {
    assert.equal(DEFAULT_MAPCN_STYLE_URL, 'https://tiles.openfreemap.org/styles/bright');
    assert.equal(MAPCN_LIGHT_STYLE, DEFAULT_MAPCN_STYLE_URL);
    assert.equal(MAPCN_LIGHT_STYLES.light, MAPCN_LIGHT_STYLE);
    assert.equal(MAPCN_LIGHT_STYLES.dark, MAPCN_LIGHT_STYLE);
    assert.equal(getMapStyleForTheme('light'), MAPCN_LIGHT_STYLE);
    assert.equal(getMapStyleForTheme('dark'), MAPCN_LIGHT_STYLE);
  });
});
