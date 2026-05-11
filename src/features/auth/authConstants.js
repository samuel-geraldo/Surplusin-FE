export const AUTH_STEPS = {
  ROLE_SELECTION: 'role-selection',
  LOGIN: 'login',
  FORGOT_PASSWORD: 'forgot-password',
  REGISTER_ACCOUNT: 'register-account',
  PROFILE_COMPLETION: 'profile-completion',
  REGISTERED: 'registered',
  AUTHENTICATED: 'authenticated',
};

export const AUTH_ROLES = {
  RETAILER: 'retailer',
  RECIPIENT: 'recipients',
  ADMIN: 'admin',
  USER: 'user',
};

export const ROLE_OPTIONS = [
  {
    value: AUTH_ROLES.RETAILER,
    label: 'Penyalur (Pedagang/Toko)',
    shortLabel: 'Penyalur',
    description:
      'Salurkan sisa produk Anda dengan cepat kepada mereka yang membutuhkan. Pantau dampak lingkungan Anda secara real-time.',
    cta: 'Pilih Penyalur',
  },
  {
    value: AUTH_ROLES.RECIPIENT,
    label: 'Penerima (Panti/Lainnya)',
    shortLabel: 'Penerima',
    description:
      'Terima donasi pangan untuk yayasan/komunitas Anda. Kelola logistik penerimaan dengan sistem inventori cerdas kami.',
    cta: 'Pilih Penerima',
  },
];

export const PROFILE_CATEGORY_OPTIONS = [
  { value: 'warung', label: 'Warung/Toko' },
  { value: 'restoran', label: 'Restoran/Kafe' },
  { value: 'yayasan', label: 'Yayasan' },
  { value: 'komunitas', label: 'Komunitas' },
  { value: 'lainnya', label: 'Lainnya' },
];

export const ROLE_DESTINATIONS = {
  [AUTH_ROLES.RETAILER]: 'retailer-dashboard',
  [AUTH_ROLES.RECIPIENT]: 'recipient-dashboard',
  [AUTH_ROLES.ADMIN]: 'admin-dashboard',
  [AUTH_ROLES.USER]: 'role-completion',
};

export function getRoleDestination(role) {
  return ROLE_DESTINATIONS[role] ?? 'role-completion';
}

export function buildRegisterPayload(accountData, profileData) {
  return {
    name: profileData.name.trim(),
    age: Number(accountData.age),
    email: accountData.email.trim(),
    password: accountData.password,
    role: accountData.role,
  };
}

export function decodeJwtPayload(token) {
  const payload = token?.split('.')?.[1];

  if (!payload) {
    return null;
  }

  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '=',
    );
    const decoded = globalThis.atob(padded);
    const json = decodeURIComponent(
      decoded
        .split('')
        .map((character) => {
          const hex = character.charCodeAt(0).toString(16).padStart(2, '0');
          return `%${hex}`;
        })
        .join(''),
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
}

