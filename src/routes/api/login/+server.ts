import { LoginUserSchema, type LoginUserInput } from '$lib/validations/user.schema.js';
import { json } from '@sveltejs/kit';
import { ZodError } from 'zod';
import  { prisma } from '$lib/server/prisma';
import bcrypt from 'bcryptjs';
import { signJWT } from '$lib/server/token.js';
import { JWT_EXPIRES_IN } from '$env/static/private';

export async function POST({ request, cookies }) {
	try {
		const body = (await request.json()) as LoginUserInput;
		const data = LoginUserSchema.parse(body);

		const user = await prisma.user.findUnique({
			where: { email: data.email },
			include: {
				role: true
			}
		});

		if (!user || !(await bcrypt.compare(data.password, user.password))) {
			return json({ message: 'Email atau Password salah!' }, { status: 401 });
		}

		const dataUser: { id: string; name: string; email: string; role: string } = {
			id: user.id.toString(),
			name: user.name,
			email: user.email,
			role: user.role.name.toLocaleLowerCase()
		};

		const accessToken = await signJWT({  dataUser }, { exp: `${JWT_EXPIRES_IN}m` });

		const tokenMaxAge = parseInt(JWT_EXPIRES_IN) * 60;

		const cookieOptions = {
			httpOnly: true,
			path: '/api',
			// secure: process.env.NODE_ENV !== 'development',
			maxAge: tokenMaxAge
		};

		cookies.set('accessToken', accessToken, cookieOptions);
		cookies.set('logged-in', 'true', {
			...cookieOptions,
			httpOnly: false
		});

		return json({ accessToken, dataUser});
	} catch (error: any) {
		if (error instanceof ZodError) {
			return json({ message: 'Validasi gagal!', error: error.flatten() }, { status: 400 });
		}

		return json({ message: error.message }, { status: 500 });
	}
}