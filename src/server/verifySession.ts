import { safeEqual } from './safeEqual.js';
import type { Session } from './Session.js';
import { sign } from './sign.js';

/**
 * The session in a cookie value, or `null` when it was not signed with
 * `secret`, was changed, is malformed or has expired.
 */
export function verifySession(
    value: string,
    secret: string,
    nowS: number,
): Session | null {
    const [payload = '', signature = '', ...rest] = value.split('.');
    if (!payload || !signature || rest.length) return null;
    if (!safeEqual(signature, sign(payload, secret))) return null;
    let data: unknown;
    try {
        data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    } catch {
        return null;
    }
    if (typeof data !== 'object' || data === null) return null;
    const { id, login, exp } = data as Record<string, unknown>;
    if (typeof id !== 'number' || typeof login !== 'string') return null;
    if (typeof exp !== 'number' || exp <= nowS) return null;
    return { id, login, exp };
}
