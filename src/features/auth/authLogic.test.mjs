import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  loginSchema,
  profileSchema,
  registerAccountSchema,
} from './authSchemas.js';
import {
  AUTH_ROLES,
  buildRegisterPayload,
  decodeJwtPayload,
  getRoleDestination,
} from './authConstants.js';

describe('auth schemas', () => {
  it('requires backend-compatible register account fields', () => {
    const result = registerAccountSchema.safeParse({
      email: 'retailer@example.com',
      password: 'secret1',
      age: '29',
      role: AUTH_ROLES.RETAILER,
    });

    assert.equal(result.success, true);
    assert.equal(result.data.age, 29);
    assert.equal(result.data.role, 'retailer');
  });

  it('rejects invalid login credentials', () => {
    const result = loginSchema.safeParse({
      email: 'bad-email',
      password: '123',
    });

    assert.equal(result.success, false);
  });

  it('requires profile name before register submit', () => {
    const result = profileSchema.safeParse({
      name: '',
      category: '',
      whatsapp: '08123456789',
      address: '',
      locationConfirmed: false,
    });

    assert.equal(result.success, false);
  });

  it('requires confirmed location before register submit', () => {
    const result = profileSchema.safeParse({
      name: 'Toko Pangan',
      category: 'warung',
      whatsapp: '08123456789',
      address: 'Jakarta',
      locationConfirmed: false,
    });

    assert.equal(result.success, false);
  });
});

describe('auth helpers', () => {
  it('builds register payload with backend role fields', () => {
    const payload = buildRegisterPayload(
      {
        email: 'recipient@example.com',
        password: 'secret1',
        age: 35,
        role: AUTH_ROLES.RECIPIENT,
      },
      {
        name: 'Yayasan Pangan',
        category: 'Yayasan',
        whatsapp: '08123456789',
        address: 'Jakarta',
        locationConfirmed: true,
      },
    );

    assert.deepEqual(payload, {
      name: 'Yayasan Pangan',
      age: 35,
      email: 'recipient@example.com',
      password: 'secret1',
      role: 'recipients',
      selectedRole: 'penerima',
    });
  });

  it('decodes a JWT payload without verifying the token', () => {
    const payload = Buffer.from(
      JSON.stringify({ id: 'user-1', role: 'retailer', email: 'r@example.com' }),
    ).toString('base64url');
    const decoded = decodeJwtPayload(`header.${payload}.signature`);

    assert.deepEqual(decoded, {
      id: 'user-1',
      role: 'retailer',
      email: 'r@example.com',
    });
  });

  it('maps roles to dashboard routes', () => {
    assert.equal(getRoleDestination('retailer'), '/retailer/dashboard');
    assert.equal(getRoleDestination('penyalur'), '/retailer/dashboard');
    assert.equal(getRoleDestination('recipients'), '/recipient/dashboard');
    assert.equal(getRoleDestination('recipient'), '/recipient/dashboard');
    assert.equal(getRoleDestination('penerima'), '/recipient/dashboard');
    assert.equal(getRoleDestination('user'), '/auth');
  });
});
