    import { json } from '@sveltejs/kit';
// import type { User } from './types'; 
    // import { Locals } from './types'; // Add the missing import statement


    export async function POST({ cookies, locals }) {
        locals.user = null;

        const cookieOptions = {
            path: '/api',
            secure: process.env.NODE_ENV !== 'development'
        };

        cookies.delete('token', cookieOptions);
        cookies.delete('logged-in', cookieOptions);

        return json({ status: 'Berhasil keluar' });
    }