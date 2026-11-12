import type { GitObject } from './GitObject';
import { githubFetch } from './githubFetch';

/** Creates a git object (blob, tree or commit) and returns its sha. */
export async function githubPost(
    path: string,
    body: unknown,
): Promise<GitObject> {
    const created = await githubFetch(path, {
        method: 'POST',
        body: JSON.stringify(body),
    });
    return created as GitObject;
}
