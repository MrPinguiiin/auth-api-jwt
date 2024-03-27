import { prisma } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	try {
		const userId = params.id;

		const user = await prisma.user.findUnique({
			where: {
				id: parseInt(userId)
			},
            include: {
                role: true
            }
		});

		if (!user) {
			const message = 'Id atau User tidak ditemukan !';
			return json({ message},{ status: 404 });
		}

		const json_response = {
			status: 'berhasil',
			data: {
				user
			}
		};
		return json(json_response);
	} catch (error: any) {
		return json({ message: error.message},{ status: 500 });
	}
}

export async function PATCH({ request, params }) {
	try {
		
        const userId = params.id;

		const userData = await request.json();

		const updated_user = await prisma.user.update({
			where: { id: parseInt(userId) },
			data: userData,
            include: {
                role: true
            }
		});

		const json_response = {
			status: 'berhasil diupdate!',
			data: {
				user: updated_user
			}
		};
		return json(json_response);
	} catch (error: any) {
		if (error.code === 'P2025') {
			const message = 'Id atau User tidak ditemukan !';
			return json({ message},{ status: 404 });
		}

		return json({ message: error.message},{ status: 500 });
	}
}

export async function DELETE({ params }) {
	try {
		
		const userId = params.id;

		await prisma.user.delete({
			where: { id: parseInt(userId) }
		});

        const json_response = {
			status: 'Berhasil dihapus!',
		};


        return json(json_response);
	} catch (error: any) {
		if (error.code === 'P2025') {
			const message = 'Id atau User tidak ditemukan !';
			return json({ message}, {status: 404 });
		}

		return json({ message: error.message},{ status: 500 });
	}
}


