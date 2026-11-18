import { NEW_TOKEN_URL, REPO_NAME } from '../constants';
import type { EditorState } from '../EditorState';
import { saveToken } from '../github/saveToken';
import { h } from '../util/h';
import { query } from '../util/query';
import { start } from './start';

/**
 * Shows the screen that asks for a GitHub token. Unpublished changes are
 * kept as a draft, so they are back after logging in.
 */
export function renderLogin(state: EditorState, errorMessage = ''): void {
    const input = h('input', {
        id: 'token',
        name: 'token',
        type: 'password',
        autocomplete: 'off',
        spellcheck: 'false',
        required: true,
    });
    const error = h(
        'p',
        { class: 'error-text', role: 'alert', hidden: !errorMessage },
        errorMessage,
    );
    const submit = h('button', { type: 'submit', class: 'primary' }, 'Log in');
    const form = h(
        'form',
        {
            onsubmit: (event) => {
                event.preventDefault();
                if (!saveToken(input.value.trim())) {
                    error.textContent =
                        "This browser won't keep the token. A private " +
                        'window may block it; try a normal one.';
                    error.hidden = false;
                    return;
                }
                submit.disabled = true;
                void start(state);
            },
        },
        h(
            'div',
            { class: 'field' },
            h('label', { for: 'token' }, 'GitHub token'),
            input,
        ),
        error,
        h(
            'div',
            { class: 'dialog-actions' },
            h('a', { href: '/' }, 'Back to the site'),
            submit,
        ),
    );
    query('#app').replaceChildren(
        h(
            'main',
            { class: 'center-page' },
            h('h1', {}, 'Log in to edit your portfolio'),
            h(
                'p',
                {},
                'Log in with a GitHub token that can change this site. ' +
                    'It stays in this browser until you log out, and ' +
                    'your changes are saved on this device until you ' +
                    'publish them.',
            ),
            h(
                'ol',
                {},
                h(
                    'li',
                    {},
                    h(
                        'a',
                        {
                            href: NEW_TOKEN_URL,
                            target: '_blank',
                            rel: 'noopener noreferrer',
                        },
                        'Create a token on GitHub',
                        h('span', { class: 'sr-only' }, ' (opens a new tab)'),
                    ),
                    '. Its name, expiry and permission are filled in.',
                ),
                h(
                    'li',
                    {},
                    'Under ',
                    h('strong', {}, 'Repository access'),
                    ', choose ',
                    h('strong', {}, 'Only select repositories'),
                    ` and pick ${REPO_NAME}.`,
                ),
                h(
                    'li',
                    {},
                    'Check that ',
                    h('strong', {}, 'Contents'),
                    ' says ',
                    h('strong', {}, 'Read and write'),
                    ', generate the token and paste it here.',
                ),
            ),
            form,
        ),
    );
    input.focus();
}
