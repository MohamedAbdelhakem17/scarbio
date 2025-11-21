import { z } from 'zod';

export const contactUsSchema = z.object({
  first_name: z
    .string()
    .min(3, 'First name must be at least 3 characters')
    .max(20, 'First name must not exceed 20 characters')
    .regex(/^[A-Za-z\s]+$/, 'First name should only contain letters'),

  last_name: z
    .string()
    .min(3, 'Last name must be at least 3 characters')
    .max(20, 'Last name must not exceed 20 characters')
    .regex(/^[A-Za-z\s]+$/, 'Last name should only contain letters'),

  email: z.string().email('Please enter a valid email address'),

  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must not exceed 15 digits'),
  message: z
    .string()
    .min(10, 'Message should be at least 10 characters')
    .max(500, 'Message should not exceed 500 characters')
    .optional(),
});

export type ContactUsType = z.infer<typeof contactUsSchema>;
