import {
    BRANCH,
    IMAGE_PREFIX,
    PAGE_PATH,
    REPO,
    REQUIRED_SELECTORS,
    TOKEN_KEY,
} from '../constants';
import { serialize } from '../document/serialize';
import { loadDraft } from '../draft/loadDraft';
import type { EditorState } from '../EditorState';
import { fetchLatest } from '../github/fetchLatest';
import { getToken } from '../github/getToken';
import { GithubError } from '../github/GithubError';
import { githubFetch } from '../github/githubFetch';
import type { LatestSite } from '../github/LatestSite';
import { listImages } from '../github/listImages';
import type { Repository } from '../github/Repository';
import { notify } from '../shell/notify';
import { h } from '../util/h';
import { renderEditor } from './renderEditor';
import { renderLogin } from './renderLogin';
import { renderMessage } from './renderMessage';

/**
 * Loads the published page and any draft kept on this device, then shows
 * the editor, or the screen that says why it cannot. Reading needs no
 * token; one is only asked for when publishing.
 */
export async function start(state: EditorState): Promise<void> {
    const connected = Boolean(getToken());
    renderMessage('Loading your portfolio…', []);
    const forgetToken = (message: string): void => {
        localStorage.removeItem(TOKEN_KEY);
        renderLogin(state, message);
    };
    try {
        if (connected) {
            const repo = (await githubFetch('')) as Repository;
            if (!repo.permissions?.push) {
                forgetToken(
                    'This token can read the repository but not write to ' +
                        'it. Give it Contents: Read and write.',
                );
                return;
            }
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
        if (connected && status === 401) {
            forgetToken(
                "GitHub didn't accept that token. It may be mistyped or " +
                    'expired.',
            );
        } else if (connected && (status === 403 || status === 404)) {
            forgetToken(
                `This token doesn't have access to ${REPO}. Check the ` +
                    'repository and permissions it was created with.',
            );
        } else {
            renderMessage(
                "Couldn't load your portfolio",
                [h('p', {}, err instanceof Error ? err.message : String(err))],
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
