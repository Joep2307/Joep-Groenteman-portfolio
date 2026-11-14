import type { CookieOptions } from './CookieOptions.js';

/**
 * A `Set-Cookie` value that scripts cannot read. Lax, not Strict: GitHub
 * sends you back with a redirect from another site, and the cookie has to
 * survive that.
 */
export function serializeCookie(
    name: string,
    value: string,
    { maxAge, path, secure }: CookieOptions,
): string {
    return [
        `${name}=${encodeURIComponent(value)}`,
        `Max-Age=${String(maxAge)}`,
        `Path=${path}`,
        'HttpOnly',
        'SameSite=Lax',
        ...(secure ? ['Secure'] : []),
    ].join('; ');
}
