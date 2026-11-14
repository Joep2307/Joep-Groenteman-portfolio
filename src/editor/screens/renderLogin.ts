import { LOGIN_URL } from '../constants';
import { h } from '../util/h';
import { query } from '../util/query';

/**
 * Shows the screen that asks you to sign in with GitHub. Unpublished
 * changes are kept as a draft, so they are back after signing in.
 */
export function renderLogin(errorMessage = ''): void {
    query('#app').replaceChildren(
        h(
            'main',
            { class: 'center-page' },
            h('h1', {}, 'Log in to edit your portfolio'),
            h(
                'p',
                {},
                'Sign in with the GitHub account that owns this site. ' +
                    'Your changes are saved on this device until you ' +
                    'publish them.',
            ),
            errorMessage
                ? h('p', { class: 'error-text', role: 'alert' }, errorMessage)
                : null,
            h(
                'div',
                { class: 'dialog-actions' },
                h('a', { href: '/' }, 'Back to the site'),
                h(
                    'a',
                    { href: LOGIN_URL, class: 'btn primary' },
                    'Sign in with GitHub',
                ),
            ),
        ),
    );
}
