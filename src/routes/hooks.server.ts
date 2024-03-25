import { verifyJWT } from '$lib/server/token';
import { error, type Handle } from '@sveltejs/kit';
import  { prisma }  from '$lib/server/prisma';


export const handle: Handle = async ({ resolve, event }) => {

	const { url, locals, request, cookies } = event;

	let authToken: string | undefined;

	if (cookies.get('token')) {
		authToken = cookies.get('token');
	} else if (request.headers.get('Authorization')?.startsWith('Bearer ')) {
		authToken = request.headers.get('Authorization')?.substring(7);
	}

	if (
		!authToken &&
		(url.pathname.startsWith('/api/users') || url.pathname.startsWith('/api/auth/logout'))
	) {
		throw error(401, 'Akses kamu ditolak. Silahkan masuk terlebih dahulu.');
	}

	try {
		if (authToken) {
			const { sub } = await verifyJWT<{ sub: string }>(authToken);
			const user = await prisma.user.findUnique({ where: { id: parseInt(sub) } }); // Convert sub to a number
			if (!user) {
				throw error(401, 'Token sudah tidak ada lagi');
			}

			// locals.user = user;
		}
	} catch (err: any) {
		if (url.pathname.startsWith('/api')) {
			throw error(401, "Token tidak valid atau pengguna tidak ada");
		}
	}

	const response = await resolve(event);

	return response;
};