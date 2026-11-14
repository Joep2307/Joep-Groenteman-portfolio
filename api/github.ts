import { createHash, timingSafeEqual } from 'node:crypto';

// Vercel serves this file at /api/github. It stands between the editor
// and GitHub: the editor sends the password, and this adds the GitHub
// token, which never leaves the server. Both are environment variables
// of the Vercel project: EDITOR_PASSWORD and GITHUB_TOKEN.

const REPO = 'Joep2307/Joep-Groenteman-portfolio';
const API_URL = `https://api.github.com/repos/${REPO}`;

/** The only calls the editor makes; anything else is refused. */
const ALLOWED: Record<string, RegExp> = {
    GET: /^(\/(git|contents)\/[\w.\-/]+(\?ref=\w+)?)?$/,
    POST: /^\/git\/(blobs|trees|commits)$/,
    PATCH: /^\/git\/refs\/heads\/main$/,
};

function reply(status: number, message: string): Response {
    return Response.json({ message }, { status });
}

function digest(text: string): Buffer {
    return createHash('sha256').update(text).digest();
}

/** Compares in constant time, so timing says nothing about the password. */
function matches(given: string, expected: string): boolean {
    return timingSafeEqual(digest(given), digest(expected));
}

async function handle(request: Request): Promise<Response> {
    const { EDITOR_PASSWORD, GITHUB_TOKEN } = process.env;
    if (!EDITOR_PASSWORD || !GITHUB_TOKEN) {
        return reply(
            503,
            'The editor password is not set up yet: add EDITOR_PASSWORD ' +
                'and GITHUB_TOKEN to the Vercel project and redeploy.',
        );
    }
    const given = request.headers.get('authorization') ?? '';
    if (!matches(given, `Bearer ${EDITOR_PASSWORD}`)) {
        return reply(401, 'Wrong password.');
    }
    const path = new URL(request.url).searchParams.get('path') ?? '';
    const allowed = ALLOWED[request.method];
    if (!allowed?.test(path) || path.includes('..')) {
        return reply(403, 'The editor is not allowed to make this call.');
    }
    const upstream = await fetch(API_URL + path, {
        method: request.method,
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github+json',
            'User-Agent': 'portfolio-editor',
        },
        body: request.method === 'GET' ? null : await request.text(),
    });
    // A 401 here is about the server's token, not about the password.
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

export const GET = handle;
export const POST = handle;
export const PATCH = handle;
