import { REPO_API } from '../constants';
import { GithubError } from './GithubError';
import { readToken } from './readToken';

/**
 * Calls GitHub's API for the site's repository with the token saved in
 * this browser. `path` is relative to the repository, '' for the
 * repository itself.
 */
export async function githubFetch(
    path: string,
    options: RequestInit = {},
): Promise<unknown> {
    const token = readToken();
    if (token === null) throw new GithubError('Not logged in.', 401);
    const res = await fetch(REPO_API + path, {
        ...options,
        cache: 'no-store',
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${token}`,
        },
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
