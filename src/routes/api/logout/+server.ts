import { json } from '@sveltejs/kit';
// import { Locals } from './types'; // Add the missing import statement

interface Locals {
    user: any; 
}

export async function POST({ cookies, locals }: { cookies: any, locals: Locals }) {
    locals.user = null;

    const cookieOptions = {
        path: '/api',
        secure: process.env.NODE_ENV !== 'development'
    };

    cookies.delete('token', cookieOptions);
    cookies.delete('logged-in', cookieOptions);

    return json({ status: 'Berhasil keluar' });
}