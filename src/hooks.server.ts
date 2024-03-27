import { verifyJWT } from "$lib/server/token";
import type { Handle } from "@sveltejs/kit";


export const handle: Handle = async ({ event, resolve }) => {	

    if (event.url.pathname.startsWith('/api')){	
        if(event.url.pathname !== '/api/login' && event.url.pathname !== '/api/register') {       
            const token = event.cookies.get('accessToken');
            if (!token) {	
                return new Response(JSON.stringify({ 
                    status: 'gagal', 
                    message: 'Tidak ada token' }),{ status: 401 });	
            } else {
                // verify token here
                try {
                    const payload = await verifyJWT<{ sub: any }>(token);
                    event.locals.user = payload.sub;
                } catch (error) {
                    return new Response(JSON.stringify({ 
                        status: 'gagal', 
                        message: 'Tokenmu kadaluarsa' }),{ status: 401 });
                }

            }

            
        }
    }
    return await resolve(event);	
}