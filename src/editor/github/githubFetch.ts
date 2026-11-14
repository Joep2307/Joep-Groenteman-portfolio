import { PROXY_URL } from '../constants';
import { GithubError } from './GithubError';

/**
 * Calls the repository's GitHub API through the site's server, which
 * checks the login cookie and adds the GitHub token.
 */
export async function githubFetch(
    path: string,
    options: RequestInit = {},
): Promise<unknown> {
    const res = await fetch(`${PROXY_URL}?path=${encodeURIComponent(path)}`, {
        ...options,
        cache: 'no-store',
        headers: { Accept: 'application/vnd.github+json' },
    });
    const data: unknown = await res.json().catch(() => ({}));
    if (!res.ok) {
        const message =
            typeof data === 'object' &&
            data !== null &&
            'message' in data &&
            typeof data.message === 'string'
                ? data.message
                : '';
        throw new GithubError(
            message || `GitHub error ${String(res.status)}`,
            res.status,
        );
    }
    return data;
}
