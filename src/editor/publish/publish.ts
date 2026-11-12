import { BRANCH, PAGE_PATH } from '../constants';
import { clearDraft } from '../draft/clearDraft';
import { serialize } from '../document/serialize';
import type { EditorState } from '../EditorState';
import { fetchLatest } from '../github/fetchLatest';
import type { GitCommit } from '../github/GitCommit';
import { githubFetch } from '../github/githubFetch';
import { githubPost } from '../github/githubPost';
import { repoPath } from '../github/repoPath';

/**
 * Commits the page and the pending uploads to the branch in one commit.
 * Refuses, and records the conflict, if the page on GitHub is no longer
 * the one these edits started from.
 */
export async function publish(
    state: EditorState,
    message: string,
): Promise<void> {
    const latest = await fetchLatest();
    if (latest.blobSha !== state.baseBlobSha) {
        state.conflict = latest;
        throw new Error(
            `${PAGE_PATH} changed on GitHub since you started editing. ` +
                'Nothing was published.',
        );
    }
    const mode = '100644';
    const type = 'blob';
    const html = serialize(state.doc);
    const htmlBlob = await githubPost('/git/blobs', {
        content: html,
        encoding: 'utf-8',
    });
    const files = await Promise.all(
        Object.entries(state.pending).map(async ([path, file]) => {
            const blob = await githubPost('/git/blobs', {
                content: file.base64,
                encoding: 'base64',
            });
            return { path: repoPath(path), mode, type, sha: blob.sha };
        }),
    );
    const parent = (await githubFetch(
        `/git/commits/${latest.head}`,
    )) as GitCommit;
    const tree = await githubPost('/git/trees', {
        base_tree: parent.tree.sha,
        tree: [{ path: PAGE_PATH, mode, type, sha: htmlBlob.sha }, ...files],
    });
    const commit = await githubPost('/git/commits', {
        message,
        tree: tree.sha,
        parents: [latest.head],
    });
    await githubFetch(`/git/refs/heads/${BRANCH}`, {
        method: 'PATCH',
        body: JSON.stringify({ sha: commit.sha }),
    });

    state.baseBlobSha = htmlBlob.sha;
    state.cleanHtml = html;
    state.pending = {};
    await clearDraft();
}
