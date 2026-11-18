import { GITHUB_API } from '../constants';
import { GithubError } from './GithubError';
import type { GithubUser } from './GithubUser';

/** Asks GitHub which account a token belongs to. */
export async function fetchViewer(token: string): Promise<GithubUser> {
    const res = await fetch(`${GITHUB_API}/user`, {
        cache: 'no-store',
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new GithubError(
            `GitHub error ${String(res.status)}`,
            res.status,
        );
    }
    return (await res.json()) as GithubUser;
}
