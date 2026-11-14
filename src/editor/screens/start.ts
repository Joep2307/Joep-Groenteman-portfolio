import {
    BRANCH,
    IMAGE_PREFIX,
    PAGE_PATH,
    REPO,
    REQUIRED_SELECTORS,
} from '../constants';
import { serialize } from '../document/serialize';
import { loadDraft } from '../draft/loadDraft';
import type { EditorState } from '../EditorState';
import { fetchLatest } from '../github/fetchLatest';
import { GithubError } from '../github/GithubError';
import { githubFetch } from '../github/githubFetch';
import { isLoggedIn } from '../github/isLoggedIn';
import type { LatestSite } from '../github/LatestSite';
import { listImages } from '../github/listImages';
import type { Repository } from '../github/Repository';
import { notify } from '../shell/notify';
import { h } from '../util/h';
import { renderEditor } from './renderEditor';
import { loginMessage } from './loginMessage';
import { renderLogin } from './renderLogin';
import { renderMessage } from './renderMessage';

/**
 * Checks the login, loads the published page and any draft kept on this
 * device, then shows the editor, or the screen that says why it cannot.
 */
export async function start(state: EditorState): Promise<void> {
    renderMessage('Loading your portfolio…', []);
    // After a sign-in that did not work, GitHub sends you back here with
    // the reason in the address. It is shown once, then dropped.
    const failure = new URLSearchParams(location.search).get('login');
    if (failure !== null) {
        history.replaceState(null, '', location.pathname + location.hash);
    }
    try {
        if (!(await isLoggedIn())) {
            renderLogin(loginMessage(failure));
            return;
        }
        const repo = (await githubFetch('')) as Repository;
        if (!repo.permissions?.push) {
            renderMessage("The editor can't publish", [
                h(
                    'p',
                    {},
                    'The GITHUB_TOKEN set in Vercel can read the ' +
                        'repository but not write to it. Give it ' +
                        'Contents: Read and write.',
                ),
            ]);
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
            renderLogin('Your login has expired. Sign in again.');
        } else if (status === 403 || status === 404) {
            renderMessage("The editor can't reach your site's files", [
                h(
                    'p',
                    {},
                    `The GITHUB_TOKEN set in Vercel doesn't have access to ` +
                        `${REPO}. Check the repository and permissions it ` +
                        'was created with.',
                ),
            ]);
        } else {
            // 502 and 503 come from the site's server, whose message says
            // what is wrong or missing.
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
