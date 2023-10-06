import { z } from 'zod';

export const signUpSchema = z.object({
	username: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
	email: z.string().email(),
	password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
});

export const signInSchema = z.object({
	emailusername: z.string(),
	password: z.string()
});
