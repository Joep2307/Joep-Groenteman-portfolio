import { REPO_NAME, TOKEN_KEY, TOKEN_URL } from '../constants';
import type { EditorState } from '../EditorState';
import { h } from '../util/h';
import { query } from '../util/query';
import { start } from './start';

/** Shows the screen that asks for a GitHub token. */
export function renderLogin(state: EditorState, errorMessage = ''): void {
    const input = h('input', {
        id: 'token',
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
    const submit = h(
        'button',
        { type: 'submit', class: 'primary' },
        'Connect',
    );
    const strong = (text: string): HTMLElement => h('strong', {}, text);
    const form = h(
        'form',
        {
            onsubmit: (event) => {
                event.preventDefault();
                submit.disabled = true;
                error.hidden = true;
                localStorage.setItem(TOKEN_KEY, input.value.trim());
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
        submit,
    );
    query('#app').replaceChildren(
        h(
            'main',
            { class: 'center-page' },
            h('h1', {}, 'Portfolio editor'),
            h(
                'p',
                {},
                'This page has no password of its own. It saves to your ' +
                    'GitHub repository, so it needs a token only you hold. ' +
                    'The token stays in this browser and is never added to ' +
                    'your site.',
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
                            href: TOKEN_URL,
                            target: '_blank',
                            rel: 'noopener noreferrer',
                        },
                        'Create a fine-grained token on GitHub',
                    ),
                    '. The name, expiry and permission are filled in for you.',
                ),
                h(
                    'li',
                    {},
                    'Under ',
                    strong('Repository access'),
                    ', choose ',
                    strong('Only select repositories'),
                    ' and pick ',
                    strong(REPO_NAME),
                    '.',
                ),
                h(
                    'li',
                    {},
                    'Check that ',
                    strong('Contents'),
                    ' is set to ',
                    strong('Read and write'),
                    ', then generate the token and paste it below.',
                ),
            ),
            form,
        ),
    );
    input.focus();
}
