import { z } from 'zod';
import { AUTH_ROLES } from './authConstants.js';

const requiredText = 'Wajib diisi';
const emailMessage = 'Email tidak valid';
const passwordMessage = 'Kata sandi minimal 6 karakter';

export const loginSchema = z.object({
  email: z.string().trim().min(1, requiredText).email(emailMessage),
  password: z.string().min(6, passwordMessage),
});

export const registerAccountSchema = z.object({
  email: z.string().trim().min(1, requiredText).email(emailMessage),
  password: z.string().min(6, passwordMessage),
  age: z.coerce
    .number({ error: requiredText })
    .int('Usia harus berupa angka bulat')
    .positive('Usia harus lebih dari 0'),
  role: z.enum([AUTH_ROLES.RETAILER, AUTH_ROLES.RECIPIENT]),
});

export const profileSchema = z.object({
  name: z.string().trim().min(1, 'Nama wajib diisi'),
  category: z.string().optional(),
  whatsapp: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^[0-9+\-\s()]{8,20}$/.test(value), {
      message: 'Nomor WhatsApp tidak valid',
    }),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  locationConfirmed: z.boolean().optional(),
});
