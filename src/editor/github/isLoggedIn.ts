import { SESSION_URL } from '../constants';

/**
 * Whether this browser has a valid login. Throws when the server cannot
 * tell, for instance because the login is not set up yet.
 */
export async function isLoggedIn(): Promise<boolean> {
    const res = await fetch(SESSION_URL, { cache: 'no-store' });
    if (res.ok) return true;
    if (res.status === 401) return false;
    const data = (await res.json().catch(() => ({}))) as {
        message?: unknown;
    };
    throw new Error(
        typeof data.message === 'string'
            ? data.message
            : `The site's server didn't answer the login check ` +
                  `(${String(res.status)}).`,
    );
}
