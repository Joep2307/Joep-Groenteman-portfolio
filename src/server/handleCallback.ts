import {
    CALLBACK_PATH,
    EDITOR_PATH,
    LOGIN_ENV,
    SESSION_COOKIE,
    SESSION_MAX_AGE_S,
    STATE_COOKIE,
} from './constants.js';
import { exchangeCode } from './exchangeCode.js';
import { fetchGithubUser } from './fetchGithubUser.js';
import { isHttps } from './isHttps.js';
import type { LoginFailure } from './LoginFailure.js';
import { readCookie } from './readCookie.js';
import { redirect } from './redirect.js';
import { safeEqual } from './safeEqual.js';
import { serializeCookie } from './serializeCookie.js';
import { signSession } from './signSession.js';

/**
 * `GET /api/auth/callback`: where GitHub sends you back. Checks the
 * `state`, asks GitHub who you are, and logs you in only if that is the
 * account in `EDITOR_GITHUB_ID`. Every way out goes back to the editor.
 */
export async function handleCallback(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const secure = isHttps(request);
    const clearState = serializeCookie(STATE_COOKIE, '', {
        maxAge: 0,
        path: CALLBACK_PATH,
        secure,
    });
    const fail = (reason: LoginFailure): Response =>
        redirect(`${EDITOR_PATH}?login=${reason}`, [clearState]);

    const { SESSION_SECRET, EDITOR_GITHUB_ID } = process.env;
    if (
        LOGIN_ENV.some((name) => !process.env[name]) ||
        !SESSION_SECRET ||
        !EDITOR_GITHUB_ID
    ) {
        return fail('setup');
    }
    if (url.searchParams.get('error') === 'access_denied') {
        return fail('cancelled');
    }
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const expected = readCookie(request, STATE_COOKIE);
    if (!code || !state || !expected || !safeEqual(state, expected)) {
        return fail('expired');
    }
    try {
        const token = await exchangeCode(code, url.origin + CALLBACK_PATH);
        const user = await fetchGithubUser(token);
        if (String(user.id) !== EDITOR_GITHUB_ID.trim()) {
            return fail('denied');
        }
        const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_S;
        const session = signSession(
            { id: user.id, login: user.login, exp },
            SESSION_SECRET,
        );
        return redirect(EDITOR_PATH, [
            clearState,
            serializeCookie(SESSION_COOKIE, session, {
                maxAge: SESSION_MAX_AGE_S,
                path: '/',
                secure,
            }),
        ]);
    } catch (error) {
        console.error('Sign-in with GitHub failed.', error);
        return fail('error');
    }
}
