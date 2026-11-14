import {
    BRANCH,
    DEFAULT_COMMIT_MESSAGE,
    LIVE_URL,
    PAGE_PATH,
} from '../constants';
import type { EditorState } from '../EditorState';
import { field } from '../fields/field';
import { getPassword } from '../github/getPassword';
import { repoPath } from '../github/repoPath';
import { flush } from '../shell/flush';
import { go } from '../shell/go';
import { notify } from '../shell/notify';
import { renderView } from '../shell/renderView';
import { updateStatus } from '../shell/updateStatus';
import { h } from '../util/h';
import { query } from '../util/query';
import { connect } from './connect';
import { publish } from './publish';
import { validate } from './validate';

/**
 * Opens the publish dialog: the list of things to fix first if there are
 * any, otherwise the commit message and the button that publishes.
 */
export function openPublishDialog(state: EditorState): void {
    flush(state);
    const dialog = query('#publish-dialog');
    const body = query('#publish-body');
    if (!(dialog instanceof HTMLDialogElement)) return;
    const close = (): void => {
        dialog.close();
    };

    const problems = validate(state);
    if (problems.length) {
        body.replaceChildren(
            h(
                'p',
                {},
                'A few things need fixing first, so nothing broken or ' +
                    'inaccessible goes live.',
            ),
            h(
                'ul',
                {},
                problems.map((item) => {
                    const fix = (): void => {
                        close();
                        go(state, item.view);
                    };
                    const type = 'button';
                    return h(
                        'li',
                        {},
                        h('button', { type, onclick: fix }, item.text),
                    );
                }),
            ),
            h(
                'div',
                { class: 'dialog-actions' },
                h(
                    'button',
                    { type: 'button', onclick: close },
                    'Back to editing',
                ),
            ),
        );
        dialog.showModal();
        return;
    }

    // Publishing is the one thing that needs the password.
    if (!getPassword()) {
        connect(state);
        return;
    }

    const files = [PAGE_PATH, ...Object.keys(state.pending).map(repoPath)];
    const messageField = field(
        state,
        'What changed?',
        DEFAULT_COMMIT_MESSAGE,
        () => undefined,
        { hint: 'Saved as the commit message on GitHub.' },
    );
    const messageInput = messageField.querySelector('input');
    const errorText = h('p', {
        class: 'error-text',
        role: 'alert',
        hidden: true,
    });
    const cancelBtn = h(
        'button',
        { type: 'button', onclick: close },
        'Cancel',
    );
    const confirmBtn = h(
        'button',
        {
            type: 'button',
            class: 'primary',
            onclick: () => {
                void run();
            },
        },
        'Publish now',
    );
    const run = async (): Promise<void> => {
        confirmBtn.disabled = cancelBtn.disabled = true;
        confirmBtn.textContent = 'Publishing…';
        errorText.hidden = true;
        try {
            await publish(
                state,
                messageInput?.value.trim() || DEFAULT_COMMIT_MESSAGE,
            );
            close();
            updateStatus(state);
            notify(
                state,
                'Published. Vercel usually has it live within a minute.',
                { href: LIVE_URL, label: 'Open your site' },
            );
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            errorText.textContent = message;
            errorText.hidden = false;
            confirmBtn.disabled = cancelBtn.disabled = false;
            confirmBtn.textContent = 'Try again';
            if (state.conflict) {
                close();
                renderView(state);
                notify(state, message);
            }
        }
    };
    body.replaceChildren(
        h(
            'p',
            {},
            `This commits to ${BRANCH} on GitHub, and Vercel then updates ` +
                'your live site.',
        ),
        messageField,
        h('p', { class: 'files' }, `Files: ${files.join(', ')}`),
        errorText,
        h('div', { class: 'dialog-actions' }, cancelBtn, confirmBtn),
    );
    dialog.showModal();
}
