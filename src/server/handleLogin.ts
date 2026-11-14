import { randomBytes } from 'node:crypto';
import {
    AUTHORIZE_URL,
    CALLBACK_PATH,
    EDITOR_PATH,
    LOGIN_ENV,
    STATE_COOKIE,
    STATE_MAX_AGE_S,
} from './constants.js';
import { isHttps } from './isHttps.js';
import { redirect } from './redirect.js';
import { serializeCookie } from './serializeCookie.js';

/**
 * `GET /api/auth/login`: sends you to GitHub to sign in. The random
 * `state` comes back with you and must match the cookie, so nobody can
 * hand you a sign-in they started.
 */
export function handleLogin(request: Request): Response {
    const { GITHUB_CLIENT_ID } = process.env;
    if (LOGIN_ENV.some((name) => !process.env[name]) || !GITHUB_CLIENT_ID) {
        return redirect(`${EDITOR_PATH}?login=setup`);
    }
    const state = randomBytes(16).toString('base64url');
    const { origin } = new URL(request.url);
    const target = new URL(AUTHORIZE_URL);
    target.search = new URLSearchParams({
        client_id: GITHUB_CLIENT_ID,
        redirect_uri: origin + CALLBACK_PATH,
        state,
        allow_signup: 'false',
    }).toString();
    return redirect(target.href, [
        serializeCookie(STATE_COOKIE, state, {
            maxAge: STATE_MAX_AGE_S,
            path: CALLBACK_PATH,
            secure: isHttps(request),
        }),
    ]);
}
