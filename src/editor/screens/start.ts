import {
    BRANCH,
    EDITOR_GITHUB_ID,
    IMAGE_PREFIX,
    PAGE_PATH,
    REPO,
    REPO_NAME,
    REQUIRED_SELECTORS,
} from '../constants';
import { serialize } from '../document/serialize';
import { loadDraft } from '../draft/loadDraft';
import type { EditorState } from '../EditorState';
import { fetchLatest } from '../github/fetchLatest';
import { GithubError } from '../github/GithubError';
import { fetchViewer } from '../github/fetchViewer';
import { forgetToken } from '../github/forgetToken';
import { githubFetch } from '../github/githubFetch';
import type { LatestSite } from '../github/LatestSite';
import { listImages } from '../github/listImages';
import { readToken } from '../github/readToken';
import type { Repository } from '../github/Repository';
import { notify } from '../shell/notify';
import { h } from '../util/h';
import { renderEditor } from './renderEditor';
import { renderLogin } from './renderLogin';
import { renderMessage } from './renderMessage';

/**
 * Checks the token saved in this browser, loads the published page and
 * any draft kept on this device, then shows the editor, or the screen
 * that says why it cannot.
 */
export async function start(state: EditorState): Promise<void> {
    const token = readToken();
    if (token === null) {
        renderLogin(state);
        return;
    }
    renderMessage('Loading your portfolio…', []);
    /** Drops the token and asks for another one, saying why. */
    const refuse = (reason: string): void => {
        forgetToken();
        renderLogin(state, reason);
    };
    try {
        const viewer = await fetchViewer(token);
        if (viewer.id !== EDITOR_GITHUB_ID) {
            refuse(
                `This token belongs to ${viewer.login}, which can't edit ` +
                    'this site. Use a token of the account that owns it.',
            );
            return;
        }
        const repo = (await githubFetch('')) as Repository;
        if (!repo.permissions?.push) {
            refuse(
                'This token can read the repository but not change it. ' +
                    'Give it Contents: Read and write.',
            );
            return;
        }
        // The repository answered, so a missing page is not about access.
        let latest: LatestSite;
        try {
            latest = await fetchLatest();
        } catch (err) {
            if (!(err instanceof GithubError) || err.status !== 404) throw err;
            renderMessage(`Couldn't find ${PAGE_PATH}`, [
                h(
                    'p',
                    {},
                    `The ${BRANCH} branch of ${REPO} has no ${PAGE_PATH} ` +
                        'for the editor to open.',
                ),
            ]);
            return;
        }
        state.knownImages = await listImages(latest.head);
        state.baseBlobSha = latest.blobSha;
        const parser = new DOMParser();
        const published = parser.parseFromString(latest.html, 'text/html');
        const missing = REQUIRED_SELECTORS.filter(
            (selector) => !published.querySelector(selector),
        );
        if (missing.length) {
            renderMessage(`This ${PAGE_PATH} looks different`, [
                h(
                    'p',
                    {},
                    "The editor couldn't find these parts of the page, so " +
                        'it stopped rather than risk damaging the site:',
                ),
                h(
                    'ul',
                    {},
                    missing.map((selector) => h('li', {}, selector)),
                ),
            ]);
            return;
        }
        state.doc = published;
        state.cleanHtml = serialize(published);
        state.conflict = null;

        const draft = await loadDraft();
        if (draft) {
            state.doc = parser.parseFromString(draft.html, 'text/html');
            state.pending = draft.pending ?? {};
            for (const [path, file] of Object.entries(state.pending)) {
                state.previewImages[path] = file.dataUrl;
                const isNewImage =
                    path.startsWith(IMAGE_PREFIX) &&
                    !state.knownImages.includes(path);
                if (isNewImage) state.knownImages.push(path);
            }
            if (draft.baseBlobSha !== latest.blobSha) state.conflict = latest;
            state.baseBlobSha = draft.baseBlobSha;
        }
        renderEditor(state);
        if (draft && !state.conflict) {
            notify(state, 'Restored your unpublished edits from this device.');
        }
    } catch (err) {
        const status = err instanceof GithubError ? err.status : undefined;
        const message = err instanceof Error ? err.message : String(err);
        if (status === 401) {
            refuse(
                "GitHub didn't accept this token. It may be mistyped, " +
                    'expired or deleted.',
            );
        } else if (status === 403 || status === 404) {
            refuse(
                `This token can't reach ${REPO}. Under Repository ` +
                    `access, pick ${REPO_NAME}.`,
            );
        } else {
            // Most likely GitHub or the connection is down; the token
            // may be fine, so it is kept.
            renderMessage(
                "Couldn't load your portfolio",
                [h('p', {}, message)],
                h(
                    'button',
                    {
                        type: 'button',
                        onclick: () => {
                            void start(state);
                        },
                    },
                    'Try again',
                ),
            );
        }
    }
}
