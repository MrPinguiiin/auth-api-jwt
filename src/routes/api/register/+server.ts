import {  RegisterUserSchema } from '$lib/validations/user.schema';
import { json } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { ZodError } from 'zod';
import { prisma }from '$lib/server/prisma';

export async function POST({ request }: { request: Request }) {
	try {
        const body = (await request.json());
        const data = RegisterUserSchema.parse(body);

        const hashedPassword = await bcrypt.hash(data.password, 12);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: {
                    create: {
                        name: 'user'
                    }
                }
            },
            include: {
                role: true
            }
        });

		return json({ status: 'success', data: { ...user, password: undefined } }, { status: 201 });
	} catch (error: any) {
		if (error instanceof ZodError) {
			return json({ message: 'Gagal validasi !', error: error.flatten() }, { status: 400 });
		}

		if (error.code === 'P2002') {
			return json({ message: 'Pengguna dengan email itu sudah ada' }, { status: 409 });
		}

		return json({ message: error.message }, { status: 500 });
	}
}