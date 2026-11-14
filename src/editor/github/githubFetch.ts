import { API_URL } from '../constants';
import { getToken } from './getToken';
import { GithubError } from './GithubError';

/** Calls the repository's GitHub API and returns the parsed response. */
export async function githubFetch(
    path: string,
    options: RequestInit = {},
): Promise<unknown> {
    // Without a token the call is anonymous, which is enough to read.
    const token = getToken();
    const res = await fetch(API_URL + path, {
        ...options,
        cache: 'no-store',
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
