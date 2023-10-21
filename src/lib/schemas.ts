import { z } from 'zod';

export const signUpSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
	termsAndPrivacy: z.boolean().refine((data) => data === true, {
		message: 'You must agree to the terms and privacy policy'
	})
});

export const signInSchema = signUpSchema.extend({
	password: z.string(),
	termsAndPrivacy: z.undefined()
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

export const journalSchema = z.object({
	title: z.string().nonempty({ message: 'Title cannot be empty' }),
	description: z
		.string()
		.trim()
		.max(50, { message: 'Description must be 50 characters or less' })
		.optional()
});
