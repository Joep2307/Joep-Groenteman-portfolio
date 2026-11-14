// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SESSION_COOKIE, STATE_COOKIE } from './constants';
import { handleCallback } from './handleCallback';
import { handleLogin } from './handleLogin';
import { handleLogout } from './handleLogout';
import { handleMe } from './handleMe';
import { signSession } from './signSession';

const SITE = 'https://site.example';
const upstream = vi.fn<typeof fetch>();

function sessionCookie(id = 42, secret = 'secret'): string {
    const exp = Math.floor(Date.now() / 1000) + 60;
    const value = signSession({ id, login: 'joep', exp }, secret);
    return `${SESSION_COOKIE}=${value}`;
}

function callback(query: string, state = 'abc'): Promise<Response> {
    return handleCallback(
        new Request(`${SITE}/api/auth/callback?${query}`, {
            headers: { cookie: `${STATE_COOKIE}=${state}` },
        }),
    );
}

/** GitHub answering the code swap and then "who are you" with `id`. */
function githubSays(id: number): void {
    upstream
        .mockResolvedValueOnce(Response.json({ access_token: 'gho_x' }))
        .mockResolvedValueOnce(Response.json({ id, login: 'someone' }));
}

beforeEach(() => {
    vi.stubEnv('GITHUB_CLIENT_ID', 'client');
    vi.stubEnv('GITHUB_CLIENT_SECRET', 'client-secret');
    vi.stubEnv('EDITOR_GITHUB_ID', '42');
    vi.stubEnv('SESSION_SECRET', 'secret');
    upstream.mockReset();
    vi.stubGlobal('fetch', upstream);
});

afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
});

describe('handleLogin', () => {
    it('sends you to GitHub with a state that is also a cookie', () => {
        const res = handleLogin(new Request(`${SITE}/api/auth/login`));
        expect(res.status).toBe(302);
        const target = new URL(res.headers.get('location') ?? '');
        expect(target.origin + target.pathname).toBe(
            'https://github.com/login/oauth/authorize',
        );
        expect(target.searchParams.get('client_id')).toBe('client');
        expect(target.searchParams.get('redirect_uri')).toBe(
            `${SITE}/api/auth/callback`,
        );
        const state = target.searchParams.get('state') ?? '';
        expect(state.length).toBeGreaterThan(10);
        const cookie = res.headers.get('set-cookie') ?? '';
        expect(cookie).toContain(`${STATE_COOKIE}=${state}`);
        expect(cookie).toContain('HttpOnly');
        expect(cookie).toContain('Secure');
    });

    it('goes back to the editor when it is not set up', () => {
        vi.stubEnv('GITHUB_CLIENT_SECRET', '');
        const res = handleLogin(new Request(`${SITE}/api/auth/login`));
        expect(res.headers.get('location')).toBe('/dev/?login=setup');
    });
});

describe('handleCallback', () => {
    it('logs in the account in EDITOR_GITHUB_ID', async () => {
        githubSays(42);
        const res = await callback('code=c&state=abc');
        expect(res.headers.get('location')).toBe('/dev/');
        const cookies = res.headers.getSetCookie();
        const session = cookies.find((c) => c.startsWith(SESSION_COOKIE));
        expect(session).toContain('HttpOnly');
        expect(session).toContain('Max-Age=2592000');
        const [, init] = upstream.mock.calls[0] ?? [];
        expect(JSON.parse(init?.body as string)).toMatchObject({
            client_id: 'client',
            client_secret: 'client-secret',
            code: 'c',
        });
    });

    it('turns away any other account', async () => {
        githubSays(7);
        const res = await callback('code=c&state=abc');
        expect(res.headers.get('location')).toBe('/dev/?login=denied');
        expect(
            res.headers
                .getSetCookie()
                .some((c) => c.startsWith(`${SESSION_COOKIE}=`)),
        ).toBe(false);
    });

    it('refuses a state that does not match the cookie', async () => {
        const res = await callback('code=c&state=abc', 'other');
        expect(res.headers.get('location')).toBe('/dev/?login=expired');
        expect(upstream).not.toHaveBeenCalled();
    });

    it('says when you cancelled on GitHub', async () => {
        const res = await callback('error=access_denied&state=abc');
        expect(res.headers.get('location')).toBe('/dev/?login=cancelled');
    });

    it('says when GitHub fails', async () => {
        upstream.mockResolvedValueOnce(Response.json({}, { status: 500 }));
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const res = await callback('code=c&state=abc');
        expect(res.headers.get('location')).toBe('/dev/?login=error');
    });
});

describe('handleMe', () => {
    const me = (cookie?: string): Response =>
        handleMe(
            new Request(`${SITE}/api/auth/me`, {
                headers: cookie ? { cookie } : {},
            }),
        );

    it('says who is logged in', async () => {
        const res = me(sessionCookie());
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ login: 'joep' });
    });

    it('is 401 without a valid login', () => {
        expect(me().status).toBe(401);
        expect(me(sessionCookie(42, 'wrong')).status).toBe(401);
        expect(me(sessionCookie(7)).status).toBe(401);
    });

    it('is 503 when not set up', () => {
        vi.stubEnv('SESSION_SECRET', '');
        expect(me(sessionCookie()).status).toBe(503);
    });
});

describe('handleLogout', () => {
    it('deletes the cookie', () => {
        const res = handleLogout(
            new Request(`${SITE}/api/auth/logout`, {
                method: 'POST',
                headers: { origin: SITE },
            }),
        );
        expect(res.status).toBe(204);
        expect(res.headers.get('set-cookie')).toContain('Max-Age=0');
    });

    it('refuses another site', () => {
        const res = handleLogout(
            new Request(`${SITE}/api/auth/logout`, {
                method: 'POST',
                headers: { origin: 'https://evil.example' },
            }),
        );
        expect(res.status).toBe(403);
    });
});
