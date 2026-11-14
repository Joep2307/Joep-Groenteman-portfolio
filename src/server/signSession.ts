import type { Session } from './Session.js';
import { sign } from './sign.js';

/**
 * The cookie value for a session: the session as base64url JSON, a dot,
 * and its signature. Only the server can make one, so it needs no store.
 */
export function signSession(session: Session, secret: string): string {
    const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
    return `${payload}.${sign(payload, secret)}`;
}
