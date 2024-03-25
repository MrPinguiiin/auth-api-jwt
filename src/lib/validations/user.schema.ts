import { z } from 'zod';

export const RegisterUserSchema = z
	.object({
		name: z
			.string({
				required_error: 'Nama harus diisi'
			})
			.min(1, 'Nama lengkap harus diisi'),
		email: z
			.string({
				required_error: 'Email harus diisi'
			})
			.min(1, 'Email harus diisi')
			.email('Email tidak valid'),
		password: z
			.string({
				required_error: 'Password harus diisi'
			})
			.min(1, 'Password harus diisi')
			.min(8, 'Password harus lebih dari 8 karakter')
			.max(32, 'Password harus kurang dari 32 karakter'),
		// role: z
		// 	.string({
		// 		required_error: 'Role harus diisi'
		// 	})
		// 	.min(1, 'Role harus diisi')
		// 	.max(32, 'Role harus kurang dari 32 karakter')
		})

export const LoginUserSchema = z.object({
	email: z
		.string({
			required_error: 'Email harus diisi'
		})
		.min(1, 'Email harus diisi')
		.email('Email tidak valid'),
	password: z
		.string({
			required_error: 'Password harus diisi'
		})
		.min(1, 'Password harus diisi')
		.min(8, 'Password harus lebih dari 8 karakter')
});

export type LoginUserInput = z.infer<typeof LoginUserSchema>;
export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;