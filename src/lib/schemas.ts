import { z } from 'zod';

export const signUpSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
});

export const signInSchema = signUpSchema.extend({
	password: z.string()
});

export const forgotPasswordSchema = z.object({
	email: z.string().email()
});

export const updatePasswordSchema = z
	.object({
		newPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
		confirmPassword: z.string()
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});
