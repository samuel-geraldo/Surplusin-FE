import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  buildAddressSearchUrl,
  mapNominatimResult,
  shouldSearchAddress,
} from './locationSearch.js';

describe('location search', () => {
  it('waits for useful address input', () => {
    assert.equal(shouldSearchAddress('Ja'), false);
    assert.equal(shouldSearchAddress('Jak'), true);
  });

  it('builds Indonesian Nominatim search URL', () => {
    const url = buildAddressSearchUrl('Jakarta Selatan');

    assert.equal(url.origin, 'https://nominatim.openstreetmap.org');
    assert.equal(url.searchParams.get('q'), 'Jakarta Selatan');
    assert.equal(url.searchParams.get('countrycodes'), 'id');
    assert.equal(url.searchParams.get('limit'), '5');
  });

  it('maps Nominatim result into picker option', () => {
    assert.deepEqual(
      mapNominatimResult({
        place_id: 123,
        display_name: 'Jl. Sudirman, Jakarta',
        lon: '106.823',
        lat: '-6.214',
      }),
      {
        id: 123,
        label: 'Jl. Sudirman, Jakarta',
        center: [106.823, -6.214],
      },
    );
  });
});
