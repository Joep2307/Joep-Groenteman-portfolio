import type { EditorState } from '../EditorState';
import { forgetToken } from '../github/forgetToken';
import { renderLogin } from '../screens/renderLogin';
import { flush } from './flush';

/**
 * Logs out, after asking: forgets the token in this browser. Unpublished
 * changes stay saved here.
 */
export function logOut(state: EditorState): void {
    const sure = confirm(
        'Log out? Unpublished changes stay saved on this device.',
    );
    if (!sure) return;
    flush(state);
    forgetToken();
    renderLogin(state);
}
