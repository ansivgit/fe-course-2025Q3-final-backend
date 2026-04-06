import { z } from 'zod';

export const UserSchema = z.object({
  name: z.string().regex(/^[a-zA-Z0-9]{3,12}$/),
  login: z.email(),
  password: z.string().min(8),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const NewUserSchema = z.object({
  name: z.string().regex(/^[a-zA-Z0-9]{3,12}$/),
  login: z.email(),
  password: z.string().min(8),
});
