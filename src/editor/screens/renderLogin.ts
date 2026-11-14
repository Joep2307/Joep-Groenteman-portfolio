import { PASSWORD_KEY } from '../constants';
import type { EditorState } from '../EditorState';
import { h } from '../util/h';
import { query } from '../util/query';
import { start } from './start';

/**
 * Shows the screen that asks for the editor password. Unpublished changes are
 * kept as a draft, so going back or connecting picks them up again.
 */
export function renderLogin(state: EditorState, errorMessage = ''): void {
    const input = h('input', {
        id: 'password',
        type: 'password',
        autocomplete: 'current-password',
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
    const form = h(
        'form',
        {
            onsubmit: (event) => {
                event.preventDefault();
                submit.disabled = true;
                error.hidden = true;
                localStorage.setItem(PASSWORD_KEY, input.value);
                void start(state);
            },
        },
        h(
            'div',
            { class: 'field' },
            h('label', { for: 'password' }, 'Password'),
            input,
        ),
        error,
        h(
            'div',
            { class: 'dialog-actions' },
            h(
                'button',
                {
                    type: 'button',
                    onclick: () => {
                        void start(state);
                    },
                },
                'Back to editing',
            ),
            submit,
        ),
    );
    query('#app').replaceChildren(
        h(
            'main',
            { class: 'center-page' },
            h('h1', {}, 'Portfolio editor'),
            h(
                'p',
                {},
                'Editing needs no login. Publishing changes your live ' +
                    'site, so it asks for the password. It is kept in ' +
                    'this browser until you disconnect.',
            ),
            form,
        ),
    );
    input.focus();
}
