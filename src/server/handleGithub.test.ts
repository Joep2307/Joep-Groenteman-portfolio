// @vitest-environment node
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { SESSION_COOKIE } from './constants';
import { handleGithub } from './handleGithub';
import { signSession } from './signSession';

const SITE = 'https://site.example';
const upstream = vi.fn<typeof fetch>();

function call(
    method: string,
    path: string,
    { loggedIn = true, origin = SITE } = {},
): Promise<Response> {
    const exp = Math.floor(Date.now() / 1000) + 60;
    const value = signSession({ id: 42, login: 'joep', exp }, 'secret');
    return handleGithub(
        new Request(`${SITE}/api/github?path=${encodeURIComponent(path)}`, {
            method,
            headers: {
                origin,
                ...(loggedIn ? { cookie: `${SESSION_COOKIE}=${value}` } : {}),
            },
            body: method === 'GET' ? null : '{}',
        }),
    );
}

beforeEach(() => {
    vi.stubEnv('SESSION_SECRET', 'secret');
    vi.stubEnv('EDITOR_GITHUB_ID', '42');
    vi.stubEnv('GITHUB_TOKEN', 'ghp_test');
    upstream.mockReset();
    upstream.mockImplementation(() =>
        Promise.resolve(Response.json({ ok: true })),
    );
    vi.stubGlobal('fetch', upstream);
});

afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
});

test('refuses a call without a login, without calling GitHub', async () => {
    const res = await call('GET', '', { loggedIn: false });
    expect(res.status).toBe(401);
    expect(upstream).not.toHaveBeenCalled();
});

test('says so when the environment variables are missing', async () => {
    vi.stubEnv('GITHUB_TOKEN', '');
    expect((await call('GET', '')).status).toBe(503);
});

test('forwards an allowed call with the server token', async () => {
    const res = await call('POST', '/git/blobs');
    expect(res.status).toBe(200);
    const [url, init] = upstream.mock.calls[0] ?? [];
    expect(url).toBe(
        'https://api.github.com/repos/Joep2307/' +
            'Joep-Groenteman-portfolio/git/blobs',
    );
    expect(new Headers(init?.headers).get('authorization')).toBe(
        'Bearer ghp_test',
    );
});

test('refuses writes from another site', async () => {
    const res = await call('POST', '/git/blobs', {
        origin: 'https://evil.example',
    });
    expect(res.status).toBe(403);
    expect(upstream).not.toHaveBeenCalled();
});

test('refuses calls the editor never makes', async () => {
    const refused = [
        call('POST', '/git/refs'),
        call('PATCH', '/git/refs/heads/other'),
        call('GET', '/../../user'),
        call('GET', '/collaborators'),
    ];
    for (const res of await Promise.all(refused)) {
        expect(res.status).toBe(403);
    }
    expect(upstream).not.toHaveBeenCalled();
});

test('reports a rejected server token as a server problem', async () => {
    upstream.mockResolvedValue(Response.json({}, { status: 401 }));
    expect((await call('GET', '')).status).toBe(502);
});
