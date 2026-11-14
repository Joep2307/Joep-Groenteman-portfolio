import { SESSION_COOKIE } from './constants.js';
import { isHttps } from './isHttps.js';
import { isSameOrigin } from './isSameOrigin.js';
import { reply } from './reply.js';
import { serializeCookie } from './serializeCookie.js';

/** `POST /api/auth/logout`: deletes the login cookie. */
export function handleLogout(request: Request): Response {
    if (!isSameOrigin(request)) return reply(403, 'Not from this site.');
    const headers = new Headers({ 'Cache-Control': 'no-store' });
    headers.append(
        'Set-Cookie',
        serializeCookie(SESSION_COOKIE, '', {
            maxAge: 0,
            path: '/',
            secure: isHttps(request),
        }),
    );
    return new Response(null, { status: 204, headers });
}
