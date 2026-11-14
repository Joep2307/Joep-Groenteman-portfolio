import { GITHUB_API, USER_AGENT } from './constants.js';
import type { GithubUser } from './GithubUser.js';

/** The GitHub account a token belongs to. */
export async function fetchGithubUser(token: string): Promise<GithubUser> {
    const res = await fetch(`${GITHUB_API}/user`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'User-Agent': USER_AGENT,
        },
    });
    const data = (await res.json().catch(() => ({}))) as Partial<GithubUser>;
    if (
        !res.ok ||
        typeof data.id !== 'number' ||
        typeof data.login !== 'string'
    ) {
        throw new Error(
            `GitHub did not say who you are (${String(res.status)}).`,
        );
    }
    return { id: data.id, login: data.login };
}
