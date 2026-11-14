import { API_URL, PROXY_URL } from '../constants';
import { getPassword } from './getPassword';
import { GithubError } from './GithubError';

/** Calls the repository's GitHub API and returns the parsed response. */
export async function githubFetch(
    path: string,
    options: RequestInit = {},
): Promise<unknown> {
    // With the password the call goes through the site's server, which
    // adds the GitHub token. Without one it goes straight to GitHub,
    // anonymously, which is enough to read.
    const password = getPassword();
    const url = password
        ? `${PROXY_URL}?path=${encodeURIComponent(path)}`
        : API_URL + path;
    const res = await fetch(url, {
        ...options,
        cache: 'no-store',
        headers: {
            ...(password ? { Authorization: `Bearer ${password}` } : {}),
            Accept: 'application/vnd.github+json',
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
