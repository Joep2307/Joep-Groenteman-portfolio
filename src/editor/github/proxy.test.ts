// @vitest-environment node
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { GET, PATCH, POST } from '../../../api/github';

const URL_BASE = 'https://site.example/api/github?path=';

function call(
    handler: typeof GET,
    method: string,
    path: string,
    password = 'secret',
): Promise<Response> {
    return handler(
        new Request(URL_BASE + encodeURIComponent(path), {
            method,
            headers: { Authorization: `Bearer ${password}` },
            body: method === 'GET' ? null : '{}',
        }),
    );
}

const upstream = vi.fn<typeof fetch>();

beforeEach(() => {
    vi.stubEnv('EDITOR_PASSWORD', 'secret');
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

test('refuses a wrong password without calling GitHub', async () => {
    const res = await call(GET, 'GET', '', 'guess');
    expect(res.status).toBe(401);
    expect(upstream).not.toHaveBeenCalled();
});

test('says so when the environment variables are missing', async () => {
    vi.stubEnv('GITHUB_TOKEN', '');
    expect((await call(GET, 'GET', '')).status).toBe(503);
});

test('forwards an allowed call with the server token', async () => {
    const res = await call(POST, 'POST', '/git/blobs');
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

test('refuses calls the editor never makes', async () => {
    const refused = [
        call(POST, 'POST', '/git/refs'),
        call(PATCH, 'PATCH', '/git/refs/heads/other'),
        call(GET, 'GET', '/../../user'),
        call(GET, 'GET', '/collaborators'),
    ];
    for (const res of await Promise.all(refused)) {
        expect(res.status).toBe(403);
    }
    expect(upstream).not.toHaveBeenCalled();
});

test('reports a rejected server token as a server problem', async () => {
    upstream.mockResolvedValue(Response.json({}, { status: 401 }));
    expect((await call(GET, 'GET', '')).status).toBe(502);
});
