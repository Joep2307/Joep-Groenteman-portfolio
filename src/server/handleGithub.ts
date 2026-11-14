import {
    ALLOWED_CALLS,
    PROXY_ENV,
    REPO_API,
    USER_AGENT,
} from './constants.js';
import { currentSession } from './currentSession.js';
import { isSameOrigin } from './isSameOrigin.js';
import { notSetUp } from './notSetUp.js';
import { reply } from './reply.js';

/**
 * `/api/github?path=…`: stands between the editor and GitHub. You need to
 * be logged in; this adds the GitHub token, which never leaves the server.
 */
export async function handleGithub(request: Request): Promise<Response> {
    const problem = notSetUp(PROXY_ENV);
    if (problem) return problem;
    if (!currentSession(request)) return reply(401, 'Not logged in.');
    if (request.method !== 'GET' && !isSameOrigin(request)) {
        return reply(403, 'Not from this site.');
    }
    const path = new URL(request.url).searchParams.get('path') ?? '';
    const allowed = ALLOWED_CALLS[request.method];
    if (!allowed?.test(path) || path.includes('..')) {
        return reply(403, 'The editor is not allowed to make this call.');
    }
    const upstream = await fetch(REPO_API + path, {
        method: request.method,
        headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN ?? ''}`,
            Accept: 'application/vnd.github+json',
            'User-Agent': USER_AGENT,
        },
        body: request.method === 'GET' ? null : await request.text(),
    });
    // A 401 here is about the server's token, not about the login.
    if (upstream.status === 401) {
        return reply(
            502,
            'GitHub rejected the GITHUB_TOKEN set in Vercel. It may have ' +
                'expired.',
        );
    }
    return new Response(await upstream.text(), {
        status: upstream.status,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
        },
    });
}
