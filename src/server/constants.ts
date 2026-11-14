// Server code runs on Vercel as Node ES modules, which need the `.js`
// extension on relative imports. TypeScript and Vite map it to the `.ts`
// file.

export const REPO = 'Joep2307/Joep-Groenteman-portfolio';
export const GITHUB_API = 'https://api.github.com';
export const REPO_API = `${GITHUB_API}/repos/${REPO}`;
export const AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
export const TOKEN_URL = 'https://github.com/login/oauth/access_token';
export const USER_AGENT = 'portfolio-editor';

/** Where GitHub sends you back to, and where the editor lives. */
export const CALLBACK_PATH = '/api/auth/callback';
export const EDITOR_PATH = '/dev/';

export const SESSION_COOKIE = 'editor_session';
export const STATE_COOKIE = 'editor_oauth_state';
/** A login lasts 30 days. */
export const SESSION_MAX_AGE_S = 30 * 24 * 60 * 60;
/** The time you get to say yes on GitHub. */
export const STATE_MAX_AGE_S = 10 * 60;

/** The environment variables each part needs, all set in Vercel. */
export const LOGIN_ENV = [
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',
    'EDITOR_GITHUB_ID',
    'SESSION_SECRET',
] as const;
export const SESSION_ENV = ['EDITOR_GITHUB_ID', 'SESSION_SECRET'] as const;
export const PROXY_ENV = [...SESSION_ENV, 'GITHUB_TOKEN'] as const;

/** The only GitHub calls the editor makes; anything else is refused. */
export const ALLOWED_CALLS: Readonly<Record<string, RegExp>> = {
    GET: /^(\/(git|contents)\/[\w.\-/]+(\?ref=\w+)?)?$/,
    POST: /^\/git\/(blobs|trees|commits)$/,
    PATCH: /^\/git\/refs\/heads\/main$/,
};
