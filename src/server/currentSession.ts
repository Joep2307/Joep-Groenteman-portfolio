import { SESSION_COOKIE } from './constants.js';
import { readCookie } from './readCookie.js';
import type { Session } from './Session.js';
import { verifySession } from './verifySession.js';

/**
 * The session in the request's cookie, if it is valid and belongs to the
 * one account that may edit. Checking the account again here means a
 * change of `EDITOR_GITHUB_ID` locks out logins made before it.
 */
export function currentSession(request: Request): Session | null {
    const { SESSION_SECRET, EDITOR_GITHUB_ID } = process.env;
    const value = readCookie(request, SESSION_COOKIE);
    if (!value || !SESSION_SECRET || !EDITOR_GITHUB_ID) return null;
    const session = verifySession(
        value,
        SESSION_SECRET,
        Math.floor(Date.now() / 1000),
    );
    return session && String(session.id) === EDITOR_GITHUB_ID.trim()
        ? session
        : null;
}
